"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { cn } from "next-vibe/shared/utils/utils";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "next-vibe-ui/ui/icons";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

// Cross-platform types
export type MenubarRootProps = {
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  dir?: "ltr" | "rtl";
  loop?: boolean;
} & StyleType;

export interface MenubarMenuProps {
  children?: React.ReactNode;
  value?: string;
}

export type MenubarTriggerProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  asChild?: boolean;
} & StyleType;

export interface MenubarGroupProps {
  children?: React.ReactNode;
}

export interface MenubarPortalProps {
  children?: React.ReactNode;
  forceMount?: true;
  container?: HTMLElement | null;
}

export interface MenubarSubProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface MenubarRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

export type MenubarSubTriggerProps = {
  children?: React.ReactNode;
  inset?: boolean;
  disabled?: boolean;
} & StyleType;

export type MenubarSubContentProps = {
  children?: React.ReactNode;
} & StyleType;

export type MenubarContentProps = {
  children?: React.ReactNode;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  sideOffset?: number;
  loop?: boolean;
  onCloseAutoFocus?: (event: Event) => void;
  forceMount?: true;
} & StyleType;

export type MenubarItemProps = {
  children?: React.ReactNode;
  inset?: boolean;
  disabled?: boolean;
  onSelect?: (event: Event) => void;
  asChild?: boolean;
} & StyleType;

export type MenubarCheckboxItemProps = {
  children?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
} & StyleType;

export type MenubarRadioItemProps = {
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
} & StyleType;

export type MenubarLabelProps = {
  children?: React.ReactNode;
  inset?: boolean;
} & StyleType;

export type MenubarSeparatorProps = StyleType;

export interface MenubarShortcutProps {
  children?: React.ReactNode;
  className?: string;
}

export function Menubar({
  className,
  style,
  children,
  ...props
}: MenubarRootProps): React.JSX.Element {
  return (
    <MenubarPrimitive.Root
      className={cn(
        "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </MenubarPrimitive.Root>
  );
}
Menubar.displayName = MenubarPrimitive.Root.displayName;

export function MenubarMenu({
  children,
  ...props
}: MenubarMenuProps): React.JSX.Element {
  return <MenubarPrimitive.Menu {...props}>{children}</MenubarPrimitive.Menu>;
}
MenubarMenu.displayName = MenubarPrimitive.Menu.displayName;

export function MenubarTrigger({
  className,
  style,
  children,
  ...props
}: MenubarTriggerProps): React.JSX.Element {
  return (
    <MenubarPrimitive.Trigger
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </MenubarPrimitive.Trigger>
  );
}
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

export function MenubarGroup({
  children,
}: MenubarGroupProps): React.JSX.Element {
  return <MenubarPrimitive.Group>{children}</MenubarPrimitive.Group>;
}
MenubarGroup.displayName = MenubarPrimitive.Group.displayName;

export function MenubarPortal({
  children,
  forceMount,
  container,
}: MenubarPortalProps): React.JSX.Element {
  return (
    <MenubarPrimitive.Portal forceMount={forceMount} container={container}>
      {children}
    </MenubarPrimitive.Portal>
  );
}
MenubarPortal.displayName = MenubarPrimitive.Portal.displayName;

export function MenubarSub({
  children,
  ...props
}: MenubarSubProps): React.JSX.Element {
  return <MenubarPrimitive.Sub {...props}>{children}</MenubarPrimitive.Sub>;
}
MenubarSub.displayName = MenubarPrimitive.Sub.displayName;

export function MenubarRadioGroup({
  children,
  ...props
}: MenubarRadioGroupProps): React.JSX.Element {
  return (
    <MenubarPrimitive.RadioGroup {...props}>
      {children}
    </MenubarPrimitive.RadioGroup>
  );
}
MenubarRadioGroup.displayName = MenubarPrimitive.RadioGroup.displayName;

export function MenubarSubTrigger({
  className,
  style,
  inset,
  children,
  ...props
}: MenubarSubTriggerProps): React.JSX.Element {
  return (
    <MenubarPrimitive.SubTrigger
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-disabled:opacity-50 data-disabled:pointer-events-none",
        inset && "pl-8",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  );
}
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

export function MenubarSubContent({
  className,
  style,
  ...props
}: MenubarSubContentProps): React.JSX.Element {
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      style={style}
      {...props}
    />
  );
}
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

export function MenubarContent({
  className,
  style,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: MenubarContentProps): React.JSX.Element {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        style={style}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
}
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

export function MenubarItem({
  className,
  style,
  inset,
  children,
  ...props
}: MenubarItemProps): React.JSX.Element {
  return (
    <MenubarPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        inset && "pl-8",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </MenubarPrimitive.Item>
  );
}
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

export function MenubarCheckboxItem({
  className,
  style,
  children,
  checked,
  onCheckedChange,
  ...props
}: MenubarCheckboxItemProps): React.JSX.Element {
  return (
    <MenubarPrimitive.CheckboxItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      style={style}
      checked={checked}
      onCheckedChange={onCheckedChange ?? undefined}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

export function MenubarRadioItem({
  className,
  style,
  children,
  value,
  ...props
}: MenubarRadioItemProps): React.JSX.Element {
  return (
    <MenubarPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      style={style}
      value={value}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <DotFilledIcon className="h-4 w-4 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

export function MenubarLabel({
  className,
  style,
  inset,
  children,
  ...props
}: MenubarLabelProps): React.JSX.Element {
  return (
    <MenubarPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </MenubarPrimitive.Label>
  );
}
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

export function MenubarSeparator({
  className,
  style,
  ...props
}: MenubarSeparatorProps): React.JSX.Element {
  return (
    <MenubarPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      style={style}
      {...props}
    />
  );
}
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

export function MenubarShortcut({
  className,
  children,
  ...props
}: MenubarShortcutProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
MenubarShortcut.displayName = "MenubarShortcut";
