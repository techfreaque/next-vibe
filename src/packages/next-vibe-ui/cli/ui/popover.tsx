import * as React from "react";

export type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverAnchorProps,
  PopoverPortalProps,
  PopoverContentProps,
  PopoverCloseProps,
} from "../../web/ui/popover";

import type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverAnchorProps,
  PopoverPortalProps,
  PopoverContentProps,
  PopoverCloseProps,
} from "../../web/ui/popover";

export function Popover({
  children,
}: PopoverRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function PopoverTrigger({
  children,
}: PopoverTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function PopoverAnchor({
  children,
}: PopoverAnchorProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function PopoverPortal({
  children,
}: PopoverPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function PopoverContent({
  children,
}: PopoverContentProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function PopoverClose({
  children,
}: PopoverCloseProps): React.JSX.Element | null {
  return <>{children}</>;
}
