import { Box } from "ink";
import type { JSX } from "react";

import type { MetricGridProps } from "../../web/components/metric-grid";

export type {
  MetricGridColumns,
  MetricGridProps,
} from "../../web/components/metric-grid";

export function MetricGrid({ children }: MetricGridProps): JSX.Element {
  return (
    <Box flexDirection="column" gap={0}>
      {children}
    </Box>
  );
}
MetricGrid.displayName = "MetricGrid";
