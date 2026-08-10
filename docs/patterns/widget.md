# Widget Pattern

Comprehensive guide to the `widget.tsx` / `widget/` folder pattern for custom UI in endpoint definitions.

---

## Overview

**Every endpoint gets a widget. No exceptions.**

The auto-rendered form does not exist as a valid option. Every endpoint — regardless of complexity, audience, or number of fields — gets a `widget.tsx`. This is not negotiable and has no exceptions.

---

## Layout Components

**Use these. No ad-hoc div/span/card soup.**

Every widget is built from shared layout components in `next-vibe-ui`. They work across all 3 render contexts (fullscreen admin, ~500px chat toolbox, ~260px help sidebar) and all 3 platforms (web, CLI, native). Import via `import { X } from "next-vibe-ui/components/X"`.

### Available Components

| Component       | Import                                   | Purpose                                                         |
| --------------- | ---------------------------------------- | --------------------------------------------------------------- |
| `WidgetShell`   | `next-vibe-ui/components/widget-shell`   | Outermost wrapper. Sets `@container` for responsive queries.    |
| `WidgetHeader`  | `next-vibe-ui/components/widget-header`  | Title bar with back button slot + action buttons.               |
| `MetricCard`    | `next-vibe-ui/components/metric-card`    | Single stat/KPI: label, value, optional icon/trend/variant.     |
| `MetricGrid`    | `next-vibe-ui/components/metric-grid`    | Responsive grid for MetricCards. Auto-adapts columns.           |
| `StatusPill`    | `next-vibe-ui/components/status-pill`    | Colored status indicator. Replaces inline `rounded-full` pills. |
| `DetailGrid`    | `next-vibe-ui/components/detail-grid`    | Grid of label-value pairs. Also exports `DetailField`.          |
| `ListItem`      | `next-vibe-ui/components/list-item`      | Standardized list row with avatar, title, badges, actions.      |
| `SectionGroup`  | `next-vibe-ui/components/section-group`  | Titled card section, optionally collapsible.                    |
| `EmptyBlock`    | `next-vibe-ui/components/empty-block`    | Empty state with icon, title, message, CTA button.              |
| `LoadingBlock`  | `next-vibe-ui/components/loading-block`  | Centered loading spinner with optional message.                 |
| `ProgressBlock` | `next-vibe-ui/components/progress-block` | Progress bar with label and percentage.                         |

### Dashboard Example

```tsx
import { EmptyBlock } from "next-vibe-ui/components/empty-block";
import { LoadingBlock } from "next-vibe-ui/components/loading-block";
import { MetricCard } from "next-vibe-ui/components/metric-card";
import { MetricGrid } from "next-vibe-ui/components/metric-grid";
import { WidgetShell } from "next-vibe-ui/components/widget-shell";

export function DashboardWidget({ field }: WidgetProps): JSX.Element {
  const data = useWidgetValue(field);
  const t = useWidgetTranslation(field);

  if (!data) return <LoadingBlock message={t("loading")} />;

  return (
    <WidgetShell>
      <MetricGrid columns={4}>
        <MetricCard
          label={t("active")}
          value={data.activeCount}
          variant="success"
        />
        <MetricCard label={t("new")} value={data.newCount} />
        <MetricCard
          label={t("running")}
          value={data.runningCount}
          variant="info"
        />
        <MetricCard
          label={t("converted")}
          value={data.convertedCount}
          variant="warning"
        />
      </MetricGrid>
    </WidgetShell>
  );
}
```

### List Example

```tsx
import { EmptyBlock } from "next-vibe-ui/components/empty-block";
import { ListItem } from "next-vibe-ui/components/list-item";
import { StatusPill } from "next-vibe-ui/components/status-pill";
import { WidgetShell } from "next-vibe-ui/components/widget-shell";
import { WidgetHeader } from "next-vibe-ui/components/widget-header";

export function OrderListWidget({ field }: WidgetProps): JSX.Element {
  const data = useWidgetValue(field);

  return (
    <WidgetShell>
      <WidgetHeader title={t("orders")} actions={<CreateButton />} />
      {data.items.length === 0 ? (
        <EmptyBlock title={t("noOrders")} message={t("createFirst")} />
      ) : (
        data.items.map((order) => (
          <ListItem
            key={order.id}
            title={order.name}
            subtitle={order.customer}
            badges={
              <StatusPill
                status={order.status}
                variant={statusVariant(order.status)}
              />
            }
            onClick={() => nav.push(order.id)}
          />
        ))
      )}
    </WidgetShell>
  );
}
```

### Detail Example

```tsx
import { DetailField, DetailGrid } from "next-vibe-ui/components/detail-grid";
import { SectionGroup } from "next-vibe-ui/components/section-group";
import { WidgetShell } from "next-vibe-ui/components/widget-shell";

export function OrderDetailWidget({ field }: WidgetProps): JSX.Element {
  return (
    <WidgetShell>
      <SectionGroup title={t("orderInfo")}>
        <DetailGrid columns={2}>
          <DetailField label={t("id")} value={data.id} mono copyable />
          <DetailField
            label={t("status")}
            value={<StatusPill status={data.status} />}
          />
          <DetailField label={t("total")} value={formatCurrency(data.total)} />
          <DetailField
            label={t("created")}
            value={formatDate(data.createdAt)}
          />
        </DetailGrid>
      </SectionGroup>
    </WidgetShell>
  );
}
```

### Responsive Behavior

`WidgetShell` sets `@container` on its outer div. Child components use `@container` queries:

- **`@lg` (>= ~900px)**: Fullscreen admin — `MetricGrid` shows 4 columns, `DetailGrid` shows 3 columns
- **`@sm` (>= ~500px)**: Chat toolbox — 2 columns
- **Below `@sm`**: Sidebar — single column, compact spacing

