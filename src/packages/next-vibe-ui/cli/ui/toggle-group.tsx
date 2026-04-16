import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type {
  ToggleGroupRootProps,
  ToggleGroupItemProps,
} from "../../web/ui/toggle-group";

export type {
  ToggleGroupRootProps,
  ToggleGroupItemProps,
} from "../../web/ui/toggle-group";

// CLI: render group as a box of items
export function ToggleGroup({ children }: ToggleGroupRootProps): JSX.Element {
  return (
    <Box flexDirection="row" gap={1}>
      {children}
    </Box>
  );
}
ToggleGroup.displayName = "ToggleGroup";

// CLI: each item shows [on] or [off] based on whether its value matches the group value
export function ToggleGroupItem({
  children,
  value,
  disabled,
}: ToggleGroupItemProps): JSX.Element {
  void value;
  void disabled;
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{children}</Text>;
  }

  return <Text>[{children}]</Text>;
}
ToggleGroupItem.displayName = "ToggleGroupItem";
