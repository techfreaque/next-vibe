# Definition File Patterns

Comprehensive guide to data-driven UI definition files for automatic form and display generation.

## Table of Contents

1. [Field Function Patterns](#field-function-patterns)
2. [Widget Metadata](#widget-metadata)
3. [Translation Keys](#translation-keys)
4. [Import Paths](#import-paths)
5. [Enum Integration](#enum-integration)
6. [Common Patterns](#common-patterns)

## Field Function Patterns

### Core Principle: No Naked z.object()

**NEVER** use `z.object()` or `z.array()` directly. Always use `objectField()` or `arrayField()` to enable UI generation.

```typescript
// ❌ WRONG - Breaks UI generation
response: responseField({...}, z.object({ field: z.string() }))

// ✅ CORRECT
response: objectField(
  {
    type: WidgetType.CONTAINER,
    title: "app.api.v1.core.domain.subdomain.get.response.title",
    description: "app.api.v1.core.domain.subdomain.get.response.description",
    layout: { type: LayoutType.GRID, columns: 12 }
  },
  { response: true },
  { field: responseField({...}, z.string()) }
)
```

### Field Functions

| Function | Context |
|----------|---------|
| `requestDataField()` | `{ request: "data" }` |
| `requestUrlPathParamsField()` | `{ request: "urlPathParams" }` |
| `requestQueryField()` | `{ request: "query" }` |
| `responseField()` | `{ response: true }` |
| `requestResponseField()` | Mixed context |
| `responseArrayField()` | `{ response: true }` |
| `objectField()` | Any context |

### Context Examples

```typescript
objectField({...}, { request: "data" }, {...})              // Request body
objectField({...}, { response: true }, {...})               // Response only
objectField({...}, { request: "urlPathParams" }, {...})     // URL params
objectField({...}, { request: "data&urlPathParams", response: true }, {...}) // Mixed
objectField({...}, {}, {...})                               // Root level
```

## Widget Metadata

### Required Properties

```typescript
{
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "translation.key.label",
  description: "translation.key.desc",
  layout: { columns: 6 },
}
```

### Widget Types

**Form Widgets:**

- `FORM_FIELD` - Input fields
- `FORM_GROUP` - Field groupings
- `FORM_SECTION` - Form sections

**Data Display Widgets:**

- `DATA_TABLE` - Tables
- `DATA_CARDS` - Card layouts
- `DATA_LIST` - Lists
- `DATA_GRID` - Grids
- `GROUPED_LIST` - Grouped arrays
- `CODE_QUALITY_LIST` - Code issues
- `METADATA_CARD` - Metadata cards

**Layout Widgets:**

- `CONTAINER` - Field groups
- `SECTION` - Logical sections
- `TABS` - Tab containers
- `ACCORDION` - Accordion containers

**Content Widgets:**

- `TITLE` - Titles
- `TEXT` - Display text
- `BADGE` - Status indicators
- `AVATAR` - Avatars
- `MARKDOWN` - Markdown content
- `MARKDOWN_EDITOR` - Markdown editors
- `LINK` - Links
- `LINK_CARD` - Link cards
- `LINK_LIST` - Link lists

**Specialized Content:**

- `FILE_PATH` - File paths
- `LINE_NUMBER` - Line numbers
- `COLUMN_NUMBER` - Column numbers
- `CODE_RULE` - Code rules
- `CODE_OUTPUT` - Code output
- `SEVERITY_BADGE` - Severity badges
- `MESSAGE_TEXT` - Messages
- `ISSUE_CARD` - Issue cards

**Interactive Widgets:**

- `BUTTON` - Buttons
- `BUTTON_GROUP` - Button groups
- `ACTION_BAR` - Action bars
- `PAGINATION_INFO` - Pagination
- `ACTION_LIST` - Action lists

**Stats Widgets:**

- `METRIC_CARD` - Metrics
- `STATS_GRID` - Stats grids
- `CHART` - Charts
- `PROGRESS` - Progress bars

**Status Widgets:**

- `LOADING` - Loading states
- `ERROR` - Error states
- `EMPTY_STATE` - Empty states
- `STATUS_INDICATOR` - Status indicators

**Custom:**

- `CUSTOM` - Custom widgets

**IMPORTANT:** If none of the available widget types fit your use case, you MUST create a new widget type in the unified interface system. DO NOT try to force-fit an inappropriate widget type. Add new widget types to `WidgetType` enum and implement the corresponding React component.

### Field Data Types

```typescript
FieldDataType.TEXT | TEXTAREA | EMAIL | PHONE | URL | NUMBER | BOOLEAN |
SELECT | MULTISELECT | UUID | DATE | DATETIME
```

### Layout Configuration

```typescript
layout: { type: LayoutType.STACKED }           // Vertical stack
layout: { type: LayoutType.GRID, columns: 12 } // Grid (1-12 columns)
layout: { type: LayoutType.GRID_2_COLUMNS }    // 2-column grid
layout: { type: LayoutType.VERTICAL }          // Vertical layout
layout: { columns: 6 }                         // Column width for grid items
```

### Container Widgets

```typescript
// ✅ Use title/description, NOT label
objectField(
  {
    type: WidgetType.CONTAINER,
    title: "translation.key.title",
    description: "translation.key.description",
    layout: { type: LayoutType.VERTICAL }
  },
  { response: true },
  { field1: responseField(...), field2: responseField(...) }
)
```

### Array Fields with Grouping

```typescript
consultations: responseArrayField(
  {
    type: WidgetType.GROUPED_LIST,
    groupBy: "status",
    sortBy: "createdAt",
    showGroupSummary: true,
    layout: { type: LayoutType.GRID, columns: 6 }
  },
  objectField(
    { type: WidgetType.CONTAINER, title: "...", layout: { type: LayoutType.GRID, columns: 12 } },
    { response: true },
    {
      id: responseField({...}, z.uuid()),
      status: responseField({...}, z.enum(Status)),
      createdAt: responseField({...}, z.string().datetime())
    }
  )
)
```

### Form Validation

```typescript
{
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "translation.key.label",
  validation: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-z]+$/
  },
  placeholder: "translation.key.placeholder",
  helpText: "translation.key.helpText"
}
```

## Translation Keys

### Key Structure

```
app.api.v1.{domain}.{subdomain}.{action}.{field}.{property}
```

### Examples by Widget Type

```typescript
// FORM_FIELD - Uses label, description, placeholder
{
  type: WidgetType.FORM_FIELD,
  label: "app.api.v1.core.users.user.id.id.get.email.label",
  description: "app.api.v1.core.users.user.id.id.get.email.description",
  placeholder: "app.api.v1.core.users.user.id.id.get.email.placeholder"
}

// TEXT - Uses content
{ type: WidgetType.TEXT, content: "...key.content" }

// BADGE - Uses text
{ type: WidgetType.BADGE, text: "...key.text" }

// CONTAINER/SECTION - Uses title, description
{ type: WidgetType.CONTAINER, title: "...key.title", description: "...key.description" }
```

### Dynamic Routes

```typescript
// Path: src/app/api/[locale]/v1/core/users/user/[id]/definition.ts
// Pattern: app.api.v1.core.users.user.id.id.{method}.{field}
title: "app.api.v1.core.users.user.id.id.get.title"
```

### Enum Translation Keys

```typescript
export const {
  enum: LeadStatus,
  options: LeadStatusOptions
} = createEnumOptions({
  NEW: "app.api.v1.core.leads.enums.leadStatus.new",
  PENDING: "app.api.v1.core.leads.enums.leadStatus.pending"
});
```

## Import Paths

```typescript
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  requestResponseField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

// Local imports
import { MyEnum, MyEnumOptions } from "./enum";
import { MyType } from "../types";
```

**Rules:**

1. Use `@/` for absolute imports from project root
2. Import enums from `/enum` not `/definition` (avoid circular deps)
3. Use relative paths for same-domain imports
4. Import `UserRole` from `@/app/api/[locale]/v1/core/user/user-roles/enum`

## Enum Integration

### Creating Enums

```typescript
// File: enum.ts
import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/enum";

export const {
  enum: LeadStatus,
  options: LeadStatusOptions,
  Value: LeadStatusValues
} = createEnumOptions({
  NEW: "app.api.v1.core.leads.enums.leadStatus.new",
  PENDING: "app.api.v1.core.leads.enums.leadStatus.pending",
  ACTIVE: "app.api.v1.core.leads.enums.leadStatus.active"
});

// Database enum for Drizzle
export const LeadStatusDB = [LeadStatus.NEW, LeadStatus.PENDING, LeadStatus.ACTIVE] as const;
```

### Using Enums

```typescript
import { LeadStatus, LeadStatusOptions } from "./enum";

// SELECT field
status: requestResponseField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "app.api.v1.core.leads.create.post.status.label",
    options: LeadStatusOptions,
    layout: { columns: 6 }
  },
  z.enum(LeadStatus)
)

// BADGE field
status: responseField(
  { type: WidgetType.BADGE, text: "app.api.v1.core.leads.get.response.status.text" },
  z.enum(LeadStatus)
)
```

## Common Patterns

### Nested Request Structure

```typescript
fields: objectField(
  { type: WidgetType.CONTAINER, ... },
  { request: "data&urlPathParams", response: true },
  {
    id: requestUrlPathParamsField({...}, z.uuid()),
    basicInfo: objectField(
      { type: WidgetType.SECTION, ... },
      { request: "data" },
      {
        firstName: requestDataField({...}, z.string()),
        lastName: requestDataField({...}, z.string())
      }
    ),
    email: responseField({...}, z.email()),
    createdAt: responseField({...}, z.string().datetime())
  }
)
```

### Response Structure Matching

```typescript
// Definition must match repository return
fields: objectField({...}, {}, {
  profile: objectField({...}, { response: true }, {
    name: responseField({...}, z.string()),
    email: responseField({...}, z.email())
  })
})

// Repository
return createSuccessResponse({
  profile: { name: "John", email: "john@example.com" }
});
```

### Error Types

```typescript
errorTypes: {
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "app.api.v1.core.domain.subdomain.action.errors.unauthorized.title",
    description: "app.api.v1.core.domain.subdomain.action.errors.unauthorized.description"
  },
  [EndpointErrorTypes.VALIDATION_FAILED]: {...},
  [EndpointErrorTypes.FORBIDDEN]: {...},
  [EndpointErrorTypes.NOT_FOUND]: {...},
  [EndpointErrorTypes.CONFLICT]: {...},
  [EndpointErrorTypes.SERVER_ERROR]: {...},
  [EndpointErrorTypes.NETWORK_ERROR]: {...},
  [EndpointErrorTypes.UNSAVED_CHANGES]: {...},
  [EndpointErrorTypes.UNKNOWN_ERROR]: {...}
}
```

### Examples Structure

```typescript
// ✅ CORRECT - Direct structure
examples: {
  requests: { default: {...} },
  responses: { default: {...} },
  urlPathParams: { default: { id: "123..." } }
}

// ❌ WRONG - Wrapped in method name
examples: { GET: { default: {...} } }
```

### Type Exports

```typescript
// Export pattern
export type UserGetRequestInput = typeof GET.types.RequestInput;
export type UserGetRequestOutput = typeof GET.types.RequestOutput;
export type UserGetResponseInput = typeof GET.types.ResponseInput;
export type UserGetResponseOutput = typeof GET.types.ResponseOutput;
export type UserGetUrlParamsTypeInput = typeof GET.types.UrlVariablesInput;
export type UserGetUrlParamsTypeOutput = typeof GET.types.UrlVariablesOutput;

// Type aliases
export type SomeStatus = UserGetRequestInput["status"];
```

### Debug Fields

**DO NOT** add debug fields:

```typescript
// ❌ WRONG
debug: requestDataField({...}, z.boolean().default(false))
verbose: requestDataField({...}, z.boolean().default(false))

// ✅ CORRECT - Use logger.isDebugEnabled() in implementation
```

## Quick Checklist

- [ ] No `z.object()` or `z.array()` directly in field functions
- [ ] All fields have complete widget metadata
- [ ] Translation keys follow pattern
- [ ] Proper enum integration with `createEnumOptions`
- [ ] Import paths use `@/` for absolute imports
- [ ] Containers use title/description, not label
- [ ] Error types are complete
- [ ] Examples structure is correct
- [ ] Type exports follow naming convention
- [ ] No debug/verbose fields

## Reference Example

See `src/app/api/[locale]/v1/core/contact/definition.ts` for complete example.

---

## See Also

- [Enum Patterns](enum.md) - Enum integration
- [Repository Patterns](repository.md) - Using definition types
- [Import Patterns](imports.md) - Import conventions
- [Email Patterns](email.md) - Using request/response types in email functions
