# Naming Conventions

This document defines the identification scheme for all traceable entities in product requirements documentation.

## Design Principles

### Flat IDs, Not Hierarchical

Use `R-0042` not `F-003.R-042`. 

**Why?** IDs survive reorganization. If a requirement moves from one feature to another, its ID stays the same. Track parent-child relationships via explicit fields, not embedded in the ID.

### Prefix Tells You the Type

When a developer writes `git commit -m "Implement R-0042"` or QA tags a test `@R-0042`, everyone knows it's a requirement without additional context.

### Zero-Padded Sequential Numbers

Use `R-0042` not `R-42`.

**Why?** Sorts correctly in any tool, looks consistent, and signals the expected scale of the project.

### Never Reuse IDs

Delete R-0042? It stays deleted. Mark status as `DELETED` but the number is burned forever. This preserves audit trails and prevents confusion in git history, test logs, and conversations.

---

## Entity Types

### G — Goals

**Format:** `G-nn` (two digits)

**Purpose:** Business objectives that explain *why* the product exists. Goals are stable across the entire project lifecycle.

**Expected count:** 3-10 per product

**Lives in:** Vision PRD (top-level)

**Example:**
```
G-01: Maintain full feature parity with existing system
G-02: Improve performance by 50% over baseline
G-03: Achieve WCAG AA accessibility compliance
```

---

### F — Features

**Format:** `F-nnn` (three digits)

**Purpose:** Major capabilities or functional areas. Features group related requirements and map to the narrative sections of your vision document.

**Expected count:** 30-100 per product

**Lives in:** Vision PRD (section headers)

**Example:**
```
## 14. RSVP Functionality [F-014]
```

**Numbering strategy:** 
- Assign sequentially as you annotate the vision doc
- Leave gaps if you want to group related features (F-010, F-011, F-012 for views)
- Or just go sequential — reorganization doesn't require renumbering

---

### R — Requirements

**Format:** `R-nnnn` (four digits)

**Purpose:** Specific, testable behaviors the system must exhibit. Requirements are the atomic unit of work.

**Expected count:** 150-500 per product, 20-80 per phase

**Lives in:** Phase PRD

**Numbering strategy:** 
- Sequential across entire product (R-0001 through R-0500)

**Required fields:**
```markdown
### R-0142: RSVP Data Collection

**Parent:** F-014
**Priority:** Must | Should | Could
**Status:** Draft | Review | Approved | Implemented | Deleted

The RSVP form shall collect attendee name and email address.

**Acceptance Criteria:** AC-0142-01, AC-0142-02
**Verification:** TC-RSVP-003, TC-RSVP-004
```

---

### Q — Quality Requirements

**Format:** `Q-nnn` (three digits)

**Purpose:** Non-functional requirements that cut across features: performance, security, accessibility, compatibility.

**Expected count:** 20-50 per product

**Lives in:** Phase PRD (dedicated section)

**Subtype tags:** Include a bracketed tag for categorization:

| Tag | Category | Examples |
|-----|----------|----------|
| `[PERF]` | Performance | Response time, throughput, caching |
| `[SEC]` | Security | Authentication, authorization, data protection |
| `[AVAIL]` | Availability | Uptime, failover, recovery |
| `[SCALE]` | Scalability | Concurrent users, data volume |
| `[MAINT]` | Maintainability | Code standards, documentation |
| `[ACCESS]` | Accessibility | WCAG compliance, keyboard nav |
| `[COMPAT]` | Compatibility | Browsers, integrations, backwards compat |
| `[I18N]` | Internationalization | Translation, localization |
| `[API]` | API Standards | OpenAPI, versioning, rate limits |

**Example:**
```markdown
Q-007 [COMPAT]: The system shall support both Classic Editor and Block Editor

**Applies to:** F-001, F-022
**Priority:** Must
**Verification:** TC-COMPAT-001
```

---

### AC — Acceptance Criteria

**Format:** `AC-[TYPE][ID]-nn`

**Purpose:** Specific, testable conditions that define when a requirement or quality requirement is satisfied.

**Expected count:** 2-5 per requirement

**Lives in:** Phase PRD (inline with requirements or in dedicated section)

**Structure:**
```
AC-R0142-01
   │  │    │
   │  │    └── Sequential criterion number (01, 02, 03...)
   │  └─────── Parent ID (0142 from R-0142)
   └────────── Parent type (R = Requirement, Q = Quality, F = Feature)
```

**Examples by parent type:**

| AC ID | Parent | Meaning |
|-------|--------|---------|
| `AC-R0142-01` | R-0142 | First criterion for requirement R-0142 |
| `AC-R0142-02` | R-0142 | Second criterion for requirement R-0142 |
| `AC-Q007-01` | Q-007 | First criterion for quality requirement Q-007 |
| `AC-F014-01` | F-014 | Feature-level acceptance (rare, for rollup tests) |

**Why embed the type?** When you see `AC-R0142-01` in a test file, bug report, or Slack thread, you immediately know it belongs to a Requirement. No implicit conventions to remember.

**Example in context:**
```markdown
### R-0142: RSVP Data Collection

**Parent:** F-014
**Priority:** Must

The RSVP form shall collect attendee name and email address.

**Acceptance Criteria:**
- AC-R0142-01: Form validates email format before submission
- AC-R0142-02: Form requires both name and email (non-empty)
```

---

## Coverage Index File

The coverage index file is the canonical list of item IDs and their status in the system.
This is essential for creating new Phase PRDs.

### File format


```markdown
# [Product Name] Coverage Index

**Last Updated:** YYYY-MM-DD

## Feature IDs (F-nnn)

| ID | Name | Phase | Status |
|----|------|-------|--------|
| F-001 | Event Data Model | Phase I | Complete |
| F-002 | Venue Management | Phase I | Complete |
| F-003 | Organizer Management | Phase I | Complete |
| F-004 | List View | Phase II | In Progress |
| F-005 | Month View | Phase II | In Progress |
| F-006 | Day View | - | Planned |
| F-007 | Pro Views | - | Out of scope |
| F-014 | RSVP Functionality | - | Planned |

```

### Status Values

`Planned | In Progress | Complete | Out of scope`

* **Planned** - Items that are in the backlog have no Phase. Planned items 

* **Out of scope** - How items are "deleted" from the product vision.


---

## External References

### Test Cases

Test cases live in your test framework, not in the PRD. Reference them by your framework's native ID:

```
**Verification:** TC-RSVP-003, TC-RSVP-004
```

In test code, reference back:

```typescript
// @requirements R-0142, AC-0142-01
test('validates email format on RSVP form', async () => {
  // ...
})
```

### Issue Tracker (Jira, Linear, etc.)

Include requirement ID in ticket title, label, or custom field:

```
PROJ-1234: [R-0142] Implement RSVP data collection
```

Or use your tracker's native linking if it supports custom fields.

### Git Commits

Reference in commit body:

```
feat(rsvp): add form validation

Implements R-0142
Satisfies AC-0142-01, AC-0142-02
```

---

## Summary Table

| Prefix | Name | Format | Count | Location |
|--------|------|--------|-------|----------|
| G | Goal | `G-nn` | 3-10 | Vision PRD |
| F | Feature | `F-nnn` | 30-100 | Vision PRD |
| R | Requirement | `R-nnnn` | 150-500 | Phase PRD |
| Q | Quality Req | `Q-nnn` | 20-50 | Phase PRD |
| AC | Acceptance Criteria | `AC-nnnn` | 300-1000 | Phase PRD |
