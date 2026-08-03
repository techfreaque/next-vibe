import { cn } from "../../../unified-ui/_shared/cn";
import type * as React from "react";

import type { StyleType } from "../utils/style-type";

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
