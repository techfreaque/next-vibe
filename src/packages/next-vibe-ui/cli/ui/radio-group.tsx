import { Box, Text } from "ink";
import type { JSX } from "react";

import type {
  RadioGroupRootProps,
  RadioGroupItemProps,
} from "../../web/ui/radio-group";

export type {
  RadioGroupRootProps,
  RadioGroupItemProps,
} from "../../web/ui/radio-group";

// Radio button marker - non-translatable terminal symbol
const RADIO_MARKER = "(\u00a0)";

// CLI: show selected value as plain text
export function RadioGroup({
  value,
  children,
}: RadioGroupRootProps): JSX.Element {
  if (value) {
    return <Text>{value}</Text>;
  }
  return <Box flexDirection="column">{children}</Box>;
}
RadioGroup.displayName = "RadioGroup";

// CLI: show each radio item with a simple marker
export function RadioGroupItem({
  value,
  children,
}: RadioGroupItemProps): JSX.Element {
  return (
    <Box gap={1}>
      <Text>{RADIO_MARKER}</Text>
      <Text>
        {value}
        {children ? ` ${String(children)}` : ""}
      </Text>
    </Box>
  );
}
RadioGroupItem.displayName = "RadioGroupItem";
