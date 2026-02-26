# Phase 1: GTM Intake

**Goal:** Parse the GTM decomposition (or raw input) and extract the strategic inputs that drive creative direction.

## Process

### Step 1: Locate and Parse Input

If a file path was provided, read it. If raw text, parse it.

Extract these fields and assess completeness:

| Field | Where to Find It | Creative Relevance |
|-------|-------------------|-------------------|
| Product name | Product section | Naming energy, formality level |
| One-liner | Product section | Core message seed |
| Capabilities | Product section | Feature-messaging mapping |
| ICP label(s) | ICP section | Audience psychology |
| ICP pain | ICP section | Emotional territory anchor |
| Current alternatives | ICP section | Competitive contrast |
| Watering holes | ICP section | Channel tone calibration |
| Budget band | ICP section | Perceived value framing |
| Core promise | Value Prop section | Primary message |
| Differentiators | Value Prop section | Proof points |
| Anti-positioning | Value Prop section | "We are NOT" boundaries |
| Beachhead | Beachhead section | Primary audience for tone |
| Channels | Channel section | Format constraints |

### Step 2: Present Creative Brief Inputs

Show what you extracted in a compact format:

```
## Creative Brief Inputs

**Product:** [name] — [one-liner]

**Primary audience:** [beachhead label]
- Pain: [pain statement]
- Currently using: [alternatives]
- Hangs out on: [watering holes]
- Budget: [band]

**Core promise:** [promise]
**Differentiators:** [list]
**We are NOT:** [anti-positioning]

**Channels to design for:** [list]
```

### Step 3: Infer Missing Creative Inputs

For fields not in the GTM data, infer from context:

| Missing Field | Inference Strategy |
|---------------|-------------------|
| Anti-positioning | Infer from capabilities (what's NOT listed) and ICP (who's NOT the audience) |
| Channels | Infer from watering holes and market type |
| Budget band | Infer from market type and ICP label |
| Beachhead | Default to first/primary ICP segment |

Mark inferences with `[~]` and note: "Inferred — correct me if wrong."

### Step 4: Derive Creative Constraints

From the GTM data, extract constraints that will govern all treatments:

```
## Creative Constraints (apply to ALL treatments)

- **Audience sophistication:** [low/mid/high — based on ICP]
- **Price perception:** [impulse/considered/investment — based on budget band]
- **Competitive frame:** [replacing nothing / replacing spreadsheets / replacing expensive tools]
- **Channel format:** [long-form OK / must work in short-form / needs to scan on mobile]
- **Product stage:** [Idea/MVP/PMF — affects how much you can promise]
```

These constraints are non-negotiable across treatments. Treatments differ in *personality*, not in *who they're talking to*.

### Step 5: Flag Critical Gaps

If any of these are missing, ask (max 2 questions):

**Must have:**
- Product name (can't do creative without it)
- At least one ICP pain statement (the emotional anchor)

**Nice to have (infer if missing):**
- Everything else

### Step 6: Gate Check

**Proceed to Phase 2 when:**
- Product name exists
- At least one ICP pain exists
- Core promise exists (even rough)

Transition:

> Strategic inputs captured. Now let's find the **emotional territory** this brand should own.

Then read `workflows/02-brand-positioning.md`.

## Anti-Patterns

- **Don't redesign the GTM.** You're consuming it, not critiquing it. If the ICP seems wrong, note it gently but proceed.
- **Don't ask 5 questions to fill gaps.** Infer aggressively. You're a creative director — you should be able to work with partial briefs.
- **Don't skip the constraints.** They prevent treatments from drifting into fantasy. A $10/mo tool for small landlords cannot sound like enterprise software.
- **Don't present the intake as raw data.** Reframe it through a creative lens — "the pain is about control and peace of mind" not just "tax-season scramble."
