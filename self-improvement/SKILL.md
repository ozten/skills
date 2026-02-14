---
name: self-improvement
description: Analyze autonomous loop session efficiency, track improvements, and view trends. Use when the user says "check loop metrics", "how are sessions doing", "analyze iterations", "self-improvement", "loop performance", "session efficiency", or wants to add/search/fix improvement records.
---

# Self-Improvement Loop Analysis

Analyze autonomous Claude Code session metrics, track improvement efforts, and monitor efficiency trends.

## Quick Start

Run these commands via Bash to get the current state:

```bash
# Dashboard — recent sessions + targets
self-improvement/self-improvement status

# Deep analysis of last 10 sessions
self-improvement/self-improvement analyze --last 10

# Open improvements needing attention
self-improvement/self-improvement improvement list --status open
```

## Available Commands

| Command | Purpose |
|---------|---------|
| `self-improvement/self-improvement status [--last N]` | Dashboard with recent sessions, trends, target comparison |
| `self-improvement/self-improvement analyze [--last N]` | Deep analysis, stores results, compares to previous run |
| `self-improvement/self-improvement targets` | Show efficiency targets and last 5 sessions vs targets |
| `self-improvement/self-improvement improvement list [--status open]` | List improvement records |
| `self-improvement/self-improvement improvement search <query>` | Search improvements by keyword |
| `self-improvement/self-improvement improvement add --title "..." --severity high\|medium\|low [--desc "..."] [--rec "..."] [--tags "..."]` | Add new improvement |
| `self-improvement/self-improvement improvement fix <ref_id> [--impact "..."]` | Mark improvement as fixed with measured impact |
| `self-improvement/self-improvement log <jsonl-file>` | Parse one iteration JSONL file into DB |
| `self-improvement/self-improvement backfill [--from N] [--to N]` | Bulk-parse iteration files |
| `self-improvement/self-improvement seed` | Populate improvements table with historical R1-R14 records |

## Efficiency Targets

| Metric | Target | Description |
|--------|--------|-------------|
| Completion rate | >=85% | Sessions that commit code |
| Narration-only turns | <20% | Assistant turns with no tool calls |
| Parallel tool calls | >10% | Turns with 2+ batched tool calls |
| Turns per session | <80 | Hard budget from PROMPT.md |

## Workflow: Reviewing Loop Health

If the user passes `$ARGUMENTS`, run that as a subcommand. Otherwise:

1. Run `self-improvement/self-improvement status` to see the dashboard
2. Run `self-improvement/self-improvement analyze --last 10` for trend analysis
3. Run `self-improvement/self-improvement improvement list --status open` for open issues
4. Present a concise summary: what's working, what's not, what to do next
5. If the user wants to add or fix an improvement, use the `improvement add` or `improvement fix` commands

## Workflow: After a Batch of Loop Iterations

1. Run `self-improvement/self-improvement backfill --from <start> --to <end>` to ingest new data
2. Run `self-improvement/self-improvement analyze --last <count>` to analyze the batch
3. Compare against previous analysis (the tool does this automatically)
4. Review open improvements and update their status based on measured data
5. File new improvements if new patterns are discovered

## Database Location

SQLite database at `self-improvement/self-improvement.db`. Created automatically on first use.
Tables: `sessions`, `improvements`, `analysis_runs`.
