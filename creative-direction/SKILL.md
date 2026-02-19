---
name: creative-direction
description: "Develop brand creative treatments from GTM data. Use when the user says 'creative direction', 'brand treatments', 'brand tone', 'creative brief', 'brand identity direction', or wants to develop visual/verbal brand direction from their GTM decomposition."
argument-hint: "[path to GTM file or product name]"
---

# Creative Direction

Take a GTM decomposition (or raw product/ICP info) and produce 3-5 distinct creative treatments — each a coherent brand direction covering tone, visual mood, messaging, and taglines. Recommend one. Output a reference document usable for landing pages, ads, social, and brand assets.

## Essential Principles

These principles govern every phase. Never violate them.

### 1. GTM Feeds Creative, Not the Reverse

```
ICP Pain + Value Prop + Anti-Positioning → Brand Position → Creative Treatments
```

Every creative choice must trace back to a strategic input. If you can't explain *why* a treatment uses a particular tone by pointing to the ICP's psychology, it's decoration, not direction.

### 2. Treatments Are Coherent Worlds

Each treatment is a complete, internally consistent creative direction — not a mix-and-match menu. Tone, visual mood, messaging cadence, and taglines all reinforce each other. A user should be able to imagine the entire brand from a single treatment card.

### 3. Contrast Over Variation

Treatments should be *meaningfully different* — different emotional territories, not the same vibe with different adjective synonyms. If Treatment A is "warm and approachable," Treatment B shouldn't be "friendly and welcoming." It should be "blunt and no-nonsense" or "playful and irreverent."

### 4. Specificity Over Abstraction

Bad: "Modern, clean, professional design with a user-friendly feel."
Good: "Stripped-back UI screenshots on white space. Monospaced type for data fields. One accent color — safety orange — used only on CTAs and cost totals."

### 5. Copy-First, Not Visual-First

The brand voice drives everything. Start with how the brand *talks*, then derive how it *looks*. A brand that speaks in short, punchy sentences looks different from one that speaks in calm, reassuring paragraphs — even if both are "minimal."

### 6. Completeness States

Align with Cantrip's existing system:

| State | Meaning | Marker |
|-------|---------|--------|
| `empty` | No data | `[ ]` |
| `draft` | Exists but thin | `[~]` |
| `refined` | Solid, could be sharper | `[+]` |
| `confirmed` | User approved | `[✓]` |

## Routing Table

| Phase | Gate to Enter | Workflow File |
|-------|---------------|---------------|
| 1. GTM Intake | Always first | `workflows/01-gtm-intake.md` |
| 2. Brand Positioning | Product + ICP pain + value prop exist | `workflows/02-brand-positioning.md` |
| 3. Treatments | Brand position established | `workflows/03-treatments.md` |
| 4. Selection | Treatments presented | `workflows/04-selection.md` |
| 5. Summary | Treatment selected | `workflows/05-summary.md` |

## Entry Point

**If `$ARGUMENTS` is a file path:** Read the file, extract GTM data, start Phase 1 intake.

**If `$ARGUMENTS` is a product name or description:** Treat as raw input, extract what you can, flag gaps.

**If no arguments:** Ask:

> Point me to your GTM decomposition — a file path, or just paste the product name, ICP, and value prop. Even partial info works; I'll flag what's missing.

## Input Vocabulary

The skill consumes these GTM primitives (any may be missing):

| Input | Source | Required? |
|-------|--------|-----------|
| Product name + one-liner | GTM decomposition or user input | Yes (will ask if missing) |
| ICP segment(s) | GTM decomposition | Yes (at least pain + label) |
| Value proposition | GTM decomposition | Yes (at least core promise) |
| Anti-positioning | GTM decomposition | Helpful but inferable |
| Beachhead segment | GTM decomposition | Helpful — defaults to first ICP |
| Channels | GTM decomposition | Optional — informs messaging format |
| Stage | GTM decomposition | Optional — affects ambition level |

## Output: What a Treatment Contains

Each treatment is a **creative direction card** with these sections:

| Section | What It Covers |
|---------|----------------|
| **Treatment Name** | A short evocative label (e.g., "The Friendly Foreman") |
| **Emotional Territory** | The 1-2 core emotions the brand occupies |
| **Brand Archetype** | From `references/tone-archetypes.md` |
| **Tone of Voice** | 3-4 adjectives + do/don't copy examples |
| **Messaging Hierarchy** | Primary message → supporting proof → CTA style |
| **Tagline Candidates** | 2-3 options per treatment |
| **Headline Style** | 2-3 example headlines showing the voice in action |
| **Visual Mood** | Color direction, typography feel, imagery style, layout energy |
| **Where It Shines** | Which channels/contexts this treatment is strongest |
| **Risk/Tradeoff** | What you give up choosing this direction |

## Reference Files

Load on-demand when entering the relevant phase:

- `references/tone-archetypes.md` — Brand voice archetypes with traits, do/don't examples, and ICP-fit guidance
- `references/visual-vocabulary.md` — Vocabulary for describing visual direction without producing visuals
- `references/saas-brand-patterns.md` — Common SaaS brand positioning patterns by market type and ICP sophistication

## Conversation Style

- You are a creative director, not a committee. Have a point of view. Recommend boldly.
- Show, don't describe. Write *example copy* in each treatment's voice — don't just say "conversational tone," demonstrate it.
- Keep the strategic thread visible. Every creative choice should visibly connect to an ICP insight or value prop element.
- Contrast is your tool. Treatments should feel like different *universes*, not different fonts.
- Never produce images, mockups, or visual assets. Describe visual direction in words — evocatively enough that a designer could execute from your description alone.
- Never produce landing pages or ad copy. Produce the *direction* that informs those artifacts.
