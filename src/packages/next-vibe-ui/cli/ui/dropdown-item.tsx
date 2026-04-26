import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { DropdownItemProps } from "../../web/ui/dropdown-item";

export type { DropdownItemProps } from "../../web/ui/dropdown-item";

const SELECTED_MARKER = "\u25B6 "; // ▶
const DISABLED_MARKER = "\u2013 "; // –

export function DropdownItem({
  isSelected = false,
  label,
  description,
  disabled = false,
}: DropdownItemProps): JSX.Element | null {
  const isMcp = useIsMcp();

  if (isMcp) {
    if (disabled) {
      return null;
    }
    return <Text>{isSelected ? `* ${label}` : label}</Text>;
  }

  const prefix = disabled
    ? DISABLED_MARKER
    : isSelected
      ? SELECTED_MARKER
      : "  ";

  return (
    <Box flexDirection="column">
      <Text dimColor={disabled} bold={isSelected}>
        {prefix}
        {label}
      </Text>
      {description !== undefined && description !== "" && (
        <Box paddingLeft={2}>
          <Text dimColor>{description}</Text>
        </Box>
      )}
    </Box>
  );
}
