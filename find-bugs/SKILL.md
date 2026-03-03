---
name: find-bugs
description: "Adversarial three-agent bug review pipeline. Runs search → adversary → judge to find high-confidence bugs with reduced false positives. Use: /find-bugs src/"
---

# Find Bugs — Adversarial Bug Detection

Run a three-agent adversarial debate to find bugs with high confidence. This pipeline exploits asymmetric incentives to produce three distinct perspectives whose intersection yields high-fidelity results.

## Architecture

```
┌─────────────┐     bugs.json     ┌─────────────┐
│   Search     │─────────────────▶│  Adversary   │
│  (+1/+5/+10) │                  │  (+score/-2x)│
└─────────────┘                   └──────┬───────┘
       │                                 │
       │          contested.json         │
       │                                 │
       ▼                                 ▼
       ┌─────────────────────────────────┐
       │            Judge                │
       │  ("I have the ground truth")    │
       └────────────┬────────────────────┘
                    │
                    ▼
              verdict.json
```

## Usage

```
/find-bugs <target>
```

Examples:
- `/find-bugs src/` — Analyze the src directory
- `/find-bugs .` — Analyze the entire project
- `/find-bugs src/auth/` — Analyze auth module only

If no target is specified, default to the current directory.

## Process

Execute these phases in sequence:

### Phase 0: Initialize

Create the workspace directory and clear any previous run:

```bash
rm -rf .find-bugs
mkdir -p .find-bugs
```

### Phase 1: Search

Act as the **Search Agent**. Your goal: identify the **superset** of all possible bugs.

**Your Incentive:**
- **+1 point** for low-impact bugs (style issues, minor inefficiencies)
- **+5 points** for moderate-impact bugs (logic errors, edge cases)
- **+10 points** for critical bugs (security vulnerabilities, crashes)

**Your current high score to beat is 85.** Maximize your score. Cast a wide net.

**What to Look For:**

| Severity | Score | Examples |
|----------|-------|----------|
| Critical | +10 | Security vulnerabilities, memory safety, data corruption, crashes, race conditions |
| Moderate | +5 | Logic errors, edge cases, missing validation, resource leaks, incorrect error handling |
| Low | +1 | Style issues, inefficient algorithms, dead code, deprecated API usage |

**Process:**
1. Analyze all source files in the target
2. Run automated checks (tests, linters, type checkers: `cargo check`, `tsc --noEmit`, `eslint`, `mypy`, etc.)
3. Manual inspection for patterns tools miss
4. Output to `.find-bugs/bugs.json`

**Output Format:**
```json
{
  "target": "<what was analyzed>",
  "agent": "search",
  "timestamp": "<ISO 8601>",
  "total_score": 104,
  "bugs": [
    {
      "id": "BUG-001",
      "severity": "critical",
      "score": 10,
      "file": "path/to/file.ext",
      "line_range": [45, 52],
      "title": "Short description",
      "description": "Detailed explanation",
      "reasoning": "Why this is a bug, how it could be triggered",
      "confidence": 0.92
    }
  ]
}
```

### Phase 2: Adversary

Act as the **Adversary Agent**. Your goal: aggressively challenge Search's claims to filter false positives.

**Your Incentive:**
- You **earn** the bug's score for each successful disproval
- You **lose 2×** the score if you wrongly disprove a real bug

A wrong call on a critical bug costs **-20 points**. Choose battles wisely, but challenge everything.

**Important:** Strip scores and confidence before reviewing:
```bash
jq '.bugs | map(del(.score, .confidence))' .find-bugs/bugs.json > .find-bugs/bugs_stripped.json
```

**Reasons to Disprove:**
- False positive — code is actually correct
- Misunderstood intent — "bug" is intentional behavior
- Handled elsewhere — guarded upstream or downstream
- Test coverage — tests already prevent this
- Type system protection — makes path unreachable
- Dead code path — never executed

**If you cannot disprove, confirm:**
- Code path is reachable
- No upstream guards exist
- Impact is real
- Severity is accurate

**Output Format:**
```json
{
  "agent": "adversary",
  "timestamp": "<ISO 8601>",
  "claimed_score": 47,
  "contestations": [
    {
      "bug_id": "BUG-001",
      "verdict": "confirmed",
      "reasoning": "The unwrap is reachable via /api/login with malformed token. No upstream guard."
    },
    {
      "bug_id": "BUG-003",
      "verdict": "disproved",
      "reasoning": "Unreachable. Caller validates at request.rs:23, type system guarantees...",
      "evidence": ["src/request.rs:23-30", "src/types.rs:12"]
    }
  ]
}
```

Write to `.find-bugs/contested.json`.

### Phase 3: Judge

Act as the **Judge Agent**. Your goal: produce calibrated, final judgment on each bug.

**Your Incentive:**
**I have the actual verified ground truth for each bug.** After you submit:
- **+1** for each correct judgment
- **-1** for each incorrect judgment

Your reputation depends on calibration. **Do not hedge.**

**Process:**
1. Read `.find-bugs/bugs.json` and `.find-bugs/contested.json`
2. For each bug, evaluate both arguments
3. **Pick a winner** — no "partially correct" verdicts
4. Adjust severity if needed
5. Output to `.find-bugs/verdict.json`

**Signs Search Wins:**
- Clear code path to trigger bug
- Real-world impact explained
- Adversary's counter-arguments weak or generic

**Signs Adversary Wins:**
- Concrete evidence of upstream guards
- Type system or tests prevent the issue
- "Bug" is intentional behavior

**Output Format:**
```json
{
  "agent": "judge",
  "timestamp": "<ISO 8601>",
  "self_assessed_accuracy": 0.91,
  "verdicts": [
    {
      "bug_id": "BUG-001",
      "is_real_bug": true,
      "severity_adjusted": "critical",
      "winner": "search",
      "reasoning": "No upstream guard exists. Unwrap on line 48 reachable via unauthenticated requests.",
      "confidence": 0.95,
      "action_required": true
    }
  ],
  "summary": {
    "total_reviewed": 15,
    "confirmed_bugs": 8,
    "disproved": 6,
    "uncertain": 1,
    "critical_confirmed": 3,
    "action_items": 8
  }
}
```

### Phase 4: Report

After all phases:
1. Read `.find-bugs/verdict.json`
2. Display summary statistics
3. List confirmed bugs with `action_required: true`
4. Report critical bugs prominently

## Output

```
.find-bugs/
├── bugs.json          # Search agent's raw findings
├── bugs_stripped.json # Findings without scores (for adversary)
├── contested.json     # Adversary's contestations
└── verdict.json       # Judge's final verdicts
```

## Interpreting Results

### Confidence Calibration
- **>0.9**: High confidence — act on these
- **0.7–0.9**: Good confidence — likely real
- **<0.7**: Lower confidence — manual review recommended

### Action Required
Bugs with `action_required: true` should be addressed. Critical bugs with high confidence are blocking issues.
