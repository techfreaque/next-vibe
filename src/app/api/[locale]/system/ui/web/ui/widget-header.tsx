import { cn } from "next-vibe/core/utils/utils";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type * as React from "react";

export type WidgetHeaderProps = {
  title: string;
  backButton?: React.ReactNode;
  actions?: React.ReactNode;
  border?: boolean;
} & StyleType;

export function WidgetHeader({
  title,
  backButton,
  actions,
  border = true,
  className,
  style,
}: WidgetHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex items-center gap-2 pb-3",
        border && "border-b",
        className,
      )}
      style={style}
    >
      {backButton}
      <span className="font-semibold text-base mr-auto truncate">{title}</span>
      {actions ? (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}
WidgetHeader.displayName = "WidgetHeader";
