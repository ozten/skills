---
name: webdev-filter-query-builder
description: Domain-specific filter query building with AST representation, operator handling, query serialization, and field-type-specific inputs. Use when building advanced filter UIs for observability tools, data analytics, search interfaces, or any system requiring structured query construction with boolean logic, comparison operators, and URL/string serialization.
---

# Webdev Filter Query Builder

Build advanced filter query interfaces with structured AST representation, operators, and serialization for production tools.

## Prerequisites

This skill builds on **webdev-token-input** and **webdev-combobox-autocomplete**. Understand token state, keyboard navigation, and the prop-getter pattern first.

## Production Tool Paradigms

Analyzing Datadog, Grafana, Honeycomb, Linear, and GitHub reveals two dominant approaches that inform your architecture decisions:

### Text-Based Query Builders (Datadog, Kibana, Sentry, GitHub)

Use colon as the delimiter—typing `status:` triggers value suggestions, and completing the value creates a visual token.

**Datadog's "search pills"** with syntax highlighting enable power users to edit any part of a query inline—click anywhere in `service:payment AND status:error` to modify it. This text-first approach treats the query string as the source of truth, with visual tokens as a rendering layer.

**Benefits**: Fast keyboard-only flow, copy/paste queries as text, syntax highlighting, inline editing anywhere

**Best for**: Complex observability queries, power users, developers who think in query syntax

### Visual Query Builders (Grafana, Honeycomb, Linear)

Use dropdowns for each component and display tokens as discrete clickable pills.

**Linear's approach** treats each filter as a structured object where clicking the operator (`is`) toggles through options (`is not`, `is any of`). The AST is the source of truth, with text serialization for URL sharing.

**Benefits**: Reduces errors, clear structure, prevents invalid states, good for non-technical users

**Best for**: Task management, business users, constrained query languages

**The UX differences are significant.** For complex observability queries where expressiveness matters, the text-based approach wins. For task management where error prevention matters, the visual builder reduces friction. Choose based on your users' technical level and query complexity.

## Filter AST Representation

Represent filters as an Abstract Syntax Tree for manipulation and serialization:

```typescript
type FilterAST = FilterGroup | FilterCondition;

interface FilterGroup {
  type: 'group';
  operator: 'AND' | 'OR';
  conditions: FilterAST[];  // Recursive: can contain groups or conditions
}

interface FilterCondition {
  type: 'condition';
  field: string;           // 'status', 'created_at', 'assignee'
  operator: Operator;      // 'is', 'is_not', 'contains', 'gt', 'lt', etc.
  value: FilterValue;      // string | number | Date | string[]
  fieldType: FieldType;    // 'string', 'number', 'date', 'enum', 'boolean'
}

type Operator =
  | 'is' | 'is_not' | 'is_any_of'           // Equality
  | 'contains' | 'not_contains'             // String matching
  | 'starts_with' | 'ends_with'             // String patterns
  | 'gt' | 'gte' | 'lt' | 'lte'            // Numeric/date comparison
  | 'between' | 'not_between'               // Range
  | 'is_empty' | 'is_not_empty';           // Nullability
```

**Why AST over string parsing?** The AST approach provides:
- Type-safe manipulation in TypeScript
- Easy validation of operator/value combinations
- Framework-agnostic data structure
- Supports nested boolean logic without parser ambiguity
- Serialization to multiple formats (URL, JSON, GraphQL)
- Can generate SQL/ElasticSearch/GraphQL from the same AST

The AST is your single source of truth. Serialize it to URL params for sharing, JSON for API calls, or human-readable strings for display.

## Operator Handling by Field Type

**Different field types support different operators.** Showing `contains` for a boolean field is a UX error. Map operators to field types:

```typescript
const OPERATORS_BY_TYPE: Record<FieldType, Operator[]> = {
  string: ['is', 'is_not', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'],
  number: ['is', 'is_not', 'gt', 'gte', 'lt', 'lte', 'between', 'is_empty', 'is_not_empty'],
  date: ['is', 'is_not', 'gt', 'gte', 'lt', 'lte', 'between'],
  enum: ['is', 'is_any_of', 'is_not', 'is_empty', 'is_not_empty'],
  boolean: ['is']
};

function getOperatorsForField(field: string, schema: FilterSchema): Operator[] {
  const fieldConfig = schema[field];
  // Allow per-field operator overrides for special cases
  return fieldConfig.operators || OPERATORS_BY_TYPE[fieldConfig.type];
}
```

When a user changes the field, reset the operator to a valid default for the new type. Don't leave `contains` selected when they switch from a string field to a number field.

