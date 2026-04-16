/**
 * CLI Tooltip — shows tooltip content inline as dimmed text
 * In terminal there are no hover states, so we display the content inline.
 */
import { Box, Text } from "ink";
import * as React from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

export type {
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipPortalProps,
} from "../../web/ui/tooltip";

import type {
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipContentProps,
} from "../../web/ui/tooltip";

// Context to pass trigger children up to parent
interface TooltipCtx {
  showContent: boolean;
}

const TooltipContext = React.createContext<TooltipCtx>({ showContent: true });
// Unicode info symbol — terminal display only, not translatable
const INFO_GLYPH = "\u2139\uFE0F ";

export function TooltipProvider({
  children,
}: TooltipProviderProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function Tooltip({
  children,
}: TooltipRootProps): React.JSX.Element | null {
  return (
    <TooltipContext.Provider value={{ showContent: true }}>
      <Box flexDirection="column">{children}</Box>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  children,
}: TooltipTriggerProps): React.JSX.Element | null {
  // Just render the trigger element (e.g. the Info icon button)
  // We suppress it in CLI since it's just a decoration
  void children;
  return null;
}

export function TooltipContent({
  children,
}: TooltipContentProps): React.JSX.Element | null {
  const isMcp = useIsMcp();
  const { showContent } = React.useContext(TooltipContext);

  if (!showContent || !children) {
    return null;
  }

  if (isMcp) {
    return <Text> ({children})</Text>;
  }

  return (
    <Text dimColor italic>
      {INFO_GLYPH}
      {children}
    </Text>
  );
}
