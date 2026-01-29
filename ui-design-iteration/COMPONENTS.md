# Reusable Component Patterns

Build or standardize these components with variants and tokens.

## Nav Rail
- Grouped sections with section headers (small caps/overline)
- Selected state: left indicator bar + subtle background + stronger text
- Collapsed state: tooltips for labels
- Primary CTA button in persistent location
- Utility zone (account, settings, help)

## Header + Context Line
- Page title
- Optional scope summary (timezone, project, filter summary)
- Primary CTA region

## Mode Tabs / Segmented Control
- Clear selected state (not color alone)
- Optional counts/badges
- Consistent placement across screens

## Data Row / Table Row
Build with consistent structure:
- **Left**: Fixed-width key column (time/id/status) if applicable
- **Middle**: Primary text (bold) + secondary metadata (muted), truncate to 1 line
- **Right**: Action cluster + overflow menu

States required:
- Default, hover, focus, selected
- Truncation with tooltip/detail access

## Status Pill / Tag
Variants: neutral, success, warning, error
- Don't encode meaning by color only
- Include icon or text differentiation

## Settings Group
Structure:
- Group title (section header)
- Optional help text
- Stacked control rows with consistent spacing
- Progressive disclosure for advanced options

## Control Row
Aligned on baseline/grid:
- Label (describes outcome)
- Description (clarifies behavior)
- Control (toggle, dropdown, input)

Minimum hit area: 44×44 px for toggles

## Empty State
- Explains what's missing
- Primary next action prominent
- Optional illustration (not required)

## Toast / Inline Validation
- Accessible messaging (not color-only)
- Clear dismiss affordance
- Appropriate persistence duration