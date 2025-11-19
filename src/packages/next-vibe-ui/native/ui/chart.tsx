"use client";

import { cn } from "next-vibe/shared/utils";
import * as React from "react";
import { View, Text } from "react-native";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

import type {
  ChartBaseProps,
  ChartConfig,
  ChartContainerBaseProps,
  ChartContainerProps,
  ChartStyleProps,
  ChartDataPoint,
  PayloadItem,
  ThemeKeys,
  ChartTooltipContentProps,
  ChartLegendContentProps,
  ChartContextProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartProps,
  LineProps,
  BarProps,
  AreaProps,
  PieProps,
  AxisProps,
} from "@/packages/next-vibe-ui/web/ui/chart";

const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart<
  TData extends ChartDataPoint = ChartDataPoint,
>(): ChartContextProps<TData> {
  const context = React.useContext(ChartContext);

  if (!context) {
    // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string -- Error handling for context
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context as ChartContextProps<TData>;
}

export function ChartContainer<TData extends ChartDataPoint = ChartDataPoint>({
  className,
  children,
  config,
  style,
  ..._props
}: ChartContainerProps<TData>): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <ChartContext.Provider value={{ config }}>
      <View
        {...applyStyleType({
          nativeStyle,
          className: cn("flex aspect-video justify-center", className),
        })}
      >
        {children}
      </View>
    </ChartContext.Provider>
  );
}

// Victory Native XL tooltip implementation
export function ChartTooltip({
  text,
  x,
  y,
  active,
  style,
}: ChartTooltipProps): React.JSX.Element | null {
  if (!active || !text) {
    return null;
  }

  const displayText = Array.isArray(text) ? text.join("\n") : text;
  const tooltipStyle = {
    position: "absolute" as const,
    left: x,
    top: y,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 8,
    borderRadius: 4,
    ...style,
  };

  return (
    <View style={tooltipStyle}>
      <Text style={{ color: "#ffffff", fontSize: 12 }}>{displayText}</Text>
    </View>
  );
}

// Victory Native XL legend implementation
export function ChartLegend({
  data,
  orientation = "horizontal",
  gutter = 10,
  style,
}: ChartLegendProps): React.JSX.Element {
  if (!data || data.length === 0) {
    return <View />;
  }

  const containerStyle = {
    flexDirection:
      orientation === "horizontal" ? ("row" as const) : ("column" as const),
    gap: gutter,
    padding: 8,
    ...style,
  };

  return (
    <View style={containerStyle}>
      {data.map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: item.symbol?.fill || "#000000",
              borderRadius: 2,
            }}
          />
          <Text style={{ fontSize: 12 }}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
}

// ChartTooltipContent - Native wrapper using same interface as web
export function ChartTooltipContent({
  className,
  style,
  children,
  ...props
}: ChartTooltipContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("rounded-lg border bg-background p-2 shadow-md", className),
      })}
      {...props}
    >
      {children}
    </View>
  );
}
ChartTooltipContent.displayName = "ChartTooltipContent";

// ChartLegendContent - Native wrapper using same interface as web
export function ChartLegendContent({
  className,
  style,
  children,
  ...props
}: ChartLegendContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-row flex-wrap gap-4 text-sm", className),
      })}
      {...props}
    >
      {children}
    </View>
  );
}
ChartLegendContent.displayName = "ChartLegendContent";

// Lazy load Victory Native components to avoid Skia initialization errors
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Victory Native props are dynamic
type VictoryPropsType = Record<
  string,
  | string
  | number
  | boolean
  // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Chart library type definition requires generic object type for flexible configuration
  | object
  | React.ReactNode
  | React.ReactElement
  | Array<string | number>
  | ((tick: number | string) => string)
>;

interface VictoryComponentsInterface {
  CartesianChart: React.ComponentType<VictoryPropsType>;
  Line: React.ComponentType<VictoryPropsType>;
  Bar: React.ComponentType<VictoryPropsType>;
  Area: React.ComponentType<VictoryPropsType>;
  Pie: React.ComponentType<VictoryPropsType>;
  CartesianAxis: React.ComponentType<VictoryPropsType>;
}

let VictoryComponents: VictoryComponentsInterface | null = null;
let skiaInitError: Error | null = null;

