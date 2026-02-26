# Phase 5: Summary — Creative Direction Document

**Goal:** Compile the full creative direction into a single reference document. This is the deliverable — usable by designers, copywriters, or the founder themselves for landing pages, ads, social content, and brand assets.

## Process

### Step 1: Compile the Full Document

Structure the output as a complete creative brief:

```
# Creative Direction: [Product Name]

*Generated from GTM decomposition. Reference document for brand, landing page, ads, and content.*

---

## Strategic Foundation

**Product:** [name] — [one-liner]
**Beachhead ICP:** [segment label]
**Core Promise:** [value prop core promise]
**We Are NOT:** [anti-positioning bullets]

---

## Brand Position

**Emotional Territory:** [1-2 words]
**Brand Tension:** [Quality A] ↔ [Quality B]
**Identity Shift:** [who the user becomes with this product]

---

## Selected Treatment: [Treatment Name]

### Tone of Voice

**In 4 words:** [adj], [adj], [adj], [adj]

**Voice rules:**
- [Rule 1 — e.g., "Use 'you' not 'users'. First person plural sparingly."]
- [Rule 2 — e.g., "Short sentences. One idea per sentence. Fragments OK."]
- [Rule 3 — e.g., "Name the pain concretely. 'Shoebox of receipts' not 'disorganized records.'"]

**Do / Don't:**

| Do Write | Don't Write |
|----------|-------------|
| "[example]" | "[example]" |
| "[example]" | "[example]" |
| "[example]" | "[example]" |
| "[example]" | "[example]" |

### Messaging

**Primary message:** [max 10 words]
**Supporting proof:** [1 sentence]
**CTA style:** [description + 2-3 example CTAs]

### Taglines

1. **[recommended tagline]** ← recommended
2. [alternative]
3. [alternative]

### Headlines

**Landing page hero:**
> [headline]

**Feature sections:**
> [headline 1]
> [headline 2]

**Ads / Social:**
> [headline 1]
> [headline 2]

### Visual Direction

**Color:**
[Mood description — specific enough to narrow a palette, not hex codes]

**Typography:**
[Feel description — serif vs sans, weight, personality, when to use which]

**Imagery:**
[Style description — photo vs illustration, subjects, energy, what to avoid]

**Layout:**
[Energy and structure — whitespace, density, rhythm]

**UI Personality:**
[How the product interface itself should feel]

### Channel Applications

#### [Channel 1]
- Voice adjustment: [any shift]
- Format: [what works here]
- Example: "[copy example]"

#### [Channel 2]
- Voice adjustment: [any shift]
- Format: [what works here]
- Example: "[copy example]"

#### [Channel 3]
- Voice adjustment: [any shift]
- Format: [what works here]
- Example: "[copy example]"

---

## Alternative Treatments (Not Selected)

Brief summaries of the other treatments for future reference:

### [Treatment B Name]
**In one sentence:** [what this direction was about]
**Best for:** [when you'd revisit this direction]
**Key tagline:** "[best tagline from this treatment]"

### [Treatment C Name]
**In one sentence:** [what this direction was about]
**Best for:** [when you'd revisit this direction]
**Key tagline:** "[best tagline from this treatment]"

(repeat for each unselected treatment)

---

## Completeness

[X]/[Y] fields confirmed ([Z]%)

---
```

### Step 2: Calculate Completeness

Count fields across all sections:

- Strategic foundation: product, ICP, promise, anti-positioning (4 fields)
- Brand position: emotional territory, tension, identity shift (3 fields)
- Tone of voice: 4-word summary, voice rules, do/don't (3 fields)
- Messaging: primary, proof, CTA style (3 fields)
- Taglines: 3 candidates (1 field)
- Headlines: hero, features, ads (3 fields)
- Visual direction: color, typography, imagery, layout, UI (5 fields)
- Channel applications: 1 per channel (2-3 fields)

Score by state:
- `[✓]` = 1.0
- `[+]` = 0.7
- `[~]` = 0.4
- `[ ]` = 0.0

### Step 3: Offer to Save

> Want me to save this creative direction to a file? I'll put it alongside your GTM decomposition.

If the user provides a path or confirms, write the document to the specified location (default: same directory as the GTM file, named `[product-name]-creative-direction.md`).

## Anti-Patterns

- **Don't dump raw phase outputs.** This is a *compiled document*, not a transcript. Restructure and polish.
- **Don't include the process.** The user doesn't need to see "Phase 1 → Phase 2." They need the *result*.
- **Don't drop the alternative treatments entirely.** Brief summaries are valuable — the user may revisit them later or use them for A/B testing.
- **Don't add implementation details.** This is direction, not execution. No CSS, no Figma specs, no ad platform settings.
- **Don't inflate completeness.** Be honest. Fields that were inferred but not confirmed by the user are `[+]` at best.
