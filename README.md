# PRD Framework Skills

Claude Code skills for product planning. Transform vision documents into traceable, testable specifications.

## Planning Pipeline

These three skills form a sequential workflow for quarterly planning:
```
Vision PRD → [annotator] → Annotated PRD + Coverage Index
                                    ↓
                          [phase-generator] → Phase PRD (R-nnnn)
                                    ↓
                            [qa-enricher] → Phase PRD + Q-nnn + AC-nnnn
```

**Example files**

- vision.md - You starting point, can be a massive spec/prd
- vision.md and coverage_index.txt - Your edited vision.md with tracking IDs
- phase_1.md - Your first sprint. Includes requirements and verification steps
- phase_<N>.md - Future sprints as you chew through your vision.md document

### prd-vision-annotator

Annotate a narrative vision document with Feature IDs (`F-nnn`) and generate a Coverage Index.

**Triggers:** "annotate my vision doc", "add feature IDs", "create coverage index"

**Outputs:**
- Vision PRD with `[F-nnn]` tags on section headers
- Coverage Index tracking feature status across phases

### prd-phase-generator

Extract features from an annotated Vision PRD into a detailed Phase PRD with requirements and priorities.

**Triggers:** "create phase PRD", "plan next quarter", "extract phase from vision"

**Outputs:**
- Phase PRD with functional requirements (`R-nnnn`)
- Updated Coverage Index (selected features → `In Progress`)

**Capacity defaults:** ~10 features, ~50 requirements, ~100 acceptance criteria per phase.

### prd-qa-enricher

Enrich a Phase PRD with quality requirements and acceptance criteria for test planning.

**Triggers:** "add QA plan", "add acceptance criteria", "enrich with test criteria"

**Adds:**
- Quality Requirements (`Q-nnn`) — performance, security, accessibility, compatibility
- Acceptance Criteria (`AC-nnnn`) — happy path, edge cases, error handling

## ID Reference

| Prefix | Entity | Example | Location |
|--------|--------|---------|----------|
| `G-nn` | Goal | G-01 | Vision PRD |
| `F-nnn` | Feature | F-014 | Vision PRD |
| `R-nnnn` | Requirement | R-0142 | Phase PRD |
| `Q-nnn` | Quality Requirement | Q-007 | Phase PRD |
| `AC-*` | Acceptance Criteria | AC-R0142-01 | Phase PRD |

## Installation

Copy `.skill` files to your Claude Code skills directory, or extract the folders to `~/.claude/skills/`.