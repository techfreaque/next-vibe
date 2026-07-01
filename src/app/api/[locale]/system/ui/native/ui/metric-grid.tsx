import { styled } from "nativewind";
import { cn } from "next-vibe/core/utils/utils";
import type { MetricGridProps } from "next-vibe/ui/web/ui/metric-grid";
import { View } from "react-native";

export type {
  MetricGridColumns,
  MetricGridProps,
} from "next-vibe/ui/web/ui/metric-grid";

const StyledView = styled(View, { className: "style" });

export function MetricGrid({
  children,
  className,
}: MetricGridProps): React.JSX.Element {
  return (
    <StyledView className={cn("flex-row flex-wrap gap-3", className)}>
      {children}
    </StyledView>
  );
}
MetricGrid.displayName = "MetricGrid";
