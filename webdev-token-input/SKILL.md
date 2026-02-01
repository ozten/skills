---
name: webdev-token-input
description: Multi-value token/chip input patterns for tag inputs, filter bars, and email "To" fields. Builds on webdev-combobox-autocomplete with token state management, key:value parsing, context-dependent suggestions, and token editing patterns. Use when building filter inputs, tag selectors, multi-select chips, or any input that creates visual tokens/pills from text.
---

# Webdev Token Input

Build multi-value token/chip inputs (tags, filters, email recipients) on top of combobox autocomplete patterns.

## Prerequisites

This skill builds on **webdev-combobox-autocomplete**. Start there for state model, ARIA patterns, keyboard navigation, and async suggestions.

## Token State Model

Extends combobox state with token-specific properties:

```typescript
interface TokenInputState extends ComboboxState {
  // Token-specific state
  tokens: FilterToken[];
  activeTokenIndex: number | null;  // For arrow-key navigation between tokens
}

interface FilterToken {
  id: string;
  key?: string;      // e.g., "status", "assignee"
  operator?: string; // e.g., ":", "=", "!="
  value: string;     // e.g., "completed", "john@example.com"
  display: string;   // Formatted for visual pill
}
```

## Production Patterns Analysis

### Text-Based (Datadog, Kibana, Sentry, GitHub)

Colon as delimiter: typing `status:` triggers value suggestions, completing creates token.

**Benefits**: Power users can edit inline, syntax highlighting, fast keyboard-only flow.

**Example**: `service:payment AND status:error` — click anywhere to modify.

### Visual Builders (Grafana, Honeycomb, Linear)

Dropdowns for each component, tokens as discrete clickable pills.

**Benefits**: Reduces errors, clear structure, good for non-technical users.

**Example**: `[Assignee] [is] [John Doe]` — clicking operator toggles options.

**Recommendation**: Start with text-based for observability/search; visual for task management.

## Token Creation Triggers

### Pattern 1: Colon Delimiter
```typescript
function handleChange(value) {
  if (value.endsWith(':')) {
    const key = value.slice(0, -1);
    setState({
      contextKey: key,
      suggestions: getValuesForKey(key),
      status: 'suggesting'
    });
  }
}
```

### Pattern 2: Enter Key
```typescript
function handleKeyDown(e) {
  if (e.key === 'Enter' && highlightedIndex >= 0) {
    createToken(suggestions[highlightedIndex]);
    setState({ inputValue: '', highlightedIndex: -1, isOpen: false });
  }
}
```

### Pattern 3: Comma/Space (Simple Tags)
```typescript
function handleChange(value) {
  if (value.endsWith(',') || value.endsWith(' ')) {
    const token = value.slice(0, -1).trim();
    if (token) createToken({ value: token });
    setState({ inputValue: '' });
  }
}
```

## Backspace Behavior

Two-step deletion for safety (Bootstrap Tokenfield pattern):

```typescript
function handleKeyDown(e) {
  if (e.key === 'Backspace' && inputValue === '') {
    if (activeTokenIndex === null) {
      // First backspace: highlight last token
      setActiveTokenIndex(tokens.length - 1);
    } else {
      // Second backspace: delete highlighted token
      deleteToken(activeTokenIndex);
      setActiveTokenIndex(null);
    }
  }
}
```

**Alternative**: Single-backspace deletion (faster but risky for accidental deletions).

## Arrow Navigation Between Tokens

Only when input is empty:

```typescript
function handleKeyDown(e) {
  if (inputValue.length === 0) {
    if (e.key === 'ArrowLeft') {
      setActiveTokenIndex(prev =>
        prev === null ? tokens.length - 1 : Math.max(0, prev - 1)
      );
    }
    if (e.key === 'ArrowRight') {
      setActiveTokenIndex(prev =>
        prev === null ? 0 : Math.min(tokens.length - 1, prev + 1)
      );
    }
  }
}
```

**Critical**: If input has text, Left/Right control cursor position within text.

## Token Editing Patterns

### Pattern 1: Delete-and-Retype (Simplest)
Clicking token removes it, places text in input. Most forgiving of edge cases.