No info is hidden at smaller sizes — only reflowed.

### Anti-patterns

```tsx
// NEVER: ad-hoc stat card
function StatCard({ label, value }) {
  return (
    <Div className="flex flex-col gap-1 rounded-lg border bg-card px-5 py-4">
      <Span className="text-2xl font-bold">{value}</Span>
      <Span className="text-xs text-muted-foreground">{label}</Span>
    </Div>
  );
}

// ALWAYS: use MetricCard
<MetricCard label={label} value={value} />;
```

```tsx
// NEVER: inline status pill
<Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
  {status}
</Span>

// ALWAYS: use StatusPill
<StatusPill status={status} variant="success" />
```

```tsx
// NEVER: ad-hoc loading spinner
<Div className="h-64 flex items-center justify-center">
  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
</Div>

// ALWAYS: use LoadingBlock
<LoadingBlock size="lg" />
```

---

## File Structure

### Single-file widget

```
next-vibe/agent/chat/skills/create/
├── definition.ts
├── repository.ts
├── route.ts
├── i18n/
└── widget.tsx
```

### Widget folder (complex)

```
next-vibe/agent/chat/threads/
├── definition.ts
├── repository.ts
├── route.ts
├── i18n/
└── widget/
    ├── widget.tsx          ← main entry, exported name matches definition
    ├── chat-input/
    └── ...
```

Everything inside `widget/` is private to that endpoint.

---

## Fundamental Rules

1. **Scoped to deepest route** — widget lives next to the `definition.ts` it renders.
2. **Self-contained** — owns all sub-components. Never imports UI from sibling endpoint widgets.
3. **No reconstruction** — never recreate another endpoint's form logic. Use navigation stack or `EndpointsPage` to embed/launch it.
4. **Definition is the contract** — data comes through `field.children` from `customWidgetObject`. No raw API calls.
5. **Context hooks, never props** — use `useWidget*` hooks for locale, user, form, navigation. Never accept these as props.
6. **No local state for request params** — filters, search, sort, pagination all live as `requestField` in definition, read/written via `form.watch()` / `form.setValue()`. `useState` is only for pure UI state (dialogs open/closed, hover, local spinners).
7. **All filtering server-side** — no `.filter()` on response data in widgets. Apply every condition in the repository before `LIMIT`/`OFFSET`.
8. **Zero `useEffect`** — the framework handles data loading, navigation, and form prefill. The only exception: seeding editable form fields from `prefillFromGet` GET response data, or from a picker session cache, when both arrive asynchronously after mount (see Entity Picker Pattern).

---

## Data Loading — How It Really Works

**The framework handles GET endpoint submissions automatically.** When a widget is mounted, the framework submits the GET request. You do NOT need any `useEffect` to load data.

```typescript
// ✅ Correct — data arrives automatically from the framework
export function InvoiceListWidget(_props: { field: ... }): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  // data is null on first render, then populated — no useEffect needed
  ...
}
```

```typescript
// ❌ Wrong — manual refetch pattern, never do this
const readMutations = endpointMutations?.read;
const readMutationsRef = useRef(readMutations);
readMutationsRef.current = readMutations;
useEffect(() => {
  if (readMutationsRef.current && !data) {
    void readMutationsRef.current.refetch();
  }
}, []);
```

`refetch()` is only for a **manual user-triggered refresh button** — nothing else.