## Field-Type-Specific Value Inputs

**The value input must match the operator and field type.** This is where most filter builders get messy. Create a single `ValueInput` component that conditionally renders based on context.

### Enum Fields
Use combobox with fixed options from schema:

```typescript
<Combobox
  items={fieldConfig.options}  // ['open', 'closed', 'pending']
  value={filter.value}
  onChange={(value) => updateFilter({ ...filter, value })}
/>
```

### Number Fields
Input with numeric validation and optional min/max from schema:

```typescript
<input
  type="number"
  value={filter.value}
  min={fieldConfig.min}
  max={fieldConfig.max}
  step={fieldConfig.step}
  onChange={(e) => updateFilter({ ...filter, value: parseFloat(e.target.value) })}
/>
```

### Date Fields
Date picker with common presets (Honeycomb and Datadog use this pattern):

```typescript
<DatePicker
  value={filter.value}
  presets={['today', 'yesterday', 'last_7_days', 'last_30_days', 'last_90_days']}
  onChange={(date) => updateFilter({ ...filter, value: date })}
/>

// For 'between' operator, use range picker
<DateRangePicker
  start={filter.value[0]}
  end={filter.value[1]}
  onChange={([start, end]) => updateFilter({ ...filter, value: [start, end] })}
/>
```

**Presets are critical for UX.** Users shouldn't need a calendar to select "last 7 days". Presets also encode relative dates that stay current (vs absolute dates that get stale).

### Range Operators (between, not_between)
Two inputs for min/max. Visual design should make the range obvious:

```typescript
{filter.operator === 'between' && (
  <div className="range-inputs">
    <input
      type="number"
      value={filter.value[0]}
      placeholder="Min"
      aria-label="Minimum value"
      onChange={(e) => updateFilter({
        ...filter,
        value: [parseFloat(e.target.value), filter.value[1]]
      })}
    />
    <span className="range-separator">to</span>
    <input
      type="number"
      value={filter.value[1]}
      placeholder="Max"
      aria-label="Maximum value"
      onChange={(e) => updateFilter({
        ...filter,
        value: [filter.value[0], parseFloat(e.target.value)]
      })}
    />
  </div>
)}
```

### Multi-Value (is_any_of)
Token input for multiple values. See **webdev-token-input** skill:

```typescript
<TokenInput
  tokens={filter.value}  // ['alice', 'bob', 'charlie']
  suggestions={fieldConfig.options}
  onTokensChange={(tokens) => updateFilter({ ...filter, value: tokens })}
/>
```

### Nullability Checks (is_empty, is_not_empty)
No value input needed—these operators don't take values:

```typescript
if (operator === 'is_empty' || operator === 'is_not_empty') {
  return null;  // Don't render value input
}
```

## Query Serialization Strategies

Choose serialization format based on use case. Most tools support multiple formats.

### URL Params (Human-Readable)

Best for shareable URLs where humans might read/edit the query string:

```typescript
function serializeToURL(ast: FilterAST): string {
  const params = new URLSearchParams();

  function walk(node: FilterAST, prefix = '') {
    if (node.type === 'condition') {
      const key = prefix ? `${prefix}.${node.field}` : node.field;
      params.append(key, `${node.operator}:${formatValue(node.value)}`);
    } else if (node.type === 'group') {
      node.conditions.forEach((child, i) => {
        walk(child, prefix ? `${prefix}.${i}` : `${i}`);
      });
      params.append(`${prefix}.op`, node.operator);
    }
  }

  walk(ast);
  return params.toString();
}

// Example: status=is:open&assignee=is_any_of:alice,bob&created_at=gt:2024-01-01
```

**Datadog uses this pattern.** The URL is readable enough that you can edit it directly if needed.

### URL Params (Compact)

Best for short URLs when deep linking:

```typescript
function serializeCompact(ast: FilterAST): string {
  function stringify(node: FilterAST): string {
    if (node.type === 'condition') {
      return `${node.field}:${node.operator}:${formatValue(node.value)}`;
    } else {
      const parts = node.conditions.map(stringify);
      return `(${parts.join(` ${node.operator} `)})`;
    }
  }

  return encodeURIComponent(stringify(ast));
}

// Example: ?q=(status:is:open%20AND%20assignee:is_any_of:alice,bob)
```

### JSON Serialization

Best for API calls and localStorage persistence:

```typescript
function serializeToJSON(ast: FilterAST): string {
  return JSON.stringify(ast, null, 2);
}

// Example:
// {
//   "type": "group",
//   "operator": "AND",
//   "conditions": [
//     { "type": "condition", "field": "status", "operator": "is", "value": "open" }
//   ]
// }
```

