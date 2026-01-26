# Worked Example: RSVP Feature Conversion

This document shows the complete conversion of one feature from vision to phase PRD format.

---

## Source: Vision PRD (Original)

This is what the original PRD section looks like, with only the Feature ID annotation added:

```markdown
## 14. RSVP Functionality [F-014]

### 14.1 Process Flow

1. User visits ticketed event page
2. Sees RSVP form below event content
3. Selects quantity (default max: 100 per purchase)
4. Enters name and email
5. Immediately receives confirmation email

### 14.2 Configuration Options

Login requirement (optional), capacity limits (specific number or
unlimited), Going/Not Going email customization, RSVP form location on
event pages.

Note: Editing RSVPs (changing status after submission) requires Event
Tickets Plus.

### 14.3 Tiered RSVPs

Support for multiple RSVP types (e.g., "Going," "Not Going,"
"Maybe") with unique names and descriptions. Attendance limits
settings to require login for RSVPs to prevent spam and ensure data
quality.
```

---

## Output: Phase PRD (Converted)

### F-014: RSVP Functionality

**Parent Goal:** G-01 (Feature Parity)  
**Source:** Vision PRD §14  
**Status:** Draft

Free reservation system for events without payment processing. Users can RSVP to events, receive confirmation, and organizers can track attendance.

---

#### R-0140: RSVP Form Display

**Parent:** F-014  
**Priority:** Must  
**Status:** Draft

The system shall display an RSVP form on event pages when one or more RSVP tickets are attached to that event.

**Acceptance Criteria:**
- AC-0140-01: RSVP form renders below event content when RSVP ticket exists
- AC-0140-02: RSVP form is hidden when no RSVP tickets are attached
- AC-0140-03: RSVP form position is configurable (above/below content)

**Verification:** TC-RSVP-001, TC-RSVP-002

---

#### R-0141: RSVP Quantity Selection

**Parent:** F-014  
**Priority:** Must  
**Status:** Draft

Users shall be able to select RSVP quantity via a numeric input or dropdown, up to a configurable maximum per submission.

**Acceptance Criteria:**
- AC-0141-01: Quantity selector defaults to 1
- AC-0141-02: Quantity selector enforces configured maximum (default: 100)
- AC-0141-03: Quantity selector prevents values less than 1
- AC-0141-04: Quantity selector respects remaining capacity

**Verification:** TC-RSVP-003

---

#### R-0142: RSVP Data Collection

**Parent:** F-014  
**Priority:** Must  
**Status:** Draft

The RSVP form shall collect attendee name and email address as required fields.

**Acceptance Criteria:**
- AC-0142-01: Form includes name field (text input)
- AC-0142-02: Form includes email field (email input)
- AC-0142-03: Both fields are required (non-empty)
- AC-0142-04: Email field validates format before submission
- AC-0142-05: Form displays validation errors inline

**Verification:** TC-RSVP-004, TC-RSVP-005

---

#### R-0143: RSVP Confirmation Email

**Parent:** F-014  
**Priority:** Must  
**Status:** Draft

Upon successful RSVP submission, the system shall immediately send a confirmation email to the provided email address.

**Acceptance Criteria:**
- AC-0143-01: Email is queued within 5 seconds of form submission
- AC-0143-02: Email contains event name
- AC-0143-03: Email contains event date and time
- AC-0143-04: Email contains RSVP quantity confirmed
- AC-0143-05: Email contains link to event page

**Verification:** TC-RSVP-006, TC-RSVP-007

**Notes:** Email delivery time depends on mail server; we control queue time only.

---

#### R-0144: RSVP Login Requirement

**Parent:** F-014  
**Priority:** Should  
**Status:** Draft

Administrators shall be able to require user authentication before RSVP submission, configurable at the global and per-event level.

**Acceptance Criteria:**
- AC-0144-01: Global setting exists for "Require login for RSVP"
- AC-0144-02: Per-event override available
- AC-0144-03: Unauthenticated users see login/register prompt when required
- AC-0144-04: After login, user returns to event page with form state preserved

**Verification:** TC-RSVP-008

---

#### R-0145: RSVP Capacity Limits