**For cross-endpoint data** (reading another endpoint's cached response in your widget), use `useWidgetSelector`:

```typescript
import { useWidgetSelector } from "...use-widget-context";

// Read favorites data from cache in a widget that doesn't own it
const favoritesData = useWidgetSelector<typeof definition.GET>()(
  (d) => d?.favorites,
);
```

**Dashboard `autoSubmit`:** Dashboards set `autoSubmit: true, debounceMs: 0` in definition options so they submit immediately on mount. This is for dashboards only.

```typescript
// definition.ts — dashboard auto-submit
options: {
  formOptions: {
    autoSubmit: true,
    debounceMs: 0,
  },
},
```

---

## Dashboard Pattern

Every domain needs a dashboard endpoint as its `defaultEntry`. A dashboard:

1. **Auto-loads on mount** — via `autoSubmit: true, debounceMs: 0` in definition options.
2. **Has optional context filters** — e.g. `companyId` is optional (`z.string().uuid().optional()`). Returns aggregate data across all accessible entities when not set.
3. **Shows KPI cards** — counts and totals meaningful to the domain.
4. **Has quick action buttons** — "New Invoice", "All Invoices", "New Estimate" etc. navigating via `navigation.push()`.
5. **Shows a recent items list** — last 5–10 items with status badges, click to navigate to detail.
6. **Has a clear empty state** — when no data yet, guides the user to create their first item.

---

## Back Button — Always Present

**Every non-dashboard widget must show a back button when there is something in the navigation stack.**

Use `canGoBack` from the navigation hook directly:

```typescript
const { push: navigate, pop, canGoBack } = useWidgetNavigation();

return (
  <Div className="flex flex-col gap-4">
    {canGoBack && (
      <Button type="button" variant="ghost" size="sm" onClick={() => pop()} className="self-start gap-1.5 -ml-1">
        <ChevronLeft className="h-4 w-4" />
        {t("widget.back")}
      </Button>
    )}
    {/* rest of widget */}
  </Div>
);
```

Add `widget.back` i18n key to all three locales (en: "Back", de: "Zurück", pl: "Wróć").

**This applies to:** detail views, edit forms, action endpoints (void, send, record-payment), any endpoint that is navigated to rather than opened directly.

---

## Cross-Endpoint Navigation Patterns

**The framework handles all post-success navigation. Never use `useEffect` for navigation.**

The `navigate()` options control what happens after a successful submission:

- `popNavigationOnSuccess: N` — pops N levels from the stack after success
- `replaceOnSuccess` — after success the framework replaces the current stack entry with a new endpoint (used for create → detail)
- `prefillFromGet: true` + `getEndpoint` — prefills the form from a GET endpoint's cached data before rendering

### List → Detail

```typescript
const handleView =
  (id: string) =>
  (e: ButtonMouseEvent): void => {
    e.stopPropagation(); // prevent row click bubbling when button is inside a clickable row
    void (async () => {
      const def = await import("../[invoiceId]/get/definition");
      navigate(def.default.GET, { urlPathParams: { invoiceId: id } });
    })();
  };
```

Always use dynamic import for cross-endpoint navigation to avoid circular dependencies.

### Create → navigate to new entity detail (`replaceOnSuccess`)

Set `replaceOnSuccess` in the caller (list or dashboard widget). The framework calls `getUrlPathParams(responseData)` with the POST response to build the new URL:

```typescript
// In list/dashboard widget — open create form, auto-navigate to detail on success
navigate(invoiceCreateDefinitions.POST, {
  renderInModal: true,
  replaceOnSuccess: {
    endpoint: invoiceGetDefinitions.GET,
    getUrlPathParams: (responseData) => ({
      invoiceId: responseData.invoice.id,
    }),
  },
});
```

The create widget itself is then just a plain form — no navigation logic:

```typescript
// create/widget.tsx — no useEffect, no navigation
export function InvoiceCreateWidget(_props: { field: ... }): JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
```

### Action → pop back (`popNavigationOnSuccess`)

For actions that should auto-pop on success (send, void, record-payment), set `popNavigationOnSuccess` in the caller's navigate call:

```typescript
// In detail widget — launch action, framework auto-pops on success
navigate(voidDefinitions.POST, {
  urlPathParams: { invoiceId: data.id },
  renderInModal: true,
  popNavigationOnSuccess: 1,
});
```

The action widget is then just a plain form — no navigation logic.

### Edit form with prefill from GET (`prefillFromGet`)

To open an edit form pre-filled with data from a GET endpoint:

```typescript
void (async () => {
  const patchDef = await import("../update/definition");
  navigate(patchDef.default.PATCH, {
    urlPathParams: { invoiceId: data.id },
    prefillFromGet: true,
    getEndpoint: patchDef.default.GET,
    popNavigationOnSuccess: 1,
  });
})();
```

The framework fetches the GET endpoint and populates the form fields automatically. No `useEffect` in the edit widget.

### Cross-domain navigation

When a flow crosses domain boundaries (e.g. invoice detail → journal entry), always use dynamic import:

```typescript
const handleViewJournal = (e: ButtonMouseEvent): void => {
  e.stopPropagation();
  void (async () => {
    const def =
      await import("@/chart-of-accounts/journal/[entryId]/get/definition");
    navigate(def.default.GET, {
      urlPathParams: { entryId: data.journalEntryId },
    });
  })();
};
```

### When caller and target are in different domains (parallel import)

```typescript
void (async () => {
  const [createDef, getDef] = await Promise.all([
    import("@/purchasing/order/create/definition"),
    import("@/purchasing/order/[poId]/get/definition"),
  ]);
  navigate(createDef.default.POST, {
    renderInModal: true,
    replaceOnSuccess: {
      endpoint: getDef.default.GET,
      getUrlPathParams: (responseData) => ({ poId: responseData.result.id }),
    },
  });
})();
```

---

## Form Values — Always `shouldDirty: true`

When setting form values programmatically (e.g. after a picker selection or filter change), always pass `{ shouldDirty: true }`:

```typescript
form.setValue("companyId", selectedId, { shouldDirty: true });
form.setValue("status", newStatus, { shouldDirty: true });
```

This ensures the framework detects the change and re-submits (for `autoSubmit` endpoints) or marks the form as dirty.

### Filter / search refetch

`autoSubmit: true` in definition options — the framework debounces and refetches automatically when `form.setValue` is called with `shouldDirty: true`. Never call `refetch()` after `form.setValue()`.

```typescript
// ✅ Correct
form.setValue("status", status, { shouldDirty: true });

// ❌ Wrong — fires with stale params
form.setValue("status", status);
endpointMutations?.read?.refetch?.();
```

---

## Cache Updates — Always in definition.ts `onSuccess`

Optimistic/post-success cache updates live in `definition.ts` inside `mutationOptions.onSuccess`, **not in the widget**. This keeps the cache logic co-located with the endpoint definition and works regardless of which widget triggers the mutation.

```typescript
// definition.ts
import { apiClient } from "next-vibe/unified-ui/hooks/store";

options: {
  mutationOptions: {
    onSuccess: async (data) => {
      const skillsDefinition = await import("../definition");
      apiClient.updateEndpointData(
        skillsDefinition.default.GET,
        data.logger,
        (oldData) => {
          if (!oldData?.success) return oldData;
          return {
            success: true,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((item) =>
                item.id === data.responseData.id ? { ...item, ...data.responseData } : item,
              ),
            },
          };
        },
      );
    },
  },
},
```

---

## WebSocket Events in definition.ts

For real-time cache sync, declare `events` in the definition:

```typescript
const { GET } = createEndpoint({
  // ...
  events: {
    "skill-updated": {
      fields: ["id", "name", "tagline", "icon"],
      operation: "merge",
    },
    "skill-deleted": {
      fields: { skills: ["id"] },
      operation: "remove",
    },
  },
});
```

---

## Entity Picker Pattern

### When to use

Use `ENTITY_PICKER` for any UUID field that requires selecting from a list:

- `companyId` — pick from user's companies
- `vendorId` — pick from vendor list
- `productId` — pick from product catalog
- `categoryId` — pick from chart of accounts categories
- Any update/action endpoint that takes an entity ID as a parameter

**Never** use `FieldDataType.TEXT` or `FieldDataType.UUID` for entity references that have a corresponding list endpoint. A raw UUID text input is unacceptable UX.

### Definition

```typescript
companyId: requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.ENTITY_PICKER,
  label: "companyId.label" as const,
  description: "companyId.description" as const,
  schema: z.string().uuid().optional(),
  listEndpoint: companiesListDefinitions.GET,
  labelField: "name",
  listAlias: "companies-list",
}),
```

### Picker mode in list widgets

When a list endpoint is opened in **picker mode**, detect it with `usePickerCallback`. Pass the **full entity snapshot** — not just `id` — so the caller's update widget can show a context header and pre-fill fields without an extra network round-trip.

```typescript
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import { setCachedEntity } from "../_shared/entity-picker-cache"; // see below

const onPick = usePickerCallback<{
  id: string;
  name: string;
  code: string;
  type: string;
  // ... all fields the update widget needs for context header + pre-fill
}>();
const isPickerMode = !!onPick;

// In handleView / row onClick:
const handleView = (id: string): void => {
  if (isPickerMode) {
    const item = (data?.items ?? []).find((i) => i.id === id);
    if (item && onPick) {
      const picked = {
        id: item.id,
        name: item.name,
        code: item.code,
        type: item.type,
      };
      setCachedEntity(picked); // write to session cache before calling onPick
      onPick(picked);
      navigation.pop();
    }
    return;
  }
  // normal mode: navigate to detail
  void (async (): Promise<void> => {
    const def = await import("../[id]/get/definition");
    navigation.push(def.default.GET, { urlPathParams: { id } });
  })();
};
```

In picker mode:

- No header bar with create buttons
- No pagination controls
- No "View" action buttons — the row click itself is the select
- Each row is a single click to select; call `onPick(fullData)` then `navigation.pop()`
- Compact, scannable layout

### Session cache for picker context

Create a small `_shared/entity-picker-cache.ts` module in the domain folder. The list widget writes to it; the update widget reads from it. This gives the update widget the full entity context without an extra GET request:

```typescript
// _shared/entity-picker-cache.ts
export interface CachedEntity {
  id: string;
  name: string;
  // ... domain-specific fields needed by update widget
}

const cache = new Map<string, CachedEntity>();

export function setCachedEntity(entity: CachedEntity): void {
  cache.set(entity.id, entity);
}

export function getCachedEntity(id: string): CachedEntity | undefined {
  return cache.get(id);
}
```

The cache is session-scoped (cleared on page reload). Stale context data is harmless — the PATCH only writes fields the user explicitly edits.

### Update widget: picker path vs prefillFromGet path

An update widget is reached via two paths:

1. **`prefillFromGet` path** — navigated from the detail widget with `prefillFromGet: true` + `getEndpoint`. Framework fetches the GET endpoint and `useWidgetValue()` returns the GET response before any PATCH fires.
2. **Picker path** — user opens the update widget directly, picks an entity via `EntityPickerFieldWidget`. The picker sets `accountId` in the form; the full context comes from the session cache.

Handle both paths in the update widget:

```typescript
// When prefillFromGet fires, rawData looks like the GET response shape
const getResponseData = rawData as
  (typeof getDefinition.GET)["types"]["ResponseOutput"] | null | undefined;
const prefillAccount = getResponseData?.result;

// When picker fires, the entity is in the session cache
const account = useMemo(() => {
  if (prefillAccount) return prefillAccount;
  if (accountId) return getCachedEntity(accountId) ?? null;
  return null;
}, [prefillAccount, accountId]);

// useEffect IS allowed in exactly two situations:
// 1. Seeding editable form fields from prefillFromGet data when it arrives
// 2. Seeding editable form fields from the picker cache when accountId is set
useEffect(() => {
  if (!prefillAccount || !form) return;
  if (prefillAccount.name) form.setValue("name", prefillAccount.name);
  if (prefillAccount.sortOrder != null)
    form.setValue("sortOrder", prefillAccount.sortOrder);
}, [prefillAccount, form]);

useEffect(() => {
  if (prefillAccount || !accountId || !form) return;
  const cached = getCachedEntity(accountId);
  if (!cached) return;
  if (cached.name) form.setValue("name", cached.name);
}, [prefillAccount, accountId, form]);
```

This is the **only legitimate use of `useEffect` in widgets**: seeding form values from an external data source that arrives asynchronously (prefillFromGet GET response) or from a session cache. All other `useEffect` usage is forbidden.

---

## Domain-Specific Cross-Endpoint Flows

Every business domain has a primary user journey. Each flow must be fully connected end-to-end.

### Payments (Invoices + Bills + Estimates)

```
Dashboard → Invoice List → Invoice Detail
                        ↓ [Draft]    → Send Invoice → back to Detail
                        ↓ [Draft]    → Add Line     → back to Detail
                        ↓ [Open]     → Record Payment → back to Detail
                        ↓ [Open]     → Send Reminder → back to Detail
                        ↓ [Open]     → Void (confirm) → back to Detail
                        ↓ [Paid]     → View Journal Entry (cross-domain)

Dashboard → Create Invoice → Invoice Detail (replace)

Dashboard → Estimate List → Estimate Detail
                          ↓ [Draft]  → Send → back to Detail
                          ↓          → Convert to Invoice → Invoice Detail (replace)

Dashboard → Bill List → Bill Detail
                      ↓ [Received] → Approve → back to Detail
                      ↓ [Approved] → Pay     → back to Detail
```

### Purchasing (Purchase Orders + Vendors)

```
Dashboard → PO List → PO Detail
                    ↓ [Draft]    → Confirm PO → back to Detail
                    ↓ [Confirmed]→ Receive PO → back to Detail
                    ↓ [Received] → Create Bill (cross-domain) → Bill Detail
                    ↓ [Any]      → Cancel (confirm) → back to Detail
                    ↓ [Any]      → View Vendor → Vendor Detail

Dashboard → Vendor List → Vendor Detail
                        ↓ → View POs for this vendor → PO List (pre-filtered)

Dashboard → Create PO (vendor picker) → PO Detail (replace)
```

### Accounting (Chart of Accounts + Journal)

```
Dashboard (requires company) → Journal Entry List → Entry Detail
                                                   ↓ → Edit/Post → back to Detail

Dashboard → Account List → Account Detail (ledger view)
                         ↓ → View transactions → Journal filtered by account

Dashboard → Balance Sheet (read-only report)
Dashboard → P&L Report (read-only report)
Dashboard → Receivables Aging → Invoice Detail (per row)
```

### Inventory

```
Dashboard → Stock List → Stock Detail (product + levels per warehouse)
                       ↓ → Receive Stock → back to Detail
                       ↓ → Adjust Stock  → back to Detail
                       ↓ → Issue Stock   → back to Detail

Dashboard → Warehouse List → Warehouse Detail
```

### POS (Point of Sale)

```
Dashboard → Open/Active Order → Order Detail
                              ↓ → Add Item (product picker) → back to Detail
                              ↓ → Add Payment → back to Detail
                              ↓ → Complete Order → back to Dashboard

Dashboard → Create New Order → Order Detail (replace)
Dashboard → Order History → Order Detail (read-only)
```

### CRM (Leads + Campaigns)

```
Dashboard → Lead List → Lead Detail
                      ↓ → Update Stage → back to Detail
                      ↓ → Assign → back to Detail

Dashboard → Campaign List → Campaign Detail
                          ↓ → Start Campaign → back to Detail
                          ↓ → View Queue     → Lead Detail (per item)
                          ↓ → View Stats     → (embedded in Detail)
```

### Subscriptions

```
Dashboard (admin) → Subscription List → Subscription Detail
                                      ↓ → Cancel (confirm) → back to Detail
                                      ↓ → Update Plan       → back to Detail

Dashboard (admin) → Stats / Referrals / Purchases (tabs or sub-nav)
                  → Payout Requests → Approve/Reject (confirm) → back
```

### Companies

```
Company List → Company Detail
             ↓ → Update Company → back to Detail
             ↓ → Members List  → Member Detail
                               ↓ → Invite Member → back to Members List
                               ↓ → Update Role   → back to Members List
                               ↓ → Remove Member (confirm) → back to Members List

Company List → Create Company → Company Detail (replace)
```

---

## List Widget Pattern

### Structure

```typescript
export function InvoiceListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  // Framework submits GET automatically — just read the value
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, canGoBack, pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();

  const items = data?.invoices;

  const handleNewInvoice = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(invoiceCreateDefinitions.POST, {
      renderInModal: true,
      replaceOnSuccess: {
        endpoint: invoiceGetDefinitions.GET,
        getUrlPathParams: (responseData) => ({
          invoiceId: responseData.invoice.id,
        }),
      },
    });
  };

  const handleView = (id: string) => (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async () => {
      const def = await import("../[invoiceId]/get/definition");
      navigate(def.default.GET, { urlPathParams: { invoiceId: id } });
    })();
  };

  return (
    <Div className="flex flex-col gap-4">
      {/* Back button */}
      {canGoBack && (
        <Button variant="ghost" size="sm" onClick={() => pop()} className="self-start gap-1.5 -ml-1">
          <ChevronLeft className="h-4 w-4" />
          {t("widget.back")}
        </Button>
      )}

      {/* Header: title + count + primary action */}
      <Div className="flex items-center justify-between">
        <H3>{t("widget.title")} {data && <Span>({data.total})</Span>}</H3>
        <Button onClick={handleNewInvoice}>{t("widget.new")}</Button>
      </Div>

      {/* Loading */}
      {!data && <LoadingState />}

      {/* Empty */}
      {data && items?.length === 0 && <EmptyState onCreateClick={handleNewInvoice} />}

      {/* List */}
      {items && items.length > 0 && (
        <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onView={handleView(item.id)} locale={locale} />
          ))}
        </Div>
      )}
    </Div>
  );
}
```

**Key points:**

- No `useEffect` anywhere — framework handles the GET submission.
- `data` is `null` initially (loading) then populated.
- Navigation uses `replaceOnSuccess` for create → detail flows.
- Dynamic import for cross-endpoint links.

### Empty state

The most important state — it's what new users see first. Must answer: why is this empty, and what do I do?

Structure: domain icon (not a generic box) → direct statement ("No invoices yet") → one sentence of context → one CTA button.

```typescript
<Div className="py-14 text-center border border-dashed rounded-md flex flex-col items-center gap-4">
  <FileX className="h-8 w-8 text-muted-foreground" />
  <Div className="flex flex-col gap-1">
    <P className="text-sm font-medium">{t("widget.empty.title")}</P>
    <P className="text-xs text-muted-foreground">{t("widget.empty.hint")}</P>
  </Div>
  <Button size="sm" onClick={handleCreate}>{t("widget.empty.cta")}</Button>
</Div>
```

Never: "No data available." Never: empty state with no action when an action is possible.

### Loading state

User must know something is happening. Include a context message — not just a spinner.

```typescript
{!data && (
  <Div className="flex items-center justify-center py-12 text-muted-foreground">
    <Loader2 className="h-5 w-5 animate-spin mr-2" />
    <Span className="text-sm">{t("widget.loading")}</Span>
  </Div>
)}
```

### List quality

- Each row answers: **what** is this, **what state** is it in, **what can I do** — in that order
- Status badge on every entity that has status. Color-coded, consistent across the domain
- Primary action (usually "view") is obvious without hunting
- Total count visible: "Showing 1–20 of 143" beats page numbers alone
- Sorting/filtering as server-side request fields — user's filter state survives navigation

---

## Detail Widget Pattern

```typescript
export function InvoiceDetailWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();

  // Loading/empty state — show form so user can enter ID if needed
  if (!data?.id) {
    return (
      <Div className="flex flex-col gap-4">
        {canGoBack && <BackButton onBack={pop} label={t("widget.back")} />}
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget field={{}} />
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-6">
      {/* Back button */}
      {canGoBack && <BackButton onBack={pop} label={t("widget.back")} />}

      {/* Entity header: title, status badge, key metadata */}
      <EntityHeader data={data} t={t} locale={locale} />

      {/* Body: main content (line items, fields, etc.) */}
      <EntityBody data={data} t={t} locale={locale} />

      {/* Action buttons: context-sensitive by status */}
      <ActionBar data={data} navigate={navigate} t={t} />
    </Div>
  );
}
```

### Detail quality

- Header: entity name/number, status badge, key metadata — visible immediately, no scrolling
- Body: grouped logically, related data together
- Cross-domain links present where relevant (invoice → journal entry, PO → bill) — user never hunts manually

### Action buttons by state

Never show all actions at once. Show only what's valid for the current entity state:

```typescript
<Div className="flex flex-wrap gap-2 pt-2 border-t">
  {data.status === "DRAFT" && (
    <>
      <Button onClick={() => navigate(sendDef.POST, { urlPathParams: { invoiceId: data.id }, popNavigationOnSuccess: 1 })}>{t("widget.send")}</Button>
      <Button variant="outline" onClick={handleAddLine}>{t("widget.addLine")}</Button>
    </>
  )}
  {data.status === "OPEN" && (
    <>
      <Button onClick={() => navigate(payDef.POST, { urlPathParams: { invoiceId: data.id }, popNavigationOnSuccess: 1 })}>{t("widget.recordPayment")}</Button>
      <Button variant="outline" onClick={() => navigate(reminderDef.POST, { urlPathParams: { invoiceId: data.id }, popNavigationOnSuccess: 1 })}>{t("widget.sendReminder")}</Button>
      <Button variant="outline" onClick={handleVoidClick} className="text-destructive">{t("widget.void")}</Button>
    </>
  )}
  {data.status === "PAID" && data.journalEntryId && (
    <Button variant="outline" onClick={handleViewJournal}>{t("widget.viewJournalEntry")}</Button>
  )}
</Div>
```

---

## Destructive Actions — Always Confirm

Any action that cannot be undone (void, cancel, delete, remove member, reject payout) must use `AlertDialog` for two-step confirmation:

```typescript
const [pendingVoid, setPendingVoid] = useState(false);

const handleVoidClick = (e: ButtonMouseEvent) => {
  e.stopPropagation();
  setPendingVoid(true);
};

const handleConfirmVoid = () => {
  setPendingVoid(false);
  navigate(voidDefinitions.POST, {
    urlPathParams: { invoiceId: data.id },
    popNavigationOnSuccess: 1,
  });
};

<AlertDialog open={pendingVoid} onOpenChange={setPendingVoid}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{t("widget.void.confirm.title")}</AlertDialogTitle>
      <AlertDialogDescription>{t("widget.void.confirm.description")}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>{t("widget.void.confirm.cancel")}</AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirmVoid}>{t("widget.void.confirm.proceed")}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Currency and Date Formatting

Always use locale-aware formatting — never hardcode `"en-US"` or any locale string:

```typescript
const locale = useWidgetLocale();

// Currency
new Intl.NumberFormat(locale, {
  style: "currency",
  currency: data.currency,
}).format(amount);

// Date
new Date(data.createdAt).toLocaleDateString(locale);
new Date(data.createdAt).toLocaleString(locale);
```

---

## Enum Values Are i18n Keys

**This is not obvious and will burn you.** Enums created with `createEnumOptions` store the translation key as the value — not "OWNER" or "b2c", but `"enums.companyMemberRole.owner"`.

```typescript
// enum.ts
export const { enum: CompanyType } = createEnumOptions(scopedTranslation, {
  B2B: "enums.companyType.b2b", // CompanyType.B2B === "enums.companyType.b2b"
  B2C: "enums.companyType.b2c",
});
```

So when the API returns `company.type`, its value is `"enums.companyType.b2c"` — the translation key itself.

**Never do this:**

```typescript
// WRONG — hardcoded strings that will never match
const TYPE_COLOR = { B2B: "...", b2b: "...", B2C: "..." };
t("get.widget.typeB2B"); // never do a separate label map
```

**Always do this:**

```typescript
import { CompanyType } from "../enum";
import { scopedTranslation as domainScopedTranslation } from "../i18n";

// Color map: keyed by the VALUE type — never Record<string, string>
const TYPE_COLOR: Record<typeof CompanyTypeValue, string> = {
  [CompanyType.B2B]: "bg-blue-100 text-blue-800 ...",
  [CompanyType.B2C]: "bg-emerald-100 ...",
};

// In component: get locale + domain translation function
const locale = useWidgetLocale();
const { t: tDomain } = domainScopedTranslation.scopedT(locale);

// Translate: company.type IS the i18n key, pass it directly
<Badge colorClass={TYPE_COLOR[company.type]}>{tDomain(company.type)}</Badge>
```

The domain `scopedTranslation` lives in the category's `i18n/` folder (e.g. `companies/i18n`). Import it directly — never re-export enum translations into endpoint-scoped i18n.

---

## Connecting Widget to Definition

```typescript
// definition.ts
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";

const InvoiceListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InvoiceListWidget })),
);

