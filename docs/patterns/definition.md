# Definition File Patterns

Comprehensive guide to data-driven UI definition files for automatic interface generation across **CLI, React Web, React Native, AI Tools, and MCP**.

## Overview

Definition files (`definition.ts`) are the single source of truth that automatically generates:

- **CLI commands** with interactive prompts and autocomplete
- **React Web forms** with full type safety
- **React Native interfaces** with native components
- **AI Tool schemas** for function calling
- **MCP (Model Context Protocol)** tool definitions

## Table of Contents

1. [Field Function Patterns](#field-function-patterns)
2. [Widget Metadata](#widget-metadata)
3. [UI/UX Optimization](#uiux-optimization)
4. [Translation Keys](#translation-keys)
5. [Import Paths](#import-paths)
6. [Enum Integration](#enum-integration)
7. [Common Patterns](#common-patterns)

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
    layoutType: LayoutType.GRID,
    columns: 12
  },
  { response: true },
  { field: responseField({...}, z.string()) }
)
```

### Field Functions

All field functions generate interfaces for **CLI, React Web, React Native, AI Tools, and MCP**.

| Function                      | Context                        | Use Case                                 | Optional Variant                  |
| ----------------------------- | ------------------------------ | ---------------------------------------- | --------------------------------- |
| `requestDataField()`          | `{ request: "data" }`          | Request body fields (POST/PUT/PATCH)     | Use `.optional()` on Zod schema   |
| `requestUrlPathParamsField()` | `{ request: "urlPathParams" }` | URL path parameters (e.g., `/user/[id]`) | N/A (path params are required)    |
| `responseField()`             | `{ response: true }`           | Response-only fields                     | Use `.optional()` on Zod schema   |
| `requestResponseField()`      | Mixed context                  | Fields used in both request and response | Use `.optional()` on Zod schema   |
| `responseArrayField()`        | `{ response: true }`           | Response arrays                          | `responseArrayOptionalField()`    |
| `requestDataArrayField()`     | `{ request: "data" }`          | Request arrays                           | `requestDataArrayOptionalField()` |
| `objectField()`               | Any context                    | Nested object structures                 | `objectOptionalField()`           |
| `arrayField()`                | Any context                    | Generic arrays                           | `arrayOptionalField()`            |

**Important Notes:**

- **Query parameters** for GET requests use `requestDataField()` - they are validated from URL search params automatically
- **Optional fields**: For primitive types (string, number, boolean), use `.optional()` on the Zod schema. For objects and arrays, use the dedicated optional field functions (`objectOptionalField()`, `arrayOptionalField()`, etc.)
- **All interfaces are generated automatically**: CLI prompts, React forms, AI tool schemas, and MCP definitions are all created from the same definition

### Optional Field Patterns

**For primitive types** (string, number, boolean), use `.optional()` on the Zod schema:

```typescript
// ✅ CORRECT - Optional primitive field
preferredModel: requestDataField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "app.api.v1.core.agent.chat.personas.post.preferredModel.label",
    options: ModelIdOptions,
    columns: 6,
  },
  z.enum(ModelId).optional()  // ✅ Use .optional() on schema
)
```

**For objects**, use `objectOptionalField()` when the entire object can be absent:

```typescript
// ✅ CORRECT - Optional object field
securityInfo: objectOptionalField(
  {
    type: WidgetType.CONTAINER,
    title: "app.api.v1.core.user.public.resetPassword.request.response.securityInfo.title",
    layoutType: LayoutType.GRID,
    columns: 12,
  },
  { response: true },
  {
    tokenExpiry: responseField({ type: WidgetType.TEXT, content: "..." }, z.string()),
    maxAttempts: responseField({ type: WidgetType.TEXT, content: "..." }, z.number()),
  }
)

// ❌ WRONG - Don't use objectField with .optional()
securityInfo: objectField({ ... }, { response: true }, { ... }).optional()  // ❌ Invalid
```

**For arrays**, use the optional array field functions:

```typescript
// ✅ CORRECT - Optional response array
attachments: responseArrayOptionalField(
  {
    type: WidgetType.DATA_TABLE,
  },
  objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 2 },
    { response: true },
    {
      filename: responseField({ type: WidgetType.TEXT, content: "..." }, z.string()),
      size: responseField({ type: WidgetType.TEXT, content: "..." }, z.number()),
    }
  )
)

// ✅ CORRECT - Optional request array
tags: requestDataArrayOptionalField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "app.api.v1.core.tags.label",
    columns: 12,
  },
  z.string()
)
```

### Specialized Field Functions

For common field types, use specialized field functions from `@/app/api/[locale]/v1/core/system/unified-interface/shared/field/specialized`:

```typescript
import { currencyField, languageField, countryField, timezoneField } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/specialized";

