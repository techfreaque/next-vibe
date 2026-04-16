/**
 * Helper for lazy-loading CLI widgets in endpoint definitions.
 *
 * Usage in definition.ts:
 *   const MyWidget = lazyWidget(() =>
 *     import("./widget").then((m) => ({ default: m.MyWidget })),
 *   );
 *
 * Why: React.lazy() wraps the component in a LazyExoticComponent, stripping
 * any static properties added before the call. Object.assign stamps .cliWidget
 * on the lazy wrapper itself so CliWidgetRenderer can detect it synchronously
 * without unwrapping the async promise.
 *
 * The Bun CLI plugin resolves `import("./widget")` to `widget.cli.tsx` when
 * present, so the lazy resolves to the Ink component in CLI context.
 */

import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- dispatch-boundary: lazy wrapper accepts any props
type CliComponent = React.ComponentType<any> & { cliWidget: true };

/**
 * Wrap a lazy import in React.lazy and stamp `.cliWidget = true` on the result.
 * Use this in definition.ts wherever you would otherwise write:
 *   Object.assign(React.lazy(...), { cliWidget: true as const })
 */
export function lazyWidget(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dispatch-boundary: accepts any component
  factory: () => Promise<{ default: React.ComponentType<any> }>,
): CliComponent {
  return Object.assign(React.lazy(factory), {
    cliWidget: true as const,
  }) as CliComponent;
}
