import * as React from "react";

export type {
  NavigationMenuContentProps,
  NavigationMenuIndicatorProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuProps,
  NavigationMenuTriggerProps,
  NavigationMenuTriggerStyleProps,
  NavigationMenuViewportProps,
} from "../../web/ui/navigation-menu";

import { cva } from "class-variance-authority";

export const navigationMenuTriggerStyle = cva("");

import type {
  NavigationMenuContentProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuProps,
  NavigationMenuTriggerProps,
} from "../../web/ui/navigation-menu";

export function NavigationMenu({
  children,
}: NavigationMenuProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function NavigationMenuList({
  children,
}: NavigationMenuListProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function NavigationMenuItem({
  children,
}: NavigationMenuItemProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function NavigationMenuTrigger({
  children,
}: NavigationMenuTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function NavigationMenuContent({
  children,
}: NavigationMenuContentProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function NavigationMenuLink({
  children,
}: NavigationMenuLinkProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function NavigationMenuViewport(): null {
  return null;
}

export function NavigationMenuIndicator(): null {
  return null;
}
