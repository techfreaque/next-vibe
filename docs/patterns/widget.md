# Widget Pattern

Comprehensive guide to the `widget.tsx` / `widget/` folder pattern for custom UI in endpoint definitions.

## Overview

Every endpoint is **definition-driven by default** - the rendering engine (`EndpointsPage` → `EndpointRenderer`) reads the definition fields and generates UI automatically. A custom widget is only needed when the auto-rendered UI is insufficient.

When a custom widget IS needed, it lives alongside the endpoint's `definition.ts`, in one of two forms:

| Complexity | Pattern                                         | When to use                             |
| ---------- | ----------------------------------------------- | --------------------------------------- |
| Simple     | `widget.tsx` (single file)                      | One main component, fits in <1000 lines |
| Complex    | `widget/` folder with `widget/widget.tsx` entry | Multiple sub-components, complex layout |

## Fundamental Rules

1. **Scoped to deepest route** - A widget file lives next to the `definition.ts` it renders. No exceptions.
2. **Self-contained** - A widget owns all its sub-components. It does NOT import UI components from sibling or parent endpoint widgets.
3. **No reconstruction** - Never recreate features that belong to another endpoint. If you need another endpoint's UI, use `EndpointsPage` (for embedding) or the navigation stack (for navigation/modal).
4. **Definition is the contract** - Widgets access data through the typed `field.children` from `customWidgetObject`. No raw API calls inside a widget.
5. **Context hooks for runtime data** - Inside a `customWidgetObject` widget, use `useWidget*` hooks for locale, user, form, navigation. Never accept these via props. Exception: dialog wrappers and page-level wrappers that pass `locale`/`user` down to `EndpointsPage` DO accept them as props - but they are not widgets, they are wrappers.
6. **No local state for request params** - Search queries, filters, sort order, pagination - any value that controls what data is fetched or how it is filtered - must be a `requestField` in the definition and read/written via `form.watch()` / `form.setValue()`. Only use `useState` for pure UI state (open/closed dialogs, hover, loading spinners).

## File Structure

### Single-file widget

```
src/app/api/[locale]/agent/chat/skills/create/
├── definition.ts       ← customWidgetObject references SkillCreateContainer
├── repository.ts
├── route.ts
├── i18n/
└── widget.tsx          ← exports SkillCreateContainer
```

### Widget folder

```
src/app/api/[locale]/agent/chat/threads/
├── definition.ts
├── repository.ts
├── route.ts
├── i18n/
└── widget/
    ├── widget.tsx              ← main entry (exported name matches endpoint)
    ├── chat-input/
    │   ├── input.tsx
    │   ├── input-container.tsx
    │   ├── file-upload-button.tsx
    │   ├── tools-button.tsx
    │   ├── recording-input-area.tsx
    │   ├── call-mode-indicator.tsx
    │   ├── hooks/
    │   │   └── use-voice-recording.ts
    │   └── selector/
    │       ├── index.tsx
    │       ├── selector-content.tsx
    │       └── selector-onboarding/
    │           ├── index.tsx
    │           └── context.tsx
    ├── public-feed/
    │   └── public-feed.tsx
    └── new-thread/
        └── empty-state.tsx
```

Everything inside `widget/` is private to that endpoint. Sub-folders are organizational only.

## Connecting Widget to Definition

The widget is registered in `definition.ts` via `customWidgetObject`:

```typescript
// definition.ts
import { SkillCreateContainer } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  // ...
  fields: customWidgetObject({
    render: SkillCreateContainer, // ← component reference
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
});
```

`usage: { request: "data", response: true }` means:

- `request: "data"` - request fields become form inputs
- `response: true` - response fields are display-only

## Writing a Widget Component

### Props interface

```typescript
interface CustomWidgetProps {
  field: {
    value: SkillCreateResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}
```

- `field.children` - typed access to every child field defined in `customWidgetObject`
- `field.value` - the response data (after successful mutation), or `null`
- `fieldName` - the key of this field in the parent (usually not needed)

### Context hooks (never use props for these)

```typescript
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetUser,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetData,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
```

| Hook                               | Returns                  | Use for                               |
| ---------------------------------- | ------------------------ | ------------------------------------- |
| `useWidgetForm<typeof def.POST>()` | React Hook Form instance | Read/write form values                |
| `useWidgetLocale()`                | `CountryLanguage`        | Pass to sub-components needing locale |
| `useWidgetUser()`                  | `JwtPayloadType`         | Pass to sub-components needing user   |
| `useWidgetLogger()`                | `EndpointLogger`         | Logging inside widget                 |
| `useWidgetNavigation()`            | Navigation stack         | Push/pop route layers                 |
| `useWidgetData()`                  | Response data            | Read server response                  |
| `useWidgetTranslation()`           | `t()` function           | Scoped translations                   |

