---
name: webdev-combobox-autocomplete
description: Foundational patterns for building accessible autocomplete/combobox components with state management, ARIA patterns, keyboard navigation, async suggestions, and framework-agnostic implementation. Use when building autocomplete inputs, command palettes, search inputs, select replacements, or any dropdown with keyboard navigation and suggestions.
---

# Webdev Combobox Autocomplete

Build accessible autocomplete/combobox components using proven patterns from production implementations.

## Universal State Model

Every library (Downshift, Headless UI, Ariakit, Algolia) converges on remarkably similar state shapes. Understanding this canonical model lets you implement in any framework:

```typescript
interface FilterInputState {
  // Interaction state (the state machine)
  status: 'idle' | 'focused' | 'suggesting' | 'loading';

  // Input state
  inputValue: string;
  cursorPosition: number;

  // Token state (for multi-select, see webdev-token-input)
  tokens: FilterToken[];
  activeTokenIndex: number | null;

  // Suggestion state
  suggestions: Suggestion[];
  highlightedIndex: number;         // -1 means no highlight

  // Async coordination
  lastFetchedQuery: string;         // Prevents redundant fetches
  pendingRequestId: number;         // Race condition prevention
}
```

**The highlightedIndex deserves special attention.** This is "virtual focus"—the visually highlighted suggestion—while DOM focus stays on the input. The W3C APG mandates this pattern: you communicate the focused option to screen readers via `aria-activedescendant` rather than actually moving focus. This lets users continue typing while navigating suggestions.

## State Reducer Pattern

**Downshift's key innovation** was the state reducer pattern, which lets you intercept and modify any state transition. When you need the menu to stay open after selection (common for multi-select), you override just that transition rather than forking the library:

```typescript
stateReducer: (state, { type, changes }) => {
  if (type === 'ItemClick' || type === 'InputKeyDownEnter') {
    return { ...changes, isOpen: true, inputValue: '' };
  }
  return changes;
}
```

This pattern allows customization without fighting the library's internal logic.

## ARIA Combobox Pattern

Required structure with `aria-activedescendant` for virtual focus:

```html
<input
  role="combobox"
  aria-expanded="true"
  aria-controls="suggestions"
  aria-activedescendant="option-2"
  aria-autocomplete="list"
/>
<ul role="listbox" id="suggestions">
  <li role="option" id="option-1" aria-selected="false">First</li>
  <li role="option" id="option-2" aria-selected="true">Second</li>
</ul>
```

**Critical:** Browsers don't auto-scroll when `aria-activedescendant` changes. Manually call `element.scrollIntoView({ block: 'nearest' })` when highlighting changes. This is the most common accessibility bug in custom implementations.

## Keyboard Navigation

### Arrow Keys
- **Up/Down**: Navigate suggestions using virtual focus (highlightedIndex)
- **Left/Right**: Control cursor within input text

### Selection Keys
- **Enter**: Select highlighted suggestion
- **Tab**: Close menu without selecting, move to next form element
- **Escape**: First press closes menu (retains input), second press clears input

### Key Implementation Notes
- W3C APG specifies these behaviors, but Tab handling varies in practice
- Emerging consensus: Tab closes without selecting (selecting feels like losing control)
- Space should type a space character, not select (unless building command palette)

## Prop-Getter Pattern

**The most reusable pattern across React, Svelte, Solid, and vanilla JS is prop-getters**: functions that return objects containing event handlers and ARIA attributes to spread onto your elements. Downshift popularized this; Headless UI, Ariakit, and Kobalte all use variants.

```typescript
function getInputProps(userProps = {}) {
  return {
    role: 'combobox',
    'aria-expanded': state.isOpen,
    'aria-controls': 'listbox-id',
    'aria-activedescendant': state.highlightedIndex >= 0
      ? `option-${state.highlightedIndex}`
      : undefined,
    'aria-autocomplete': 'list',
    onKeyDown: composeEventHandlers(userProps.onKeyDown, handleKeyDown),
    onChange: composeEventHandlers(userProps.onChange, handleChange),
    onFocus: composeEventHandlers(userProps.onFocus, handleFocus),
    onBlur: composeEventHandlers(userProps.onBlur, handleBlur),
    ...userProps
  };
}

function composeEventHandlers(...handlers) {
  return (event) => {
    for (const handler of handlers) {
      if (event.defaultPrevented) break;
      handler?.(event);
    }
  };
}
```

