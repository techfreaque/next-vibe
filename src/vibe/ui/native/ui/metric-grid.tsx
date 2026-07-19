import { styled } from "nativewind";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { View } from "react-native";

import type { MetricGridProps } from "../../web/ui/metric-grid";

export type {
  MetricGridColumns,
  MetricGridProps,
} from "../../web/ui/metric-grid";

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
