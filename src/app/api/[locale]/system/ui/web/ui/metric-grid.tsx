import { cn } from "next-vibe/core/utils/utils";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type * as React from "react";

export type MetricGridColumns = 2 | 3 | 4;

export type MetricGridProps = {
  children?: React.ReactNode;
  columns?: MetricGridColumns;
} & StyleType;

const columnClasses: Record<MetricGridColumns, string> = {
  2: "grid-cols-1 @sm:grid-cols-2",
  3: "grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3",
  4: "grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4",
};

export function MetricGrid({
  children,
  columns = 4,
  className,
  style,
}: MetricGridProps): React.JSX.Element {
  return (
    <div
      className={cn("grid gap-3", columnClasses[columns], className)}
      style={style}
    >
      {children}
    </div>
  );
}
MetricGrid.displayName = "MetricGrid";