function getVictoryComponents(): VictoryComponentsInterface | null {
  if (VictoryComponents) {
    return VictoryComponents;
  }
  if (skiaInitError) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const victory = require("victory-native") as VictoryComponentsInterface;
    VictoryComponents = {
      CartesianChart: victory.CartesianChart,
      Line: victory.Line,
      Bar: victory.Bar,
      Area: victory.Area,
      Pie: victory.Pie,
      CartesianAxis: victory.CartesianAxis,
    };
    return VictoryComponents;
  } catch (error) {
    skiaInitError = error as Error;
    // eslint-disable-next-line no-console
    console.error("Failed to load victory-native:", error);
    return null;
  }
}

/* eslint-disable oxlint-plugin-i18n/no-literal-string -- Fallback UI for unavailable native module */
// Fallback component for when Skia is unavailable
function ChartFallback(): React.JSX.Element {
  return (
    <View
      style={{
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
      }}
    >
      <Text style={{ color: "#999", fontSize: 14, fontWeight: "600" }}>
        Chart unavailable
      </Text>
      <Text
        style={{
          color: "#666",
          fontSize: 12,
          marginTop: 4,
          textAlign: "center",
        }}
      >
        Skia/Victory Native not initialized
      </Text>
    </View>
  );
}
/* eslint-enable oxlint-plugin-i18n/no-literal-string */

// Export wrapped components with web-compatible signatures
// Victory Native accepts the same prop types as web Recharts since they follow similar APIs
export function Chart({
  children,
  width,
  height,
  padding,
  domainPadding,
}: ChartProps): React.JSX.Element {
  const components = getVictoryComponents();
  if (!components || !components.CartesianChart) {
    return <ChartFallback />;
  }
  const { CartesianChart } = components;
  const chartProps: VictoryPropsType = { children };
  if (width !== undefined) {
    chartProps.width = width;
  }
  if (height !== undefined) {
    chartProps.height = height;
  }
  if (padding !== undefined) {
    chartProps.padding = padding;
  }
  if (domainPadding !== undefined) {
    chartProps.domainPadding = domainPadding;
  }
  return <CartesianChart {...chartProps} />;
}

export function Line({
  data,
  x,
  y,
  interpolation,
  animate,
  style,
  labels,
  domain,
  scale,
  samples,
  sortKey,
  sortOrder,
}: LineProps): React.JSX.Element {
  const components = getVictoryComponents();
  if (!components || !components.Line) {
    return <ChartFallback />;
  }
  const { Line: VictoryLine } = components;
  const lineProps: VictoryPropsType = {};
  if (data !== undefined) {
    lineProps.data = data;
  }
  if (x !== undefined) {
    lineProps.x = x;
  }
  if (y !== undefined) {
    lineProps.y = y;
  }
  if (interpolation !== undefined) {
    lineProps.interpolation = interpolation;
  }
  if (animate !== undefined) {
    lineProps.animate = animate;
  }
  if (style !== undefined) {
    lineProps.style = style;
  }
  if (labels !== undefined) {
    lineProps.labels = labels;
  }
  if (domain !== undefined) {
    lineProps.domain = domain;
  }
  if (scale !== undefined) {
    lineProps.scale = scale;
  }
  if (samples !== undefined) {
    lineProps.samples = samples;
  }
  if (sortKey !== undefined) {
    lineProps.sortKey = sortKey;
  }
  if (sortOrder !== undefined) {
    lineProps.sortOrder = sortOrder;
  }
  return <VictoryLine {...lineProps} />;
}

export function Bar({
  data,
  x,
  y,
  animate,
  barWidth,
  style,
  labels,
}: BarProps): React.JSX.Element {
  const components = getVictoryComponents();
  if (!components || !components.Bar) {
    return <ChartFallback />;
  }
  const { Bar: VictoryBar } = components;
  const barProps: VictoryPropsType = {};
  if (data !== undefined) {
    barProps.data = data;
  }
  if (x !== undefined) {
    barProps.x = x;
  }
  if (y !== undefined) {
    barProps.y = y;
  }
  if (animate !== undefined) {
    barProps.animate = animate;
  }
  if (barWidth !== undefined) {
    barProps.barWidth = barWidth;
  }
  if (style !== undefined) {
    barProps.style = style;
  }
  if (labels !== undefined) {
    barProps.labels = labels;
  }
  return <VictoryBar {...barProps} />;
}

