import * as React from "react";

export type {
  DrawerRootProps,
  DrawerTriggerProps,
  DrawerPortalProps,
  DrawerCloseProps,
  DrawerTriggerRefObject,
  DrawerCloseRefObject,
  DrawerOverlayProps,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerFooterProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerContextValue,
} from "../../web/ui/drawer";

import type {
  DrawerRootProps,
  DrawerTriggerProps,
  DrawerCloseProps,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerFooterProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
} from "../../web/ui/drawer";

export function Drawer({
  children,
}: DrawerRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DrawerTrigger({
  children,
}: DrawerTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DrawerClose({
  children,
}: DrawerCloseProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DrawerPortal({
  children,
}: {
  children?: React.ReactNode;
}): React.JSX.Element | null {
  return <>{children}</>;
}

export function DrawerOverlay(): null {
  return null;
}

export function DrawerContent({
  children,
}: DrawerContentProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DrawerHeader({
  children,
}: DrawerHeaderProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DrawerFooter({
  children,
}: DrawerFooterProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DrawerTitle({
  children,
}: DrawerTitleProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DrawerDescription({
  children,
}: DrawerDescriptionProps): React.JSX.Element | null {
  return <>{children}</>;
}
