# Phase 6: Summary

**Goal:** Present all primitives in a structured format that maps to Cantrip data models. Provide next steps.

## Process

### Step 1: Generate Full Summary

Present the complete GTM decomposition:

```
---

## GTM Decomposition: [Product Name]

### Product

| Field | Value | Status |
|-------|-------|--------|
| Name | [name] | [✓] |
| One-liner | [one_liner] | [status] |
| Capabilities | [tag1], [tag2], [tag3] | [status] |
| Format | [format] | [status] |
| Stage | [stage] | [status] |

### ICP

**Market type:** [type] | **Buying model:** [model]

#### Segment 1 — Beachhead: [Label]

| Field | Value | Status |
|-------|-------|--------|
| Label | [label] | [✓] |
| Pain | [pain] | [status] |
| Current alternative | [alternative] | [status] |
| Trigger events | [triggers] | [status] |
| Watering holes | [watering_holes] | [status] |
| Budget band | [budget] | [status] |
| Decision maker | [decision_maker] | [status] |

#### Segment 2: [Label] (if exists)

(same format)

### Value Proposition

| Field | Value | Status |
|-------|-------|--------|
| Core promise | [promise] | [✓] |
| Differentiator 1 | [claim] ([dimension]) | [status] |
| Differentiator 2 | [claim] ([dimension]) | [status] |
| Anti-positioning | [statements] | [status] |

### Beachhead

**Selected:** [Segment label]
**Rationale:** [1-2 sentences]
**Expand to:** [Next segment] after validation

### Channels

| # | Channel | Motion | First Experiment | Status |
|---|---------|--------|-----------------|--------|
| 1 | [name] | [motion] | [experiment] | [status] |
| 2 | [name] | [motion] | [experiment] | [status] |
| 3 | [name] | [motion] | [experiment] | [status] |

### Completeness

[X]/[Y] fields confirmed ([Z]%)

---
```

### Step 2: Calculate Completeness

Count fields across all sections:

- Product: name, one_liner, capabilities, format, stage (5 fields)
- ICP: label, pain, current_alternative, trigger_events, watering_holes, budget_band, decision_maker, market_type, buying_model (9 fields per segment + 2 shared)
- Value Prop: core_promise, differentiators, anti_positioning (3 fields)
- Beachhead: selection (1 field)
- Channels: 2-3 channel entries (count each as 1 field)

For each field, score by completeness state:
- `[✓]` confirmed = 1.0
- `[+]` refined = 0.7
- `[~]` draft = 0.4
- `[ ]` empty = 0.0

Report: "[confirmed count]/[total fields] confirmed ([percentage]%)"

### Step 3: Provide Next Steps

Based on what's weakest in the completeness assessment:

> ### Next Steps
>
> **Validate first:**
> - [Most important assumption to test — usually the beachhead ICP's pain]
> - [Second assumption — usually willingness to pay]
>
> **Sharpen next:**
> - [Fields still at draft/refined status that would benefit from customer conversations]
>
> **Execute:**
> - [First channel experiment to run this week]
> - [Second experiment for next week]

### Step 4: Offer to Save

If working within a Cantrip project context:

> Want me to save this as a Cantrip project? I'll create the project with ICP segments, value proposition, and channel entries mapped to the data model.

If not in project context:

> You can use this decomposition to set up a Cantrip project when you're ready. The fields map directly to the data model.

## Output Field Mapping

When saving to Cantrip, map as follows:

| Summary Field | Cantrip Model | Cantrip Field |
|---|---|---|
| Product name | `ProjectModel` | `name` |
| Product one-liner | `ProjectModel` | `description` |
| Segment label | `ICPModel` | `name` |
| Segment pain | `ICPModel` | `painPoints[]` |
| Segment trigger events | `ICPModel` | `jobsToBeDone[]` |
| Segment current alternative | `ICPModel` | `currentAlternatives[]` |
| Segment budget band | `ICPModel` | `willingnessToPay` |
| Segment priority (beachhead=1) | `ICPModel` | `priority` |
| Core promise | `ValuePropositionModel` | `framing` |
| Differentiators | `ValuePropositionModel` | `options[]` (as MultiOptionCandidate) |
| Channel name | `SocialWebEntryModel` | `name` |
| Channel platform | `SocialWebEntryModel` | `platform` |
| Channel relevance (1=primary) | `SocialWebEntryModel` | `relevanceScore` |

## Anti-Patterns

- **Don't just dump the data.** The summary should read as a coherent strategy document, not a database export.
- **Don't inflate completeness.** Be honest about what's draft vs confirmed.
- **Don't provide generic next steps.** "Talk to customers" is not actionable. "Interview 5 [segment] landlords from [watering hole] about [specific pain]" is.
- **Don't end without action.** The user should leave with something to do this week.