### Form state for search / filter / sort (never `useState`)

Request params (search, filter, sort, pagination) must live in form state - not `useState`. Add the field to `definition.ts` as a `requestField`, then read and write it via `form`:

```typescript
// definition.ts - declare the field
search: requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "get.fields.search.label",
  schema: z.string().optional(),
}),

// widget.tsx - read & write via form (never useState)
const form = useWidgetForm<typeof definition.GET>();
const search = form?.watch("search") ?? "";

<Input
  value={search}
  onChange={(e) => form?.setValue("search", e.target.value)}
/>
```

`useState` is only appropriate for pure UI state: open/closed dialogs, hover highlights, local loading flags.

### Filter / search refetch - framework handles it, never call refetch manually

When `autoSubmit: true` is configured (set in `page-client.tsx` or `hooks.ts` via `endpointOptions.read.formOptions`), the framework watches every form value change, debounces it, and triggers a refetch automatically. **You must not call `refetch()` after `form.setValue()`** - the value hasn't propagated to the query params yet and the refetch will fire with stale params.

```typescript
// ✅ Correct - just set the value, framework refetches
const handleStatusChange = (status: string) => {
  form.setValue("status", status);
};

// ❌ Wrong - refetch fires before form value reaches query params
const handleStatusChange = (status: string) => {
  form.setValue("status", status);
  endpointMutations?.read?.refetch?.(); // fires with OLD params
};
```

`refetch()` is only appropriate for a **manual refresh button** that re-runs the current query unchanged.

### All filtering must happen server-side (repository), never client-side

There are **no exceptions**. Every filter - search, status, `hidden`, `resolved`, category, ownership, display flags - must be a `requestField`, sent to the server, and applied in `repository.ts` before `LIMIT`/`OFFSET`.

Client-side filtering is always wrong because:

- It produces incorrect counts (you only have the current page)
- Pagination breaks (filtering a subset of already-paged results)
- Stats/badges are wrong (counts derived from the page, not the full dataset)
- It defeats caching (server cache key changes but data is stale)

```typescript
// ❌ Wrong - any .filter() on response data in a widget
const visible = tasks.filter((t) => !t.hidden);
const active = logs.filter((l) => !l.resolved);
const matching = items.filter((i) => i.name.includes(search));

// ❌ Wrong - filtering in repository AFTER pagination
let rows = await db.select().limit(50).offset(0);
if (search) rows = rows.filter((r) => r.name.includes(search));

// ✅ Correct - all conditions in DB before LIMIT/OFFSET
if (search) conditions.push(ilike(tasks.name, `%${search}%`));
if (!showHidden) conditions.push(eq(tasks.hidden, false));
const rows = await db
  .select()
  .where(and(...conditions))
  .limit(50)
  .offset(0);
```

If a count badge needs to show a number that differs from the current filter (e.g. "unresolved" badge while viewing all logs), add a separate count field to the response schema and compute it with a second DB query - never derive it from the returned rows.

### Rendering child fields

Use `withValue()` to attach response data to a field before passing it to a display widget:

```typescript
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";

<AlertWidget
  fieldName="success"
  field={withValue(children.success, field.value?.success, null)}
/>
```

Render request fields directly (form state is managed by context):

```typescript
<TextFieldWidget fieldName="name" field={children.name} />
<IconFieldWidget fieldName="icon" field={children.icon} />
<SelectFieldWidget fieldName="category" field={children.category} />
```

### Interactive elements

```typescript
// Submit button - reads text from i18n keys
<SubmitButtonWidget<typeof definition.POST>
  field={{
    text: "post.submitButton.text",
    loadingText: "post.submitButton.loadingText",
    icon: "plus",
    variant: "primary",
  }}
/>

// Back / navigate up the stack
<NavigateButtonWidget field={{ icon: "arrow-left", variant: "outline" }} />

// Form-level error display
<FormAlertWidget field={{}} />
```

### Complete simple widget example

