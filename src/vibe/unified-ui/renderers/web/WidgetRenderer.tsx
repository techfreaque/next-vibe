"use client";

import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import { FieldDataType, WidgetType } from "../../../core/definition/enums";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type {
  AnyChildrenConstrain,
  ConstrainedChildUsage,
  DispatchField,
  FieldUsageConfig,
} from "../../_shared/types";
import { useWidgetLocale } from "../../_shared/use-widget-context";
import React, { type JSX, Suspense } from "react";
import type { z } from "zod";

import { WidgetErrorBoundary } from "./ErrorBoundary";

/**
 * Widget Renderer Component - Routes to appropriate widget with full type inference.
 * Receives DispatchField (UnifiedField + value) and switches on field.type.
 */
export function WidgetRenderer<TEndpoint extends CreateApiEndpointAny>({
  fieldName,
  field,
  inlineButtonInfo,
}: ReactWidgetProps<
  TEndpoint,
  FieldUsageConfig,
  DispatchField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >
>): JSX.Element {
  const locale = useWidgetLocale();

  return (
    <WidgetErrorBoundary locale={locale!}>
      {renderWidget({
        fieldName,
        field,
        inlineButtonInfo,
      })}
    </WidgetErrorBoundary>
  );
}

// Dispatch-boundary cast used throughout — switch discriminant guarantees type safety.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = React.ComponentType<any>;

/**
 * Lazy registry entry. `Component` is a React.lazy wrapper (web: chunk loads
 * on first render, inside Suspense). `resolve()` eagerly imports the module
 * and stores it on `resolved` so subsequent renders are fully synchronous —
 * required by the CLI/MCP fast renderer, which only takes the first render.
 */
interface LazyWidgetEntry {
  Component: AnyProps;
  resolve: () => Promise<void>;
  resolved: AnyProps | null;
}

function lazyEntry(
  load: () => Promise<{ default: AnyProps }>,
): LazyWidgetEntry {
  let pending: Promise<void> | null = null;
  const entry: LazyWidgetEntry = {
    Component: React.lazy(load),
    resolve: (): Promise<void> => {
      pending ??= load().then((mod) => {
        entry.resolved = mod.default;
        return undefined;
      });
      return pending;
    },
    resolved: null,
  };
  return entry;
}

// One entry per widget module. Exhaustive over WidgetType (minus FORM_FIELD,
// which dispatches on FieldDataType, and CUSTOM_WIDGET, which carries its own
// render). Modules are NOT imported here — each loads on demand.
const widgetRegistry: Record<
  Exclude<WidgetType, WidgetType.FORM_FIELD | WidgetType.CUSTOM_WIDGET>,
  LazyWidgetEntry
> = {
  [WidgetType.TEXT]: lazyEntry(
    () => import("../../widgets/display-only/text/widget"),
  ),
  [WidgetType.DESCRIPTION]: lazyEntry(
    () => import("../../widgets/display-only/description/widget"),
  ),
  [WidgetType.METADATA]: lazyEntry(
    () => import("../../widgets/display-only/metadata/widget"),
  ),
  [WidgetType.KEY_VALUE]: lazyEntry(
    () => import("../../widgets/display-only/key-value/widget"),
  ),
  [WidgetType.BADGE]: lazyEntry(
    () => import("../../widgets/display-only/badge/widget"),
  ),
  [WidgetType.ICON]: lazyEntry(
    () => import("../../widgets/display-only/icon/widget"),
  ),
  [WidgetType.MARKDOWN]: lazyEntry(
    () => import("../../widgets/display-only/markdown/widget"),
  ),
  [WidgetType.MARKDOWN_EDITOR]: lazyEntry(
    () => import("../../widgets/form-fields/markdown-editor/widget"),
  ),
  [WidgetType.TITLE]: lazyEntry(
    () => import("../../widgets/display-only/title/widget"),
  ),
  [WidgetType.LINK]: lazyEntry(
    () => import("../../widgets/display-only/link/widget"),
  ),
  [WidgetType.CODE_OUTPUT]: lazyEntry(
    () => import("../../widgets/containers/code-output/widget"),
  ),
  [WidgetType.CODE_QUALITY_LIST]: lazyEntry(
    () => import("../../widgets/display-only/code-quality-list/widget"),
  ),
  [WidgetType.PAGINATION]: lazyEntry(
    () => import("../../widgets/containers/pagination/widget"),
  ),
  [WidgetType.STAT]: lazyEntry(
    () => import("../../widgets/display-only/stat/widget"),
  ),
  [WidgetType.CHART]: lazyEntry(
    () => import("../../widgets/display-only/chart/widget"),
  ),
  [WidgetType.CONTAINER]: lazyEntry(
    () => import("../../widgets/containers/container/widget"),
  ),
  [WidgetType.SEPARATOR]: lazyEntry(
    () => import("../../widgets/display-only/separator/widget"),
  ),
  [WidgetType.BUTTON]: lazyEntry(
    () => import("../../widgets/interactive/button/widget"),
  ),
  [WidgetType.NAVIGATE_BUTTON]: lazyEntry(
    () => import("../../widgets/interactive/navigate-button/widget"),
  ),
  [WidgetType.SUBMIT_BUTTON]: lazyEntry(
    () => import("../../widgets/interactive/submit-button/widget"),
  ),
  [WidgetType.ALERT]: lazyEntry(
    () => import("../../widgets/display-only/alert/widget"),
  ),
  [WidgetType.FORM_ALERT]: lazyEntry(
    () => import("../../widgets/interactive/form-alert/widget"),
  ),
  [WidgetType.STATUS_INDICATOR]: lazyEntry(
    () => import("../../widgets/display-only/status-indicator/widget"),
  ),
  [WidgetType.EMPTY_STATE]: lazyEntry(
    () => import("../../widgets/display-only/empty-state/widget"),
  ),
  [WidgetType.CODE_QUALITY_FILES]: lazyEntry(
    () => import("../../widgets/display-only/code-quality-files/widget"),
  ),
  [WidgetType.CODE_QUALITY_SUMMARY]: lazyEntry(
    () => import("../../widgets/display-only/code-quality-summary/widget"),
  ),
  [WidgetType.AVATAR]: lazyEntry(
    () => import("../../widgets/display-only/avatar/widget"),
  ),
  [WidgetType.LOADING]: lazyEntry(
    () => import("../../widgets/display-only/loading/widget"),
  ),
  [WidgetType.SEARCH_BAR]: lazyEntry(
    () => import("../../widgets/interactive/search-bar/widget"),
  ),
};

