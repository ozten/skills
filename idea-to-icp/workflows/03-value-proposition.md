# Phase 3: Value Proposition

**Goal:** Derive a value proposition from Product capabilities crossed with ICP pain.

**Reference:** `references/domain-primitives.md` — for ValueProp fields and DiffDimension enum.

## Process

### Step 1: Generate Core Promise Candidates

Using the formula: **"[Capability] so that [ICP pain resolved]"**

Generate 2-3 `core_promise` candidates. Each should:
- Connect a specific product capability to a specific ICP pain
- Be concrete, not abstract
- Use the ICP's language, not marketing jargon

Present as numbered options:

```
### Value Proposition Candidates

Based on [Product name]'s capabilities and [Primary ICP]'s pain:

1. **"[capability verb] so that [pain resolution]"**
   Connects: [capability tag] → [pain statement]

2. **"[capability verb] so that [pain resolution]"**
   Connects: [capability tag] → [pain statement]

3. **"[capability verb] so that [pain resolution]"**
   Connects: [capability tag] → [pain statement]
```

**Quality bar:**
- Bad: "Streamline your operations to maximize efficiency"
- Good: "Track repair hours against QBI so you don't leave deductions on the table at tax time"
- Bad: "All-in-one solution for your business needs"
- Good: "One screen to log time, track costs, and generate the QBI report your accountant actually wants"

### Step 2: Suggest Differentiators

Based on the product's capabilities compared to the current alternatives identified in Phase 2:

```
### Differentiators

| Claim | Dimension | vs. Current Alternative |
|-------|-----------|------------------------|
| [specific claim] | Speed / Price / Simplicity / etc. | [how this beats what they do today] |
| [specific claim] | [dimension] | [comparison] |
```

Pick 2-3 dimensions that genuinely differentiate. Don't stretch — if the product isn't cheaper, don't claim Price.

**Dimension selection guide:**
- Replacing spreadsheets → **Simplicity** or **Speed**
- Replacing expensive software → **Price** or **Simplicity**
- Replacing nothing (new behavior) → **Specialization**
- Replacing generic tools → **Specialization** or **Integration**
- Replacing manual processes → **Speed** or **Quality**

### Step 3: Suggest Anti-Positioning

What this product is NOT. Anti-positioning clarifies focus and prevents feature creep.

> **What [Product name] is NOT:**
> - Not a full property management suite — no tenant screening, lease signing, or rent collection
> - Not an accounting tool — won't replace QuickBooks, just feeds it the right data
> - Not for large portfolios — built for the 1-10 door landlord, not the 100-unit operator

Generate 2-3 anti-positioning statements based on:
- Adjacent products the ICP might confuse this with
- Features the product explicitly does NOT have
- Segments the product is NOT for

### Step 4: User Selects/Edits

> Which core promise resonates most? Pick one, or tell me what's off and I'll revise.
>
> The differentiators and anti-positioning — anything to add or change?

### Step 5: Confirm and Present

After user feedback:

```
### Value Proposition [✓]

**Core promise:** "[selected/edited promise]" [✓]

**Differentiators:**
| Claim | Dimension | Status |
|-------|-----------|--------|
| [claim] | [dimension] | [✓] |
| [claim] | [dimension] | [+] |

**Anti-positioning:**
- [statement] [+]
- [statement] [+]
```

### Step 6: Gate Check

**Proceed to Phase 4 when:**
- `core_promise` exists (user picked or edited one)

If only 1 ICP segment was selected in Phase 2, skip Phase 4 and go directly to Phase 5.

Transition (if 2+ segments):
> Value prop locked. You've got [N] ICP segments — let's pick which one to **attack first**.

Transition (if 1 segment):
> Value prop locked. Since [segment] is your only ICP, that's your beachhead. Let's figure out **how to reach them**.

Then read the appropriate workflow file.

## Anti-Patterns

- **Don't generate vague promises.** "Help you succeed" is not a value prop.
- **Don't list 10 differentiators.** 2-3 that are genuinely true and defensible.
- **Don't skip anti-positioning.** It's one of the most useful strategic exercises at this stage.
- **Don't force the "[X] so that [Y]" format** if the user edits to something better. The format is a starting point, not a cage.
- **Don't confuse features with value.** "Has a timer" is a feature. "Never miss a QBI deduction" is value.