**GitHub's issue search** uses JSON in API calls but human-readable text in the URL.

## Query Deserialization

Parse URL params or query strings back to AST. **Robust parsing is critical**—users will share malformed URLs:

```typescript
function deserializeFromURL(search: string): FilterAST {
  const params = new URLSearchParams(search);
  const conditions: FilterCondition[] = [];

  for (const [key, value] of params.entries()) {
    if (key.endsWith('.op')) continue;  // Skip operator markers

    const [operator, ...valueParts] = value.split(':');
    const rawValue = valueParts.join(':');  // Handle values with colons

    // Validate operator is known
    if (!VALID_OPERATORS.includes(operator)) {
      console.warn(`Unknown operator: ${operator}`);
      continue;
    }

    conditions.push({
      type: 'condition',
      field: key,
      operator: operator as Operator,
      value: parseValue(rawValue, operator),
      fieldType: inferFieldType(key)  // Look up in schema
    });
  }

  // Default to AND for top-level
  const groupOperator = params.get('op') || 'AND';

  return {
    type: 'group',
    operator: groupOperator as 'AND' | 'OR',
    conditions
  };
}
```

**Handle parse errors gracefully.** If a URL param is malformed, log a warning and skip it rather than crashing. Users will thank you.

## Filter Schema Definition

**The schema is your contract.** Define available fields, their types, valid operators, and options:

```typescript
interface FilterSchema {
  [field: string]: FieldConfig;
}

interface FieldConfig {
  type: FieldType;
  label: string;              // Human-readable label for UI
  operators?: Operator[];     // Override default operators for type
  options?: string[];         // For enum fields
  min?: number;               // For number fields
  max?: number;               // For number fields
  step?: number;              // For number fields
  format?: string;            // For date fields ('YYYY-MM-DD')
  description?: string;       // Help text for users
}

// Example schema for issue tracking
const filterSchema: FilterSchema = {
  status: {
    type: 'enum',
    label: 'Status',
    options: ['open', 'closed', 'pending', 'in_progress'],
    description: 'Current status of the issue'
  },
  assignee: {
    type: 'string',
    label: 'Assignee',
    description: 'Person assigned to this issue'
  },
  created_at: {
    type: 'date',
    label: 'Created',
    format: 'YYYY-MM-DD',
    description: 'When the issue was created'
  },
  priority: {
    type: 'number',
    label: 'Priority',
    min: 1,
    max: 5,
    step: 1,
    description: 'Priority level (1=lowest, 5=highest)'
  },
  is_archived: {
    type: 'boolean',
    label: 'Archived',
    description: 'Whether the issue is archived'
  }
};
```

**Make the schema data-driven.** Load it from your API so field changes don't require frontend deploys. Segment and Amplitude use this pattern.

## Boolean Combinators (AND/OR)

Support nested groups with different operators for complex queries:

```typescript
interface FilterGroup {
  type: 'group';
  operator: 'AND' | 'OR';
  conditions: (FilterCondition | FilterGroup)[];  // Recursive nesting
}

// Example: (status=open OR status=pending) AND assignee=alice
const complexFilter: FilterGroup = {
  type: 'group',
  operator: 'AND',
  conditions: [
    {
      type: 'group',
      operator: 'OR',
      conditions: [
        { type: 'condition', field: 'status', operator: 'is', value: 'open' },
        { type: 'condition', field: 'status', operator: 'is', value: 'pending' }
      ]
    },
    { type: 'condition', field: 'assignee', operator: 'is', value: 'alice' }
  ]
};
```

**UI Patterns for nested groups**:
- Dropdown to toggle AND/OR for each group
- "Add group" button creates nested FilterGroup
- Visual indentation or borders shows nesting level
- Drag handles for reordering (advanced)

**Most users never nest beyond 2 levels.** Honeycomb limits to 2 levels; Datadog allows unlimited but usage data shows 90% are 1 level, 9% are 2 levels, 1% are 3+.

## Visual Builder Components

### Filter Row Component

The fundamental building block. Each row represents one condition:

```typescript
function FilterRow({ filter, schema, onChange, onRemove }) {
  const fieldConfig = schema[filter.field];
  const operators = getOperatorsForField(filter.field, schema);

  return (
    <div className="filter-row">
      <FieldSelect
        value={filter.field}
        fields={Object.keys(schema)}
        onChange={(field) => {
          const newFieldConfig = schema[field];
          const defaultOp = getDefaultOperator(field);
          onChange({
            ...filter,
            field,
            operator: defaultOp,
            value: getDefaultValue(newFieldConfig.type, defaultOp)
          });
        }}
      />

      <OperatorSelect
        value={filter.operator}
        operators={operators}
        onChange={(operator) => {
          onChange({
            ...filter,
            operator,
            value: getDefaultValue(fieldConfig.type, operator)
          });
        }}
      />

      <ValueInput
        type={fieldConfig.type}
        operator={filter.operator}
        value={filter.value}
        config={fieldConfig}
        onChange={(value) => onChange({ ...filter, value })}
      />

      <button onClick={onRemove} aria-label="Remove filter">
        ×
      </button>
    </div>
  );
}
```

**Key implementation detail**: When field or operator changes, reset value to a sensible default. Don't leave a string value when switching to a number field.

### Value Input Component

**This component handles the complexity of showing the right input for each context:**

```typescript
function ValueInput({ type, operator, value, config, onChange }) {
  // No value input for nullability checks
  if (operator === 'is_empty' || operator === 'is_not_empty') {
    return null;
  }

  // Range inputs for between operators
  if (operator === 'between' || operator === 'not_between') {
    return <RangeInput value={value} config={config} onChange={onChange} />;
  }

  // Multi-value for is_any_of
  if (operator === 'is_any_of') {
    return <TokenInput tokens={value} options={config.options} onChange={onChange} />;
  }

  // Type-specific inputs
  switch (type) {
    case 'enum':
      return <Combobox items={config.options} value={value} onChange={onChange} />;
    case 'number':
      return <NumberInput value={value} config={config} onChange={onChange} />;
    case 'date':
      return <DatePicker value={value} presets={DATE_PRESETS} onChange={onChange} />;
    case 'boolean':
      return <Checkbox checked={value} onChange={onChange} />;
    default:
      return <TextInput value={value} onChange={onChange} />;
  }
}
```

## Common Pitfalls

### 1. Not Validating Operator/Value Combinations
**Problem**: User selects `between` operator but you only accept single values.

**Solution**: Reset value when operator changes, validate before submission.

### 2. Stale UI After Field Change
**Problem**: User changes field from "Status" (enum) to "Created" (date) but UI still shows enum dropdown.

**Solution**: Reset both operator and value when field changes. Use React key on ValueInput.

### 3. Malformed URL Params
**Problem**: User edits URL manually and breaks parsing.

**Solution**: Wrap parsing in try/catch, validate each piece, fall back to defaults gracefully.

### 4. Deep Nesting Performance
**Problem**: Rendering deeply nested groups causes performance issues.

**Solution**: Limit nesting depth (2 levels is usually enough). Use React.memo on FilterRow.

### 5. Lost Focus When Typing
**Problem**: Each keystroke re-renders and input loses focus.

**Solution**: Debounce updates to parent state, use controlled inputs with local state.

## Common Use Cases

- **Observability tools**: Datadog, Grafana, Honeycomb filter UIs for logs/metrics
- **Data analytics**: Segment, Amplitude, Mixpanel query builders for event data
- **Search interfaces**: Advanced search with field-specific filters
- **Admin panels**: User/data filtering with complex conditions
- **E-commerce**: Faceted search with price ranges, categories, ratings

## Implementation Checklist

1. ✓ Choose paradigm: text-based (power users) or visual (simplicity)
2. ✓ Define FilterAST types (group, condition)
3. ✓ Create FilterSchema for available fields (ideally API-driven)
4. ✓ Map operators to field types with getOperatorsForField
5. ✓ Build field-specific value inputs (ValueInput component)
6. ✓ Implement serialization (URL/JSON) with error handling
7. ✓ Implement deserialization with graceful fallbacks
8. ✓ Add boolean combinators (AND/OR) with visual nesting
9. ✓ Build FilterRow component with proper state resets
10. ✓ Validate operator/value combinations before submission
11. ✓ Add presets for dates ("last 7 days")
12. ✓ Limit nesting depth (2 levels recommended)
13. ✓ Test with malformed URLs and edge cases
14. ✓ Performance test with 20+ filters

## Key Insights

**The filter query builder is where UX and data modeling meet.** Get the AST structure right and the rest flows naturally. Get it wrong and you'll fight every feature addition.

**Users will push your limits.** Plan for: malformed URLs, deeply nested groups, switching field types mid-edit, copy/pasting queries, sharing URLs with teammates using old schemas.

**The schema is your API contract.** Changes to the schema (removing a field, renaming an operator) break saved filters and shared URLs. Version your schema or use additive-only changes.