**This pattern solves multiple problems**: users can add their own handlers that run before yours, your handlers can call `preventDefault()` to stop user handlers, and all the ARIA attributes are correct by default. The same `getInputProps`/`getMenuProps`/`getItemProps` shape works in any framework—you're returning plain objects, not JSX.

## Async Suggestions Without Race Conditions

**Race conditions are the #1 bug source in custom autocomplete implementations.** User types "java", request fires, user types "script", first request returns and overwrites the correct "javascript" results. Three patterns prevent this:

```typescript
// Pattern 1: Request ID tracking (simplest)
let latestRequestId = 0;
async function fetchSuggestions(query) {
  const requestId = ++latestRequestId;
  const results = await api.search(query);
  if (requestId === latestRequestId) {
    setState({ suggestions: results });
  }
}

// Pattern 2: AbortController (cleanest)
useEffect(() => {
  const controller = new AbortController();
  api.search(query, { signal: controller.signal }).then(setSuggestions);
  return () => controller.abort();
}, [query]);

// Pattern 3: XState (most robust)
// Transitioning out of "fetching" state automatically cancels invoked services
```

### Debouncing Strategy

Algolia's research shows a hybrid approach works better—throttle for the first few characters (eager feedback), debounce after (patient waiting):

```typescript
function handleInput(query) {
  if (query.length < 3) throttledSearch(query);  // Immediate feedback
  else debouncedSearch(query);                    // Wait for typing to settle
}
```

Tuning: 200ms for desktop, 300ms for mobile.

### Caching by Context

Prevent redundant fetches by storing `lastFetchedQuery` in state:

```typescript
if (query === state.lastFetchedQuery) return;
```

For context-dependent suggestions (different values for `status:` vs `assignee:`), maintain separate caches keyed by field name.

## Focus Management Pitfalls

### Focus Fighting
**Problem**: Using `blur` to close menu fires before click events, preventing selection.

**Solution**: Close on Tab keydown and click-outside detection, never on blur.

### Cursor Jumping
**Problem**: Framework re-renders reset cursor to end of input.

**Solution**: Store `selectionStart` before update, restore in microtask:

```typescript
const cursorPos = inputRef.current.selectionStart;
setState({ value });
requestAnimationFrame(() => {
  inputRef.current.setSelectionRange(cursorPos, cursorPos);
});
```

### Stale Closures
**Problem**: Debounced handlers capture old state. When the debounced function fires, it sees the state from when it was created, not current state.

**Solution**: Use refs for values that debounced functions need to read:

```typescript
const queryRef = useRef();
queryRef.current = query;

const debouncedFetch = useMemo(
  () => debounce(() => fetchSuggestions(queryRef.current), 300),
  []
);
```

### Event Handler Conflicts
**Problem**: Event handlers between input and container cause double-firing.

**Solution**: The prop-getter pattern with `composeEventHandlers` solves this by checking `defaultPrevented` before calling each handler.

## Implementation Strategy

1. **State model as reducer** with explicit action types for debuggability
2. **Prop-getters**: `getInputProps`, `getListboxProps`, `getOptionProps`
3. **Keyboard handling** action by action: ArrowDown, Enter, Escape, Tab
4. **Async suggestions** with request ID tracking from the start
5. **ARIA attributes** incrementally as you go
6. **Test with screen reader** (VoiceOver/NVDA) before considering complete

The fundamental insight: automated tools like axe-core catch only ~30% of real accessibility issues.

## Library Recommendations

- **React**: Downshift (`useCombobox`), cmdk (command palettes), Headless UI Combobox
- **Svelte**: Melt UI
- **Solid**: Kobalte
- **Framework-agnostic**: Zag.js (state machine adapters), Algolia autocomplete.js
- **Virtualization**: @tanstack/react-virtual for large lists

## Key Insight

Combobox is a **composite widget**: one tab stop containing multiple interactive elements. The component owns a mini focus system (virtual focus via `aria-activedescendant` and arrow keys) while participating in the page's tab order as a single unit. Get this mental model right and the implementation details follow naturally.
