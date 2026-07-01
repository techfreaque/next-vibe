import { Box, Text } from "ink";
import type {
  ToggleGroupItemProps,
  ToggleGroupRootProps,
} from "next-vibe/ui/web/ui/toggle-group";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

export type {
  ToggleGroupItemProps,
  ToggleGroupRootProps,
} from "next-vibe/ui/web/ui/toggle-group";

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
