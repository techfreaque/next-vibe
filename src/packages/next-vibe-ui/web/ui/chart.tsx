"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "next-vibe/shared/utils";
import type { ReactNode } from "react";
import * as React from "react";
import {
  VictoryArea as VictoryAreaBase,
  VictoryAxis as VictoryAxisBase,
  VictoryBar as VictoryBarBase,
  VictoryChart as VictoryChartBase,
  VictoryLegend as VictoryLegendBase,
  VictoryLine as VictoryLineBase,
  VictoryPie as VictoryPieBase,
  VictoryTheme as VictoryThemeBase,
  VictoryTooltip as VictoryTooltipBase,
} from "victory";

import type { StyleType } from "../utils/style-type";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: ".light", dark: ".dark" } as const;

export type ThemeKeys = keyof typeof THEMES;

export type ChartConfig<
  TData extends Record<string, string | number | boolean> = Record<
    string,
    string | number | boolean
  >,
> = {
  [K in keyof TData | string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<ThemeKeys, string> }
  );
};

// Type for chart data points
export type ChartDataPoint = Record<string, string | number | boolean>;

// Type for payload items in tooltips and legends
export interface PayloadItem<TData extends ChartDataPoint = ChartDataPoint> {
  value?: string | number | null;
  name?: string;
  dataKey?: string;
  color?: string;
  fill?: string;
  stroke?: string;
  payload?: TData;
}

// Cross-platform base props interfaces
interface ChartBasePropsBase {
  children: ReactNode;
}

export type ChartBaseProps = ChartBasePropsBase & StyleType;

interface ChartContainerBasePropsBase<
  TData extends ChartDataPoint = ChartDataPoint,
> {
  children: ReactNode;
  config: ChartConfig<TData>;
}

export type ChartContainerBaseProps<
  TData extends ChartDataPoint = ChartDataPoint,
> = ChartContainerBasePropsBase<TData> & StyleType;

// Explicit interface for ChartContainer props
interface ChartContainerPropsBase<
  TData extends ChartDataPoint = ChartDataPoint,
> {
  config: ChartConfig<TData>;
  children: ReactNode;
}

export type ChartContainerProps<TData extends ChartDataPoint = ChartDataPoint> =
  ChartContainerPropsBase<TData> & StyleType;

// Explicit interface for ChartStyle props
export interface ChartStyleProps {
  id: string;
  config: ChartConfig;
}

// Context interface
export interface ChartContextProps<
  TData extends ChartDataPoint = ChartDataPoint,
> {
  config: ChartConfig<TData>;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart<
  TData extends ChartDataPoint = ChartDataPoint,
>(): ChartContextProps<TData> {
  const context = React.useContext(ChartContext);

  if (!context) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Standard React context hook pattern - throw is correct for developer mistakes
    // eslint-disable-next-line i18next/no-literal-string -- Error handling for context
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context as ChartContextProps<TData>;
}

export function ChartContainer<TData extends ChartDataPoint = ChartDataPoint>({
  className,
  style,
  children,
  config,
}: ChartContainerProps<TData>): React.JSX.Element {
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn("flex aspect-video justify-center text-xs", className)}
        style={style}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

export interface ChartTooltipProps {
  text?: string | string[];
  x?: number;
  y?: number;
  active?: boolean;
  style?: Record<string, string | number>;
  children?: React.ReactNode;
}

export interface ChartLegendProps {
  data?: Array<{ name: string; symbol?: { fill?: string } }>;
  orientation?: "horizontal" | "vertical";
  gutter?: number;
  style?: Record<string, string | number>;
  children?: React.ReactNode;
}

export function ChartTooltip({
  text,
  x,
  y,
  active,
  style,
}: ChartTooltipProps): React.JSX.Element | null {
  if (!active) {
    return null;
  }

  return (
    <VictoryTooltipBase
      text={text}
      x={x}
      y={y}
      active={active}
      style={style}
      flyoutStyle={style}
    />
  );
}

export function ChartLegend(props: ChartLegendProps): React.JSX.Element {
  return <VictoryLegendBase {...props} />;
}

export type ChartTooltipContentProps = {
  children: React.ReactNode;
} & StyleType;

// ChartTooltipContent - Simple wrapper for tooltip content
export function ChartTooltipContent({
  className,
  style,
  children,
  ...props
}: ChartTooltipContentProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Content
      className={cn("rounded-lg border bg-background p-2 shadow-md", className)}
      style={style}
      {...props}
    >
      {children}
    </TooltipPrimitive.Content>
  );
}
ChartTooltipContent.displayName = "ChartTooltipContent";

// Explicit interface for ChartLegendContent props
export type ChartLegendContentProps = {
  children: React.ReactNode;
} & StyleType;

