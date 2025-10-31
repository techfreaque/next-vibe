/**
 * Chart Component for React Native
 * Provides a consistent interface with web charts but simplified for native
 * Uses view containers that can be enhanced with react-native-svg/victory-native
 */
import React from "react";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

import { cn } from "../lib/utils";

// Cross-platform type definitions - import from web to ensure exact match
export type {
  ThemeKeys,
  ChartConfig,
  ChartDataPoint,
  PayloadItem,
  ChartBaseProps,
  ChartContainerBaseProps,
} from "next-vibe-ui/ui/chart";

import type {
  ChartBaseProps,
  ChartContainerBaseProps,
  ChartDataPoint,
} from "next-vibe-ui/ui/chart";

// Type-safe View with className support (NativeWind)
const StyledView = View as unknown as React.ForwardRefExoticComponent<
  ViewProps & { className?: string } & React.RefAttributes<View>
>;

export const Chart = React.forwardRef<View, ChartBaseProps>(
  ({ className, children }, ref) => {
    return (
      <StyledView ref={ref} className={cn("flex flex-col gap-2", className)}>
        {children}
      </StyledView>
    );
  },
);

Chart.displayName = "Chart";

export function ChartContainer<TData extends ChartDataPoint = ChartDataPoint>({
  className,
  children,
  config,
}: ChartContainerBaseProps<TData>): React.JSX.Element {
  // Native implementation doesn't use the config for styling like web does
  // But we accept it to maintain interface consistency
  return (
    <StyledView className={cn("flex aspect-video justify-center", className)}>
      {children}
    </StyledView>
  );
}

ChartContainer.displayName = "ChartContainer";

// Placeholder components for native - these maintain API consistency
// In a full implementation, these would be replaced with proper chart library components
export const ChartTooltip = View;
export const ChartTooltipContent = View;
export const ChartLegend = View;
export const ChartLegendContent = View;
