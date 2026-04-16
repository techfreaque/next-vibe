/**
 * Widget chunk preloader - no "use client" directive so Vite does NOT strip
 * this module at the client boundary. Exported preloadAllWidgets() is safe to
 * call from client.tsx before hydrateRoot().
 *
 * The eagerImport() calls fire at module-eval time, starting all dynamic
 * imports immediately. preloadAllWidgets() awaits them so hydrateRoot sees
 * fully-resolved components in createWidget() - no Suspense, no CLS.
 */

// oxlint-disable-next-line typescript/no-explicit-any
type AnyWidgetComponent = React.ComponentType<any>;

export const resolvedCache = new Map<string, AnyWidgetComponent>();
const pendingCache = new Map<string, Promise<void>>();

export function eagerImport(
  key: string,
  importFn: () => Promise<{ default: AnyWidgetComponent }>,
): void {
  if (pendingCache.has(key)) {
    return;
  }
  const p = importFn().then((mod) => {
    resolvedCache.set(key, mod.default);
    return undefined;
  });
  pendingCache.set(key, p);
}

// Start all imports at module-eval time so chunks are in-flight immediately.
eagerImport(
  "description",
  () => import("../../widgets/display-only/description/widget"),
);
eagerImport(
  "metadata",
  () => import("../../widgets/display-only/metadata/widget"),
);
eagerImport(
  "key-value",
  () => import("../../widgets/display-only/key-value/widget"),
);
eagerImport(
  "markdown",
  () => import("../../widgets/display-only/markdown/widget"),
);
eagerImport(
  "markdown-editor",
  () => import("../../widgets/form-fields/markdown-editor/widget"),
);
eagerImport("link", () => import("../../widgets/display-only/link/widget"));
eagerImport(
  "code-output",
  () => import("../../widgets/containers/code-output/widget"),
);
eagerImport(
  "code-quality-list",
  () => import("../../widgets/display-only/code-quality-list/widget"),
);
eagerImport(
  "pagination",
  () => import("../../widgets/containers/pagination/widget"),
);
eagerImport("stat", () => import("../../widgets/display-only/stat/widget"));
eagerImport("chart", () => import("../../widgets/display-only/chart/widget"));
eagerImport(
  "status-indicator",
  () => import("../../widgets/display-only/status-indicator/widget"),
);
eagerImport(
  "empty-state",
  () => import("../../widgets/display-only/empty-state/widget"),
);
eagerImport(
  "code-quality-files",
  () => import("../../widgets/display-only/code-quality-files/widget"),
);
eagerImport(
  "code-quality-summary",
  () => import("../../widgets/display-only/code-quality-summary/widget"),
);
eagerImport("avatar", () => import("../../widgets/display-only/avatar/widget"));
eagerImport(
  "loading",
  () => import("../../widgets/display-only/loading/widget"),
);
eagerImport(
  "color",
  () => import("../../widgets/form-fields/color-field/widget"),
);
eagerImport(
  "country-select",
  () => import("../../widgets/form-fields/country-select-field/widget"),
);
eagerImport(
  "currency-select",
  () => import("../../widgets/form-fields/currency-select-field/widget"),
);
eagerImport(
  "date",
  () => import("../../widgets/form-fields/date-field/widget"),
);
eagerImport(
  "date-range",
  () => import("../../widgets/form-fields/date-range-field/widget"),
);
eagerImport(
  "datetime",
  () => import("../../widgets/form-fields/datetime-field/widget"),
);
eagerImport(
  "email",
  () => import("../../widgets/form-fields/email-field/widget"),
);
eagerImport(
  "file",
  () => import("../../widgets/form-fields/file-field/widget"),
);
eagerImport(
  "filter-pills",
  () => import("../../widgets/form-fields/filter-pills-field/widget"),
);
eagerImport("int", () => import("../../widgets/form-fields/int-field/widget"));
eagerImport(
  "json",
  () => import("../../widgets/form-fields/json-field/widget"),
);
eagerImport(
  "language-select",
  () => import("../../widgets/form-fields/language-select-field/widget"),
);
eagerImport(
  "multiselect",
  () => import("../../widgets/form-fields/multiselect-field/widget"),
);
eagerImport(
  "number",
  () => import("../../widgets/form-fields/number-field/widget"),
);
eagerImport(
  "password",
  () => import("../../widgets/form-fields/password-field/widget"),
);
eagerImport(
  "tel",
  () => import("../../widgets/form-fields/phone-field/widget"),
);
eagerImport(
  "range-slider",
  () => import("../../widgets/form-fields/range-slider-field/widget"),
);
eagerImport(
  "slider",
  () => import("../../widgets/form-fields/slider-field/widget"),
);
eagerImport(
  "tags",
  () => import("../../widgets/form-fields/tags-field/widget"),
);
eagerImport(
  "text-array",
  () => import("../../widgets/form-fields/text-array-field/widget"),
);
eagerImport(
  "time",
  () => import("../../widgets/form-fields/time-field/widget"),
);
eagerImport(
  "time-range",
  () => import("../../widgets/form-fields/time-range-field/widget"),
);
eagerImport(
  "timezone",
  () => import("../../widgets/form-fields/timezone-field/widget"),
);
eagerImport("url", () => import("../../widgets/form-fields/url-field/widget"));
eagerImport(
  "markdown-textarea",
  () => import("../../widgets/form-fields/markdown-textarea-field/widget"),
);

/**
 * Waits for all eager widget imports to resolve.
 * Call this in client.tsx before hydrateRoot() so createWidget() always
 * renders synchronously without Suspense during hydration.
 */
export function preloadAllWidgets(): Promise<void> {
  return Promise.all(pendingCache.values()).then(() => undefined);
}
