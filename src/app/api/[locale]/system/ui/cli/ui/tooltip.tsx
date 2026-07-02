/**
 * CLI Tooltip
 *
 * In terminal there are no hover states.
 * - TooltipTrigger: renders children (the interactive element)
 * - TooltipContent: suppressed in CLI (noise), compact in MCP
 */
import { Text } from "ink";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import * as React from "react";

export type {
  TooltipContentProps,
  TooltipPortalProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from "../../web/ui/tooltip";

import type {
  TooltipContentProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from "../../web/ui/tooltip";

export function TooltipProvider({
  children,
}: TooltipProviderProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function Tooltip({
  children,
}: TooltipRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function TooltipTrigger({
  children,
}: TooltipTriggerProps): React.JSX.Element | null {
  // Render children - in CLI the trigger is the interactive element itself
  return <>{children}</>;
}

export function TooltipContent({
  children,
}: TooltipContentProps): React.JSX.Element | null {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text> ({children})</Text>;
  }

  // In CLI, tooltip content is suppressed - the trigger itself is sufficient
  return null;
}
