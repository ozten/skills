# PRD Framework

A lightweight system for creating traceable product requirements that connect vision documents to development tasks and QA automation.

## Core Principles

1. **Vision stays readable** — The original PRD remains a human-readable narrative document
2. **IDs are assigned once** — Feature IDs live in the vision doc, requirements IDs in phase docs
3. **Traceability is built-in** — Every requirement traces to a feature, every test traces to a requirement
4. **Phases extract, not reduce** — Each quarter extracts from the vision; the vision stays intact

## Documents in This Framework

| Document | Purpose |
|----------|---------|
| [Naming Conventions](./naming-conventions.md) | ID schemes, formats, and rules |
| [Phasing Process](./phasing-process.md) | Workflow for quarterly planning |
| [Templates](./templates.md) | Copy-paste templates for all document types |

## Quick Reference

### Entity Prefixes

| Prefix | Entity | Example | Lives In |
|--------|--------|---------|----------|
| `G-nn` | Goal | G-01 | Vision PRD |
| `F-nnn` | Feature | F-014 | Vision PRD |
| `R-nnnn` | Requirement | R-0142 | Phase PRD |
| `Q-nnn` | Quality Requirement | Q-007 | Phase PRD |
| `AC-nnnn` | Acceptance Criteria | AC-0142 | Phase PRD |

### Traceability Chain

```
G-nn  ←  F-nnn  ←  R-nnnn  ←  AC-nnnn  →  Test Cases
                      ↑
                   Q-nnn
```

## Getting Started

1. Read [Naming Conventions](./naming-conventions.md) to understand the ID system
2. Annotate your vision PRD with Feature IDs using the pattern in [Templates](./templates.md)
3. Follow [Phasing Process](./phasing-process.md) to extract your first phase
4. Connect to your tools (Jira, test framework) using the integration patterns

## License

Internal use. Adapt freely for your organization.
