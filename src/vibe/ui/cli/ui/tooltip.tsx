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

export function TooltipTrigger(
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  _props: TooltipTriggerProps,
): React.JSX.Element | null {
  return null;
}

export function TooltipContent({
  children,
}: TooltipContentProps): React.JSX.Element | null {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text> ({children})</Text>;
  }

  // In CLI, tooltip content is suppressed (no hover). Descriptions are shown
  // via the field widget's inline descriptionStyle when needed.
  return null;
}
