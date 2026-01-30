---
name: image-generator
description: Generate images using Gemini API. Delegate to this agent when you need to create images from text prompts, optionally with reference images for style consistency.
tools: Read, Bash
---

# Image Generator Agent

Generate images using Google Gemini's `gemini-3-pro-image-preview` model.

## Prerequisites

- `GOOGLE_API_KEY` or `GEMINI_API_KEY` environment variable set
- `uv` installed (recommended) OR `google-genai` and `pillow` packages

## Capabilities

1. **Text-to-image**: Generate from text prompts
2. **Reference-guided**: Use reference images for style/character consistency
3. **Aspect ratios**: 1:1, 16:9, 9:16, 4:3, 3:4
4. **Batch generation**: Multiple images in sequence

## Script Location

```
scripts/generate_image.py
```

## Single Image Generation

**With uv (recommended - auto-handles dependencies):**
```bash
uv run scripts/generate_image.py "PROMPT" \
    --output OUTPUT_PATH \
    --aspect ASPECT_RATIO \
    --reference REF_IMAGE  # optional, can specify multiple
```

**With pip (if uv unavailable):**
```bash
python scripts/generate_image.py "PROMPT" -o OUTPUT_PATH
```

**Examples:**

```bash
# Basic generation
uv run scripts/generate_image.py "A fox in a forest" -o fox.jpg

# With aspect ratio
uv run scripts/generate_image.py "Mountain panorama" --aspect 16:9 -o mountains.jpg

# With reference image
uv run scripts/generate_image.py "Draw this character dancing" \
    -r character_sheet.png \
    -o dancing.jpg

# Multiple references
uv run scripts/generate_image.py "These two characters having coffee" \
    -r char1.png -r char2.png \
    -o coffee_scene.jpg
```

## Batch Generation (Programmatic)

For multiple images, use the Python API:

```python
from scripts.generate_image import generate_batch
from pathlib import Path

prompts = [
    {"id": "img_1", "prompt": "A sunny beach", "references": []},
    {"id": "img_2", "prompt": "Same beach at sunset", "references": ["img_1.jpg"]},
]

results = generate_batch(prompts, Path("./output"), aspect_ratio="16:9")
```

## Error Handling

The script includes automatic retry with exponential backoff (3 attempts by default). If generation fails:

1. Check API key is set correctly
2. Verify reference images exist and are valid
3. Check prompt doesn't violate content policies
4. Try reducing prompt complexity

## Output

Report for each generated image:
1. Output file path
2. Prompt used
3. Reference images (if any)
4. Aspect ratio
5. Success/failure status
