# nano-banana-image-gen

Generate images using the `imagen` CLI — a unified interface for Google Gemini and OpenAI image models.

## Features

- **Text-to-image generation** from natural language prompts
- **Multiple providers**: Gemini (`nano-banana`) and OpenAI (`gpt-1.5`, `gpt-1`, `gpt-1-mini`)
- **Multiple aspect ratios**: 1:1, 16:9, 9:16, 4:3, 3:4, and more
- **Resolution control**: 1K, 2K, 4K
- **Output formats**: jpeg, png, webp
- **Batch generation**: multiple images with `-n`
- **Prompt from file**: read prompts from text files

## Installation

### 1. Install Plugin

```bash
# In Claude Code
/plugin marketplace add https://github.com/ozten/skills
/plugin install nano-banana-image-gen@skills
```

### 2. Install imagen CLI

```bash
curl -fsSL https://raw.githubusercontent.com/ozten/imagen/main/scripts/install.sh | bash
```

### 3. Set API Keys

**Option A: Environment variables**

```bash
export GEMINI_API_KEY="your-gemini-api-key"
export OPENAI_API_KEY="your-openai-api-key"
```

**Option B: Config file** (`~/.config/imagen/config.toml`)

```toml
[keys]
gemini = "your-gemini-api-key"      # or set GEMINI_API_KEY env var
openai = "your-openai-api-key"      # or set OPENAI_API_KEY env var
```

You only need keys for the providers you plan to use. Gemini for `nano-banana` (default), OpenAI for `gpt-*` models.

> **Note:** On session start, the plugin checks for `imagen` and API keys and shows a warning if missing. At runtime, the skill will offer to install `imagen` if it's not found.

## Usage

### Slash Command

```
/generate-image a cat wearing a monocle and top hat
```

With options:
```
/generate-image --aspect 16:9 cyberpunk street scene
/generate-image --model gpt-1.5 watercolor mountain landscape
```

### Delegate to Agent

Other agents/pipelines can delegate to the `image-generator` agent:

```markdown
Use the **image-generator** agent to generate an image of [description].
```

### Direct CLI Usage

```bash
# Basic generation (default: nano-banana / Gemini)
imagen "A dragon" -o dragon.jpg

# With aspect ratio
imagen "Landscape" --aspect-ratio 16:9 -o landscape.jpg

# OpenAI model
imagen "Cyberpunk city" -m gpt-1.5 -o city.png

# Multiple images
imagen "Abstract art" -n 3 -o art.jpg

# Higher resolution
imagen "Detailed portrait" --size 2K -o portrait.jpg

# PNG format
imagen "Logo design" --format png -o logo.png

# Prompt from file
imagen --prompt-file prompt.txt -o result.jpg
```

## Models

| Alias | Model ID | Provider | API Key |
|-------|----------|----------|---------|
| `nano-banana` (default) | `gemini-3-pro-image-preview` | Gemini | `GEMINI_API_KEY` |
| `gpt-1.5` | `gpt-image-1.5` | OpenAI | `OPENAI_API_KEY` |
| `gpt-1` | `gpt-image-1` | OpenAI | `OPENAI_API_KEY` |
| `gpt-1-mini` | `gpt-image-1-mini` | OpenAI | `OPENAI_API_KEY` |

## Integration with Other Plugins

This plugin is designed to be used by other pipelines. For example, a comic strip pipeline could delegate panel illustration:

```markdown
# In your pipeline's agent
Use the **image-generator** agent to create an image for each panel:
- Panel 1: "Wide shot of coffee shop interior..."
- Panel 2: "Close-up of character's surprised face..."
```

## Plugin Structure

```
nano-banana-image-gen/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── generate-image.md    # /generate-image slash command
├── agents/
│   └── image-generator.md   # Delegatable agent
├── hooks/
│   └── hooks.json           # SessionStart dep check
├── scripts/
│   └── check_deps.sh        # Dependency checker
└── README.md
```

## Dependency Management

This plugin checks for the `imagen` CLI and API keys:

1. **SessionStart Hook** - Warns on missing `imagen` CLI or API keys when session starts
2. **Runtime Check** - If `imagen` is not installed when you try to generate, the skill offers to install it for you
3. **Graceful Guidance** - Clear instructions for setting up API keys if missing
