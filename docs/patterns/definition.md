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
2. [Custom Widget Integration](#custom-widget-integration)
3. [Widget Metadata](#widget-metadata)
4. [UI/UX Optimization](#uiux-optimization)
5. [Translation Keys](#translation-keys)
6. [Import Paths](#import-paths)
7. [Enum Integration](#enum-integration)
8. [Common Patterns](#common-patterns)
9. [Category & Subcategory Registration](#category--subcategory-registration)

## Field Function Patterns

### Core Principle: Always use scoped field functions

All field functions come in **scoped** and non-scoped variants. Always use the scoped versions - they validate translation key strings against the module's i18n schema at compile time.

Import from `utils-i18n` (not `utils`) - the `utils-i18n` variants take `scopedTranslation` as their first argument and validate label keys at compile time:

```typescript
import {
  requestField,
  responseField,
  requestResponseField,
  requestUrlPathParamsField,
  objectField,
  responseArrayField,
  requestDataArrayField,
  responseArrayOptionalField,
  backButton,
  submitButton,
  deleteButton,
  navigateButtonField,
} from "next-vibe/unified-ui/_shared/utils-i18n";

// customWidgetObject takes no scopedTranslation - it lives in `utils`
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
```

**The scoped variants are not separately named.** `utils` and `utils-i18n` export the _same_ function names; the `utils-i18n` copies take `scopedTranslation` as their first argument. "Scoped" is the module you import from, not a `scoped*` prefix on the identifier - there is no `scopedTextField`, `scopedSubmitButton`, or `scopedEditButton`.

Pass `scopedTranslation` as the first argument to every field function from `utils-i18n`. This is type-inference only - it enables the compiler to validate your translation key strings.

### Core Principle: No naked z.object()

**NEVER** use `z.object()` or `z.array()` directly. Always use the field functions to enable UI generation.

### Field Functions Reference

| Scoped function                          | Purpose                                                           | Usage context                         |
| ---------------------------------------- | ----------------------------------------------------------------- | ------------------------------------- |
| `requestField(st, config)`               | Request body or query param field                                 | `{ request: "data" }`                 |
| `requestUrlPathParamsField(st, config)`  | URL path parameter                                                | `{ request: "urlPathParams" }`        |
| `responseField(st, config)`              | Response-only display field                                       | `{ response: true }`                  |
| `requestResponseField(st, config)`       | Appears in both request AND response - single field, dual purpose | mixed (routing hint + response value) |
| `objectField(st, config)`                | Nested object / container                                         | any context                           |
| `responseArrayField(st, config)`         | Response array                                                    | `{ response: true }`                  |
| `requestDataArrayField(st, config)`      | Request array                                                     | `{ request: "data" }`                 |
| `responseArrayOptionalField(st, config)` | Nullable response array                                           | `{ response: true }`                  |
| `customWidgetObject(config)`             | Custom React widget (no st needed)                                | root field                            |

**Optional primitives:** Use `.optional()` on the Zod schema:

```typescript
requestField(st, { schema: z.string().optional(), ... })
```

**Optional objects:** Use `responseArrayOptionalField` for optional arrays. For optional nested objects, use `objectField` and set `.optional()` on the inner Zod schema. `objectOptionalField` is FORBIDDEN (legacy 4-param API).

### Flat API - objectField

Config is a single object containing `usage` + `children`:

```typescript
fields: objectField(scopedTranslation, {
  type: WidgetType.CONTAINER,
  usage: { request: "data", response: true },
  children: {
    email: requestField(scopedTranslation, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.EMAIL,
      label: "create.form.email.label",
      schema: z.email(),
    }),
    name: requestField(scopedTranslation, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "create.form.name.label",
      schema: z.string().min(2),
      columns: 6,
      order: 0,
    }),
  },
}),
```

### Arrays - responseArrayField

Config contains `child` (not `children`):

```typescript
items: responseArrayField(scopedTranslation, {
  type: WidgetType.CONTAINER,
  child: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    usage: { response: true },
    children: {
      name: responseField(scopedTranslation, {
        schema: z.string(),
        type: WidgetType.TEXT,
      }),
    },
  }),
}),
```

### Optional arrays - responseArrayOptionalField

For nullable arrays, use the flat API with `child` inside the config object:

```typescript
attachments: responseArrayOptionalField(scopedTranslation, {
  type: WidgetType.CONTAINER,
  child: responseField(scopedTranslation, {
    schema: z.string(),
    type: WidgetType.TEXT,
    content: "get.response.attachments.name.content",
  }),
}),
```

### Specialized Field Types

Currency, language, country and timezone pickers are **not** separate helper functions - there is no `currencyField()`. They are ordinary `requestField` calls that select a specialized `FieldDataType`; the matching widget lives under `next-vibe/unified-ui/widgets/form-fields/`.

```typescript
import { FieldDataType, WidgetType } from "next-vibe/core/definition/enums";
import { requestField } from "next-vibe/unified-ui/_shared/utils-i18n";

// Currency selection
currency: requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.CURRENCY_SELECT,
  label: "post.currency.label",
  description: "post.currency.description",
  schema: z.string(),
}),
```

The same shape applies to the other specialized pickers - only `fieldType` changes:

| `fieldType`                     | Widget                              |
| ------------------------------- | ----------------------------------- |
| `FieldDataType.CURRENCY_SELECT` | `form-fields/currency-select-field` |
| `FieldDataType.LANGUAGE_SELECT` | `form-fields/language-select-field` |
| `FieldDataType.COUNTRY_SELECT`  | `form-fields/country-select-field`  |
| `FieldDataType.TIMEZONE`        | `form-fields/timezone-field`        |

Each widget supplies its own options list, validation and rendering - the definition only names the `fieldType`.

### Context Examples

```typescript
// Request body object
objectField(st, { type: WidgetType.CONTAINER, usage: { request: "data" }, children: {...} })
// Response-only object
objectField(st, { type: WidgetType.CONTAINER, usage: { response: true }, children: {...} })
// URL path params object
objectField(st, { type: WidgetType.CONTAINER, usage: { request: "urlPathParams" }, children: {...} })
// Both request and response
objectField(st, { type: WidgetType.CONTAINER, usage: { request: "data&urlPathParams", response: true }, children: {...} })
// Root level (no usage restriction)
objectField(st, { type: WidgetType.CONTAINER, usage: {}, children: {...} })
```

## Custom Widget Integration

When the auto-rendered UI isn't sufficient, use `customWidgetObject` to wire a React component directly into the definition.

**CRITICAL: Always use `lazyWidget` - never statically import `widget.tsx`.** Static import breaks `vibe gen` (SSR/bun module resolution fails). `lazyWidget` also automatically routes `import("./widget")` → `widget.cli.tsx` in CLI/MCP context (the Bun plugin intercepts by name).

```typescript
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";

const SkillCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SkillCreateContainer })),
);

fields: customWidgetObject({
  render: SkillCreateContainer,    // ← lazy component reference
  usage: { request: "data", response: true } as const,
  children: {
    name: requestField(scopedTranslation, {
      schema: z.string().min(2).max(100),
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "post.name.label" as const,
      columns: 6,
      order: 0,
    }),
    success: responseField(scopedTranslation, {
      schema: z.string(),
      type: WidgetType.ALERT,
    }),
  },
}),
```

`customWidgetObject` does NOT take `scopedTranslation` as first param. Children are defined normally with scoped field functions.

See `docs/patterns/widget.md` for the full widget implementation pattern.

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
layoutType: LayoutType.STACKED; // Vertical stack
layoutType: LayoutType.GRID; // Grid layout (use with columns)
layoutType: LayoutType.GRID_2_COLUMNS; // 2-column grid
layoutType: LayoutType.VERTICAL; // Vertical layout
columns: 12; // Total grid columns (for GRID layoutType)
```

**For Form Fields:**

```typescript
columns: 6; // Column width within parent grid (1-12)
```

### Container Widgets

Containers use `layoutType` and `columns` properties (NOT nested `layout` object):

```typescript
// ✅ Container with layoutType
objectField(st, {
  type: WidgetType.CONTAINER,
  title: "section.title",     // scoped key
  description: "section.description",
  layoutType: LayoutType.STACKED,
  usage: { response: true },
  children: {
    field1: responseField(st, { ... }),
    field2: responseField(st, { ... }),
  },
})

// ✅ Container with GRID layout
objectField(st, {
  type: WidgetType.CONTAINER,
  title: "section.title",
  layoutType: LayoutType.GRID,
  columns: 2,
  usage: { response: true },
  children: { ... },
})

// ❌ WRONG - Don't use nested layout object
objectField(st, {
  type: WidgetType.CONTAINER,
  layout: { type: LayoutType.GRID, columns: 2 },  // ❌ Invalid - use top-level layoutType/columns
})
```

### Array Fields with Grouping

```typescript
consultations: responseArrayField(st, {
  type: WidgetType.GROUPED_LIST,
  child: objectField(st, {
    type: WidgetType.CONTAINER,
    title: "item.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      id: responseField(st, {
        type: WidgetType.TEXT,
        schema: z.uuid(),
        content: "item.id.content",
      }),
      status: responseField(st, {
        type: WidgetType.BADGE,
        schema: z.enum(StatusDB),
        content: "item.status.content",
      }),
      createdAt: responseField(st, {
        type: WidgetType.TEXT,
        schema: z.string(),
        content: "item.createdAt.content",
      }),
    },
  }),
});
```

### Form Field Widgets

Form fields use `columns` property for grid width (1-12):

```typescript
// ✅ Text field
name: requestField(st, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "post.name.label", // scoped key
  description: "post.name.description",
  schema: z.string().min(1).max(100),
  columns: 6,
});

// ✅ Full width textarea
systemPrompt: requestField(st, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXTAREA,
  label: "post.systemPrompt.label",
  description: "post.systemPrompt.description",
  schema: z.string().min(1).max(5000),
  columns: 12,
});

// ✅ Select field with options
category: requestField(st, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.SELECT,
  label: "post.category.label",
  description: "post.category.description",
  options: CategoryOptions, // from enum.ts
  schema: z.enum(CategoryDB),
  columns: 6,
});

// ❌ WRONG - Don't use nested layout object
requestField(st, {
  type: WidgetType.FORM_FIELD,
  layout: { columns: 6 }, // ❌ Invalid - use top-level columns
});
```

**Important:** Validation is defined in the Zod schema (`.min()`, `.max()`, `.email()`, `.optional()`, etc.), not in widget config.

### Response Field Widgets

Response fields display data (not for user input):

```typescript
// ✅ TEXT widget
name: responseField(st, {
  type: WidgetType.TEXT,
  content: "get.response.name.content", // scoped key
  schema: z.string(),
});

// ✅ Response array with containers
skills: responseArrayField(st, {
  type: WidgetType.CONTAINER,
  child: objectField(st, {
    type: WidgetType.CONTAINER,
    title: "get.response.skill.title",
    layoutType: LayoutType.GRID,
    columns: 2,
    usage: { response: true },
    children: {
      id: responseField(st, {
        type: WidgetType.TEXT,
        content: "get.response.skill.id.content",
        schema: z.string(),
      }),
      name: responseField(st, {
        type: WidgetType.TEXT,
        content: "get.response.skill.name.content",
        schema: z.string(),
      }),
    },
  }),
});
```

**Note:** Response fields use `content` property for translation keys, request fields use `label`.

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
LayoutType.GRID; // Grid with custom columns (use with columns property)
LayoutType.GRID_2_COLUMNS; // 2-column grid for field pairs
LayoutType.FULL_WIDTH; // Full width for text areas
LayoutType.STACKED; // Vertical stack for mobile-first
LayoutType.VERTICAL; // Simple vertical layout
LayoutType.HORIZONTAL; // Horizontal layout
LayoutType.FLEX; // Flex layout
LayoutType.COLLAPSIBLE; // Collapsible sections
LayoutType.GRID_ITEM; // Grid item positioning
```

**Layout Examples:**

```typescript
// Related field pairs (email/phone)
layoutType: LayoutType.GRID_2_COLUMNS;

// Text areas and descriptions
layoutType: LayoutType.FULL_WIDTH;

// Mobile-first forms
layoutType: LayoutType.STACKED;

// Custom grid with column specification
layoutType: LayoutType.GRID;
columns: 12; // Specify number of columns for GRID layout
```

### Field Grouping Strategy

Group related fields for better UX:

```typescript
// ✅ Contact information group
contactInfo: objectField(st, {
  type: WidgetType.SECTION,
  title: "post.sections.contact.title", // scoped key
  description: "post.sections.contact.description",
  layoutType: LayoutType.GRID_2_COLUMNS,
  usage: { request: "data" },
  children: {
    email: requestField(st, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.EMAIL,
      label: "post.email.label",
      schema: z.email(),
      columns: 6,
    }),
    phone: requestField(st, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.PHONE,
      label: "post.phone.label",
      schema: z.string(),
      columns: 6,
    }),
  },
});

// ✅ Address information group
addressInfo: objectField(st, {
  type: WidgetType.SECTION,
  title: "post.sections.address.title",
  description: "post.sections.address.description",
  layoutType: LayoutType.STACKED,
  usage: { request: "data" },
  children: {
    street: requestField(st, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "post.street.label",
      schema: z.string(),
      columns: 12,
    }),
    city: requestField(st, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "post.city.label",
      schema: z.string(),
      columns: 6,
    }),
    country: requestField(st, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "post.country.label",
      schema: z.string(),
      columns: 6,
    }),
  },
});
```

**Field Ordering Strategy:**

1. **Importance** - Most critical fields first
2. **Frequency** - Most commonly used fields first
3. **Logical flow** - Natural progression through form
4. **Dependencies** - Parent fields before dependent fields

### Common Field Type Patterns

**Email fields:**

```typescript
email: requestField(st, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.EMAIL,
  label: "post.email.label",
  description: "post.email.description",
  schema: z.email(),
  columns: 12,
});
```

**Phone fields:**

```typescript
phone: requestField(st, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.PHONE,
  label: "post.phone.label",
  description: "post.phone.description",
  schema: z.string(),
  columns: 6,
});
```

**Text areas:**

```typescript
description: requestField(st, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXTAREA,
  label: "post.description.label",
  description: "post.description.description",
  schema: z.string(),
  columns: 12,
});
```

**Select fields with enums:**

```typescript
status: requestField(st, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.SELECT,
  label: "post.status.label",
  description: "post.status.description",
  options: StatusOptions, // from enum.ts
  schema: z.enum(StatusDB),
  columns: 6,
});
```

## Translation Keys

All translation keys are **short, scoped** relative to the module's i18n scope. The old global `"app.api.*"` format is **FORBIDDEN** in new code - a refactor agent will migrate existing usages.

### Two createEndpoint variants: inline (default) vs scoped i18n

There are two modules, each exporting `createEndpoint`:

| Module                        | Copy             | Field helpers        | Repository   |
| ----------------------------- | ---------------- | -------------------- | ------------ |
| `core/definition/create`      | literal strings  | `_shared/utils`      | `failInline` |
| `core/definition/create-i18n` | scoped i18n keys | `_shared/utils-i18n` | `fail`       |

The split keeps single-language modules off the i18n folder entirely. The inline variant takes **no `scopedTranslation`** - titles, descriptions, tags, error/success types and field labels are plain strings that render verbatim on every surface (web, CLI, MCP, AI, native).

```typescript
import { createEndpoint } from "next-vibe/core/definition/create";
// NOTE: plain `utils`, not `utils-i18n` - these take no scopedTranslation arg
import { objectField, requestField } from "next-vibe/unified-ui/_shared/utils";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["companies", "create"],
  title: "Create company",
  titleShort: "Create",
  description: "Register a new company under your account.",
  tags: ["companies", "onboarding"],
  fields: objectField({
    type: WidgetType.CONTAINER,
    usage: { request: "data", response: true },
    children: {
      name: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "Company name",
        schema: z.string().min(2),
      }),
    },
  }),
  // ...remaining required config is identical to createEndpoint
});
```

Everything else is unchanged: schema generation, field inference, events, channels and `POST.types.*` behave identically in both. The inline variant attaches a pass-through `scopedTranslation` that hands keys straight back - it exists only so the widget layer can keep inferring `TKey`, and inline definitions never call it.

**The repository uses `failInline`, not `fail`.** `fail({ message })` requires a `TranslatedKeyType` — text that came out of a `t()` call. An inline module has no `t()`, so it uses the literal counterpart:

```typescript
import { failInline } from "next-vibe/core/route/response.schema";

return failInline({
  message: `Template not found at ${templatePath}`,
  errorType: ErrorResponseTypes.NOT_FOUND,
});
```

`failInline` has **no `messageParams`** — that field exists to fill placeholders into a static translation key. Inline copy is built at the call site, so interpolate with a template literal and keep the sentence readable. `logger.*` already takes plain strings, so it needs no wrapper either.

Do NOT route literals through a translation function to satisfy the brand (`t("Internal Error")`) — that is ceremony with no i18n behind it. `failInline` is the one sanctioned place a literal becomes a message, which keeps the brand on `fail` meaningful for scoped endpoints.

**Trade-off:** inline copy is single-language - the locale argument is ignored. Use it for internal tooling, admin-only endpoints and prototypes. **Anything user-facing that must ship in DE/PL uses `createEndpoint` + `createScopedTranslation`.** Migrating later means moving the strings into `i18n/` and swapping the field helpers back to `utils-i18n`.

### Key Structure

```text
{action}.{field}.{property}
```

### Examples by Widget Type

```typescript
// FORM_FIELD - Uses label, description, placeholder
{
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "post.name.label",
  description: "post.name.description",
  placeholder: "post.name.placeholder",
  columns: 6,
}

// TEXT (response) - Uses content (not label)
{
  type: WidgetType.TEXT,
  content: "get.response.name.content",
}

// CONTAINER - Uses title, description
{
  type: WidgetType.CONTAINER,
  title: "get.container.title",
  description: "get.container.description",
  layoutType: LayoutType.STACKED,
}

// Endpoint metadata
{
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.chat",   // ← global category key
  tags: ["tags.skills" as const],        // ← scoped tag key
}
```

### Enum Translation Keys

```typescript
// In enum.ts - short scoped keys, pass scopedTranslation
export const { enum: LeadStatus, options: LeadStatusOptions } =
  createEnumOptions(scopedTranslation, {
    NEW: "enums.leadStatus.new",
    PENDING: "enums.leadStatus.pending",
  });
```

These keys must exist in all three language files (`en/`, `de/`, `pl/`) under the module's `enums.leadStatus.*` path.

## Import Paths

```typescript
import { z } from "zod";

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestResponseField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
  submitButton,
  backButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";

// Local imports - always use ./i18n (module-local scope)
import { scopedTranslation } from "./i18n";
import { MyEnum, MyEnumOptions } from "./enum";
// if using customWidgetObject - ALWAYS lazy, never static import:
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
const MyWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.MyWidget })),
);
```

**Rules:**

1. Use `@/` for absolute imports from project root
2. Import from `utils-i18n` not `utils` (scoped API)
3. Import `scopedTranslation` from `./i18n` - never from a parent scope
4. Import enums from `./enum` not `./definition` (avoid circular deps)
5. Import `UserRole` from `next-vibe/identity/roles/enum`

## Enum Integration

### Creating Enums

```typescript
// File: enum.ts
import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";
import { scopedTranslation } from "./i18n";

export const {
  enum: LeadStatus,
  options: LeadStatusOptions,
  Value: LeadStatusValue,
} = createEnumOptions(scopedTranslation, {
  NEW: "enums.leadStatus.new", // ← short scoped key, not global
  PENDING: "enums.leadStatus.pending",
  ACTIVE: "enums.leadStatus.active",
});

// Database enum array for Drizzle - explicit, as const
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
status: requestResponseField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.SELECT,
  label: "post.status.label",
  options: LeadStatusOptions,
  schema: z.enum(LeadStatus),
  columns: 6,
}),

// BADGE field
status: responseField(scopedTranslation, {
  type: WidgetType.BADGE,
  schema: z.enum(LeadStatus),
  content: "get.response.status.content",
}),
```

## Common Patterns

### Nested Request Structure

```typescript
fields: objectField(st, {
  type: WidgetType.CONTAINER,
  usage: { request: "data&urlPathParams", response: true },
  children: {
    id: requestUrlPathParamsField(st, {
      schema: z.uuid(),
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.UUID,
      label: "get.id.label",
    }),
    basicInfo: objectField(st, {
      type: WidgetType.SECTION,
      usage: { request: "data" },
      children: {
        firstName: requestField(st, {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "post.firstName.label",
          schema: z.string(),
          columns: 6,
        }),
        lastName: requestField(st, {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "post.lastName.label",
          schema: z.string(),
          columns: 6,
        }),
      },
    }),
    email: responseField(st, {
      type: WidgetType.TEXT,
      content: "get.response.email.content",
      schema: z.email(),
    }),
    createdAt: responseField(st, {
      type: WidgetType.TEXT,
      content: "get.response.createdAt.content",
      schema: z.string(),
    }),
  },
});
```

### Response Structure Matching

```typescript
// Definition must match repository return
fields: objectField(st, {
  type: WidgetType.CONTAINER,
  usage: {},
  children: {
    profile: objectField(st, {
      type: WidgetType.CONTAINER,
      usage: { response: true },
      children: {
        name: responseField(st, {
          type: WidgetType.TEXT,
          content: "get.response.profile.name.content",
          schema: z.string(),
        }),
        email: responseField(st, {
          type: WidgetType.TEXT,
          content: "get.response.profile.email.content",
          schema: z.email(),
        }),
      },
    }),
  },
});

// Repository
return success({
  profile: { name: "John", email: "john@example.com" },
});
```

### Error Types

All 9 error types are required. Use short scoped keys:

```typescript
errorTypes: {
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title",        // scoped key
    description: "errors.unauthorized.description"
  },
  [EndpointErrorTypes.VALIDATION_FAILED]: { title: "errors.validationFailed.title", description: "errors.validationFailed.description" },
  [EndpointErrorTypes.FORBIDDEN]: { title: "errors.forbidden.title", description: "errors.forbidden.description" },
  [EndpointErrorTypes.NOT_FOUND]: { title: "errors.notFound.title", description: "errors.notFound.description" },
  [EndpointErrorTypes.CONFLICT]: { title: "errors.conflict.title", description: "errors.conflict.description" },
  [EndpointErrorTypes.SERVER_ERROR]: { title: "errors.serverError.title", description: "errors.serverError.description" },
  [EndpointErrorTypes.NETWORK_ERROR]: { title: "errors.networkError.title", description: "errors.networkError.description" },
  [EndpointErrorTypes.UNSAVED_CHANGES]: { title: "errors.unsavedChanges.title", description: "errors.unsavedChanges.description" },
  [EndpointErrorTypes.UNKNOWN_ERROR]: { title: "errors.unknownError.title", description: "errors.unknownError.description" },
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

### `useClientRoute` - placement matters

`useClientRoute` checks request data to decide whether to route to `route-client.ts`. TypeScript infers the `data` type from `fields`, so `useClientRoute` **must appear AFTER `successTypes`** in the `createEndpoint` config object (i.e. after `fields` is fully defined). Place it anywhere before that and TypeScript cannot infer `data`, making it `never`.

```typescript
// ✅ CORRECT - after successTypes
const { GET } = createEndpoint({
  scopedTranslation,
  fields: objectField(st, {
    usage: { request: "data&urlPathParams" },
    children: {
      rootFolderId: requestField(st, {
        schema: z.enum(DefaultFolderId),
        // ...
      }),
    },
  }),
  successTypes: { title: "get.success.title", description: "get.success.description" },

  // ← useClientRoute goes HERE, after successTypes
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,
  examples: { ... },
});

// ❌ WRONG - before fields (data is never)
const { GET } = createEndpoint({
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO, // TS error: data is never
  fields: ...,
  successTypes: ...,
});
```

The `rootFolderId` field is optional (`.optional()`) so callers that don't care about routing simply omit it - they always hit the server. Only callers that explicitly set `rootFolderId: DefaultFolderId.INCOGNITO` get routed to the client.

### `requestResponseField` - when to use it

Use `requestResponseField` when a field must appear in **both the request input and the response output** from a single definition. This avoids the duplicate-key error that results from defining the same field name as both `requestField` and `responseField` in the same `children` object.

```typescript
// ✅ CORRECT - single field covers both request (routing hint) and response (returned value)
rootFolderId: requestResponseField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.SELECT,
  label: "get.rootFolderId.label" as const,
  description: "get.rootFolderId.description" as const,
  columns: 6,
  schema: z.enum(DefaultFolderId),
}),