export function Area({
  data,
  x,
  y,
  y0,
  interpolation,
  animate,
  style,
  labels,
  domain,
  scale,
}: AreaProps): React.JSX.Element {
  const components = getVictoryComponents();
  if (!components || !components.Area) {
    return <ChartFallback />;
  }
  const { Area: VictoryArea } = components;
  const areaProps: VictoryPropsType = {};
  if (data !== undefined) {
    areaProps.data = data;
  }
  if (x !== undefined) {
    areaProps.x = x;
  }
  if (y !== undefined) {
    areaProps.y = y;
  }
  if (y0 !== undefined) {
    areaProps.y0 = y0;
  }
  if (interpolation !== undefined) {
    areaProps.interpolation = interpolation;
  }
  if (animate !== undefined) {
    areaProps.animate = animate;
  }
  if (style !== undefined) {
    areaProps.style = style;
  }
  if (labels !== undefined) {
    areaProps.labels = labels;
  }
  if (domain !== undefined) {
    areaProps.domain = domain;
  }
  if (scale !== undefined) {
    areaProps.scale = scale;
  }
  return <VictoryArea {...areaProps} />;
}

export function Pie({
  data,
  x,
  y,
  colorScale,
  innerRadius,
  padAngle,
  startAngle,
  endAngle,
  animate,
  style,
  labels,
}: PieProps): React.JSX.Element {
  const components = getVictoryComponents();
  if (!components || !components.Pie) {
    return <ChartFallback />;
  }
  const { Pie: VictoryPie } = components;
  const pieProps: VictoryPropsType = {};
  if (data !== undefined) pieProps.data = data;
  if (x !== undefined) pieProps.x = x;
  if (y !== undefined) pieProps.y = y;
  if (colorScale !== undefined) pieProps.colorScale = colorScale;
  if (innerRadius !== undefined) pieProps.innerRadius = innerRadius;
  if (padAngle !== undefined) pieProps.padAngle = padAngle;
  if (startAngle !== undefined) pieProps.startAngle = startAngle;
  if (endAngle !== undefined) pieProps.endAngle = endAngle;
  if (animate !== undefined) pieProps.animate = animate;
  if (style !== undefined) pieProps.style = style;
  if (labels !== undefined) pieProps.labels = labels;
  return <VictoryPie {...pieProps} />;
}

export function Axis({
  label,
  tickValues,
  tickFormat,
  tickLabelComponent,
  axisLabelComponent,
  gridComponent,
  orientation,
  dependentAxis,
  standalone,
  style,
  domain,
}: AxisProps): React.JSX.Element {
  const components = getVictoryComponents();
  if (!components || !components.CartesianAxis) {
    return <ChartFallback />;
  }
  const { CartesianAxis } = components;
  const axisProps: VictoryPropsType = {};
  if (label !== undefined) axisProps.label = label;
  if (tickValues !== undefined) axisProps.tickValues = tickValues;
  if (tickFormat !== undefined) axisProps.tickFormat = tickFormat;
  if (tickLabelComponent !== undefined)
    axisProps.tickLabelComponent = tickLabelComponent;
  if (axisLabelComponent !== undefined)
    axisProps.axisLabelComponent = axisLabelComponent;
  if (gridComponent !== undefined) axisProps.gridComponent = gridComponent;
  if (orientation !== undefined) axisProps.orientation = orientation;
  if (dependentAxis !== undefined) axisProps.dependentAxis = dependentAxis;
  if (standalone !== undefined) axisProps.standalone = standalone;
  if (style !== undefined) axisProps.style = style;
  if (domain !== undefined) axisProps.domain = domain;
  return <CartesianAxis {...axisProps} />;
}

export const Theme = {
  grayscale: {},
  material: {},
  clean: {},
} as const;

// Re-export all types from web (web is source of truth)
export type {
  ChartBaseProps,
  ChartConfig,
  ChartContainerBaseProps,
  ChartContainerProps,
  ChartStyleProps,
  ChartDataPoint,
  PayloadItem,
  ThemeKeys,
  ChartTooltipContentProps,
  ChartLegendContentProps,
  ChartContextProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartProps,
  LineProps,
  BarProps,
  AreaProps,
  PieProps,
  AxisProps,
} from "@/packages/next-vibe-ui/web/ui/chart";
