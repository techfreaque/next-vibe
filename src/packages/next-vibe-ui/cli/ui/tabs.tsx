import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "../../web/ui/tabs";

export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "../../web/ui/tabs";

export function Tabs({ children }: TabsProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}
Tabs.displayName = "Tabs";

export function TabsList({ children }: TabsListProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Box>{children}</Box>;
  }

  return (
    <Box flexDirection="row" gap={1} marginBottom={1}>
      {children}
    </Box>
  );
}
TabsList.displayName = "TabsList";

export function TabsTrigger({
  children,
  value,
  disabled,
}: TabsTriggerProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text dimColor>{String(value)}</Text>;
  }

  if (disabled) {
    return <Text dimColor>[{children}]</Text>;
  }

  // In CLI, all tabs show as inactive style - no active state tracking
  return (
    <Text color="cyan" dimColor>
      [{children}]
    </Text>
  );
}
TabsTrigger.displayName = "TabsTrigger";

export function TabsContent({
  children,
  value,
}: TabsContentProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Box flexDirection="column">{children}</Box>;
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold dimColor>
        {String(value)}
      </Text>
      <Box paddingLeft={1}>{children}</Box>
    </Box>
  );
}
TabsContent.displayName = "TabsContent";
