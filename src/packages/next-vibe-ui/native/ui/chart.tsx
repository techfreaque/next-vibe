/**
 * Chart Component for React Native
 * TODO: Implement charts using react-native-svg or similar library
 * Currently a placeholder container
 */
import type { ReactNode } from "react";
import React from "react";
import { View } from "react-native";

import { cn } from "../lib/utils";

interface ChartProps {
  children: ReactNode;
  className?: string;
}

export const Chart = React.forwardRef<View, ChartProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </View>
    );
  },
);

Chart.displayName = "Chart";

export const ChartContainer = Chart;
export const ChartTooltip = View;
export const ChartTooltipContent = View;
export const ChartLegend = View;
export const ChartLegendContent = View;
