import { cn } from "../../../unified-ui/_shared/cn";
import type * as React from "react";

import type { StyleType } from "../utils/style-type";

export type StatusPillVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

export type StatusPillProps = {
  status: string;
  variant?: StatusPillVariant;
  label?: string;
} & StyleType;

const variantClasses: Record<StatusPillVariant, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  muted: "bg-muted text-muted-foreground",
};

export function StatusPill({
  status,
  variant = "default",
  label,
  className,
  style,
}: StatusPillProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      style={style}
    >
      {label ?? status}
    </span>
  );
}
StatusPill.displayName = "StatusPill";
