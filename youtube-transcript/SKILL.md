# youtube-transcript

Extract transcripts from YouTube videos. Zero dependencies - just Node.js.

## When to Use

- "Get the transcript from this YouTube video"
- "Extract transcript from this video"
- "What does this YouTube video say?"

## Usage

```bash
# Extract plain text transcript
node get-transcript.js "https://www.youtube.com/watch?v=VIDEO_ID"

# With timestamps
node get-transcript.js "https://youtu.be/VIDEO_ID" --timestamps

# JSON output (includes offset/duration for each segment)
node get-transcript.js "https://youtube.com/watch?v=VIDEO_ID" --json

# Save to file
node get-transcript.js "https://youtu.be/VIDEO_ID" --save transcript.txt

# Specific language
node get-transcript.js "https://youtu.be/VIDEO_ID" --lang es
```

## Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID&t=123`
- `https://youtube.com/shorts/VIDEO_ID`
- Just the video ID: `dQw4w9WgXcQ`

## Requirements

- Node.js 18+

No npm install needed. No dependencies.

## How It Works

1. Tries YouTube's Innertube API first (Android client - faster)
2. Falls back to web page scraping if needed
3. Extracts caption track URL from response
4. Fetches XML captions
5. Parses segments with timestamps
6. Returns clean text

## API Keys

**None required.** Uses YouTube's public APIs.

## Output Formats

| Flag | Output |
|------|--------|
| (default) | Plain text, all segments joined |
| `--timestamps` | `[0:00] First line\n[0:05] Second line...` |
| `--json` | `[{text, offset, duration, lang}, ...]` |

## Limitations

- Only works for videos with captions (manual or auto-generated)
- Private or age-restricted videos will fail
- YouTube may require CAPTCHA if too many requests from same IP
