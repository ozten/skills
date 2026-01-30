---
description: Generate an image using Gemini API from a text prompt, with optional reference images
---

# Generate Image

Generate images using Google Gemini's `gemini-3-pro-image-preview` model.

## Prerequisites

1. **API Key**: Set `GOOGLE_API_KEY` or `GEMINI_API_KEY` environment variable
2. **Dependencies**: `pip install google-genai pillow`

## Usage

### Basic generation
```
/generate-image a golden retriever astronaut floating in space
```

### With aspect ratio
```
/generate-image --aspect 16:9 cyberpunk cityscape at night with neon signs
```

### With reference images (for style/character consistency)
```
/generate-image --ref character.png the character from the reference as a samurai warrior
```

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--aspect` | 1:1, 16:9, 9:16, 4:3, 3:4 | 1:1 | Output aspect ratio |
| `--ref` | path(s) | none | Reference image(s) for consistency |
| `--output` | path | auto-generated | Output file path |

## Implementation

Run the generation script:

```bash
python scripts/generate_image.py "PROMPT" \
    --aspect ASPECT_RATIO \
    --reference REF_IMAGE \
    --output OUTPUT_PATH
```

## Output

Save generated images to the current working directory or specified path. Report:
1. Output file path
2. Generation parameters used
3. Any errors or retries that occurred
