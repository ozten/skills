---
description: Transform a narrative (debate transcript, story, anecdote) into a polished comic strip through a 5-stage pipeline
---

# Create Comic Strip

Orchestrate the comic strip creation pipeline to transform source material into a publication-ready strip.

## Pipeline Stages

Execute these agents **in sequence**, passing results between stages:

### Stage 1: Story Translation
Use the **story-translator** agent to:
- Identify the core moment (punchline, turning point, or recognition)
- Determine minimum context needed
- Map to 1-4 panel structure
- Apply compression test

**Pass to next stage:** Panel count, core moment, panel-by-panel function breakdown

### Stage 2: Panel Structure
Use the **panel-structurer** agent to:
- Apply proven structural formulas (4-panel build, 3-panel compressed, 2-panel zinger)
- Implement misdirection techniques
- Verify setup → development → payoff flow
- Check punchline placement

**Pass to next stage:** Finalized panel structure with function assignments

### Stage 3: Dialogue Writing
Use the **dialogue-writer** agent to:
- Write compressed dialogue (≤25 words/panel, ≤80 words total)
- Establish distinct character voices
- Place punchline in final panel, final balloon (≤10 words)
- Eliminate double-writing (dialogue duplicating art)

**Pass to next stage:** Complete dialogue with voice verification

### Stage 4: Panel Descriptions
Use the **panel-describer** agent to:
- Write technical 1-2 sentence descriptions per panel
- Specify shot types and frozen moments
- Position characters in speaking order (left speaks first)
- Include SFX where needed

**Pass to next stage:** Full script with descriptions and dialogue

### Stage 5: Editorial Review
Use the **editorial-reviewer** agent to:
- Run the Five-Category Checklist (Economy, Visual Storytelling, Character Voice, Structure, Craft)
- Apply the "one fewer panel" test
- Verify first-reader accessibility
- Polish and finalize

**Output:** Publication-ready comic strip script

## Usage

```
/create-comic [paste or describe source material]
```

## Agent Handoff Protocol

After each agent completes:
1. Summarize what was accomplished
2. Note any concerns or trade-offs
3. Pass relevant context to the next agent
4. Do not re-explain fundamentals—each agent knows its craft

## Output Format

Final deliverable includes:
1. **Strip metadata** — Title, panel count, structure type
2. **Complete script** — Panel descriptions + dialogue in standard format
3. **Review summary** — Word counts, checklist status, any remaining notes
