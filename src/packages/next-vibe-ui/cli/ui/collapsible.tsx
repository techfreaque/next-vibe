import { Box, Text } from "ink";
import type { JSX } from "react";

import type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from "../../web/ui/collapsible";

export type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from "../../web/ui/collapsible";

// CLI: always expanded - no interactivity in terminal

export function Collapsible({ children }: CollapsibleProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}
Collapsible.displayName = "Collapsible";

export function CollapsibleTrigger({
  children,
}: CollapsibleTriggerProps): JSX.Element {
  return <Text bold>▼ {children}</Text>;
}
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export function CollapsibleContent({
  children,
}: CollapsibleContentProps): JSX.Element {
  return <Box paddingLeft={2}>{children}</Box>;
}
CollapsibleContent.displayName = "CollapsibleContent";
