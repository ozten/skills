---
name: webdev-filter-query-builder
description: Domain-specific filter query building with AST representation, operator handling, query serialization, and field-type-specific inputs. Use when building advanced filter UIs for observability tools, data analytics, search interfaces, or any system requiring structured query construction with boolean logic, comparison operators, and URL/string serialization.
---

# Webdev Filter Query Builder

Build advanced filter query interfaces with structured AST representation, operators, and serialization.

## Prerequisites

This skill builds on **webdev-token-input** and **webdev-combobox-autocomplete**. Understand token state and keyboard navigation first.

## Filter AST Representation

Represent filters as an Abstract Syntax Tree for manipulation and serialization:

```typescript
type FilterAST = FilterGroup | FilterCondition;

interface FilterGroup {
  type: 'group';
  operator: 'AND' | 'OR';
  conditions: FilterAST[];
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

**Benefits**:
- Easy to serialize to URL params or JSON
- Can validate operator/value combinations
- Supports nested boolean logic
- Framework-agnostic data structure

## Operator Handling by Field Type

Different field types support different operators:

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
  return OPERATORS_BY_TYPE[fieldConfig.type];
}
```

## Field-Type-Specific Value Inputs

### Enum Fields
Use combobox with fixed options:

```typescript
<Combobox
  items={fieldConfig.options}  // ['open', 'closed', 'pending']
  value={filter.value}
  onChange={(value) => updateFilter({ ...filter, value })}
/>
```

### Number Fields
Input with numeric validation:

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
Date picker with presets:

```typescript
<DatePicker
  value={filter.value}
  presets={['today', 'yesterday', 'last_7_days', 'last_30_days']}
  onChange={(date) => updateFilter({ ...filter, value: date })}
/>

// For 'between' operator
<DateRangePicker
  start={filter.value[0]}
  end={filter.value[1]}
  onChange={([start, end]) => updateFilter({ ...filter, value: [start, end] })}
/>
```

### Range Operators (between, not_between)
Two inputs for min/max:

```typescript
{filter.operator === 'between' && (
  <>
    <input
      type="number"
      value={filter.value[0]}
      placeholder="Min"
      onChange={(e) => updateFilter({ ...filter, value: [parseFloat(e.target.value), filter.value[1]] })}
    />
    <input
      type="number"
      value={filter.value[1]}
      placeholder="Max"
      onChange={(e) => updateFilter({ ...filter, value: [filter.value[0], parseFloat(e.target.value)] })}
    />
  </>
)}
```

### Multi-Value (is_any_of)
Token input for multiple values:

```typescript
<TokenInput
  tokens={filter.value}  // ['value1', 'value2']
  suggestions={fieldConfig.options}
  onTokensChange={(tokens) => updateFilter({ ...filter, value: tokens })}
/>
```

## Query Serialization

### URL Params (Human-Readable)

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

### URL Params (Compact)

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

## Query Deserialization

Parse URL params or query strings back to AST:

```typescript
function deserializeFromURL(search: string): FilterAST {
  const params = new URLSearchParams(search);
  const conditions: FilterCondition[] = [];

  for (const [key, value] of params.entries()) {
    if (key.endsWith('.op')) continue;  // Skip operator markers

    const [operator, ...valueParts] = value.split(':');
    const rawValue = valueParts.join(':');

    conditions.push({
      type: 'condition',
      field: key,
      operator: operator as Operator,
      value: parseValue(rawValue, operator),
      fieldType: inferFieldType(key)
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

## Filter Schema Definition

Define available fields and their types:

```typescript
interface FilterSchema {
  [field: string]: FieldConfig;
}

interface FieldConfig {
  type: FieldType;
  label: string;
  operators?: Operator[];      // Override default operators for type
  options?: string[];          // For enum fields
  min?: number;                // For number fields
  max?: number;                // For number fields
  step?: number;               // For number fields
  format?: string;             // For date fields ('YYYY-MM-DD')
}

// Example schema
const filterSchema: FilterSchema = {
  status: {
    type: 'enum',
    label: 'Status',
    options: ['open', 'closed', 'pending']
  },
  assignee: {
    type: 'string',
    label: 'Assignee'
  },
  created_at: {
    type: 'date',
    label: 'Created',
    format: 'YYYY-MM-DD'
  },
  priority: {
    type: 'number',
    label: 'Priority',
    min: 1,
    max: 5,
    step: 1
  },
  is_archived: {
    type: 'boolean',
    label: 'Archived'
  }
};
```

## Boolean Combinators (AND/OR)

Support nested groups with different operators:

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

**UI Patterns**:
- Dropdown to toggle AND/OR for each group
- "Add group" button creates nested FilterGroup
- Visual indentation shows nesting level

## Visual Builder Components

### Filter Row Component

```typescript
function FilterRow({ filter, schema, onChange, onRemove }) {
  const fieldConfig = schema[filter.field];
  const operators = getOperatorsForField(filter.field, schema);

  return (
    <div className="filter-row">
      <FieldSelect
        value={filter.field}
        fields={Object.keys(schema)}
        onChange={(field) => onChange({ ...filter, field, operator: getDefaultOperator(field) })}
      />

      <OperatorSelect
        value={filter.operator}
        operators={operators}
        onChange={(operator) => onChange({ ...filter, operator })}
      />

      <ValueInput
        type={fieldConfig.type}
        operator={filter.operator}
        value={filter.value}
        config={fieldConfig}
        onChange={(value) => onChange({ ...filter, value })}
      />

      <button onClick={onRemove}>Remove</button>
    </div>
  );
}
```

### Value Input Component

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
      return <DatePicker value={value} onChange={onChange} />;
    case 'boolean':
      return <Checkbox checked={value} onChange={onChange} />;
    default:
      return <TextInput value={value} onChange={onChange} />;
  }
}
```

## Common Use Cases

- **Observability tools**: Datadog, Grafana, Honeycomb filter UIs
- **Data analytics**: Segment, Amplitude, Mixpanel query builders
- **Search interfaces**: Advanced search with field-specific filters
- **Admin panels**: User/data filtering with complex conditions
- **E-commerce**: Faceted search with price ranges, categories

## Implementation Checklist

1. ✓ Define FilterAST types (group, condition)
2. ✓ Create FilterSchema for available fields
3. ✓ Map operators to field types
4. ✓ Build field-specific value inputs
5. ✓ Implement serialization (URL/JSON)
6. ✓ Implement deserialization
7. ✓ Add boolean combinators (AND/OR)
8. ✓ Build FilterRow component
9. ✓ Support nested groups
10. ✓ Add validation for operator/value combinations

## Reference Implementation

For complete examples with React/TypeScript, see references/examples.md (if needed for more complex scenarios).
