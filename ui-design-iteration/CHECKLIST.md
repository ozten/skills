# Accessibility & QA Checklists

## Accessibility Requirements (Non-negotiable)

### Contrast and Color (WCAG AA)
- [ ] Body text ≥ 4.5:1 contrast ratio
- [ ] Large text ≥ 3:1 contrast ratio
- [ ] Controls and icons meet contrast requirements
- [ ] Never rely on color alone for: selected state, errors/warnings, toggle on/off

### Keyboard and Focus
- [ ] All interactive elements keyboard reachable in logical order
- [ ] Focus states visible, high-contrast, not clipped
- [ ] Focus states consistent across components
- [ ] No icon-only control without accessible name (label or tooltip)

### Hit Targets
- [ ] Minimum target size: 44×44 px for touch
- [ ] Dense tables: actions reachable, row hover/focus doesn't require precision clicking

### Labels and Semantics
- [ ] Inputs have persistent labels (not placeholder-only)
- [ ] Toggles express outcome ("Enable X behavior"), not mechanics
- [ ] Helper text provided when behavior is non-obvious

### Truncation
- [ ] Ellipsis allowed only with way to access full content
- [ ] Access method: tooltip on hover/focus, expandable row, or detail panel

---

## QA Rubric (Ship/No-Ship)

A design iteration passes when:

### User Comprehension (5-second test)
- [ ] A first-time user can identify what this screen is for
- [ ] A first-time user can identify the primary action
- [ ] A first-time user can identify their current state/mode

### Scannability
- [ ] Clear distinction between primary and secondary text
- [ ] Consistent alignment and row rhythm
- [ ] No "wall of toggles" — settings are chunked

### State Clarity
- [ ] Selected row is obvious
- [ ] Active filters are obvious
- [ ] Active settings are obvious

### Systematization
- [ ] Component variants used consistently
- [ ] Minimal one-off styling
- [ ] Spacing and typography follow token system