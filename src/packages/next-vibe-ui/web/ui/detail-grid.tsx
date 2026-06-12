import { cn } from "next-vibe/shared/utils/utils";
import type * as React from "react";

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
      className={cn("grid gap-x-6 gap-y-3", columnClasses[columns], className)}
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
  className,
  style,
}: DetailFieldProps): React.JSX.Element {
  const handleCopy = (): void => {
    if (copyable && value !== undefined && value !== null) {
      void navigator.clipboard.writeText(String(value));
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-0.5 min-w-0", className)}
      style={style}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      {copyable ? (
        <button
          type="button"
          className={cn(
            "text-sm font-medium truncate text-left",
            mono && "font-mono text-xs",
            "cursor-pointer hover:text-primary transition-colors",
          )}
          onClick={handleCopy}
          title="Click to copy"
        >
          {value ?? "\u2014"}
        </button>
      ) : (
        <span
          className={cn(
            "text-sm font-medium truncate",
            mono && "font-mono text-xs",
          )}
        >
          {value ?? "\u2014"}
        </span>
      )}
    </div>
  );
}
DetailField.displayName = "DetailField";
