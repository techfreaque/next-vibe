import * as React from "react";

export type {
  DialogRootProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogCloseProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
} from "../../web/ui/dialog";

import type {
  DialogRootProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogTriggerProps,
  DialogCloseProps,
  DialogPortalProps,
} from "../../web/ui/dialog";

export function Dialog({
  children,
}: DialogRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DialogTrigger({
  children,
}: DialogTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DialogPortal({
  children,
}: DialogPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DialogClose({
  children,
}: DialogCloseProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DialogOverlay(): null {
  return null;
}

export function DialogContent({
  children,
}: DialogContentProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DialogHeader({
  children,
}: DialogHeaderProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DialogFooter({
  children,
}: DialogFooterProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DialogTitle({
  children,
}: DialogTitleProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DialogDescription({
  children,
}: DialogDescriptionProps): React.JSX.Element | null {
  return <>{children}</>;
}
