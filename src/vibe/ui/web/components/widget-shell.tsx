import type * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";

export type WidgetShellPadding = "none" | "sm" | "md";

/**
 * `scroll` (default `true`): enables `overflow-y-auto` so the widget scrolls
 * within the available viewport height.  Set to `false` for widgets that manage
 * their own height (e.g. ai-stream chat which fills the viewport).
 */
export type WidgetShellProps = {
  children?: React.ReactNode;
  layout?: "compact" | "page";
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
  layout = "compact",
  padding = "md",
  scroll = true,
}: WidgetShellProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "@container flex flex-col gap-4",
        scroll ? "flex-1 min-h-0 overflow-y-auto" : "",
        layout === "page" && "w-full min-w-0",
        layout === "compact" && paddingClasses[padding],
        className,
      )}
      style={style}
    >
      {layout === "page" ? (
        <div className="mx-auto flex w-full min-w-0 max-w-[1280px] flex-col gap-5 px-4 pb-8 pt-5 @md:px-6 @xl:px-8 @xl:pt-6">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
WidgetShell.displayName = "WidgetShell";