// ❌ WRONG - duplicate key: TypeScript TS1117 / eslint no-dupe-keys
children: {
  rootFolderId: requestField(st, { ... }),   // key already used
  rootFolderId: responseField(st, { ... }),  // ← TS error
}
```

Common use case: a field the server reads from the request (e.g. `rootFolderId` used to pick a storage path) and also returns in the response (so the client can use it after the round-trip).

### Debug Fields

**DO NOT** add debug fields:

```typescript
// ❌ WRONG
debug: requestField(st, { schema: z.boolean().default(false), ... })
verbose: requestField(st, { schema: z.boolean().default(false), ... })

// ✅ CORRECT - Use logger.isDebugEnabled() in implementation
```

## Category & Subcategory Registration

Every module has a `category.ts` that controls the sidebar entry and what loads on click.

```typescript
// category.ts
import { PAYMENT_DASHBOARD_ALIAS } from "@/payment/dashboard/constants";
import { INVOICE_LIST_ALIAS } from "@/payment/invoice/list/constants";
import type { CategoryDefinition } from "next-vibe/help-tool/category-types";

export const category: CategoryDefinition = {
  key: "payments",
  defaultEntry: PAYMENT_DASHBOARD_ALIAS, // loads on category click
  subcategories: {
    Transactions: {
      defaultEntry: INVOICE_LIST_ALIAS, // loads on subcategory click
      label: {
        "en-US": "Transactions",
        "en-GLOBAL": "Transactions",
        "de-DE": "Transaktionen",
        "pl-PL": "Transakcje",
      },
      icon: "receipt",
      order: 0,
    },
  },
};
```

**Rules:**

- `defaultEntry` → always imported from `constants.ts`, never a raw string literal.
- Category `defaultEntry` → dashboard (KPI cards + quick actions). Subcategory `defaultEntry` → primary list.
- Every category **and** subcategory must have a `defaultEntry`. No exceptions.
- Run `vibe gen` after any `category.ts` change to rebuild the registry.

### `defaultWebPinned`

Controls which roles see this endpoint pinned in the web sidebar by default. Web pins are the primary navigation — they form the sidebar at `/admin/endpoints` and determine each role's first impression of the platform.

```typescript
// definition.ts
defaultWebPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
```

**Pin these endpoint types:**

- Dashboards (KPI cards + quick actions — the entry point for a module)
- Primary list endpoints (invoices, orders, leads, products)
- Key create forms that users access frequently

**Never pin:**

- Sub-actions (void, send-reminder, approve, dispatch)
- Detail/get-by-ID views (`[id]` routes — reached via list navigation)
- Internal utilities (health checks, migrations, seed runners)
- Config endpoints rarely touched after setup
- Duplicate entry points (if dashboard exists, don't also pin the list unless the list is genuinely separate)

**Role guidelines:**

- **Public** — AI inference tools only (chat, image/music/video gen, search, models, TTS, STT). Plus `user-me` and `credits-balance`. No business tools. Public users are browsing or trying the platform.
- **Customer** — Everything Public sees + business tools they operate (accounting, payments, invoices, POS, products, inventory, purchasing, leads dashboard, subscriptions, referrals, messenger, remote/SSH). Customers run their own business on the platform.
- **Admin** — Everything Customer sees + user management, system settings, error logs, deployment, SQL, coding agent, advanced monitoring (pulse, vibe-sense), full lead management, newsletter campaigns, support sessions.

**Validation rule:** A tool must never appear in `defaultWebPinned` for a role that isn't in its `allowedRoles`. This would show a sidebar entry that fails on click.

### `defaultAiPinned`

Controls which roles get this tool pinned in the AI context window by default. AI-pinned tools are always visible to the AI and can be called automatically without the user explicitly requesting them.

```typescript
// definition.ts
defaultAiPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
```

**Pin for AI:** Tools the AI needs autonomously — `ai-run`, `tool-help`, `cortex-*` (memory), `execute-tool`, `await-task`. Admin adds `coding-agent`, `sql`, `rebuild`.

**Never AI-pin:** UI-only tools (dashboards, lists with custom widgets), endpoints that only make sense through browser interaction, tools with large response payloads that waste context.

### Tool Titles and Labels

Tool titles appear in the sidebar grid, CLI output, and MCP tool lists. They must work across all surfaces.

**Rules:**

- Lead with the noun, not the verb: "Invoice List" not "List Invoices". Exception: action endpoints ("Generate Image", "Run AI Stream").
- Max 3 words for sidebar display. Longer titles get truncated in the 72px grid cells.
- No redundant category prefix: "Dashboard" not "Payment Dashboard" (the category already shows "Payments").
- Fluffless: "Models" not "Browse Available AI Models". "Credits" not "Credit Balance Overview".
- Consistent within a module: if one endpoint says "List" the sibling says "Create", not "New" or "Add".

**Naming patterns by endpoint type:**

| Type      | Pattern                                  | Example                        |
| --------- | ---------------------------------------- | ------------------------------ |
| Dashboard | `{Module} Dashboard` or just `Dashboard` | "Dashboard"                    |
| List      | `{Entity} List` or `{Entities}` (plural) | "Invoices", "Stock List"       |
| Create    | `Create {Entity}`                        | "Create Invoice"               |
| Detail    | `{Entity} Details`                       | "Invoice Details"              |
| Action    | `{Verb} {Entity}`                        | "Generate Image", "Send Email" |
| Settings  | `{Module} Settings` or `Settings`        | "Chat Settings"                |

### Module Verification Checklist

When building or auditing a module, verify these in order:

1. **Category registration** — `category.ts` exists, has `defaultEntry` pointing to the dashboard, subcategories have sensible icons and labels, `vibe gen` produces correct registry entry
2. **Web pins** — dashboards and primary lists are pinned for the right roles. Detail views and sub-actions are NOT pinned. Run `vibe tool-help --statsFilter=webPinned` to verify.
3. **AI pins** — only tools the AI needs autonomously. Most modules have zero AI-pinned tools (AI discovers them via `tool-help`).
4. **Tool titles** — short, fluffless, consistent within the module. Check CLI output with `vibe tool-help --category={category}`.
5. **Role access** — `allowedRoles` matches who should access it. `defaultWebPinned` is a subset of `allowedRoles`.
6. **View-as-role test** — use `vibe tool-help --viewAsRole=customer --statsFilter=webPinned` and `--viewAsRole=public` to verify each role sees only what they need.

---

## Quick Checklist

- [ ] Imports from `utils-i18n` (not `utils`)
- [ ] All field functions use `scoped*` variants with `scopedTranslation` as first arg
- [ ] `scopedTranslation` imported from `./i18n` (never parent scope)
- [ ] No `z.object()` or `z.array()` directly in field functions
- [ ] All fields have complete widget metadata
- [ ] Translation keys are short scoped (not `app.api.*` global format)
- [ ] Enum created with `createEnumOptions(scopedTranslation, {...})`
- [ ] Containers use `title`/`description` (not `label`)
- [ ] Response fields use `content` property (not `label`)
- [ ] Layout uses `layoutType` and `columns` (NOT nested `layout` object)
- [ ] Optional primitives use `.optional()` on Zod schema
- [ ] Optional arrays use `responseArrayOptionalField(st, { ..., child })`
- [ ] Custom widget uses `customWidgetObject({ render, usage, children })`
- [ ] Widget imported via `lazyWidget` (NEVER static `import { X } from "./widget"`)
- [ ] Error types: all 9 `EndpointErrorTypes` present
- [ ] Examples structure correct (not wrapped in method name)
- [ ] Type exports follow naming convention
- [ ] No debug/verbose fields
- [ ] `useClientRoute` placed AFTER `successTypes` (not before `fields`)
- [ ] Dual request+response fields use `requestResponseField` (not two fields with same key)

## Reference Examples

**Clean definition files:**

- `next-vibe/agent/chat/skills/create/definition.ts` - POST with `customWidgetObject`
- `next-vibe/agent/chat/folders/definition.ts` - GET with `responseArrayField`
- `next-vibe/agent/chat/threads/[threadId]/permissions/definition.ts` - GET + PATCH with urlPathParams

---

## See Also

- [Enum Patterns](enum.md) - Enum integration
- [Repository Patterns](repository.md) - Using definition types
- [Import Patterns](imports.md) - Import conventions
- [Email Patterns](email.md) - Using request/response types in email functions
