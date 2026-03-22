#!/usr/bin/env node

/**
 * get-transcript.js - Extract transcript from YouTube video
 *
 * Self-contained script with zero dependencies.
 * Fetches YouTube's hosted captions (manual or auto-generated).
 * No API key required.
 *
 * Usage:
 *   node get-transcript.js <youtube-url>
 *   node get-transcript.js <youtube-url> --save <output-file>
 *   node get-transcript.js <youtube-url> --json
 *   node get-transcript.js <youtube-url> --timestamps
 */

import { writeFileSync } from "fs";

const HELP = `
get-transcript - Extract transcript from YouTube video

Usage:
  node get-transcript.js <youtube-url> [options]

Options:
  --save <file>    Save transcript to file
  --json           Output as JSON with timestamps
  --timestamps     Include timestamps in text output
  --lang <code>    Preferred language code (e.g., en, es, fr)
  --help           Show this help message

Examples:
  node get-transcript.js "https://www.youtube.com/watch?v=abc123"
  node get-transcript.js "https://youtu.be/xyz789" --save transcript.txt
  node get-transcript.js "https://youtube.com/watch?v=abc123" --json
  node get-transcript.js "https://youtube.com/watch?v=abc123" --lang es

Supported URL formats:
  - https://www.youtube.com/watch?v=VIDEO_ID
  - https://youtu.be/VIDEO_ID
  - https://www.youtube.com/watch?v=VIDEO_ID&t=123
  - https://youtube.com/shorts/VIDEO_ID
  - Just the video ID

No dependencies required.
`;

const VIDEO_ID_REGEX =
  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36";

const INNERTUBE_API_URL =
  "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";

const INNERTUBE_CLIENT = {
  context: {
    client: {
      clientName: "ANDROID",
      clientVersion: "20.10.38",
    },
  },
};

const ANDROID_USER_AGENT =
  "com.google.android.youtube/20.10.38 (Linux; U; Android 14)";

/**
 * Extract video ID from URL or return if already an ID
 */
function extractVideoId(input) {
  if (input.length === 11 && /^[a-zA-Z0-9_-]+$/.test(input)) {
    return input;
  }
  const match = input.match(VIDEO_ID_REGEX);
  if (match) return match[1];
  throw new Error(`Could not extract video ID from: ${input}`);
}

/**
 * Decode HTML entities in transcript text
 */
function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

/**
 * Parse transcript XML into segments
 */
function parseTranscriptXml(xml, lang) {
  const segments = [];

  // Try new format first: <p t="offset" d="duration">text</p>
  const newFormatRegex = /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;
  let match;

  while ((match = newFormatRegex.exec(xml)) !== null) {
    const offset = parseInt(match[1], 10);
    const duration = parseInt(match[2], 10);
    let text = match[3];

    // Extract text from <s> tags if present
    const sTags = /<s[^>]*>([^<]*)<\/s>/g;
    let sMatch;
    let extracted = "";
    while ((sMatch = sTags.exec(text)) !== null) {
      extracted += sMatch[1];
    }

    if (extracted) {
      text = extracted;
    } else {
      text = text.replace(/<[^>]+>/g, "");
    }

    text = decodeEntities(text).trim();
    if (text) {
      segments.push({ text, offset, duration, lang });
    }
  }

  if (segments.length > 0) return segments;

  // Fall back to old format: <text start="x" dur="y">text</text>
  const oldFormatRegex = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;

  while ((match = oldFormatRegex.exec(xml)) !== null) {
    const offset = parseFloat(match[1]) * 1000; // Convert to ms
    const duration = parseFloat(match[2]) * 1000;
    const text = decodeEntities(match[3]).trim();

    if (text) {
      segments.push({ text, offset, duration, lang });
    }
  }

  return segments;
}

/**
 * Try to fetch transcript via YouTube's Innertube API (Android client)
 */
