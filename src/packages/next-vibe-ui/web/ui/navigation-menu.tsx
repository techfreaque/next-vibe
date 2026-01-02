"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import { ChevronDownIcon } from "next-vibe-ui/ui/icons";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
);

export type NavigationMenuTriggerStyleProps = VariantProps<typeof navigationMenuTriggerStyle>;

// NavigationMenu
export type NavigationMenuProps = {
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  defaultValue?: string;
  delayDuration?: number;
  skipDelayDuration?: number;
  dir?: "ltr" | "rtl";
  orientation?: "horizontal" | "vertical";
} & StyleType;

export function NavigationMenu({
  className,
  style,
  children,
  ...props
}: NavigationMenuProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Root
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      style={style}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
}
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

// NavigationMenuList
export type NavigationMenuListProps = {
  children?: React.ReactNode;
} & StyleType;

export function NavigationMenuList({
  className,
  style,
  children,
  ...props
}: NavigationMenuListProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.List
      className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
      style={style}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.List>
  );
}
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

// NavigationMenuItem
export type NavigationMenuItemProps = {
  children?: React.ReactNode;
  value?: string;
} & StyleType;

export function NavigationMenuItem({
  value,
  className,
  style,
  children,
}: NavigationMenuItemProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Item value={value} className={className} style={style}>
      {children}
    </NavigationMenuPrimitive.Item>
  );
}
NavigationMenuItem.displayName = NavigationMenuPrimitive.Item.displayName;

// NavigationMenuTrigger
export type NavigationMenuTriggerProps = {
  children?: React.ReactNode;
} & StyleType;

export function NavigationMenuTrigger({
  className,
  style,
  children,
  ...props
}: NavigationMenuTriggerProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      style={style}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

// NavigationMenuContent
export type NavigationMenuContentProps = {
  children?: React.ReactNode;
} & StyleType;

export function NavigationMenuContent({
  className,
  style,
  children,
  ...props
}: NavigationMenuContentProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Content>
  );
}
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

// NavigationMenuLink
export type NavigationMenuLinkProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  active?: boolean;
} & StyleType;

export function NavigationMenuLink({
  className,
  style,
  children,
  ...props
}: NavigationMenuLinkProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Link className={className} style={style} {...props}>
      {children}
    </NavigationMenuPrimitive.Link>
  );
}
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName;

export type NavigationMenuViewportProps = StyleType;

export function NavigationMenuViewport({
  className,
  style,
  ...props
}: NavigationMenuViewportProps): React.JSX.Element {
  return (
    <div className={cn("absolute left-0 top-full flex justify-center")}>
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        style={style}
        {...props}
      />
    </div>
  );
}
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

export type NavigationMenuIndicatorProps = StyleType;

export function NavigationMenuIndicator({
  className,
  style,
  ...props
}: NavigationMenuIndicatorProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Indicator
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
        className,
      )}
      style={style}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export { navigationMenuTriggerStyle };