// ChartLegendContent - Simple wrapper for legend content
export function ChartLegendContent({
  className,
  style,
  children,
  ...props
}: ChartLegendContentProps): React.JSX.Element {
  return (
    <div
      className={cn("flex flex-wrap gap-4 text-sm", className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
ChartLegendContent.displayName = "ChartLegendContent";

export interface ChartProps {
  children?: React.ReactNode;
  width?: number;
  height?: number;
  padding?:
    | number
    | { top?: number; bottom?: number; left?: number; right?: number };
  domainPadding?: number | { x?: number; y?: number };
}

export interface LineProps {
  data?: Array<Record<string, number | string>>;
  x?:
    | string
    | number
    | ((datum: Record<string, number | string>) => number | string);
  y?: string | number | ((datum: Record<string, number | string>) => number);
  interpolation?:
    | "basis"
    | "bundle"
    | "cardinal"
    | "catmullRom"
    | "linear"
    | "monotoneX"
    | "monotoneY"
    | "natural"
    | "step"
    | "stepAfter"
    | "stepBefore";
  animate?:
    | boolean
    | { duration?: number; onLoad?: Record<string, number | string> };
  style?: {
    data?: Record<string, number | string>;
    labels?: Record<string, number | string>;
    parent?: Record<string, number | string>;
  };
  labels?: string[] | ((datum: Record<string, number | string>) => string);
  domain?: { x?: [number, number]; y?: [number, number] };
  scale?:
    | "linear"
    | "time"
    | "log"
    | "sqrt"
    | {
        x?: "linear" | "time" | "log" | "sqrt";
        y?: "linear" | "time" | "log" | "sqrt";
      };
  samples?: number;
  sortKey?: string | number | Array<string>;
  sortOrder?: "ascending" | "descending";
}

export interface BarProps {
  data?: Array<Record<string, number | string>>;
  x?: string | number;
  y?: string | number;
  animate?: boolean;
  barWidth?: number;
  style?: {
    data?: Record<string, string | number>;
    labels?: Record<string, string | number>;
    parent?: Record<string, string | number>;
  };
  labels?: string[] | ((datum: Record<string, number | string>) => string);
}

export interface AreaProps {
  data?: Array<Record<string, number | string>>;
  x?:
    | string
    | number
    | ((datum: Record<string, number | string>) => number | string);
  y?: string | number | ((datum: Record<string, number | string>) => number);
  y0?: string | number | ((datum: Record<string, number | string>) => number);
  interpolation?:
    | "basis"
    | "bundle"
    | "cardinal"
    | "catmullRom"
    | "linear"
    | "monotoneX"
    | "monotoneY"
    | "natural"
    | "step"
    | "stepAfter"
    | "stepBefore";
  animate?:
    | boolean
    | { duration?: number; onLoad?: Record<string, number | string> };
  style?: {
    data?: Record<string, number | string>;
    labels?: Record<string, number | string>;
    parent?: Record<string, number | string>;
  };
  labels?: string[] | ((datum: Record<string, number | string>) => string);
  domain?: { x?: [number, number]; y?: [number, number] };
  scale?:
    | "linear"
    | "time"
    | "log"
    | "sqrt"
    | {
        x?: "linear" | "time" | "log" | "sqrt";
        y?: "linear" | "time" | "log" | "sqrt";
      };
  samples?: number;
  sortKey?: string | number | Array<string>;
  sortOrder?: "ascending" | "descending";
}

export interface PieProps {
  data?: Array<{ x: string; y: number }>;
  x?: string | ((datum: Record<string, number | string>) => string);
  y?: string | ((datum: Record<string, number | string>) => number);
  colorScale?: string[];
  innerRadius?: number;
  padAngle?: number;
  startAngle?: number;
  endAngle?: number;
  animate?:
    | boolean
    | { duration?: number; onLoad?: Record<string, number | string> };
  style?: {
    data?: Record<string, number | string>;
    labels?: Record<string, number | string>;
    parent?: Record<string, number | string>;
  };
  labels?: string[] | ((datum: Record<string, number | string>) => string);
}

export interface AxisProps {
  label?: string;
  tickValues?: Array<number | string>;
  tickFormat?: (tick: number | string) => string;
  tickLabelComponent?: React.ReactElement;
  axisLabelComponent?: React.ReactElement;
  gridComponent?: React.ReactElement;
  orientation?: "top" | "bottom" | "left" | "right";
  dependentAxis?: boolean;
  standalone?: boolean;
  style?: {
    axis?: Record<string, number | string>;
    axisLabel?: Record<string, number | string>;
    grid?: Record<string, number | string>;
    ticks?: Record<string, number | string>;
    tickLabels?: Record<string, number | string>;
  };
  domain?: { x?: [number, number]; y?: [number, number] };
}

export function Chart(props: ChartProps): React.JSX.Element {
  return <VictoryChartBase {...props} />;
}

export function Line(props: LineProps): React.JSX.Element {
  return <VictoryLineBase {...props} />;
}

export function Bar(props: BarProps): React.JSX.Element {
  return <VictoryBarBase {...props} />;
}

export function Area(props: AreaProps): React.JSX.Element {
  return <VictoryAreaBase {...props} />;
}

export function Pie(props: PieProps): React.JSX.Element {
  return <VictoryPieBase {...props} />;
}

export function Axis(props: AxisProps): React.JSX.Element {
  return <VictoryAxisBase {...props} />;
}

export const Theme = VictoryThemeBase;
