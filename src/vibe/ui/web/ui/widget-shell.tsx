import { cn } from "../../../unified-ui/_shared/cn";
import type * as React from "react";

import type { StyleType } from "../utils/style-type";

export type WidgetShellPadding = "none" | "sm" | "md";

/**
 * `scroll` (default `true`): enables `overflow-y-auto` so the widget scrolls
 * within the available viewport height.  Set to `false` for widgets that manage
 * their own height (e.g. ai-stream chat which fills the viewport).
 */
export type WidgetShellProps = {
  children?: React.ReactNode;
  padding?: WidgetShellPadding;
  scroll?: boolean;
} & StyleType;

const paddingClasses: Record<WidgetShellPadding, string> = {
  none: "",
  sm: "p-2",
  md: "p-4",
};

export function WidgetShell({
  children,
  className,
  style,
  padding = "md",
  scroll = true,
}: WidgetShellProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "@container flex flex-col gap-4",
        scroll ? "flex-1 min-h-0 overflow-y-auto" : "",
        paddingClasses[padding],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
WidgetShell.displayName = "WidgetShell";
