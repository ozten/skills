# nano-banana-image-gen

Generate images using Google Gemini API (`gemini-3-pro-image-preview`).

## Features

- **Text-to-image generation** from natural language prompts
- **Reference images** for style/character consistency
- **Multiple aspect ratios**: 1:1, 16:9, 9:16, 4:3, 3:4
- **Automatic retry** with exponential backoff
- **Batch generation** support for pipelines
- **PEP 723 compatible** - works with `uv run` (auto-installs deps)

## Installation

### 1. Install Plugin

```bash
# In Claude Code
/plugin marketplace add https://github.com/ozten/skills
/plugin install nano-banana-image-gen@skills
```

### 2. Set API Key

```bash
export GOOGLE_API_KEY="your-api-key"
# or
export GEMINI_API_KEY="your-api-key"
```

### 3. Dependencies (choose one)

**Option A: Use uv (recommended - zero setup)**

If you have `uv` installed, dependencies are handled automatically via PEP 723 inline metadata. Just run:

```bash
uv run scripts/generate_image.py "your prompt" -o output.jpg
```

**Option B: pip install**

```bash
pip install google-genai pillow
```

**Option C: uv add to project**

```bash
uv add google-genai pillow
```

> **Note:** On session start, the plugin checks for dependencies and shows a warning if missing.

## Usage

### Slash Command

```
/generate-image a cat wearing a monocle and top hat
```

With options:
```
/generate-image --aspect 16:9 --ref style_reference.png cyberpunk street scene
```

### Delegate to Agent

Other agents/pipelines can delegate to the `image-generator` agent:

```markdown
Use the **image-generator** agent to generate an image of [description].
```

### Direct Script Usage

```bash
# With uv (recommended - auto-handles deps)
uv run scripts/generate_image.py "A dragon" -o dragon.jpg

# With aspect ratio
uv run scripts/generate_image.py "Landscape" --aspect 16:9 -o landscape.jpg

# With reference image
uv run scripts/generate_image.py "This character as a knight" -r char.png -o knight.jpg

# Or with pip (after installing deps)
python scripts/generate_image.py "A dragon" -o dragon.jpg
```

## Integration with Other Plugins

This plugin is designed to be used by other pipelines. For example, a comic strip pipeline could delegate panel illustration:

```markdown
# In your pipeline's agent
Use the **image-generator** agent to create an image for each panel:
- Panel 1: "Wide shot of coffee shop interior..."
- Panel 2: "Close-up of character's surprised face..."
```

## API

### generate_image()

```python
from scripts.generate_image import generate_image
from pathlib import Path

result = generate_image(
    prompt="A serene mountain lake at dawn",
    output_path=Path("lake.jpg"),
    reference_images=[Path("style_ref.png")],  # optional
    aspect_ratio="16:9",
    model="gemini-3-pro-image-preview",
    max_retries=3,
)
```

### generate_batch()

```python
from scripts.generate_image import generate_batch
from pathlib import Path

prompts = [
    {"id": "scene_1", "prompt": "A forest clearing", "references": []},
    {"id": "scene_2", "prompt": "Same forest at night", "references": []},
]

results = generate_batch(
    prompts=prompts,
    output_dir=Path("./output"),
    aspect_ratio="16:9",
)
# Returns: {"scene_1": Path("output/scene_1.jpg"), "scene_2": Path("output/scene_2.jpg")}
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
│   ├── check_deps.sh        # Dependency checker
│   └── generate_image.py    # Core generation logic (PEP 723)
└── README.md
```

## Dependency Management

This plugin uses three strategies to handle Python dependencies:

1. **SessionStart Hook** - Warns on missing deps when session starts
2. **PEP 723 Inline Metadata** - `uv run` auto-installs deps in isolated env
3. **Graceful Failure** - Script prints install instructions if deps missing

This means users can either:
- Use `uv run` and never manually install anything
- Use `pip install` once and use `python` directly
