import * as React from "react";

export type {
  AreaProps,
  AxisProps,
  BarProps,
  ChartBaseProps,
  ChartConfig,
  ChartContainerBaseProps,
  ChartContainerProps,
  ChartContextProps,
  ChartDataPoint,
  ChartLegendContentProps,
  ChartLegendProps,
  ChartProps,
  ChartStyleProps,
  ChartTooltipContentProps,
  ChartTooltipProps,
  LineProps,
  PayloadItem,
  PieProps,
  ThemeKeys,
} from "../../web/ui/chart";

export function useChart(): ChartContextProps {
  // CLI stub - chart context is never used in terminal rendering
  return { config: {} };
}

import type {
  AreaProps,
  AxisProps,
  BarProps,
  ChartContainerProps,
  ChartContextProps,
  ChartDataPoint,
  ChartLegendContentProps,
  ChartProps,
  ChartTooltipContentProps,
  LineProps,
  PieProps,
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

// Charts have no terminal rendering. These accept the full web prop surface so
// callers type-check unchanged, and discard it.
export function Chart(_props: ChartProps): null {
  void _props;
  return null;
}

export function Line(_props: LineProps): null {
  void _props;
  return null;
}

export function Bar(_props: BarProps): null {
  void _props;
  return null;
}

export function Area(_props: AreaProps): null {
  void _props;
  return null;
}

export function Pie(_props: PieProps): null {
  void _props;
  return null;
}

export function Axis(_props: AxisProps): null {
  void _props;
  return null;
}

export const Theme = {} as Record<string, Record<string, string | number>>;
