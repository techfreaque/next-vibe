import type * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";

export type DetailGridColumns = 1 | 2 | 3;

export type DetailGridProps = {
  children?: React.ReactNode;
  columns?: DetailGridColumns;
} & StyleType;

export type DetailFieldProps = {
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
  copyable?: boolean;
  copyLabel?: string;
} & StyleType;

const columnClasses: Record<DetailGridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 @sm:grid-cols-2",
  3: "grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3",
};

export function DetailGrid({
  children,
  columns = 2,
  className,
  style,
}: DetailGridProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "grid min-w-0 gap-x-6 gap-y-3",
        columnClasses[columns],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
DetailGrid.displayName = "DetailGrid";

export function DetailField({
  label,
  value,
  mono = false,
  copyable = false,
  copyLabel,
  className,
  style,
}: DetailFieldProps): React.JSX.Element {
  const text =
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "bigint"
      ? String(value)
      : null;
  const valueClasses = cn(
    "text-sm font-medium [overflow-wrap:anywhere]",
    mono && "font-mono text-xs",
  );

  return (
    <div
      className={cn("flex flex-col gap-0.5 min-w-0", className)}
      style={style}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      {copyable && text !== null ? (
        <button
          type="button"
          className={cn(
            valueClasses,
            "cursor-pointer text-start hover:text-primary transition-colors",
          )}
          onClick={() => void navigator.clipboard?.writeText(text)}
          aria-label={copyLabel}
          title={copyLabel ?? "Click to copy"}
        >
          {text}
        </button>
      ) : (
        <span className={valueClasses}>{value ?? "\u2013"}</span>
      )}
    </div>
  );
}
DetailField.displayName = "DetailField";
