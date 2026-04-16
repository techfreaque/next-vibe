import * as React from "react";

export type {
  SheetRootProps,
  SheetTriggerProps,
  SheetCloseProps,
  SheetPortalProps,
  SheetOverlayProps,
  SheetContentProps,
  SheetHeaderProps,
  SheetFooterProps,
  SheetTitleProps,
  SheetDescriptionProps,
} from "../../web/ui/sheet";

import type {
  SheetRootProps,
  SheetTriggerProps,
  SheetCloseProps,
  SheetPortalProps,
  SheetContentProps,
  SheetHeaderProps,
  SheetFooterProps,
  SheetTitleProps,
  SheetDescriptionProps,
} from "../../web/ui/sheet";

export function Sheet({ children }: SheetRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function SheetTrigger({
  children,
}: SheetTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function SheetClose({
  children,
}: SheetCloseProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function SheetPortal({
  children,
}: SheetPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function SheetOverlay(): null {
  return null;
}

export function SheetContent({
  children,
}: SheetContentProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function SheetHeader({
  children,
}: SheetHeaderProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function SheetFooter({
  children,
}: SheetFooterProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function SheetTitle({
  children,
}: SheetTitleProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function SheetDescription({
  children,
}: SheetDescriptionProps): React.JSX.Element | null {
  return <>{children}</>;
}