// Currency selection
currency: currencyField(
  "app.api.v1.core.domain.fields.currency.label",
  "app.api.v1.core.domain.fields.currency.description",
  "app.api.v1.core.domain.fields.currency.placeholder",
  true, // required
  false // multiple selection
)

// Language selection
language: languageField(...)

// Country selection
country: countryField(...)

// Timezone selection
timezone: timezoneField(...)
```

These functions automatically provide proper options, validation, and widget configuration.

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
// Form field example
{
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "translation.key.label",
  description: "translation.key.desc",
  columns: 6, // Grid column width (1-12)
}

// Container example
{
  type: WidgetType.CONTAINER,
  title: "translation.key.title",
  description: "translation.key.desc",
  layoutType: LayoutType.GRID,
  columns: 12, // Total grid columns
}
```

### Widget Types

**Form Widgets:**

- `FORM_FIELD` - Input fields
- `FORM_GROUP` - Field groupings
- `FORM_SECTION` - Form sections

**Data Display Widgets:**

- `DATA_TABLE` - Tables with columns and rows
- `DATA_CARD` - Single data card
- `DATA_CARDS` - Multiple card layouts
- `DATA_LIST` - Simple lists
- `DATA_GRID` - Grid layouts
- `GROUPED_LIST` - Grouped arrays with groupBy/sortBy
- `CODE_QUALITY_LIST` - Code issues with severity
- `METADATA_CARD` - Metadata display cards

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
FieldDataType.TEXT |
  TEXTAREA |
  EMAIL |
  PHONE |
  URL |
  NUMBER |
  BOOLEAN |
  SELECT |
  MULTISELECT |
  UUID |
  DATE |
  DATETIME;
```

### Layout Configuration

**For Containers (CONTAINER, SECTION):**

```typescript
layoutType: LayoutType.STACKED        // Vertical stack
layoutType: LayoutType.GRID           // Grid layout (use with columns)
layoutType: LayoutType.GRID_2_COLUMNS // 2-column grid
layoutType: LayoutType.VERTICAL       // Vertical layout
columns: 12                           // Total grid columns (for GRID layoutType)
```

**For Form Fields:**

```typescript
columns: 6  // Column width within parent grid (1-12)
```

### Container Widgets

Containers use `layoutType` and `columns` properties (NOT nested `layout` object):

```typescript
// ✅ CORRECT - Container with layoutType
objectField(
  {
    type: WidgetType.CONTAINER,
    title: "translation.key.title",
    description: "translation.key.description",
    layoutType: LayoutType.STACKED,  // or VERTICAL, GRID, etc.
  },
  { response: true },
  { field1: responseField(...), field2: responseField(...) }
)

// ✅ CORRECT - Container with GRID layout and columns
objectField(
  {
    type: WidgetType.CONTAINER,
    title: "translation.key.title",
    layoutType: LayoutType.GRID,
    columns: 2,  // Number of columns for GRID layout
  },
  { response: true },
  { field1: responseField(...), field2: responseField(...) }
)

// ❌ WRONG - Don't use nested layout object
objectField(
  {
    type: WidgetType.CONTAINER,
    layout: { type: LayoutType.GRID, columns: 2 },  // ❌ Invalid
  },
  ...
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
  },
  objectField(
    {
      type: WidgetType.CONTAINER,
      title: "...",
      layoutType: LayoutType.GRID,
      columns: 12
    },
    { response: true },
    {
      id: responseField({...}, z.uuid()),
      status: responseField({...}, z.enum(Status)),
      createdAt: responseField({...}, z.string().datetime())
    }
  )
)
```

### Form Field Widgets

Form fields use `columns` property for grid width (1-12):

```typescript
// ✅ CORRECT - Form field with columns
requestDataField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    label: "app.api.v1.core.agent.chat.personas.post.name.label",
    description: "app.api.v1.core.agent.chat.personas.post.name.description",
    columns: 6,  // Grid width (1-12)
  },
  z.string().min(1).max(100)  // Validation in Zod schema
)

// ✅ CORRECT - Full width textarea
requestDataField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXTAREA,
    label: "app.api.v1.core.agent.chat.personas.post.systemPrompt.label",
    description: "app.api.v1.core.agent.chat.personas.post.systemPrompt.description",
    columns: 12,  // Full width
  },
  z.string().min(1).max(5000)
)

// ✅ CORRECT - Select field with options
requestDataField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "app.api.v1.core.agent.chat.personas.post.category.label",
    description: "app.api.v1.core.agent.chat.personas.post.category.description",
    options: CategoryOptions,  // From enum or config
    columns: 6,
  },
  z.enum(["general", "creative", "technical", "education", "controversial", "lifestyle"])
)

