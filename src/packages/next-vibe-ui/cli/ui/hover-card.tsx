import * as React from "react";

export type {
  HoverCardRootProps,
  HoverCardTriggerProps,
  HoverCardPortalProps,
  HoverCardContentProps,
} from "../../web/ui/hover-card";

import type {
  HoverCardRootProps,
  HoverCardTriggerProps,
  HoverCardPortalProps,
  HoverCardContentProps,
} from "../../web/ui/hover-card";

export function HoverCard({
  children,
}: HoverCardRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function HoverCardTrigger({
  children,
}: HoverCardTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function HoverCardPortal({
  children,
}: HoverCardPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function HoverCardContent({
  children,
}: HoverCardContentProps): React.JSX.Element | null {
  return <>{children}</>;
}
