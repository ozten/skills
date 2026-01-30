# Comic Strip Pipeline Plugin

Transform narratives into professional comic strips through a 5-agent pipeline.

## Installation

### Option 1: Local Testing

```bash
# Unzip to a test marketplace directory
mkdir -p ~/test-marketplace
unzip comic-strip-pipeline.zip -d ~/test-marketplace/

# Create marketplace manifest
mkdir -p ~/test-marketplace/.claude-plugin
cat > ~/test-marketplace/.claude-plugin/marketplace.json << 'EOF'
{
  "name": "test-marketplace",
  "owner": { "name": "Your Name" },
  "plugins": [{
    "name": "comic-strip-pipeline",
    "source": "./comic-strip-pipeline",
    "description": "Transform narratives into comic strips"
  }]
}
EOF

# In Claude Code:
/plugin marketplace add https://github.com/ozten/skills
/plugin install comic-strip-pipeline@skills
```

### Option 2: Add to Existing Marketplace

Copy the `comic-strip-pipeline/` directory into your marketplace and add to `marketplace.json`:

```json
{
  "name": "comic-strip-pipeline",
  "source": "./comic-strip-pipeline",
  "description": "Transform narratives into professional comic strips"
}
```

## Usage

```
/create-comic [paste your source material]
```

**Example:**
```
/create-comic 

The debate transcript where candidate A kept interrupting candidate B,
and B finally said "I'm speaking" which became a viral moment.
```

## What's Included

### Slash Command
- `/create-comic` — Orchestrates the full pipeline

### Agents (executed in sequence)
1. **story-translator** — Identifies core moment, maps to panels
2. **panel-structurer** — Applies structural formulas, misdirection
3. **dialogue-writer** — Writes compressed, character-distinct dialogue  
4. **panel-describer** — Creates technical artist instructions
5. **editorial-reviewer** — Final polish against professional standards

## Pipeline Flow

```
Source Material
      ↓
[story-translator] → Core moment + panel breakdown
      ↓
[panel-structurer] → Structure formula + pacing
      ↓
[dialogue-writer] → Compressed dialogue + voice
      ↓
[panel-describer] → Technical descriptions
      ↓
[editorial-reviewer] → Final polish
      ↓
Publication-Ready Script
```

## Output Format

The final deliverable follows standard comic script format:

```
STRIP TITLE: [Title]

PANEL 1: [SHOT TYPE]. [Location].
    [Description: frozen moment, left-to-right].
    CHARACTER: "[Dialogue]"

PANEL 2: ...
```

## Constraints Enforced

| Element | Limit |
|---------|-------|
| Total words | 50-80 |
| Words per panel | ≤25 |
| Punchline | ≤10 words |
| Lines per balloon | ≤3 |
| Panel descriptions | 1-2 sentences |
