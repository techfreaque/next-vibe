import * as React from "react";

export type {
  AlertDialogRootProps,
  AlertDialogTriggerProps,
  AlertDialogPortalProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogHeaderProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
} from "../../web/ui/alert-dialog";

import type {
  AlertDialogRootProps,
  AlertDialogTriggerProps,
  AlertDialogPortalProps,
  AlertDialogContentProps,
  AlertDialogHeaderProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
} from "../../web/ui/alert-dialog";

export function AlertDialog({
  children,
}: AlertDialogRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function AlertDialogTrigger({
  children,
}: AlertDialogTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function AlertDialogPortal({
  children,
}: AlertDialogPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function AlertDialogOverlay(): null {
  return null;
}

export function AlertDialogContent({
  children,
}: AlertDialogContentProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function AlertDialogHeader({
  children,
}: AlertDialogHeaderProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function AlertDialogFooter({
  children,
}: AlertDialogFooterProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function AlertDialogTitle({
  children,
}: AlertDialogTitleProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function AlertDialogDescription({
  children,
}: AlertDialogDescriptionProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function AlertDialogAction({
  children,
}: AlertDialogActionProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function AlertDialogCancel({
  children,
}: AlertDialogCancelProps): React.JSX.Element | null {
  return <>{children}</>;
}
