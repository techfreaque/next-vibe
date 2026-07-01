import { cn } from "next-vibe/core/utils/utils";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type * as React from "react";

export type ProgressBlockVariant = "default" | "success" | "warning" | "danger";

export type ProgressBlockProps = {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: ProgressBlockVariant;
} & StyleType;

const variantClasses: Record<ProgressBlockVariant, string> = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
};

export function ProgressBlock({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = "default",
  className,
  style,
}: ProgressBlockProps): React.JSX.Element {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex flex-col gap-1.5", className)} style={style}>
      {label || showPercentage ? (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {label ? <span>{label}</span> : <span />}
          {showPercentage ? (
            <span className="tabular-nums font-medium">{Math.round(pct)}%</span>
          ) : null}
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            variantClasses[variant],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
ProgressBlock.displayName = "ProgressBlock";