```typescript
// widget.tsx
"use client";

import { Div } from "next-vibe-ui/ui/div";
import { type JSX } from "react";

import { withValue } from "@/app/api/.../widgets/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetUser,
} from "@/app/api/.../widgets/_shared/use-widget-context";
import { AlertWidget } from "@/app/api/.../widgets/display-only/alert/react";
import { TextFieldWidget } from "@/app/api/.../widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/.../widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/.../widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { MyResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: MyResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function MyCustomWidget({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />
      <AlertWidget
        fieldName="success"
        field={withValue(children.success, field.value?.success, null)}
      />
      <TextFieldWidget fieldName="name" field={children.name} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.submit", loadingText: "post.submitting" }}
      />
    </Div>
  );
}
```

## Dialog Wrapper Pattern

When an endpoint's UI should appear as a dialog (launched from another widget), wrap `EndpointsPage` in a dialog shell. This is the correct pattern for reusing another endpoint's UI - you embed the whole endpoint, not individual components.

```typescript
// threads/[threadId]/permissions/widget.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "next-vibe-ui/ui/dialog";
import type { JSX } from "react";
import { useCallback, useMemo } from "react";

import threadPermissionsDefinitions from "./definition";
import { scopedTranslation } from "./i18n";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { EndpointLogger } from "@/app/api/.../shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/.../user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface ThreadPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threadId: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}

export function ThreadPermissionsDialog({
  open,
  onOpenChange,
  threadId,
  locale,
  user,
}: ThreadPermissionsDialogProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const handleSuccess = useCallback(() => onOpenChange(false), [onOpenChange]);

  const endpointOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { threadId },
        queryOptions: { enabled: open && !!threadId },
      },
      update: {
        urlPathParams: { threadId },
        mutationOptions: { onSuccess: handleSuccess },
      },
    }),
    [threadId, open, handleSuccess],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
        </DialogHeader>
        <EndpointsPage
          endpoint={threadPermissionsDefinitions}
          locale={locale}
          user={user}
          endpointOptions={endpointOptions}
        />
      </DialogContent>
    </Dialog>
  );
}
```

This dialog widget lives at `permissions/widget.tsx`. It is designed to be **imported and mounted** by the parent threads list widget (`threads/widget/widget.tsx`). This is correct - a parent widget that manages a list can import dialog wrappers from its child route endpoints.

## Navigation Stack Pattern

For navigation between endpoints (push instead of modal), use `useWidgetNavigation`:

```typescript
const navigation = useWidgetNavigation();

// Push a new endpoint onto the stack (renders in-place or as modal)
navigation.push({
  endpoint: someOtherDefinition,
  urlPathParams: { id: itemId },
  renderInModal: false,
});

// Pop current layer (go back)
navigation.pop();
```

## What a Widget Must NOT Do

```typescript
// ❌ Import UI components from a sibling endpoint's widget
import { ModelSelector } from "../../models/widget/model-selector";

// ❌ Import hooks from a sibling endpoint's widget
import { useSidebarFolders } from "../../folders/widget/widget";

// ❌ Reconstruct another endpoint's form logic
import { ThreadListItem } from "../threads/widget/thread-item"; // NO

// ❌ Use fetch() or axios directly inside a widget
const data = await fetch("/api/...");

// ❌ Accept user, locale, logger as props from outside
export function MyWidget({
  user,
  locale,
}: {
  user: JwtPayloadType;
  locale: CountryLanguage;
}) {
  // ← wrong: use useWidgetUser() and useWidgetLocale() instead
}
```

## Shared UI Components - Canonical Owner Pattern

When a UI component is reused across multiple endpoints, it lives in the widget of the endpoint that **conceptually owns** it. Other endpoints import from the owner.

Rules:

1. The component lives in the endpoint widget that **conceptually owns** it
2. Imports flow **inward only** - owner never imports from its consumers
3. The owner widget does NOT depend on any widget that imports it (no circular deps)

```
// ✅ skills/widget imports from models/widget - models owns ModelSelector
import { ModelSelector } from "@/app/api/[locale]/agent/models/widget/model-selector";

// ✅ messages/widget imports from threads/widget/chat-input - threads owns chat input
import { Selector } from "@/app/api/[locale]/agent/chat/threads/widget/chat-input/selector";

// ❌ models/widget imports from skills/widget - that reverses ownership
import { SkillCard } from "@/app/api/[locale]/agent/chat/skills/widget"; // WRONG
```

For truly generic, domain-agnostic components (buttons, inputs, icons, layout primitives), use `src/packages/next-vibe-ui/`.

## Definition-Driven Rendering (no widget needed)

Many endpoints don't need a custom widget at all. If the auto-rendered form is sufficient, omit `customWidgetObject` entirely and use flat field definitions. `EndpointRenderer` handles all layout:

