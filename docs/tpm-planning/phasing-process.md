# Phasing Process

This document describes the workflow for extracting quarterly phase PRDs from a vision document.

## The Core Insight

The vision PRD is your **feature registry**. It contains:
- The complete narrative of what you're building
- Permanent Feature IDs assigned to each section
- Human-readable context that never goes stale

The Coverage Index is your **ID registery**. Example:

```markdown
# [Product Name] Coverage Index

**Last Updated:** YYYY-MM-DD

## Feature IDs (F-nnn)

| ID | Name | Phase | Status |
|----|------|-------|--------|
| F-001 | Event Data Model | Phase I | Complete |
| F-004 | List View | Phase II | In Progress |
| F-006 | Day View | - | Planned |
...
```

Phase PRDs are **working documents**. They contain:
- The subset of features for this quarter
- Detailed requirements with IDs
- Acceptance criteria ready for QA
- Quality requirements that apply

```
┌─────────────────────────────────────────────────────────────┐
│  Vision PRD + Feature IDs                                   │
│  ├── §1 Event Management [F-001]                           │
│  ├── §2 Venue Management [F-002]                           │
│  ├── ...                                                    │
│  ├── §14 RSVP Functionality [F-014]                        │
│  └── §15 Paid Tickets [F-015]                              │
└─────────────────────────────────────────────────────────────┘
            │
            ├──── Q1 Extract ────▶  Phase I PRD
            │                       F-001, F-002, F-003...
            │                       R-0010 → R-0089
            │
            ├──── Q2 Extract ────▶  Phase II PRD
            │                       F-014, F-015, F-016...
            │                       R-0140 → R-0199
            │
            └──── Q3 Extract ────▶  Phase III PRD
                                    F-020, F-021...
                                    R-0200 → R-0249
```

---

## One-Time Setup

### Step 1: Annotate the Vision PRD

Add Feature IDs to section headers. Don't change the prose.

**Before:**
```markdown
## 14. RSVP Functionality

### 14.1 Process Flow
...
```

**After:**
```markdown
## 14. RSVP Functionality [F-014]

### 14.1 Process Flow
...
```

Rules:
- One Feature ID per major section
- Subsections inherit the parent's Feature ID (or get their own if substantial)
- Skip sections that are out of scope (e.g., paid add-ons you're not building)

### Step 2: Add Goals Section

At the top of the vision PRD, add explicit goals:

```markdown
## Goals

G-01: Maintain full feature parity with existing system
G-02: Improve architecture and performance
G-03: Achieve WCAG AA accessibility compliance
G-04: Preserve SEO through stable permalinks
```

### Step 3: Create a Coverage Index (Optional)

If you want to track phase assignments explicitly:

| Section | Feature | Phase | Notes |
|---------|---------|-------|-------|
| §1 Event Management | F-001 | Phase I | Foundation |
| §2 Venue Management | F-002 | Phase I | Foundation |
| §14 RSVP | F-014 | Phase II | Ticketing |
| §15 Paid Tickets | F-015 | Phase II | Ticketing |
| §8 Recurring Events | F-030 | — | Pro feature, out of scope |

This is optional because you can always grep the phase PRDs to see what's been extracted.

---

## Quarterly Workflow

### Phase Planning (Week 1 of Quarter)

**Input:** Vision PRD, previous phase PRDs, team capacity

**Process:**

1. **Review unassigned features**
   - Filter Coverage Index for blank phases. These items are in "Planned" status

2. **Select scope**
   - Consider dependencies (can't build ticketing without events)
   - Consider related items
   - Consider team capacity (how many requirements can you spec and build?)
   - Consider business priority

3. **Draft feature list**
   ```
   Phase II Scope:
   - F-014: RSVP Functionality
   - F-015: Paid Tickets
   - F-016: Capacity Management
   - F-017: Attendee Management
   ```

4. **Validate with stakeholders**
   - Does this represent a shippable increment?
   - Are dependencies satisfied by previous phases?

---

### Extraction (Week 1-2 of Quarter)

**Input:** Vision PRD, selected feature list

**Process:**

For each feature in scope:

1. **Read the vision PRD section** — Understand the full context

2. **Decompose into requirements** — Each "shall" statement becomes an R-nnnn
   
   Vision says:
   > User selects quantity, enters name/email, receives confirmation email immediately.
   
   Becomes:
   ```
   R-0141: Users shall select RSVP quantity
   R-0142: RSVP form shall collect name and email
   R-0143: System shall send confirmation email upon submission
   ```

3. **Write acceptance criteria** — Testable conditions for each requirement
   ```
   AC-0143-01: Email sent within 30 seconds of submission
   AC-0143-02: Email contains event name, date, and confirmation details
   ```

4. **Identify quality requirements** — Cross-cutting concerns that apply
   ```
   Q-015 [PERF]: Confirmation email sent within 30 seconds
   Q-016 [SEC]: Email addresses validated and sanitized
   ```

5. **Assign priorities** — Must / Should / Could for each requirement

---

### Validation (Week 2 of Quarter)

**Review checklist:**

- [ ] Every requirement traces to a Feature ID
- [ ] Every requirement has at least one Acceptance Criterion
- [ ] No requirement is too large (if it has 10+ ACs, split it)
- [ ] Quality requirements cover: performance, security, accessibility, compatibility
- [ ] Priorities are realistic (not everything is "Must")
- [ ] Dependencies on previous phases are satisfied

**Stakeholder review:**

- Engineering: Are requirements clear and testable?
- QA: Can acceptance criteria be automated?
- Product: Does this match intent from vision?

---

### Execution (Weeks 3-12)

The phase PRD is now the source of truth for the quarter.

**Development:**
- Create tickets referencing R-nnnn
- Commit messages reference R-nnnn
- PR descriptions list requirements satisfied

**QA:**
- Test cases reference AC-nnnn
- Test reports show coverage by requirement
- Bugs reference R-nnnn they violate

**Tracking:**
- Update requirement status: Draft → In Progress → Implemented → Verified
- Track completion by feature (all R-nnnn for F-014 done? Feature done.)

---

### Closeout (Week 12)

1. **Update requirement statuses** — Mark implemented, verified, or deferred

2. **Capture deferrals** — Requirements not completed:
   - Stay in current phase PRD with status `Deferred`
   - Or move to next phase PRD
   - Document why in notes

3. **Update Coverage Index** — If you're maintaining one

4. **Retrospective input** — What worked, what didn't in the spec process

---

## FAQ

**Q: What if we need to add a feature mid-quarter?**

A: Add it to the Vision PRD with a new Feature ID. Add it to the current Phase PRD if it's in scope, or note it for next phase.

**Q: What if a requirement changes?**

A: Update the requirement in place. Never reuse the ID. If it's a major change, consider deprecating the old R-nnnn and creating a new one.

**Q: What if we realize the Vision PRD is missing something?**

A: Add it to the Vision PRD. It's a living document. Assign a Feature ID. Include in current or future phase as appropriate.

**Q: Do we version the Phase PRDs?**

A: Yes. Use document version (v1.0, v1.1) or date stamps. Track changes via git or your doc system's history.

**Q: How detailed should Vision PRD be vs Phase PRD?**

A: Vision PRD is narrative — it explains what and why in readable prose. Phase PRD is specification — it lists exact behaviors in structured format. The Vision PRD for a feature might be 2 paragraphs; the Phase PRD extraction might be 15 requirements.
