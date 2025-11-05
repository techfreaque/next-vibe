/**
 * Chart Component for React Native
 * Provides a consistent interface with web charts but simplified for native
 * Uses view containers that can be enhanced with react-native-svg/victory-native
 */
import React from "react";
import { View } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";

// Import all public types from web version (web is source of truth)
import type {
  ChartBaseProps,
  ChartContainerBaseProps,
  ChartDataPoint,
} from "@/packages/next-vibe-ui/web/ui/chart";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

export function Chart({
  className,
  children,
}: ChartBaseProps): React.JSX.Element {
  return (
    <StyledView className={cn("flex flex-col gap-2", className)}>
      {children}
    </StyledView>
  );
}

Chart.displayName = "Chart";

export function ChartContainer<TData extends ChartDataPoint = ChartDataPoint>({
  className,
  children,
  config: _config,
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
