# Phase 1: Product Extraction

**Goal:** Extract the Product primitive from whatever the user shared.

**Reference:** `references/domain-primitives.md` — for Product fields and enums.

## Process

### Step 1: Parse Input

Scan the user's input and extract everything you can:

| Field | Source | Fallback |
|-------|--------|----------|
| `name` | Explicit mention or infer from description | Ask (required) |
| `one_liner` | Distill from description (≤15 words) | Construct from what's given |
| `capabilities` | Keywords, features mentioned | Infer from domain |
| `format` | "SaaS", "app", "course", "API" signals | Infer from description |
| `stage` | "idea", "building", "have users" signals | Default to `Idea` |

**Inference signals:**
- "app" / "tool" / "platform" / "software" → SaaS
- "course" / "ebook" / "template" / "guide" → InfoProduct
- "API" / "SDK" / "library" → API
- "marketplace" / "connect X with Y" → Marketplace
- "agency" / "consulting" / "done for you" → Service
- "I have an idea" / "thinking about" → Idea stage
- "building" / "working on" / "prototype" → MVP stage
- "have users" / "customers paying" → ProductMarket stage

### Step 2: Present Extraction

Show what you extracted as a compact table:

```
## Product: [name]

| Field | Value | Status |
|-------|-------|--------|
| Name | [name] | [✓] or [~] |
| One-liner | [one_liner] | [~] or [+] |
| Capabilities | tag1, tag2, tag3 | [~] or [+] |
| Format | [format] | [✓] or [~] |
| Stage | [stage] | [✓] or [~] |
```

After the table, add a brief note for any inferred fields:
> I'm inferring **format: SaaS** from "app for landlords" and **stage: Idea** since you said "thinking about." Correct me if either is off.

### Step 3: Ask Only Critical Gaps

**Ask at most 2 questions.** Only ask if:
- `name` is completely missing (not inferable)
- The description is too vague to extract even 1 capability

**Do NOT ask about:**
- Pricing (not needed yet)
- Stage (default to Idea)
- Format (make your best guess)

If you need to ask, prefer multiple-choice over open-ended:

> What would you call this product?
> 1. [inferred name from description]
> 2. [alternative name]
> 3. Something else — tell me

### Step 4: Gate Check

**Proceed to Phase 2 when:**
- Name exists (even rough)
- One-liner exists (even rough)
- At least 1 capability identified

If all three are met, transition:

> Product captured. Now the critical question: **who would use this?**

Then read `workflows/02-icp-hypothesis.md` and proceed to Phase 2.

## Anti-Patterns

- **Don't ask 10 questions.** Extract first, ask only for critical gaps.
- **Don't block on pricing or stage.** These can be refined later.
- **Don't rewrite the user's words into marketing-speak.** "Track time for QBI" is better than "optimize temporal resource allocation."
- **Don't present the extraction as tentative.** Be confident: "Here's what I extracted" not "I think maybe this could be..."
- **Don't skip to ICP.** Even if the user mentioned "for landlords," complete the Product extraction first.

## Examples

**Minimal input:** "SaaS for landlords"
- Name: [~] (ask — "What would you call this?")
- One-liner: "SaaS tool for landlords" [~]
- Capabilities: (none yet — ask "What's the core thing it does?")
- Format: SaaS [✓]
- Stage: Idea [✓] (inferred)

**Rich input:** "I'm building a Simple Repair Tracker to record my time against QBI and keep a TODO list. It's a web app for mom-and-pop landlords."
- Name: Simple Repair Tracker [✓]
- One-liner: "Track repair time against QBI with a TODO list for landlords" [+]
- Capabilities: time-tracking, qbi-tracking, todo-list [+]
- Format: SaaS [✓] (inferred from "web app")
- Stage: MVP [~] (inferred from "building")
- → No questions needed, proceed to Phase 2