const { GET } = createEndpoint({
  fields: customWidgetObject({
    render: InvoiceListWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // field definitions...
    },
  }),
});
```

---

## Context Hooks

```typescript
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetUser,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetValue,
  useWidgetTranslation,
  useWidgetEndpointMutations,
  useWidgetPlatform,
  useWidgetSelector,
} from "next-vibe/unified-ui/_shared/use-widget-context";

import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
```

| Hook                                     | Returns                                    | Use for                                          |
| ---------------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| `useWidgetForm<typeof def.GET>()`        | React Hook Form                            | Read/write form values                           |
| `useWidgetLocale()`                      | `CountryLanguage`                          | Locale-aware formatting — never hardcode         |
| `useWidgetUser()`                        | `JwtPayloadType`                           | User identity                                    |
| `useWidgetLogger()`                      | `EndpointLogger`                           | Logging                                          |
| `useWidgetNavigation()`                  | `{ push, pop, stack, canGoBack, current }` | Navigation — push/pop/check stack                |
| `useWidgetValue<typeof def.GET>()`       | Response data                              | Read this endpoint's response                    |
| `useWidgetSelector<typeof def.GET>()`    | Selector fn                                | Read another endpoint's cached data              |
| `useWidgetTranslation<typeof def.GET>()` | `t()`                                      | Scoped i18n                                      |
| `useWidgetEndpointMutations()`           | Mutations                                  | `read.refetch()` for manual refresh buttons only |
| `useWidgetPlatform()`                    | `Platform` enum                            | Platform branching                               |
| `usePickerCallback<T>()`                 | `((value: T) => void) \| undefined`        | Detect picker mode in list widgets               |

**`useWidgetNavigation()` return:**

```typescript
{
  push: (endpoint, options) => void;  // navigate to a new endpoint
  pop: (count?: number) => void;      // go back
  stack: NavigationStackEntry[];      // full stack
  canGoBack: boolean;                 // true when stack.length > 0
  current: NavigationStackEntry | null; // top of stack
}
```

**`useWidgetEndpointMutations()`** returns `{ read, write }`. Only `read.refetch()` is legitimate in widgets, and only for an explicit manual refresh button the user clicks. Never call it automatically.

**`usePickerCallback<T>()`** returns the selection callback when a list widget is opened in picker mode (via entity picker field). Returns `undefined` in normal mode. Call it when the user selects an item, then `pop()` to close.

---

## Multi-Platform Design

Every widget handles web, CLI, MCP, AI tool, and native in a **single `widget.tsx`**. All platform differences live inside `next-vibe-ui` components — never branch on platform inside widget code itself.

```typescript
// ✅ Correct — platform handled inside next-vibe-ui, widget code is agnostic
<Form form={form}><Input name="title" /></Form>

