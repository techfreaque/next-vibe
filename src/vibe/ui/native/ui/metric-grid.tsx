import { styled } from "nativewind";
import { View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
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