```typescript
// definition.ts - no widget needed
const { GET } = createEndpoint({
  scopedTranslation,
  fields: {
    name: requestField(scopedTranslation, {
      schema: z.string(),
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "get.name.label" as const,
      order: 0,
      columns: 6,
    }),
    result: responseField(scopedTranslation, {
      schema: z.string(),
      type: WidgetType.TEXT,
      content: "get.result.content" as const,
    }),
  },
});
// No widget.tsx needed - EndpointsPage renders this automatically
```

Use a custom widget only when:

- You need custom layout (sidebar, split-pane, complex grid)
- You need inline conditionals that field metadata can't express
- You need custom interactive elements (drag-and-drop, rich editor, inline preview)
- The auto-rendered form doesn't match the design

## Violations

### Rule: Never use `_components/` under `src/app/api/[locale]/`

All UI sub-components for an endpoint must live inside `widget/` (or `widget.tsx`). The `_components/` folder name is **not allowed** under `src/app/api/[locale]/`.

If you encounter a `_components/` folder: move its files to `widget/`, update all import sites, and delete the empty folder.

### Rule: Page/layout components do NOT live in `widget/`

`widget/` is only for components registered in `definition.ts` via `customWidgetObject`. A component that accepts `locale`, `user`, or other server-side props as external props and is imported from a `page.tsx` or `layout.tsx` is a **page component**, not a widget. It belongs in `src/app/[locale]/<feature>/_components/`.

**Signs a file is in the wrong place:**

- Lives under `src/app/api/[locale]/.../widget/` but accepts `locale: CountryLanguage` or `user: JwtPayloadType` as props
- Is imported from `src/app/[locale]/` (pages/layouts), not from a definition or another widget
- Has no corresponding `customWidgetObject` entry in any `definition.ts`

**Fix:** Move the file to `src/app/[locale]/<feature>/_components/`, update all imports, delete the empty `widget/` folder.

### Rule: Widget i18n is private to the widget

If a `widget/` folder contains an `i18n/` subfolder, those translations are **private** to that widget. No other file - including the endpoint's own `i18n/en/index.ts` - may import from `widget/i18n/`. Endpoint i18n lives in `i18n/` (sibling to `definition.ts`). Widget i18n lives in `widget/i18n/`. They do not cross.

If the widget is removed, its `widget/i18n/` goes with it. Any dependent imports break immediately and must be fixed.

### Rule: Never import from a sibling or parent endpoint's `widget/`

Widgets must be self-contained. No cross-endpoint widget imports unless the importing widget is a **parent** using a **child dialog** that wraps `EndpointsPage`.

Acceptable: `threads/widget/widget.tsx` imports `permissions/widget.tsx` (child dialog wrapping `EndpointsPage`).

Not acceptable: importing bare components or hooks from a sibling endpoint's `widget/` folder.

### Rule: No cross-domain Zustand store imports

A widget (or any hook it calls) must **never** import a Zustand store from a different endpoint domain. Cross-domain state access is only allowed via:

1. **`apiClient.updateEndpointData`** - write to another domain's endpoint cache (optimistic updates, streaming signals, etc.)
2. **`apiClient.getCachedData`** - read from another domain's endpoint cache (rare, prefer `useEndpoint`)
3. **`useEndpoint(definition, ...)`** - self-contained fetch + subscribe to another endpoint's data (e.g. loading folder list inside threads widget without importing from folders widget)

```typescript
// ❌ Cross-domain store import - forbidden
import { useAIStreamStore } from "../../ai-stream/stream/hooks/store";
import { useSidebarFolders } from "../../folders/widget/widget";

// ✅ Correct: read streaming state from the endpoint cache (field.value)
const isStreaming = thread.isStreaming; // comes from ThreadListResponseOutput

// ✅ Correct: fetch folders data self-contained
const foldersEndpoint = useEndpoint(
  foldersDefinition,
  { read: { initialState: { rootFolderId } } },
  logger,
  user,
);
const folders = foldersEndpoint.read?.response?.data?.folders ?? [];

// ✅ Correct: write streaming state to threads cache from another domain
apiClient.updateEndpointData(
  threadsDefinition.GET,
  logger,
  (old) => {
    if (!old?.success) return old;
    return success({
      ...old.data,
      threads: old.data.threads.map((t) =>
        t.id === threadId ? { ...t, isStreaming: true } : t,
      ),
    });
  },
  undefined,
);
```

Shared neutral stores (e.g. `useChatStore`, `useChatNavigationStore`) that are owned by neither domain but serve as a coordination layer are **not** cross-domain imports - they are explicitly shared infrastructure.