// ❌ Wrong — platform branch in widget code
if (isCli) { return <CliForm /> } else { return <WebForm /> }
```

Platform behavior contract:

- **Web:** HTML/Tailwind, rich layout, hover states, modals, animations.
- **CLI interactive:** Ink components, sequential Tab focus (one cursor at a time), all details expanded inline, no collapsibles.
- **CLI non-interactive / response-only:** Compact text output, no form fields, focused on the response.
- **MCP/AI:** Clean formatted text, one meaningful line per item, no decorative output, context-efficient.

`useWidgetPlatform()` and `useWidgetResponseOnly()` are available for the rare case where a response display (not a form) must differ across platforms:</p>

```typescript
const responseOnly = useWidgetResponseOnly();
if (responseOnly) { return <CompactResultView /> }
return <FullFormView />;
```

---

## Shared UI — Canonical Owner Pattern

When a component is reused across endpoints, it lives in the widget of the **conceptually owning** endpoint. Imports flow inward only.

```typescript
// ✅ payment/invoice/list/widget imports InvoiceRow from itself (owner)
// ✅ payment/dashboard/widget imports from invoice/list/widget if invoice is the owner
// ❌ invoice/list/widget imports from dashboard/widget (reverses ownership)
```

For truly generic components (buttons, inputs, icons): `src/packages/next-vibe-ui/`.

---

## Dialog Wrapper Pattern

To embed another endpoint's UI as a dialog, wrap `EndpointsPage` in a dialog shell:

```typescript
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";

