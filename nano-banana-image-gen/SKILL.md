---
name: nano-banana-image-gen
description: Generate images using Google Gemini API. Use when the user says "nano banana", "generate an image", "create an image", "make me a picture", "image gen", "draw", "illustrate", or wants to create images from text prompts with optional reference images for style consistency.
---

# Image Generation with Gemini

Generate images using Google Gemini's `gemini-3-pro-image-preview` model. Supports text prompts, reference images for style/character consistency, and multiple aspect ratios.

## Prerequisites

1. **API Key**: Set `GOOGLE_API_KEY` or `GEMINI_API_KEY` environment variable
2. **Dependencies**: Handled automatically by `uv run`, or install manually with `pip install google-genai pillow`

## Quick Start

```bash
# Basic generation
uv run nano-banana-image-gen/scripts/generate_image.py "A cat wearing a top hat" -o cat.jpg

# With aspect ratio
uv run nano-banana-image-gen/scripts/generate_image.py "Mountain panorama" --aspect 16:9 -o mountains.jpg

# With reference image for style consistency
uv run nano-banana-image-gen/scripts/generate_image.py "Draw this character dancing" \
    -r character_sheet.png -o dancing.jpg
```

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--aspect` | 1:1, 16:9, 9:16, 4:3, 3:4 | 1:1 | Output aspect ratio |
| `-r, --reference` | path(s) | none | Reference image(s) for consistency (can specify multiple) |
| `-o, --output` | path | output.jpg | Output file path |
| `--retries` | integer | 3 | Max retry attempts on failure |

## Workflow

If the user provides `$ARGUMENTS`, treat them as the image prompt. Otherwise ask what they'd like to generate.

1. Determine the prompt, output path, aspect ratio, and any reference images
2. Run the generation script via Bash:
   ```bash
   uv run nano-banana-image-gen/scripts/generate_image.py "PROMPT" \
       --aspect ASPECT_RATIO \
       -r REF_IMAGE \
       -o OUTPUT_PATH
   ```
3. Report the output file path and parameters used
4. If generation fails, check:
   - API key is set (`GOOGLE_API_KEY` or `GEMINI_API_KEY`)
   - Reference images exist and are valid
   - Prompt doesn't violate content policies

## Batch Generation

For multiple images (e.g., comic panels, storyboards), use the Python API:

```python
from nano-banana-image-gen.scripts.generate_image import generate_batch
from pathlib import Path

prompts = [
    {"id": "panel_1", "prompt": "A sunny beach", "references": []},
    {"id": "panel_2", "prompt": "Same beach at sunset", "references": ["panel_1.jpg"]},
]

results = generate_batch(prompts, Path("./output"), aspect_ratio="16:9")
```

## Integration

Other skills and pipelines can delegate image generation to this skill by invoking the generation script or importing the Python API.