**Parent:** F-014  
**Priority:** Must  
**Status:** Draft

Administrators shall be able to set capacity limits for RSVP tickets, either as a specific number or unlimited.

**Acceptance Criteria:**
- AC-0145-01: Capacity field accepts positive integers or blank (unlimited)
- AC-0145-02: Remaining capacity calculated as limit minus confirmed RSVPs
- AC-0145-03: Form prevents submission when capacity is zero
- AC-0145-04: "Sold out" or "At capacity" message displays when full

**Verification:** TC-RSVP-009, TC-RSVP-010

---

#### R-0146: Multiple RSVP Types

**Parent:** F-014  
**Priority:** Should  
**Status:** Draft

The system shall support multiple RSVP response types per event (e.g., "Going", "Not Going", "Maybe"), each with independent capacity tracking.

**Acceptance Criteria:**
- AC-0146-01: Multiple RSVP tickets can be created per event
- AC-0146-02: Each RSVP ticket has unique name and description
- AC-0146-03: Each RSVP type tracks capacity independently
- AC-0146-04: User can only select one RSVP type per submission

**Verification:** TC-RSVP-011

---

#### R-0147: RSVP "Not Going" Email

**Parent:** F-014  
**Priority:** Could  
**Status:** Draft

When a user submits a "Not Going" RSVP type, the system shall send a distinct confirmation email acknowledging their response.

**Acceptance Criteria:**
- AC-0147-01: "Not Going" email uses separate template from "Going"
- AC-0147-02: Email subject and content are customizable
- AC-0147-03: Email sending can be disabled for "Not Going" responses

**Verification:** TC-RSVP-012

---

### Related Quality Requirements

#### Q-014 [PERF]: RSVP Confirmation Email Timing

**Applies to:** F-014 (R-0143)  
**Priority:** Must

RSVP confirmation emails shall be queued for delivery within 5 seconds of form submission under normal load.

**Measurement:** Automated test measuring time from form POST to email queue insertion.

---

#### Q-015 [ACCESS]: RSVP Form Accessibility

**Applies to:** F-014 (R-0140, R-0142)  
**Priority:** Must

The RSVP form shall be fully accessible via keyboard navigation and compatible with screen readers (NVDA, JAWS, VoiceOver).

**Measurement:** Manual accessibility audit, automated axe-core scan.

---

#### Q-016 [SEC]: RSVP Data Validation

**Applies to:** F-014 (R-0142)  
**Priority:** Must

All RSVP form inputs shall be validated and sanitized server-side to prevent XSS, SQL injection, and email header injection attacks.

**Measurement:** Security review, automated SAST scan.

---

## Summary: What We Extracted

From ~25 lines of narrative prose, we produced:

| Type | Count | IDs |
|------|-------|-----|
| Requirements | 8 | R-0140 through R-0147 |
| Acceptance Criteria | 26 | AC-0140-01 through AC-0147-03 |
| Quality Requirements | 3 | Q-014, Q-015, Q-016 |

**Estimated effort:** This feature represents roughly 2-3 sprints of work for a small team (design, implementation, QA).

---

## Traceability Demonstration

### From Goal to Test

```
G-01 (Feature Parity)
  └── F-014 (RSVP Functionality)
        └── R-0143 (Confirmation Email)
              └── AC-0143-02 (Contains event name)
                    └── TC-RSVP-007 (verify email content)
```

### In Practice

**Jira ticket:**
```
PROJ-234: [R-0143] Implement RSVP confirmation email
```

**Git commit:**
```
feat(rsvp): send confirmation email after submission

Implements R-0143
Satisfies AC-0143-01, AC-0143-02, AC-0143-03
```

**Test file:**
```typescript
// @requirements R-0143
// @acceptance AC-0143-02
test('confirmation email contains event name', async () => {
  const event = await createEvent({ title: 'Test Concert' });
  await submitRSVP(event.id, { name: 'Jane', email: 'jane@test.com' });
  
  const email = await getLastEmail('jane@test.com');
  expect(email.body).toContain('Test Concert');
});
```

**Bug report:**
```
BUG: RSVP email missing event date
Violates: R-0143, AC-0143-03
Steps to reproduce: ...
```