<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <EndpointsPage endpoint={someDefinition} locale={locale} user={user} endpointOptions={...} />
  </DialogContent>
</Dialog>
```

---

## What a Widget Must NOT Do

```typescript
// ❌ useEffect for most reasons — no data loading, no navigation
// ✅ useEffect IS allowed ONLY for seeding form fields from prefillFromGet data
//    or from a picker session cache (see Entity Picker Pattern above)
useEffect(() => { ... }, [...]);

// ❌ navigation.replace() called directly — use replaceOnSuccess in navigate() options
navigation.replace(def.GET, { urlPathParams: { id } });

// ❌ useEffect + pop() — use popNavigationOnSuccess in navigate() options
useEffect(() => { if (data?.id) navigation.pop(); }, [data?.id]);

// ❌ useEffect + form.setValue() for prefill — use prefillFromGet: true in navigate() options
useEffect(() => { form.setValue("field", data?.field); }, [data]);

// ❌ Manual refetch on mount — framework handles GET loading
useEffect(() => { if (!data) refetch(); }, []);

// ❌ refetch() after form.setValue() — use autoSubmit + shouldDirty: true
form.setValue("status", status);
refetch();

// ❌ Import UI from sibling endpoint widget
import { ModelSelector } from "../../models/widget/model-selector";

