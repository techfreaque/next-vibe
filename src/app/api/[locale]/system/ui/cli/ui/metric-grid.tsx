import { Box } from "ink";
import type { MetricGridProps } from "next-vibe/ui/web/ui/metric-grid";
import type { JSX } from "react";

export type {
  MetricGridColumns,
  MetricGridProps,
} from "next-vibe/ui/web/ui/metric-grid";

export function MetricGrid({ children }: MetricGridProps): JSX.Element {
  return (
    <Box flexDirection="column" gap={0}>
      {children}
    </Box>
  );
}
MetricGrid.displayName = "MetricGrid";
