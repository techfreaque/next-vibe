"use client";

import { cn } from "next-vibe/shared/utils";
import * as React from "react";
import * as RechartsPrimitive from "recharts";

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

interface ChartContextProps<TData extends ChartDataPoint = ChartDataPoint> {
  config: ChartConfig<TData>;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart<
  TData extends ChartDataPoint = ChartDataPoint,
>(): ChartContextProps<TData> {
  const context = React.useContext(ChartContext);

  if (!context) {
    // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string -- Error handling for context
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context as ChartContextProps<TData>;
}

function ChartContainer<TData extends ChartDataPoint = ChartDataPoint>({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig<TData>;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}): React.JSX.Element {
  const uniqueId = React.useId();
  // eslint-disable-next-line i18next/no-literal-string
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}): React.JSX.Element | null => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

interface ChartTooltipContentProps<
  TData extends ChartDataPoint = ChartDataPoint,
> {
  active?: boolean;
  payload?: PayloadItem<TData>[];
  label?: React.ReactNode;
  labelFormatter?: (
    value: React.ReactNode,
    payload: PayloadItem<TData>[],
  ) => React.ReactNode;
  formatter?: (
    value: string | number | null,
    name: string,
    props: PayloadItem<TData>,
    index: number,
    payload: TData,
  ) => React.ReactNode;
  className?: string;
  labelClassName?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  color?: string;
  nameKey?: string;
  labelKey?: string;
}

function ChartTooltipContent<TData extends ChartDataPoint = ChartDataPoint>({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps<TData>): React.JSX.Element | null {
  const { config } = useChart<TData>();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || String(item?.dataKey) || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item: PayloadItem<TData>, index: number) => {
          const key = `${nameKey || item.name || String(item.dataKey) || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload?.fill || item.color;

          return (
            <div
              key={String(item.dataKey) || index}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center",
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload!)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          },
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center",
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {typeof item.value === "number"
                          ? item.value.toLocaleString()
                          : item.value}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

interface ChartLegendContentProps {
  className?: string;
  hideIcon?: boolean;
  payload?: Array<{
    value?: string;
    dataKey?: string;
    color?: string;
    [key: string]: string | number | boolean | undefined;
  }>;
  verticalAlign?: "top" | "bottom";
  nameKey?: string;
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentProps): React.JSX.Element | null {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || String(item.dataKey) || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={item.value || key}
            className={cn(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3",
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

// Helper to extract item config from a payload with improved type safety
function getPayloadConfigFromPayload<TData extends ChartDataPoint>(
  config: ChartConfig<TData>,
  payload: PayloadItem<TData> | Record<string, string | number | boolean>,
  key: string,
): ChartConfig<TData>[string] | undefined {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? (payload.payload as Record<string, string | number | boolean>)
      : undefined;

  let configLabelKey: string = key;

  if (key in payload) {
    const value = (payload as Record<string, string | number | boolean>)[key];
    if (typeof value === "string") {
      configLabelKey = value;
    }
  } else if (payloadPayload && key in payloadPayload) {
    const value = payloadPayload[key];
    if (typeof value === "string") {
      configLabelKey = value;
    }
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
