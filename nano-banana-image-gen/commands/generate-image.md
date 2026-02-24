---
description: Generate an image using the imagen CLI from a text prompt
---

# Generate Image

Generate images using the `imagen` CLI — a unified interface for Gemini and OpenAI image models.

## Prerequisites

1. **imagen CLI**: Must be installed (`curl -fsSL https://raw.githubusercontent.com/ozten/imagen/main/scripts/install.sh | bash`)
2. **API Key**: `GEMINI_API_KEY` or `OPENAI_API_KEY` set via env var or `~/.config/imagen/config.toml`

## Usage

### Basic generation
```
/generate-image a golden retriever astronaut floating in space
```

### With aspect ratio
```
/generate-image --aspect 16:9 cyberpunk cityscape at night with neon signs
```

### With a specific model
```
/generate-image --model gpt-1.5 a watercolor painting of a mountain lake
```

## Options

| Option | Values | Default | Description |
|--------|--------|---------|-------------|
| `--aspect` | 1:1, 16:9, 9:16, 4:3, 3:4 | 1:1 | Output aspect ratio |
| `--model` | nano-banana, gpt-1.5, gpt-1, gpt-1-mini | nano-banana | Image model |
| `--size` | 1K, 2K, 4K | 1K | Image resolution |
| `--format` | jpeg, png, webp | jpeg | Output format |
| `--output` | path | auto-generated | Output file path |
| `--count` | integer | 1 | Number of images |

## Implementation

First check that `imagen` is installed (`which imagen`). If not, ask the user if they'd like to install it:
```bash
curl -fsSL https://raw.githubusercontent.com/ozten/imagen/main/scripts/install.sh | bash
```

Then check that the required API key is configured. If not, ask the user to set it up.

Then run:
```bash
imagen "PROMPT" \
    --model MODEL \
    --aspect-ratio ASPECT_RATIO \
    --output OUTPUT_PATH
```

## Output

Save generated images to the current working directory or specified path. Report:
1. Output file path
2. Generation parameters used
3. Any errors that occurred
