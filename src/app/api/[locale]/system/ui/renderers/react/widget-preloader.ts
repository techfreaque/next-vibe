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
  () => import("next-vibe/unified-ui/display-only/description/widget"),
);
eagerImport(
  "metadata",
  () => import("next-vibe/unified-ui/display-only/metadata/widget"),
);
eagerImport(
  "key-value",
  () => import("next-vibe/unified-ui/display-only/key-value/widget"),
);
eagerImport(
  "markdown",
  () => import("next-vibe/unified-ui/display-only/markdown/widget"),
);
eagerImport(
  "markdown-editor",
  () => import("next-vibe/unified-ui/form-fields/markdown-editor/widget"),
);
eagerImport(
  "link",
  () => import("next-vibe/unified-ui/display-only/link/widget"),
);
eagerImport(
  "code-output",
  () => import("next-vibe/unified-ui/containers/code-output/widget"),
);
eagerImport(
  "code-quality-list",
  () => import("next-vibe/unified-ui/display-only/code-quality-list/widget"),
);
eagerImport(
  "pagination",
  () => import("next-vibe/unified-ui/containers/pagination/widget"),
);
eagerImport(
  "stat",
  () => import("next-vibe/unified-ui/display-only/stat/widget"),
);
eagerImport(
  "chart",
  () => import("next-vibe/unified-ui/display-only/chart/widget"),
);
eagerImport(
  "status-indicator",
  () => import("next-vibe/unified-ui/display-only/status-indicator/widget"),
);
eagerImport(
  "empty-state",
  () => import("next-vibe/unified-ui/display-only/empty-state/widget"),
);
eagerImport(
  "code-quality-files",
  () => import("next-vibe/unified-ui/display-only/code-quality-files/widget"),
);
eagerImport(
  "code-quality-summary",
  () => import("next-vibe/unified-ui/display-only/code-quality-summary/widget"),
);
eagerImport(
  "avatar",
  () => import("next-vibe/unified-ui/display-only/avatar/widget"),
);
eagerImport(
  "loading",
  () => import("next-vibe/unified-ui/display-only/loading/widget"),
);
eagerImport(
  "color",
  () => import("next-vibe/unified-ui/form-fields/color-field/widget"),
);
eagerImport(
  "country-select",
  () => import("next-vibe/unified-ui/form-fields/country-select-field/widget"),
);
eagerImport(
  "currency-select",
  () => import("next-vibe/unified-ui/form-fields/currency-select-field/widget"),
);
eagerImport(
  "date",
  () => import("next-vibe/unified-ui/form-fields/date-field/widget"),
);
eagerImport(
  "date-range",
  () => import("next-vibe/unified-ui/form-fields/date-range-field/widget"),
);
eagerImport(
  "datetime",
  () => import("next-vibe/unified-ui/form-fields/datetime-field/widget"),
);
eagerImport(
  "email",
  () => import("next-vibe/unified-ui/form-fields/email-field/widget"),
);
eagerImport(
  "file",
  () => import("next-vibe/unified-ui/form-fields/file-field/widget"),
);
eagerImport(
  "filter-pills",
  () => import("next-vibe/unified-ui/form-fields/filter-pills-field/widget"),
);
eagerImport(
  "int",
  () => import("next-vibe/unified-ui/form-fields/int-field/widget"),
);
eagerImport(
  "json",
  () => import("next-vibe/unified-ui/form-fields/json-field/widget"),
);
eagerImport(
  "language-select",
  () => import("next-vibe/unified-ui/form-fields/language-select-field/widget"),
);
eagerImport(
  "multiselect",
  () => import("next-vibe/unified-ui/form-fields/multiselect-field/widget"),
);
eagerImport(
  "number",
  () => import("next-vibe/unified-ui/form-fields/number-field/widget"),
);
eagerImport(
  "password",
  () => import("next-vibe/unified-ui/form-fields/password-field/widget"),
);
eagerImport(
  "tel",
  () => import("next-vibe/unified-ui/form-fields/phone-field/widget"),
);
eagerImport(
  "range-slider",
  () => import("next-vibe/unified-ui/form-fields/range-slider-field/widget"),
);
eagerImport(
  "slider",
  () => import("next-vibe/unified-ui/form-fields/slider-field/widget"),
);
eagerImport(
  "tags",
  () => import("next-vibe/unified-ui/form-fields/tags-field/widget"),
);
eagerImport(
  "text-array",
  () => import("next-vibe/unified-ui/form-fields/text-array-field/widget"),
);
eagerImport(
  "time",
  () => import("next-vibe/unified-ui/form-fields/time-field/widget"),
);
eagerImport(
  "time-range",
  () => import("next-vibe/unified-ui/form-fields/time-range-field/widget"),
);
eagerImport(
  "timezone",
  () => import("next-vibe/unified-ui/form-fields/timezone-field/widget"),
);
eagerImport(
  "url",
  () => import("next-vibe/unified-ui/form-fields/url-field/widget"),
);
eagerImport(
  "markdown-textarea",
  () =>
    import("next-vibe/unified-ui/form-fields/markdown-textarea-field/widget"),
);

/**
 * Waits for all eager widget imports to resolve.
 * Call this in client.tsx before hydrateRoot() so createWidget() always
 * renders synchronously without Suspense during hydration.
 */
export function preloadAllWidgets(): Promise<void> {
  return Promise.all(pendingCache.values()).then(() => undefined);
}
