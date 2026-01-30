#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "google-genai>=1.0.0",
#     "pillow>=10.0.0",
# ]
# ///
"""Generate images using Google Gemini API.

Supports text prompts with optional reference images for style consistency.

Usage (with uv - recommended, auto-installs deps):
    uv run generate_image.py "A cat wearing a top hat" -o output.jpg
    uv run generate_image.py "Draw this character dancing" -r char.png -o output.jpg

Usage (with pip):
    pip install google-genai pillow
    python generate_image.py "Cyberpunk city" --aspect 16:9 -o city.jpg
    
Environment:
    GOOGLE_API_KEY or GEMINI_API_KEY must be set
"""

import argparse
import base64
import mimetypes
import os
import sys
import time
from pathlib import Path
from typing import Optional

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: google-genai not installed.")
    print("")
    print("Install with uv (recommended - handles venv automatically):")
    print("  uv run scripts/generate_image.py 'your prompt'")
    print("")
    print("Or install manually:")
    print("  pip install google-genai pillow")
    print("  # then: python scripts/generate_image.py 'your prompt'")
    sys.exit(1)


def get_api_key() -> str:
    """Get API key from environment."""
    key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not key:
        print("Error: Set GOOGLE_API_KEY or GEMINI_API_KEY environment variable")
        sys.exit(1)
    return key


def generate_image(
    prompt: str,
    output_path: Path,
    reference_images: Optional[list[Path]] = None,
    aspect_ratio: str = "1:1",
    model: str = "gemini-3-pro-image-preview",
    max_retries: int = 3,
) -> Path:
    """Generate an image from a text prompt.

    Args:
        prompt: Text description of desired image
        output_path: Where to save the generated image
        reference_images: Optional list of reference images for style/character consistency
        aspect_ratio: Output aspect ratio (1:1, 16:9, 9:16, 4:3, 3:4)
        model: Gemini model ID
        max_retries: Number of retry attempts on failure

    Returns:
        Path to the saved image

    Raises:
        ValueError: If generation fails after all retries
        FileNotFoundError: If reference image not found
    """
    client = genai.Client(api_key=get_api_key())

    # Build content parts
    parts = []

    # Add reference images if provided
    if reference_images:
        for img_path in reference_images:
            if not img_path.exists():
                raise FileNotFoundError(f"Reference image not found: {img_path}")
            img_bytes = img_path.read_bytes()
            mime_type = mimetypes.guess_type(str(img_path))[0] or "image/jpeg"
            parts.append(types.Part.from_bytes(mime_type=mime_type, data=img_bytes))

    # Add text prompt
    parts.append(types.Part.from_text(text=prompt))

    # Configure request
    contents = [types.Content(role="user", parts=parts)]
    config = types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio=aspect_ratio),
    )

    # Generate with retry logic
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=model,
                contents=contents,
                config=config,
            )

            # Extract image from response
            if hasattr(response, "candidates") and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate, "content") and candidate.content.parts:
                    for part in candidate.content.parts:
                        if hasattr(part, "inline_data"):
                            # Save image
                            output_path.parent.mkdir(parents=True, exist_ok=True)
                            output_path.write_bytes(part.inline_data.data)
                            return output_path

            raise ValueError("No image data in API response")

        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = 2**attempt
                print(f"[Retry {attempt + 1}/{max_retries}] Failed: {e}", file=sys.stderr)
                print(f"Waiting {wait_time}s before retry...", file=sys.stderr)
                time.sleep(wait_time)
            else:
                raise ValueError(f"Failed after {max_retries} attempts: {e}")


def generate_batch(
    prompts: list[dict],
    output_dir: Path,
    aspect_ratio: str = "1:1",
    model: str = "gemini-3-pro-image-preview",
) -> dict[str, Path]:
    """Generate multiple images from a list of prompts.

    Args:
        prompts: List of dicts with 'id', 'prompt', and optional 'references' keys
        output_dir: Directory to save generated images
        aspect_ratio: Output aspect ratio for all images
        model: Gemini model ID

    Returns:
        Dict mapping prompt IDs to output paths

    Example prompts format:
        [
            {"id": "panel_1", "prompt": "A dog at the park", "references": ["dog.png"]},
            {"id": "panel_2", "prompt": "Same dog running"},
        ]
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    results = {}

    for item in prompts:
        prompt_id = item["id"]
        prompt_text = item["prompt"]
        references = [Path(p) for p in item.get("references", [])]

        output_path = output_dir / f"{prompt_id}.jpg"

        try:
            generate_image(
                prompt=prompt_text,
                output_path=output_path,
                reference_images=references if references else None,
                aspect_ratio=aspect_ratio,
                model=model,
            )
            results[prompt_id] = output_path
            print(f"✓ Generated: {prompt_id} -> {output_path}")
        except Exception as e:
            print(f"✗ Failed: {prompt_id} - {e}", file=sys.stderr)
            results[prompt_id] = None

    return results


def main():
    parser = argparse.ArgumentParser(
        description="Generate images using Google Gemini API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s "A cat in a spacesuit" -o cat.jpg
  %(prog)s "Draw this character as a wizard" -r character.png -o wizard.jpg
  %(prog)s "Panoramic mountain vista" --aspect 16:9 -o mountains.jpg
  %(prog)s "Portrait photo" --aspect 9:16 -r face.png -o portrait.jpg

Environment:
  GOOGLE_API_KEY or GEMINI_API_KEY must be set
        """,
    )
    parser.add_argument("prompt", help="Text description of desired image")
    parser.add_argument(
        "-o", "--output",
        type=Path,
        default=Path("output.jpg"),
        help="Output image path (default: output.jpg)",
    )
    parser.add_argument(
        "-r", "--reference",
        type=Path,
        action="append",
        dest="references",
        help="Reference image(s) for style/character consistency (can specify multiple)",
    )
    parser.add_argument(
        "--aspect",
        default="1:1",
        choices=["1:1", "16:9", "9:16", "4:3", "3:4"],
        help="Output aspect ratio (default: 1:1)",
    )
    parser.add_argument(
        "--model",
        default="gemini-3-pro-image-preview",
        help="Gemini model ID (default: gemini-3-pro-image-preview)",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=3,
        help="Max retry attempts on failure (default: 3)",
    )

    args = parser.parse_args()

    try:
        result = generate_image(
            prompt=args.prompt,
            output_path=args.output,
            reference_images=args.references,
            aspect_ratio=args.aspect,
            model=args.model,
            max_retries=args.retries,
        )
        print(f"Generated: {result}")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