// One entry per FORM_FIELD fieldType that has its own widget module.
// FieldDataTypes without an entry (array, badge, code, …) render nothing,
// matching the previous switch's default branch.
const formFieldRegistry: Partial<Record<FieldDataType, LazyWidgetEntry>> = {
  [FieldDataType.BOOLEAN]: lazyEntry(
    () => import("../../widgets/form-fields/boolean-field/widget"),
  ),
  [FieldDataType.COLOR]: lazyEntry(
    () => import("../../widgets/form-fields/color-field/widget"),
  ),
  [FieldDataType.COUNTRY_SELECT]: lazyEntry(
    () => import("../../widgets/form-fields/country-select-field/widget"),
  ),
  [FieldDataType.CURRENCY_SELECT]: lazyEntry(
    () => import("../../widgets/form-fields/currency-select-field/widget"),
  ),
  [FieldDataType.DATE]: lazyEntry(
    () => import("../../widgets/form-fields/date-field/widget"),
  ),
  [FieldDataType.DATE_RANGE]: lazyEntry(
    () => import("../../widgets/form-fields/date-range-field/widget"),
  ),
  [FieldDataType.DATETIME]: lazyEntry(
    () => import("../../widgets/form-fields/datetime-field/widget"),
  ),
  [FieldDataType.EMAIL]: lazyEntry(
    () => import("../../widgets/form-fields/email-field/widget"),
  ),
  [FieldDataType.ENTITY_PICKER]: lazyEntry(
    () => import("../../widgets/form-fields/entity-picker-field/widget"),
  ),
  [FieldDataType.FILE]: lazyEntry(
    () => import("../../widgets/form-fields/file-field/widget"),
  ),
  [FieldDataType.FILTER_PILLS]: lazyEntry(
    () => import("../../widgets/form-fields/filter-pills-field/widget"),
  ),
  [FieldDataType.ICON]: lazyEntry(
    () => import("../../widgets/form-fields/icon-field/widget"),
  ),
  [FieldDataType.INT]: lazyEntry(
    () => import("../../widgets/form-fields/int-field/widget"),
  ),
  [FieldDataType.JSON]: lazyEntry(
    () => import("../../widgets/form-fields/json-field/widget"),
  ),
  [FieldDataType.LANGUAGE_SELECT]: lazyEntry(
    () => import("../../widgets/form-fields/language-select-field/widget"),
  ),
  [FieldDataType.MARKDOWN_TEXTAREA]: lazyEntry(
    () => import("../../widgets/form-fields/markdown-textarea-field/widget"),
  ),
  [FieldDataType.MULTISELECT]: lazyEntry(
    () => import("../../widgets/form-fields/multiselect-field/widget"),
  ),
  [FieldDataType.NUMBER]: lazyEntry(
    () => import("../../widgets/form-fields/number-field/widget"),
  ),
  [FieldDataType.PASSWORD]: lazyEntry(
    () => import("../../widgets/form-fields/password-field/widget"),
  ),
  [FieldDataType.TEL]: lazyEntry(
    () => import("../../widgets/form-fields/phone-field/widget"),
  ),
  [FieldDataType.RANGE_SLIDER]: lazyEntry(
    () => import("../../widgets/form-fields/range-slider-field/widget"),
  ),
  [FieldDataType.SELECT]: lazyEntry(
    () => import("../../widgets/form-fields/select-field/widget"),
  ),
  [FieldDataType.SLIDER]: lazyEntry(
    () => import("../../widgets/form-fields/slider-field/widget"),
  ),
  [FieldDataType.TAGS]: lazyEntry(
    () => import("../../widgets/form-fields/tags-field/widget"),
  ),
  [FieldDataType.TEXT]: lazyEntry(
    () => import("../../widgets/form-fields/text-field/widget"),
  ),
  [FieldDataType.TEXTAREA]: lazyEntry(
    () => import("../../widgets/form-fields/textarea-field/widget"),
  ),
  [FieldDataType.TEXT_ARRAY]: lazyEntry(
    () => import("../../widgets/form-fields/text-array-field/widget"),
  ),
  [FieldDataType.TIME]: lazyEntry(
    () => import("../../widgets/form-fields/time-field/widget"),
  ),
  [FieldDataType.TIME_RANGE]: lazyEntry(
    () => import("../../widgets/form-fields/time-range-field/widget"),
  ),
  [FieldDataType.TIMEZONE]: lazyEntry(
    () => import("../../widgets/form-fields/timezone-field/widget"),
  ),
  [FieldDataType.URL]: lazyEntry(
    () => import("../../widgets/form-fields/url-field/widget"),
  ),
  [FieldDataType.UUID]: lazyEntry(
    () => import("../../widgets/form-fields/uuid-field/widget"),
  ),
};

