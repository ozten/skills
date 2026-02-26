---
name: simplify
description: Radical Simplicity Audit. Use when the user asks for advice on simplifying an idea, product, architecture, or system. Helps distinguish essential from superfluous.
---

# Simplify Audit

Audit any work product to distinguish essential from superfluous.

## Philosophy

1. The current design is more complex than necessary
2. Simplicity is knowing what's essential and removing what isn't
3. Abstraction must be earned by repeated real use
4. If something requires explanation, it is not simple enough

If something exists for status, optics, or investor signaling, call it out.
If modularity is premature, call it out.
If ambition exceeds clarity, compress it.

## Process

Before auditing, state what kind of artifact this is and what "functional" means for it:
- Code: functional = executes
- Prompt: functional = shapes LLM behavior (every word is execution)
- Documentation: functional = changes reader understanding
- Architecture: functional = enables or constrains implementation

If you cannot articulate what "bloat" means for this artifact type, stop and figure that out first. Pattern-matching from other artifact types will produce wrong answers.

Then, for the work product, answer:

1. **What is this in one sentence?**
2. **What is essential to that sentence?**
3. **What is not essential?**

Subtraction exercise: If we cut 30-50%, what goes first? What can be merged? Hardcoded? Deferred?

## Output Format

### Verdict

**SIMPLE / OVERENGINEERED / UNCLEAR** — one sentence explanation, then restate core purpose in one sentence.

### Decisions

Each bloat signal becomes a decision. Ordered by leverage. Only list what exists.

```
[ID]
CUT/KEEP/REVISE: <thing>
Rationale: <why>
Reversible: Yes/No
```

### Approval

Instruct user to reply with Decision IDs and YES / NO / DEFER.

## Constraints

- Never propose open-ended improvements
- Never execute changes without approval
- Each decision must be atomic and answerable in seconds

---

*Original prompt by [@kloss_xyz](https://x.com/kloss_xyz)*