// ❌ WRONG - Don't use nested layout object
requestDataField(
  {
    type: WidgetType.FORM_FIELD,
    layout: { columns: 6 },  // ❌ Invalid
  },
  ...
)
```

**Important:** Validation is defined in the Zod schema (`.min()`, `.max()`, `.email()`, `.optional()`, etc.), not in widget config.

### Response Field Widgets

Response fields display data (not for user input):

```typescript
// ✅ CORRECT - Response field with TEXT widget
responseField(
  {
    type: WidgetType.TEXT,
    content: "app.api.v1.core.agent.chat.personas.get.response.personas.persona.name.content",
  },
  z.string()
)

// ✅ CORRECT - Response array with DATA_CARDS widget
responseArrayField(
  {
    type: WidgetType.DATA_CARDS,
  },
  objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.personas.get.response.personas.persona.title",
      layoutType: LayoutType.GRID,
      columns: 2,
    },
    { response: true },
    {
      id: responseField({ type: WidgetType.TEXT, content: "..." }, z.string()),
      name: responseField({ type: WidgetType.TEXT, content: "..." }, z.string()),
    }
  )
)
```

**Note:** Response fields use `content` property for translation keys, not `label`.

## UI/UX Optimization

### Multi-Interface Design Principles

NextVibe generates interfaces from endpoint definitions for **five contexts**:

**CLI Interface:**
- Clear, human-readable prompts and responses
- Logical field grouping and ordering
- Intuitive parameter names and descriptions
- Progressive disclosure (optional fields clearly marked)
- Error messages that guide users to solutions

**React Web Interface:**
- Responsive layout configurations with shadcn/ui
- Proper form field types and validations
- Accessible labels and descriptions (ARIA)
- Visual hierarchy through layout types
- Mobile-friendly field arrangements
- Tailwind CSS styling

**React Native Interface:**
- Native mobile components with NativeWind
- Touch-optimized interactions
- Platform-specific patterns (iOS/Android)
- Responsive to different screen sizes
- Native keyboard handling

**AI Tools Interface:**
- Natural language field descriptions
- Structured schemas for function calling
- Clear parameter types and constraints
- Context-aware help text
- Human-readable field relationships

**MCP Interface:**
- Model Context Protocol tool definitions
- Structured input/output schemas
- Clear tool descriptions and parameters
- Type-safe tool invocation

### Layout Types

Choose appropriate layout types for field context:

```typescript
LayoutType.GRID              // Grid with custom columns (use with columns property)
LayoutType.GRID_2_COLUMNS    // 2-column grid for field pairs
LayoutType.FULL_WIDTH        // Full width for text areas
LayoutType.STACKED           // Vertical stack for mobile-first
LayoutType.VERTICAL          // Simple vertical layout
LayoutType.HORIZONTAL        // Horizontal layout
LayoutType.FLEX              // Flex layout
LayoutType.COLLAPSIBLE       // Collapsible sections
LayoutType.GRID_ITEM         // Grid item positioning
```

**Layout Examples:**

```typescript
// Related field pairs (email/phone)
layoutType: LayoutType.GRID_2_COLUMNS

// Text areas and descriptions
layoutType: LayoutType.FULL_WIDTH

// Mobile-first forms
layoutType: LayoutType.STACKED

// Custom grid with column specification
layoutType: LayoutType.GRID
columns: 12  // Specify number of columns for GRID layout
```

### Field Grouping Strategy

Group related fields for better UX:

```typescript
// ✅ Contact information group
contactInfo: objectField(
  {
    type: WidgetType.SECTION,
    title: "app.api.v1.core.user.create.post.sections.contact.title",
    description: "app.api.v1.core.user.create.post.sections.contact.description",
    layoutType: LayoutType.GRID_2_COLUMNS
  },
  { request: "data" },
  {
    email: requestDataField({...}, z.string().email()),
    phone: requestDataField({...}, z.string()),
  }
)

