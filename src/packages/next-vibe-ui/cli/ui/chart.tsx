import * as React from "react";

export type {
  ThemeKeys,
  ChartConfig,
  ChartDataPoint,
  PayloadItem,
  ChartBaseProps,
  ChartContainerBaseProps,
  ChartContainerProps,
  ChartStyleProps,
  ChartContextProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartTooltipContentProps,
  ChartLegendContentProps,
  ChartProps,
  LineProps,
  BarProps,
  AreaProps,
  PieProps,
  AxisProps,
} from "../../web/ui/chart";

export function useChart(): ChartContextProps {
  // CLI stub — chart context is never used in terminal rendering
  return { config: {} };
}

import type {
  ChartContainerProps,
  ChartContextProps,
  ChartDataPoint,
  ChartTooltipContentProps,
  ChartLegendContentProps,
} from "../../web/ui/chart";

export function ChartContainer<TData extends ChartDataPoint = ChartDataPoint>({
  children,
}: ChartContainerProps<TData>): React.JSX.Element | null {
  return <>{children}</>;
}

export function ChartTooltip(): null {
  return null;
}

export function ChartLegend(): null {
  return null;
}

export function ChartTooltipContent({
  children,
}: ChartTooltipContentProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ChartLegendContent({
  children,
}: ChartLegendContentProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function Chart(): null {
  return null;
}

export function Line(): null {
  return null;
}

export function Bar(): null {
  return null;
}

export function Area(): null {
  return null;
}

export function Pie(): null {
  return null;
}

export function Axis(): null {
  return null;
}

export const Theme = {} as Record<string, Record<string, string | number>>;