function entryForField(field: {
  type: WidgetType;
  fieldType?: FieldDataType;
}): LazyWidgetEntry | null {
  if (field.type === WidgetType.FORM_FIELD) {
    return field.fieldType
      ? (formFieldRegistry[field.fieldType] ?? null)
      : null;
  }
  if (field.type === WidgetType.CUSTOM_WIDGET) {
    return null;
  }
  return widgetRegistry[field.type] ?? null;
}

/**
 * Walk an endpoint's field tree and resolve ONLY the widget modules it uses.
 * Must run before the synchronous CLI/MCP fast renderer, which cannot suspend —
 * an unresolved lazy widget there produces no output.
 */
export function prewarmBuiltinWidgets(
  endpoint: CreateApiEndpointAny,
): Promise<void> {
  const entries = new Set<LazyWidgetEntry>();
  // oxlint-disable-next-line typescript/no-explicit-any -- dispatch-boundary: untyped field-tree walk, same pattern as scanForInlineButtons
  collectEntries(endpoint.fields as any as FieldTreeNode, entries, new Set());
  return Promise.all(
    [...entries].filter((e) => !e.resolved).map((e) => e.resolve()),
  ).then(() => undefined);
}

/** Structural view of a field-tree node — only what the walk needs. */
interface FieldTreeNode {
  type?: WidgetType;
  fieldType?: FieldDataType;
  children?: Record<string, FieldTreeNode>;
}

function collectEntries(
  field: FieldTreeNode | null | undefined,
  entries: Set<LazyWidgetEntry>,
  seen: Set<FieldTreeNode>,
): void {
  if (!field || typeof field !== "object" || seen.has(field)) {
    return;
  }
  seen.add(field);

  if (typeof field.type === "string") {
    const entry = entryForField({
      type: field.type,
      fieldType: field.fieldType,
    });
    if (entry) {
      entries.add(entry);
    }
  }

  if (field.children && typeof field.children === "object") {
    for (const child of Object.values(field.children)) {
      collectEntries(child, entries, seen);
    }
  }
}

/**
 * Render a lazy widget. Once its module is resolved (prewarm or a prior
 * load), renders synchronously — no Suspense, no flash. Otherwise the
 * React.lazy wrapper loads the chunk on demand inside Suspense (web only).
 */
function w<TEndpoint extends CreateApiEndpointAny>(
  entry: LazyWidgetEntry,
  props: ReactWidgetProps<
    TEndpoint,
    FieldUsageConfig,
    DispatchField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
    >
  >,
): JSX.Element {
  const W = entry.resolved ?? entry.Component;
  const el = (
    <W
      fieldName={props.fieldName}
      field={props.field}
      inlineButtonInfo={props.inlineButtonInfo}
    />
  );
  return entry.resolved ? el : <Suspense fallback={null}>{el}</Suspense>;
}

/**
 * Render helper - dispatches on field.type via the lazy registries.
 */
function renderWidget<TEndpoint extends CreateApiEndpointAny>(
  props: ReactWidgetProps<
    TEndpoint,
    FieldUsageConfig,
    DispatchField<
      string,
      z.ZodTypeAny,
      FieldUsageConfig,
      AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
    >
  >,
): JSX.Element {
  if (props.field.type === WidgetType.CUSTOM_WIDGET) {
    const customField = props.field as typeof props.field & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render?: React.ComponentType<any>;
    };
    const CustomRender = customField.render;
    if (!CustomRender) {
      return <></>;
    }
    return (
      <Suspense fallback={null}>
        <CustomRender
          fieldName={props.fieldName}
          field={props.field}
          inlineButtonInfo={props.inlineButtonInfo}
        />
      </Suspense>
    );
  }

  const entry = entryForField(
    props.field as { type: WidgetType; fieldType?: FieldDataType },
  );
  if (!entry) {
    return <></>;
  }
  return w(entry, props);
}

WidgetRenderer.displayName = "WidgetRenderer";
