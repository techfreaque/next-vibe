/**
 * Widget chunk preloader — no "use client" directive so Vite does NOT strip
 * this module at the client boundary. Exported preloadAllWidgets() is safe to
 * call from client.tsx before hydrateRoot().
 *
 * The eagerImport() calls fire at module-eval time, starting all dynamic
 * imports immediately. preloadAllWidgets() awaits them so hydrateRoot sees
 * fully-resolved components in createWidget() — no Suspense, no CLS.
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
  () => import("../../widgets/display-only/description/react"),
);
eagerImport(
  "metadata",
  () => import("../../widgets/display-only/metadata/react"),
);
eagerImport(
  "key-value",
  () => import("../../widgets/display-only/key-value/react"),
);
eagerImport(
  "markdown",
  () => import("../../widgets/display-only/markdown/react"),
);
eagerImport(
  "markdown-editor",
  () => import("../../widgets/form-fields/markdown-editor/react"),
);
eagerImport("link", () => import("../../widgets/display-only/link/react"));
eagerImport(
  "code-output",
  () => import("../../widgets/containers/code-output/react"),
);
eagerImport(
  "code-quality-list",
  () => import("../../widgets/display-only/code-quality-list/react"),
);
eagerImport(
  "pagination",
  () => import("../../widgets/containers/pagination/react"),
);
eagerImport("stat", () => import("../../widgets/display-only/stat/react"));
eagerImport("chart", () => import("../../widgets/display-only/chart/react"));
eagerImport(
  "status-indicator",
  () => import("../../widgets/display-only/status-indicator/react"),
);
eagerImport(
  "empty-state",
  () => import("../../widgets/display-only/empty-state/react"),
);
eagerImport(
  "code-quality-files",
  () => import("../../widgets/display-only/code-quality-files/react"),
);
eagerImport(
  "code-quality-summary",
  () => import("../../widgets/display-only/code-quality-summary/react"),
);
eagerImport("avatar", () => import("../../widgets/display-only/avatar/react"));
eagerImport(
  "loading",
  () => import("../../widgets/display-only/loading/react"),
);
eagerImport(
  "color",
  () => import("../../widgets/form-fields/color-field/react"),
);
eagerImport(
  "country-select",
  () => import("../../widgets/form-fields/country-select-field/react"),
);
eagerImport(
  "currency-select",
  () => import("../../widgets/form-fields/currency-select-field/react"),
);
eagerImport("date", () => import("../../widgets/form-fields/date-field/react"));
eagerImport(
  "date-range",
  () => import("../../widgets/form-fields/date-range-field/react"),
);
eagerImport(
  "datetime",
  () => import("../../widgets/form-fields/datetime-field/react"),
);
eagerImport(
  "email",
  () => import("../../widgets/form-fields/email-field/react"),
);
eagerImport("file", () => import("../../widgets/form-fields/file-field/react"));
eagerImport(
  "filter-pills",
  () => import("../../widgets/form-fields/filter-pills-field/react"),
);
eagerImport("int", () => import("../../widgets/form-fields/int-field/react"));
eagerImport("json", () => import("../../widgets/form-fields/json-field/react"));
eagerImport(
  "language-select",
  () => import("../../widgets/form-fields/language-select-field/react"),
);
eagerImport(
  "multiselect",
  () => import("../../widgets/form-fields/multiselect-field/react"),
);
eagerImport(
  "number",
  () => import("../../widgets/form-fields/number-field/react"),
);
eagerImport(
  "password",
  () => import("../../widgets/form-fields/password-field/react"),
);
eagerImport("tel", () => import("../../widgets/form-fields/phone-field/react"));
eagerImport(
  "range-slider",
  () => import("../../widgets/form-fields/range-slider-field/react"),
);
eagerImport(
  "slider",
  () => import("../../widgets/form-fields/slider-field/react"),
);
eagerImport("tags", () => import("../../widgets/form-fields/tags-field/react"));
eagerImport(
  "text-array",
  () => import("../../widgets/form-fields/text-array-field/react"),
);
eagerImport("time", () => import("../../widgets/form-fields/time-field/react"));
eagerImport(
  "time-range",
  () => import("../../widgets/form-fields/time-range-field/react"),
);
eagerImport(
  "timezone",
  () => import("../../widgets/form-fields/timezone-field/react"),
);
eagerImport("url", () => import("../../widgets/form-fields/url-field/react"));

/**
 * Waits for all eager widget imports to resolve.
 * Call this in client.tsx before hydrateRoot() so createWidget() always
 * renders synchronously without Suspense during hydration.
 */
export function preloadAllWidgets(): Promise<void> {
  return Promise.all(pendingCache.values()).then(() => undefined);
}