// ❌ Raw fetch/axios inside widget
const data = await fetch("/api/...");

// ❌ Accept user/locale as props
export function MyWidget({ user, locale }) { ... }

// ❌ Client-side filtering
const visible = items.filter((i) => i.active);

// ❌ Hardcoded locale
new Date(x).toLocaleDateString("en-US")
new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n)

// ❌ Hardcoded strings
<Button>Send Invoice</Button>

// ❌ Plain UUID text input for entity references
fieldType: FieldDataType.TEXT, schema: z.uuid()  // use ENTITY_PICKER instead

// ❌ Cache updates in widget — they belong in definition.ts mutationOptions.onSuccess
apiClient.updateEndpointData(...) // in widget.tsx — wrong place

// ❌ Picker mode detection via navigation.current — use usePickerCallback() instead
const { pickerCallback } = useWidgetNavigation().current ?? {};
```

---

## Violations

### Rule: Never use `_components/` under `src/`

All UI sub-components for an endpoint must live inside `widget/` (or `widget.tsx`). The `_components/` folder name is **not allowed** under `src/`. Move any such files to `widget/`, update all import sites, delete the empty folder.

### Rule: Page/layout components do NOT live in `widget/`

`widget/` is only for components registered in `definition.ts` via `customWidgetObject`. A component that accepts `locale`, `user`, or other server-side props and is imported from a `page.tsx` or `layout.tsx` is a **page component**, not a widget. It belongs in `src/_pages/<feature>/_components/`.

### Rule: Widget i18n is private to the widget

If a `widget/` folder contains an `i18n/` subfolder, those translations are private. No other file may import from `widget/i18n/`. Endpoint i18n lives in `i18n/` (sibling to `definition.ts`). They do not cross.

---

## Checklist — New Widget

**Structure**

- [ ] Wrapped in `WidgetShell` → `WidgetHeader` → sections
- [ ] `LoadingBlock` for loading (not hand-rolled spinner)
- [ ] `EmptyBlock` for empty state (not bare text) — domain icon, direct statement, CTA button
- [ ] `MetricCard` + `MetricGrid` for KPIs (not ad-hoc stat cards)
- [ ] `StatusPill` for status badges (not inline rounded spans)
- [ ] `DetailGrid` + `DetailField` for label-value pairs
- [ ] `ListItem` for list rows (not hand-rolled flex divs)
- [ ] `SectionGroup` for titled sections (not raw Card/CardHeader)
- [ ] No local `StatCard`, `InfoRow`, `StatusBadge` duplicating shared components

**Behavior**

- [ ] No `useEffect` except seeding form fields from `prefillFromGet` or picker cache
- [ ] `canGoBack` from `useWidgetNavigation()` — back button shown when true
- [ ] Create flow: caller uses `replaceOnSuccess`; create widget is a plain form
- [ ] Action flow: caller uses `popNavigationOnSuccess`; action widget is a plain form
- [ ] Edit prefill: caller uses `prefillFromGet: true` + `getEndpoint`
- [ ] Picker mode: `usePickerCallback()` — pass full entity snapshot, write cache, `pop()`
- [ ] List widget hides create/action buttons in picker mode
- [ ] Cache updates in `definition.ts` `mutationOptions.onSuccess`, not in widget
- [ ] `form.setValue(field, value, { shouldDirty: true })` — always with `shouldDirty`
- [ ] Dynamic import for cross-endpoint navigation
- [ ] No client-side `.filter()` — all filtering server-side

**Quality**

- [ ] All strings via `t()` — no hardcoded English
- [ ] Locale-aware dates/currencies via `useWidgetLocale()` — never `"en-US"`
- [ ] Action buttons filtered by entity status — don't show irrelevant actions
- [ ] Destructive actions behind `AlertDialog` — confirmation text describes the consequence
- [ ] Entity ID fields use `ENTITY_PICKER`, not `TEXT`/`UUID`
- [ ] Button labels say what happens: "Create invoice" not "Submit", "Send to customer" not "Send"
- [ ] Form field labels are nouns: "Company name" not "Name". Placeholders are examples, not label repeats
- [ ] Terminology consistent within domain — one word for one concept everywhere
- [ ] No platform branches inside `widget.tsx` — all differences handled by `next-vibe-ui`

**Verification**

- [ ] `mcp atlas check <path>` → 0 errors
- [ ] CLI non-interactive: `vibe <alias>` → all fields render, layout intentional, MCP output compact
- [ ] CLI interactive (when asked): start in background via agent harness, PID auto-detected. Tab cycles all fields, select/picker opens/closes, submit renders real response
- [ ] Browser E2E: all sections render, submit works, resize to ~500px and ~260px still usable, navigation flows complete

**The test** — if any answer is no, it's not done:

1. Can a user who's never seen this complete the primary action without help?
2. Does every possible state look intentional?
3. Does every action produce visible feedback?
4. Is there any state where the user is stuck with no path forward?
5. Does the language match what the user would call this thing?

---

## Legacy: `widget.cli.tsx`

Existing endpoints may have a separate `widget.cli.tsx`. This is deprecated — new endpoints handle all platforms in `widget.tsx`. See [widget.cli.md](widget.cli.md) for the legacy reference.
