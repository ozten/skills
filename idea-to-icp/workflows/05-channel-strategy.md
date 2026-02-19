# Phase 5: Channel Strategy

**Goal:** Map 2-3 primary channels based on the beachhead ICP segment + market type.

**Reference:** `references/channel-taxonomy.md` — for the full channel list with best-for guidance.

## Process

### Step 1: Cross-Reference ICP with Channels

Pull from the beachhead segment:
1. **Watering holes** — these are direct channel matches (e.g., "BiggerPockets" → community-participation on BiggerPockets)
2. **Market type** — use the Channel Selection Matrix from the reference
3. **Buying model** — use the Buying Model Adjustments from the reference
4. **Budget band** — filters out channels where unit economics don't work (e.g., Google Ads for a $5/mo product)

### Step 2: Recommend 2-3 Channels

Present each recommended channel as a card:

```
### Channel Strategy for [Beachhead Segment]

#### 1. [Channel Name]
| Field | Value |
|-------|-------|
| Motion | Inbound / Outbound |
| Tags | [relevant tags] |
| Rationale | [why this channel for this ICP — tie to watering holes or market type] |
| First experiment | [concrete, time-boxed experiment with measurable outcome] |

#### 2. [Channel Name]
| Field | Value |
|-------|-------|
| Motion | Inbound / Outbound |
| Tags | [relevant tags] |
| Rationale | [why this channel for this ICP] |
| First experiment | [concrete experiment] |

#### 3. [Channel Name]
| Field | Value |
|-------|-------|
| Motion | Inbound / Outbound |
| Tags | [relevant tags] |
| Rationale | [why this channel for this ICP] |
| First experiment | [concrete experiment] |
```

**Channel recommendation rules:**

1. **Always include landing-page** as a foundational channel (unless they already have one)
2. **At least 1 channel matching a watering hole** — if the ICP hangs out on BiggerPockets, that's a channel
3. **Mix motions when possible** — 1 inbound + 1 outbound gives faster learning
4. **Match buying model** — SelfServe favors inbound, SalesLed favors outbound
5. **Respect budget** — don't recommend Google Ads for a Micro budget product

**First experiment quality bar:**
- Specific: "50 personalized emails" not "do some outreach"
- Time-boxed: "over 2 weeks" not "eventually"
- Measurable: "measuring reply rate" not "see how it goes"
- Achievable: something they can do this week, not a 3-month project

### Step 3: Explain What Was Excluded

Briefly note 1-2 channels you considered but rejected, and why:

> **Considered but not recommended now:**
> - **Google Ads** — your price point ($X/mo) makes it hard to achieve positive ROAS at this stage
> - **Cold email** — your ICP is B2C, and cold email works better for B2B contexts

This builds trust and shows strategic thinking.

### Step 4: User Confirms or Adjusts

> These 3 channels are your starting playbook. Anything to swap or adjust?
>
> You can also tell me about channels you've already tried — I'll factor in what you've learned.

### Step 5: Confirm and Present

```
### Channel Strategy [✓]

| # | Channel | Motion | First Experiment | Status |
|---|---------|--------|-----------------|--------|
| 1 | [name] | [motion] | [experiment summary] | [+] |
| 2 | [name] | [motion] | [experiment summary] | [+] |
| 3 | [name] | [motion] | [experiment summary] | [+] |
```

### Step 6: Gate Check

**Proceed to Phase 6 when:**
- 2+ channels identified

Transition:

> Channel strategy set. Let me pull everything together into a **structured GTM summary**.

Then read `workflows/06-summary.md` and proceed to Phase 6.

## Anti-Patterns

- **Don't recommend 7 channels.** 2-3 is the max. Focus beats breadth. Early-stage founders can't execute on more.
- **Don't recommend channels disconnected from the ICP.** If the ICP doesn't use LinkedIn, don't recommend LinkedIn DMs just because it's a "standard B2B play."
- **Don't skip the first experiment.** The channel recommendation without an actionable experiment is just theory.
- **Don't recommend paid channels for Idea-stage products.** They should validate with organic/outbound before spending money.
- **Don't ignore what the user already tried.** If they mention "I posted on Reddit and got 0 traction," factor that in.
