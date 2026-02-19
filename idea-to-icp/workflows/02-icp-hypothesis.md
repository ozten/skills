# Phase 2: ICP Hypothesis — THE CRITICAL GATE

**Goal:** Generate ICP segment hypotheses, user selects/ranks, deep-dive on selected segments.

**Reference:** `references/icp-patterns.md` — for vertical-specific segment templates and decision trees.

This is the most important phase. Everything downstream depends on getting ICP right. Spend the time here.

## Process

### Step 1: Ask Who

Even if the user hinted at an audience in Phase 1, ask explicitly:

> Who do you think would use [Product name]? Even a rough description — "landlords," "small dev teams," "fitness coaches" — gives me enough to work with.

If the user already provided a clear audience (e.g., "for mom-and-pop landlords"), skip this and proceed to Step 2.

### Step 2: Generate 3-5 ICP Segment Hypotheses

Using the user's audience hint + product capabilities, generate 3-5 distinct segments.

For each segment, produce a **card** with these fields:

```
### Segment N: [Label]

| Field | Value | Status |
|-------|-------|--------|
| Label | [descriptive name with qualifier] | [~] |
| Pain | [core problem this segment has] | [~] |
| Current alternative | [what they do today] | [~] |
| Trigger events | [when they start looking] | [~] |
| Watering holes | [where they hang out] | [~] |
| Budget band | [Micro/Low/Mid/High/Enterprise] | [~] |
| Decision maker | [Individual/Household/Team/Committee/Champion] | [~] |
```

**How to generate good segments:**

1. Check `references/icp-patterns.md` for the relevant vertical
2. Adapt templates to the specific product's capabilities
3. Differentiate segments by: size/scale, motivation, sophistication, or use case
4. Each segment should have a meaningfully different pain and buying context
5. Use specific, descriptive labels — "Mom & Pop Landlords (3-10 doors)" not just "Landlords"

**Quality bar for segment labels:**
- Include a qualifier that narrows the segment: size, role, situation, or behavior
- Bad: "Small businesses" / Good: "Solo consultants scaling past $100K"
- Bad: "Developers" / Good: "Backend engineers at seed-stage startups"

### Step 3: Present and Ask User to Select

After presenting all segment cards:

> Which of these feel closest to who you'd sell to first? Pick 1-2 and rank them (1 = primary).
>
> You can also tell me if I'm missing a segment entirely — I can generate more.

### Step 4: Deep-Dive on Selected Segments

For each selected segment, ask **at most 1-2 follow-up questions** to sharpen the highest-impact fields:

**Priority questions (pick the most relevant):**
- Pain specificity: "When [segment] deals with [pain], what's the most frustrating part?"
- Watering holes: "Where do [segment] actually go for advice? Specific forums, communities, people they follow?"
- Current alternative detail: "What do [segment] actually use today for this? Name specific tools or behaviors."
- Trigger: "What event would make [segment] suddenly Google for a solution like yours?"

**Do NOT ask about:**
- Budget band (infer from context)
- Decision maker (infer from market type)
- Abstract strategy questions

### Step 5: Infer Market Type and Buying Model

Using the decision trees from `references/icp-patterns.md`:

1. Determine `market_type` from the selected segments
2. Determine `buying_model` from price point + buyer sophistication
3. Present as a brief inline note:

> Based on your segments, I'm tagging this as **B2B_SMB / SelfServe** — small business owners buying directly, no sales process needed. Sound right?

### Step 6: Update Segment Status

After user feedback, update the selected segments:

```
### Segment 1 (Primary): [Label] [✓]

| Field | Value | Status |
|-------|-------|--------|
| Label | [refined label] | [✓] |
| Pain | [refined pain] | [+] or [✓] |
| Current alternative | [refined] | [+] |
| Trigger events | [refined] | [~] or [+] |
| Watering holes | [refined] | [+] or [✓] |
| Budget band | [inferred] | [~] |
| Decision maker | [inferred] | [~] |

Market type: [type] | Buying model: [model]
```

### Step 7: Gate Check

**Proceed to Phase 3 when:**
- At least 1 segment has a confirmed label
- Market type is assigned
- User has ranked their selections

Transition:

> ICP locked in. Now let's figure out **why they'd pick you** over what they're doing today.

Then read `workflows/03-value-proposition.md` and proceed to Phase 3.

**If 2+ segments were ranked**, note that we'll pick a beachhead in Phase 4. If only 1 segment was selected, it IS the beachhead — note this and skip Phase 4 later.

## Anti-Patterns

- **Don't generate generic segments.** "Small businesses" is not a segment. "Shopify store owners doing $10-50K/mo who can't afford an agency" is.
- **Don't ask the user to fill in every field.** Populate from your knowledge, mark as `[~]`, and let them correct.
- **Don't generate more than 5 segments.** It's overwhelming. 3-5 is the sweet spot.
- **Don't deep-dive on unselected segments.** Only ask follow-ups on the ones the user picked.
- **Don't skip market_type inference.** It shapes everything downstream (value prop framing, channel selection).
- **Don't present segments as equally valid.** If you have a strong opinion about which is best, say so: "I'd bet on Segment 2 — they have the sharpest pain and clearest budget."