```typescript
function handleTokenClick(token) {
  deleteToken(token.id);
  setState({ inputValue: token.display });
}
```

### Pattern 2: Inline Text Editing (Datadog)
Token expands into editable text inline.

```typescript
function handleTokenClick(token) {
  setEditingTokenId(token.id);
  // Replace token with contenteditable or input
}
```

### Pattern 3: Popover Editing (Linear)
Clicking opens structured editor for operator and value.

```typescript
function handleTokenClick(token) {
  showPopover({
    key: token.key,
    operator: token.operator,
    value: token.value,
    position: getTokenRect(token.id)
  });
}
```

### Pattern 4: No Editing (Most Common)
Tokens can only be deleted and recreated. Safest for preventing invalid states.

**Recommendation**: Start with delete-and-retype, most forgiving.

## Context-Dependent Suggestions

Different values for different keys:

```typescript
function getSuggestionsForContext(contextKey, query) {
  const cacheKey = `${contextKey}:${query}`;

  if (cache[cacheKey]) return cache[cacheKey];

  const suggestions = contextKey === 'status'
    ? ['open', 'closed', 'pending']
    : contextKey === 'assignee'
    ? fetchUsers(query)
    : fetchGeneric(contextKey, query);

  cache[cacheKey] = suggestions;
  return suggestions;
}
```

Maintain separate caches keyed by field name to prevent redundant fetches.

## Key:Value Parsing

Extract structured data from text input:

```typescript
function parseTokenInput(input) {
  // Simple pattern: "key:value"
  const colonMatch = input.match(/^([^:]+):(.+)$/);
  if (colonMatch) {
    return {
      key: colonMatch[1].trim(),
      operator: ':',
      value: colonMatch[2].trim(),
      display: input
    };
  }

  // Fallback: plain value
  return {
    value: input.trim(),
    display: input.trim()
  };
}
```

For complex operators, see **webdev-filter-query-builder** skill.

## Multi-Select ARIA

Extend combobox ARIA with multi-select:

```html
<div role="group" aria-label="Selected filters">
  <div role="button" tabindex="0" aria-label="Filter: status is error">
    status:error
  </div>
</div>

<input role="combobox" aria-multiselectable="true" />

<ul role="listbox" aria-multiselectable="true">
  <!-- suggestions -->
</ul>

<div role="status" aria-live="polite" aria-atomic="true">
  Filter 'status:error' added. 3 filters applied.
</div>
```

**Live region**: Announce token creation/deletion: "Filter added. 3 filters applied."

## Multiple Selection Hook

Downshift provides `useMultipleSelection`:

```typescript
const {
  getDropdownProps,
  addSelectedItem,
  removeSelectedItem,
  selectedItems
} = useMultipleSelection({
  selectedItems: tokens,
  onSelectedItemsChange: ({ selectedItems }) => setTokens(selectedItems)
});

const {
  getInputProps,
  getMenuProps,
  getItemProps,
  highlightedIndex
} = useCombobox({
  items: suggestions,
  onSelectedItemChange: ({ selectedItem }) => {
    if (selectedItem) {
      addSelectedItem(selectedItem);
      setInputValue('');
    }
  }
});
```

## Implementation Checklist

1. ✓ Implement base combobox (webdev-combobox-autocomplete)
2. ✓ Add token state array and activeTokenIndex
3. ✓ Implement token creation trigger (colon/Enter/comma)
4. ✓ Add two-step backspace deletion
5. ✓ Conditional arrow navigation (only when input empty)
6. ✓ Choose token editing pattern (recommend delete-and-retype)
7. ✓ Context-dependent suggestions with separate caches
8. ✓ Key:value parsing for structured tokens
9. ✓ Multi-select ARIA attributes
10. ✓ Live region announcements

## Common Use Cases

- **Filter bars**: Observability tools (Datadog, Grafana)
- **Tag inputs**: Content management, categorization
- **Email recipients**: "To" and "CC" fields
- **Multi-select**: Assign multiple users, categories, labels
- **Search chips**: E-commerce faceted search

For domain-specific filter queries with operators and AST, see **webdev-filter-query-builder**.