// ✅ Address information group
addressInfo: objectField(
  {
    type: WidgetType.SECTION,
    title: "app.api.v1.core.user.create.post.sections.address.title",
    description: "app.api.v1.core.user.create.post.sections.address.description",
    layoutType: LayoutType.STACKED
  },
  { request: "data" },
  {
    street: requestDataField({...}, z.string()),
    city: requestDataField({...}, z.string()),
    country: requestDataField({...}, z.string()),
  }
)
```

**Field Ordering Strategy:**

1. **Importance** - Most critical fields first
2. **Frequency** - Most commonly used fields first
3. **Logical flow** - Natural progression through form
4. **Dependencies** - Parent fields before dependent fields

### Common Field Type Patterns

**Email fields:**

```typescript
email: requestDataField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.EMAIL,
    label: "...",
    description: "...",
    columns: 12,  // Full width
  },
  z.string().email()
)
```

**Phone fields:**

```typescript
phone: requestDataField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.PHONE,
    label: "...",
    description: "...",
    columns: 6,
  },
  z.string()
)
```

**Text areas:**

```typescript
description: requestDataField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXTAREA,
    label: "...",
    description: "...",
    columns: 12,  // Full width
  },
  z.string()
)
```

**Select fields with enums:**

```typescript
status: requestDataField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.SELECT,
    label: "...",
    description: "...",
    options: StatusOptions,  // From enum.ts
    columns: 6,
  },
  z.enum(Status)
)
```

## Translation Keys

### Key Structure

```text
app.api.v1.{domain}.{subdomain}.{action}.{field}.{property}
```

### Examples by Widget Type

```typescript
// FORM_FIELD - Uses label, description
{
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "app.api.v1.core.agent.chat.personas.post.name.label",
  description: "app.api.v1.core.agent.chat.personas.post.name.description",
  columns: 6
}

// TEXT (response) - Uses content
{
  type: WidgetType.TEXT,
  content: "app.api.v1.core.agent.chat.personas.get.response.personas.persona.name.content"
}

// CONTAINER - Uses title, description
{
  type: WidgetType.CONTAINER,
  title: "app.api.v1.core.agent.chat.personas.get.container.title",
  description: "app.api.v1.core.agent.chat.personas.get.container.description",
  layoutType: LayoutType.STACKED
}

// Endpoint metadata - Uses title, description, category, tags
{
  title: "app.api.v1.core.agent.chat.personas.get.title",
  description: "app.api.v1.core.agent.chat.personas.get.description",
  category: "app.api.v1.core.agent.chat.category",
  tags: ["app.api.v1.core.agent.chat.tags.personas"]
}
```

### Dynamic Routes

```typescript
// Path: src/app/api/[locale]/v1/core/agent/chat/personas/[id]/definition.ts
// Pattern: app.api.v1.core.agent.chat.personas.id.{method}.{field}
title: "app.api.v1.core.agent.chat.personas.id.get.title";
description: "app.api.v1.core.agent.chat.personas.id.get.description";
```

### Enum Translation Keys

```typescript
export const { enum: LeadStatus, options: LeadStatusOptions } =
  createEnumOptions({
    NEW: "app.api.v1.core.leads.enums.leadStatus.new",
    PENDING: "app.api.v1.core.leads.enums.leadStatus.pending",
  });
```

## Import Paths

```typescript
import { z } from "zod";

import { createEndpoint } from '@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/definition/create';
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
  Value: LeadStatusValues,
} = createEnumOptions({
  NEW: "app.api.v1.core.leads.enums.leadStatus.new",
  PENDING: "app.api.v1.core.leads.enums.leadStatus.pending",
  ACTIVE: "app.api.v1.core.leads.enums.leadStatus.active",
});

// Database enum for Drizzle
export const LeadStatusDB = [
  LeadStatus.NEW,
  LeadStatus.PENDING,
  LeadStatus.ACTIVE,
] as const;
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
    columns: 6,
  },
  z.enum(LeadStatus),
);

// BADGE field
status: responseField(
  {
    type: WidgetType.BADGE,
    text: "app.api.v1.core.leads.get.response.status.text",
  },
  z.enum(LeadStatus),
);
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
return success({
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
- [ ] Containers use `title`/`description` (not `label`)
- [ ] Response fields use `content` property (not `label`)
- [ ] Layout uses `layoutType` and `columns` properties (NOT nested `layout` object)
- [ ] Optional objects use `objectOptionalField()` (not `.optional()` on schema)
- [ ] Optional arrays use `arrayOptionalField()` or `responseArrayOptionalField()` or `requestDataArrayOptionalField()`
- [ ] Optional primitives use `.optional()` on Zod schema
- [ ] Error types are complete
- [ ] Examples structure is correct
- [ ] Type exports follow naming convention
- [ ] No debug/verbose fields

## Reference Examples

**Clean definition files with no errors:**

- `src/app/api/[locale]/v1/core/agent/chat/personas/definition.ts` - GET and POST endpoints with forms, arrays, optional fields
- `src/app/api/[locale]/v1/core/agent/brave-search/definition.ts` - POST endpoint with search functionality

---

## See Also

- [Enum Patterns](enum.md) - Enum integration
- [Repository Patterns](repository.md) - Using definition types
- [Import Patterns](imports.md) - Import conventions
- [Email Patterns](email.md) - Using request/response types in email functions
