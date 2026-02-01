---
name: webdev-combobox-autocomplete
description: Foundational patterns for building accessible autocomplete/combobox components with state management, ARIA patterns, keyboard navigation, async suggestions, and framework-agnostic implementation. Use when building autocomplete inputs, command palettes, search inputs, select replacements, or any dropdown with keyboard navigation and suggestions.
---

# Webdev Combobox Autocomplete

Build accessible autocomplete/combobox components using proven patterns from production implementations.

## State Model

Every library (Downshift, Headless UI, Ariakit, Algolia) converges on the same core state shape:

```typescript
interface ComboboxState {
  // Interaction state machine
  status: 'idle' | 'focused' | 'suggesting' | 'loading';

  // Input state
  inputValue: string;
  cursorPosition: number;

  // Suggestion state
  suggestions: Suggestion[];
  highlightedIndex: number;  // -1 = no highlight (virtual focus)

  // Async coordination
  lastFetchedQuery: string;
  pendingRequestId: number;
}
```

**highlightedIndex** is "virtual focus"—the visually highlighted option while DOM focus stays on the input. This enables continued typing while navigating suggestions.

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

**Critical:** Browsers don't auto-scroll when `aria-activedescendant` changes. Manually call `element.scrollIntoView({ block: 'nearest' })` when highlighting changes.

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

Framework-agnostic implementation via functions returning event handlers and ARIA attributes:

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

Benefits: Users can add their own handlers, your handlers can preventDefault to stop propagation, ARIA attributes correct by default.

## Async Suggestions

### Race Condition Prevention

Three patterns to prevent stale results:

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
// Transitioning out of "fetching" automatically cancels invoked services
```

### Debouncing Strategy

Algolia's research shows hybrid approach works best:

```typescript
function handleInput(query) {
  if (query.length < 3) throttledSearch(query);  // Immediate feedback
  else debouncedSearch(query);                    // Wait for typing to settle
}
```

- Desktop: 200ms debounce
- Mobile: 300ms debounce

### Caching

Store `lastFetchedQuery` to prevent redundant fetches:

```typescript
if (query === state.lastFetchedQuery) return;
```

For context-dependent suggestions, maintain separate caches keyed by field name.

## Focus Management Pitfalls

### Focus Fighting
**Problem**: Using `blur` to close menu fires before click events, preventing selection.

**Solution**: Close on Tab keydown and click-outside detection, never on blur.

### Cursor Jumping
**Problem**: Framework re-renders reset cursor to end of input.

**Solution**: Store selectionStart before update, restore in microtask:

```typescript
const cursorPos = inputRef.current.selectionStart;
setState({ value });
requestAnimationFrame(() => {
  inputRef.current.setSelectionRange(cursorPos, cursorPos);
});
```

### Stale Closures
**Problem**: Debounced handlers capture old state.

**Solution**: Use refs for values debounced functions need:

```typescript
const queryRef = useRef();
queryRef.current = query;

const debouncedFetch = useMemo(
  () => debounce(() => fetchSuggestions(queryRef.current), 300),
  []
);
```

## Implementation Strategy

1. **State model as reducer** with explicit action types for debuggability
2. **Prop-getters**: `getInputProps`, `getListboxProps`, `getOptionProps`
3. **Keyboard handling** action by action: ArrowDown, Enter, Escape, Tab
4. **Async suggestions** with request ID tracking from the start
5. **ARIA attributes** incrementally as you go
6. **Test with screen reader** (VoiceOver/NVDA) before considering complete

## Library Recommendations

- **React**: Downshift (useCombobox), cmdk (command palettes), Headless UI Combobox
- **Svelte**: Melt UI
- **Solid**: Kobalte
- **Framework-agnostic**: Zag.js (state machine adapters), Algolia autocomplete.js
- **Virtualization**: @tanstack/react-virtual for large lists

## State Reducer Pattern

Downshift's innovation for overriding state transitions:

```typescript
stateReducer: (state, { type, changes }) => {
  if (type === 'ItemClick' || type === 'InputKeyDownEnter') {
    return { ...changes, isOpen: true, inputValue: '' };
  }
  return changes;
}
```

Use when menu should stay open after selection (multi-select) or other custom behaviors.

## Key Insight

Combobox is a **composite widget**: one tab stop containing multiple interactive elements. Component owns a mini focus system (virtual focus via `aria-activedescendant` and arrow keys) while participating in page tab order as single unit.