async function fetchViaInnertube(videoId, lang) {
  try {
    const response = await fetch(INNERTUBE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": ANDROID_USER_AGENT,
      },
      body: JSON.stringify({
        ...INNERTUBE_CLIENT,
        videoId,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const captionTracks =
      data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
      return null;
    }

    return fetchFromTracks(captionTracks, videoId, lang);
  } catch {
    return null;
  }
}

/**
 * Fetch transcript via web page scraping (fallback)
 */
async function fetchViaWebPage(videoId, lang) {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      "User-Agent": USER_AGENT,
      ...(lang && { "Accept-Language": lang }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch video page: ${response.status}`);
  }

  const html = await response.text();

  if (html.includes('class="g-recaptcha"')) {
    throw new Error(
      "YouTube is requiring CAPTCHA verification. Try again later."
    );
  }

  if (!html.includes('"playabilityStatus":')) {
    throw new Error("Video is unavailable or does not exist");
  }

  // Extract ytInitialPlayerResponse JSON
  const captionTracks = extractCaptionTracks(html);

  if (!captionTracks || captionTracks.length === 0) {
    throw new Error("No captions available for this video");
  }

  return fetchFromTracks(captionTracks, videoId, lang);
}

/**
 * Extract caption tracks from page HTML
 */
function extractCaptionTracks(html) {
  const marker = "var ytInitialPlayerResponse = ";
  const startIdx = html.indexOf(marker);

  if (startIdx === -1) return null;

  const jsonStart = startIdx + marker.length;
  let depth = 0;

  for (let i = jsonStart; i < html.length; i++) {
    if (html[i] === "{") depth++;
    else if (html[i] === "}") {
      depth--;
      if (depth === 0) {
        try {
          const json = JSON.parse(html.slice(jsonStart, i + 1));
          return json?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

/**
 * Fetch transcript from caption tracks
 */
async function fetchFromTracks(tracks, videoId, preferredLang) {
  // Select track: prefer specified language, otherwise first available
  let track = tracks[0];

  if (preferredLang) {
    const langTrack = tracks.find((t) => t.languageCode === preferredLang);
    if (langTrack) {
      track = langTrack;
    } else {
      const available = tracks.map((t) => t.languageCode).join(", ");
      console.error(
        `Language '${preferredLang}' not available. Using '${track.languageCode}'. Available: ${available}`
      );
    }
  }

  const captionUrl = track.baseUrl;

  // Verify URL is from YouTube
  try {
    const url = new URL(captionUrl);
    if (!url.hostname.endsWith(".youtube.com")) {
      throw new Error("Invalid caption URL");
    }
  } catch (e) {
    throw new Error("Invalid caption URL");
  }

  const response = await fetch(captionUrl, {
    headers: {
      "User-Agent": USER_AGENT,
      ...(preferredLang && { "Accept-Language": preferredLang }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch captions: ${response.status}`);
  }

  const xml = await response.text();
  const lang = preferredLang || track.languageCode;

  return parseTranscriptXml(xml, lang);
}

/**
 * Main fetch function - tries Innertube first, falls back to web scraping
 */
async function fetchTranscript(videoId, options = {}) {
  const { lang } = options;

  // Try Innertube API first (faster, more reliable)
  const innertubeResult = await fetchViaInnertube(videoId, lang);
  if (innertubeResult && innertubeResult.length > 0) {
    return innertubeResult;
  }

  // Fall back to web page scraping
  return fetchViaWebPage(videoId, lang);
}

/**
 * Format milliseconds to HH:MM:SS or MM:SS
 */
function formatTimestamp(ms) {
  const seconds = Math.floor(ms / 1000);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    console.log(HELP);
    process.exit(0);
  }

  // Find URL or video ID
  const input = args.find(
    (arg) =>
      arg.includes("youtube.com") ||
      arg.includes("youtu.be") ||
      /^[a-zA-Z0-9_-]{11}$/.test(arg)
  );

  if (!input) {
    console.error("Error: No YouTube URL or video ID provided");
    console.log("\nUsage: node get-transcript.js <youtube-url>");
    process.exit(1);
  }

  // Parse options
  const saveIndex = args.indexOf("--save");
  const outputFile = saveIndex !== -1 ? args[saveIndex + 1] : null;
  const jsonOutput = args.includes("--json");
  const showTimestamps = args.includes("--timestamps");
  const langIndex = args.indexOf("--lang");
  const lang = langIndex !== -1 ? args[langIndex + 1] : undefined;

  let videoId;
  try {
    videoId = extractVideoId(input);
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }

  console.error(`Extracting transcript for video: ${videoId}`);

  try {
    const segments = await fetchTranscript(videoId, { lang });
    console.error(`Found ${segments.length} segments\n`);

    let output;

    if (jsonOutput) {
      output = JSON.stringify(segments, null, 2);
    } else if (showTimestamps) {
      output = segments
        .map((s) => `[${formatTimestamp(s.offset)}] ${s.text}`)
        .join("\n");
    } else {
      output = segments.map((s) => s.text).join(" ");
    }

    if (outputFile) {
      writeFileSync(outputFile, output, "utf-8");
      console.error(`Saved to: ${outputFile}`);
    } else {
      console.log(output);
    }
  } catch (error) {
    console.error("Failed to extract transcript");
    console.error(`Error: ${error.message}`);
    console.error("\nPossible reasons:");
    console.error("  - Video has no captions/transcript");
    console.error("  - Video is private or restricted");
    console.error("  - Invalid video ID");
    process.exit(1);
  }
}

main();
