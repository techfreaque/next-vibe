import { Box, Text } from "ink";
import type { JSX } from "react";

import type {
  DetailFieldProps,
  DetailGridProps,
} from "../../web/ui/detail-grid";

export type {
  DetailFieldProps,
  DetailGridColumns,
  DetailGridProps,
} from "../../web/ui/detail-grid";

export function DetailGrid({ children }: DetailGridProps): JSX.Element {
  return (
    <Box flexDirection="column" gap={0}>
      {children}
    </Box>
  );
}
DetailGrid.displayName = "DetailGrid";

export function DetailField({ label, value }: DetailFieldProps): JSX.Element {
  return (
    <Box gap={1}>
      <Text dimColor>{label}:</Text>
      <Text>
        {value !== undefined && value !== null ? String(value) : "\u2014"}
      </Text>
    </Box>
  );
}
DetailField.displayName = "DetailField";
