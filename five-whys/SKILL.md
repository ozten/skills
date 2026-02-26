---
name: five-whys
description: "Root cause analysis technique for self-improvement. Use after any failure, mistake, or suboptimal outcome to find systemic causes and actionable changes. Triggers: analyzing why something went wrong, debugging repeated failures, post-mortem analysis, retrospectives, understanding root causes, reflecting on what could be improved."
---

# Five Whys

Iteratively ask "Why?" until reaching a cause that is actionable, systemic, and honest.

## Process

1. State the problem (specific, factual, no judgment)
2. Ask "Why did this happen?"
3. Take that answer, ask "Why?" again
4. Repeat until reaching a root cause
5. Identify what to change

## Forking

When an answer contains multiple factors (look for "and", "plus", "also", or multiple clauses), fork into separate branches. Each branch gets its own chain of whys and its own change.

```
Problem: Deploy failed
│
├─ Branch A: Why did the config have a typo?
│  └── Why? I edited it manually
│      └── Why? No templating or validation
│          └── Change: Add config schema validation
│
└─ Branch B: Why were there no tests?
   └── Why? I didn't know that path existed
       └── Why? I didn't check coverage
           └── Change: Require coverage check
```

## Blameless Reframes

| Avoid | Instead |
|-------|---------|
| "I was careless" | "What check would have caught this?" |
| "I should have known" | "What information was I missing?" |
| "I made a mistake" | "What made this mistake possible?" |

"I failed" is never a root cause. Ask: **what process, knowledge, or check was missing?**

## Pitfalls

- **Stopping too early**: "I didn't test it" → keep going → "Why didn't I test?"
- **Vague answers**: "Be more careful" is not actionable. "Read the full file before editing" is.
- **Single-threading**: Multiple factors need multiple branches

## Good Changes

- **Specific**: "Search for function usage before modifying" not "Be more thorough"
- **Verifiable**: You can tell if you did it
- **Preventive**: Stops this class of problem, not just this instance

## Output Template

```markdown
## Problem
[What went wrong - specific and factual]

## Analysis

### Branch A: [First factor]
1. Why? [Answer]
2. Why? [Answer]
3. Why? [Root cause]

**Root cause**: [Systemic gap]
**Change**: [Specific action]

### Branch B: [Second factor, if any]
1. Why? [Answer]
2. Why? [Root cause]

**Root cause**: [Systemic gap]
**Change**: [Specific action]
```
