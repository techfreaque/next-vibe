import { View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import type { MetricGridProps } from "../../web/components/metric-grid";
import { styledNative } from "../utils/style-converter";

export type {
  MetricGridColumns,
  MetricGridProps,
} from "../../web/components/metric-grid";

const StyledView = styledNative(View);

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
