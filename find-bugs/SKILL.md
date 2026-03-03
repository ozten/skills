---
name: find-bugs
description: "Adversarial three-agent bug review pipeline. Runs search → adversary → judge to find high-confidence bugs with reduced false positives. Use: /find-bugs src/"
---

# Find Bugs — Adversarial Bug Detection

Run a three-agent adversarial debate to find bugs with high confidence. Each agent runs as an **isolated subagent** with its own context — they communicate only via JSON files.

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

Execute these phases in sequence. **Each phase runs as an isolated Task subagent.**

### Phase 0: Initialize

Create the workspace directory and clear any previous run:

```bash
rm -rf .find-bugs
mkdir -p .find-bugs
```

### Phase 1: Search Agent (Task subagent)

Spawn a Task subagent with `subagent_type: "general-purpose"` and the following prompt:

```
You are the SEARCH AGENT in a bug-hunting competition. Your goal: identify the SUPERSET of all possible bugs in: <TARGET>

SCORING:
- +1 point for low-impact bugs (style issues, minor inefficiencies)
- +5 points for moderate-impact bugs (logic errors, edge cases)
- +10 points for critical bugs (security vulnerabilities, crashes)

Your high score to beat is 85. MAXIMIZE your score. Cast a wide net.

WHAT TO LOOK FOR:
Critical (+10): Security vulnerabilities, memory safety, data corruption, crashes, race conditions
Moderate (+5): Logic errors, edge cases, missing validation, resource leaks, error handling
Low (+1): Style issues, inefficient algorithms, dead code, deprecated APIs

PROCESS:
1. Read all source files in the target
2. Run automated checks that apply: npm test, npm audit, eslint, tsc --noEmit, cargo check, mypy, etc.
3. Manual inspection for patterns tools miss
4. Write findings to .find-bugs/bugs.json

OUTPUT FORMAT (.find-bugs/bugs.json):
{
  "target": "<what was analyzed>",
  "agent": "search",
  "timestamp": "<ISO 8601>",
  "total_score": <sum>,
  "bugs": [
    {
      "id": "BUG-001",
      "severity": "critical|moderate|low",
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

Be THOROUGH. An adversary will challenge every finding. Document your reasoning with file paths and line numbers.
```

**Allowed tools for Search:** `Read`, `Bash`, `Glob`, `Grep`, `Write`

Wait for the Search agent to complete and write `.find-bugs/bugs.json`.

### Phase 1.5: Strip Scores

Before running the Adversary, strip scores and confidence to prevent cherry-picking:

```bash
jq '{target: .target, bugs: [.bugs[] | {id, severity, file, line_range, title, description, reasoning}]}' .find-bugs/bugs.json > .find-bugs/bugs_stripped.json
```

### Phase 2: Adversary Agent (Task subagent)

Spawn a Task subagent with `subagent_type: "general-purpose"` and the following prompt:

```
You are the ADVERSARY AGENT in a bug-hunting competition. Your goal: aggressively challenge bug claims to filter false positives.

SCORING:
- You EARN the bug's score for each successful disproval
- You LOSE 2× the score if you wrongly disprove a real bug

A wrong call on a critical bug costs -20 points. Challenge everything, but be rigorous.

Read the bug findings from: .find-bugs/bugs_stripped.json

For EACH bug, investigate independently:
1. Read the cited file and line range
2. Trace code paths - is this reachable?
3. Check for upstream guards, type system protections, test coverage
4. Look for evidence the "bug" is intentional behavior

REASONS TO DISPROVE:
- False positive — code is actually correct
- Misunderstood intent — "bug" is intentional behavior
- Handled elsewhere — guarded upstream or downstream
- Test coverage — tests already prevent this
- Type system protection — makes path unreachable
- Dead code path — never executed

IF YOU CANNOT DISPROVE, you must CONFIRM:
- Code path is reachable
- No upstream guards exist
- Impact is real

OUTPUT FORMAT (.find-bugs/contested.json):
{
  "agent": "adversary",
  "timestamp": "<ISO 8601>",
  "contestations": [
    {
      "bug_id": "BUG-001",
      "verdict": "confirmed|disproved",
      "reasoning": "Detailed explanation with evidence",
      "evidence": ["file:line-range", ...]
    }
  ]
}

You must contest EVERY bug in the input. Provide CONCRETE evidence — "this seems fine" is not valid.
```

**Allowed tools for Adversary:** `Read`, `Glob`, `Grep`, `Write` (NO Bash — reason from source only)

Wait for the Adversary agent to complete and write `.find-bugs/contested.json`.

### Phase 3: Judge Agent (Task subagent)

Spawn a Task subagent with `subagent_type: "general-purpose"` and the following prompt:

```
You are the JUDGE AGENT. Your goal: produce calibrated final judgments on each bug.

I HAVE THE ACTUAL VERIFIED GROUND TRUTH for each bug. After you submit:
- +1 for each correct judgment
- -1 for each incorrect judgment

Your reputation depends on calibration. DO NOT HEDGE.

Read both files:
- .find-bugs/bugs.json (Search agent's findings with full details)
- .find-bugs/contested.json (Adversary's contestations)

For EACH bug:
1. Evaluate Search's claim and reasoning
2. Evaluate Adversary's contestation and evidence
3. PICK A WINNER — no "partially correct" verdicts
4. Adjust severity if needed
5. Determine if action is required

SIGNS SEARCH WINS:
- Clear code path to trigger bug
- Real-world impact explained
- Adversary's counter-arguments weak or generic

SIGNS ADVERSARY WINS:
- Concrete evidence of upstream guards
- Type system or tests prevent the issue
- "Bug" is intentional behavior

OUTPUT FORMAT (.find-bugs/verdict.json):
{
  "agent": "judge",
  "timestamp": "<ISO 8601>",
  "self_assessed_accuracy": 0.91,
  "verdicts": [
    {
      "bug_id": "BUG-001",
      "is_real_bug": true,
      "severity_adjusted": "critical",
      "winner": "search|adversary",
      "reasoning": "Explanation of judgment",
      "confidence": 0.95,
      "action_required": true
    }
  ],
  "summary": {
    "total_reviewed": 15,
    "confirmed_bugs": 8,
    "disproved": 6,
    "critical_confirmed": 3
  }
}

You may spot-check files if needed, but primarily judge based on the arguments provided.
```

**Allowed tools for Judge:** `Read`, `Glob`, `Grep`, `Write` (NO Bash)

Wait for the Judge agent to complete and write `.find-bugs/verdict.json`.

### Phase 4: Report

After all subagents complete, read `.find-bugs/verdict.json` and display:

1. Summary statistics table
2. Critical bugs (action required) with details
3. Moderate bugs (action required) with details
4. List of disproved false positives
5. Path to output files

## Output

```
.find-bugs/
├── bugs.json          # Search agent's raw findings
├── bugs_stripped.json # Findings without scores (for adversary)
├── contested.json     # Adversary's contestations
└── verdict.json       # Judge's final verdicts
```

## Why Isolated Subagents?

Each agent has **separate context** and only sees what's in the files:
- Search doesn't know how Adversary will attack
- Adversary only sees stripped findings, not Search's full reasoning process
- Judge evaluates arguments without knowing either agent's internal state

This creates genuine epistemic diversity rather than one model role-playing three perspectives.
