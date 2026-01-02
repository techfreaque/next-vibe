"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cn } from "next-vibe/shared/utils/utils";
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "next-vibe-ui/ui/icons";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

// Cross-platform types
export interface ContextMenuRootProps {
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export type ContextMenuTriggerProps = {
  asChild?: boolean;
  children?: React.ReactNode;
} & StyleType;

export interface ContextMenuGroupProps {
  children?: React.ReactNode;
}

export interface ContextMenuPortalProps {
  children?: React.ReactNode;
  forceMount?: true;
  container?: HTMLElement | null;
}

export interface ContextMenuSubProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface ContextMenuRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

export type ContextMenuSubTriggerProps = {
  children?: React.ReactNode;
  inset?: boolean;
} & StyleType;

export type ContextMenuSubContentProps = {
  children?: React.ReactNode;
} & StyleType;

export type ContextMenuContentProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  onCloseAutoFocus?: (event: Event) => void;
  forceMount?: true;
} & StyleType;

export type ContextMenuItemProps = {
  children?: React.ReactNode;
  inset?: boolean;
  key?: string | number;
  onSelect?: (event: Event) => void;
  disabled?: boolean;
  asChild?: boolean;
  onClick?: () => void;
} & StyleType;

export type ContextMenuCheckboxItemProps = {
  children?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
} & StyleType;

export type ContextMenuRadioItemProps = {
  children?: React.ReactNode;
  value?: string;
} & StyleType;

export type ContextMenuLabelProps = {
  children?: React.ReactNode;
  inset?: boolean;
} & StyleType;

export type ContextMenuSeparatorProps = StyleType;

export interface ContextMenuShortcutProps {
  children?: React.ReactNode;
  className?: string;
}

export function ContextMenu({ children, ...props }: ContextMenuRootProps): React.JSX.Element {
  return <ContextMenuPrimitive.Root {...props}>{children}</ContextMenuPrimitive.Root>;
}
ContextMenu.displayName = ContextMenuPrimitive.Root.displayName;

export function ContextMenuTrigger({
  children,
  asChild,
  className,
  style,
  ...props
}: ContextMenuTriggerProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Trigger asChild={asChild} className={className} style={style} {...props}>
      {children}
    </ContextMenuPrimitive.Trigger>
  );
}
ContextMenuTrigger.displayName = ContextMenuPrimitive.Trigger.displayName;

export function ContextMenuGroup({ children }: ContextMenuGroupProps): React.JSX.Element {
  return <ContextMenuPrimitive.Group>{children}</ContextMenuPrimitive.Group>;
}
ContextMenuGroup.displayName = ContextMenuPrimitive.Group.displayName;

export function ContextMenuPortal({
  children,
  forceMount,
  container,
}: ContextMenuPortalProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Portal forceMount={forceMount} container={container}>
      {children}
    </ContextMenuPrimitive.Portal>
  );
}
ContextMenuPortal.displayName = ContextMenuPrimitive.Portal.displayName;

export function ContextMenuSub({ children, ...props }: ContextMenuSubProps): React.JSX.Element {
  return <ContextMenuPrimitive.Sub {...props}>{children}</ContextMenuPrimitive.Sub>;
}
ContextMenuSub.displayName = ContextMenuPrimitive.Sub.displayName;

export function ContextMenuRadioGroup({
  children,
  ...props
}: ContextMenuRadioGroupProps): React.JSX.Element {
  return <ContextMenuPrimitive.RadioGroup {...props}>{children}</ContextMenuPrimitive.RadioGroup>;
}
ContextMenuRadioGroup.displayName = ContextMenuPrimitive.RadioGroup.displayName;

export function ContextMenuSubTrigger({
  className,
  style,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent data-disabled:opacity-50 data-disabled:pointer-events-none",
        inset && "pl-8",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </ContextMenuPrimitive.SubTrigger>
  );
}
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

export function ContextMenuSubContent({
  className,
  style,
  ...props
}: ContextMenuSubContentProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      style={style}
      {...props}
    />
  );
}
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

export function ContextMenuContent({
  className,
  style,
  ...props
}: ContextMenuContentProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cn(
          "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        style={style}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

export function ContextMenuItem({
  className,
  style,
  inset,
  children,
  ...props
}: ContextMenuItemProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        inset && "pl-8",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Item>
  );
}
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

export function ContextMenuCheckboxItem({
  className,
  style,
  children,
  checked,
  onCheckedChange,
  ...props
}: ContextMenuCheckboxItemProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.CheckboxItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      style={style}
      checked={checked ?? false}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

export function ContextMenuRadioItem({
  className,
  style,
  children,
  value,
  ...props
}: ContextMenuRadioItemProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      style={style}
      value={value ?? ""}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <DotFilledIcon className="h-4 w-4 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

export function ContextMenuLabel({
  className,
  style,
  inset,
  children,
  ...props
}: ContextMenuLabelProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Label
      className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
      style={style}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Label>
  );
}
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

export function ContextMenuSeparator({
  className,
  style,
  ...props
}: ContextMenuSeparatorProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      style={style}
      {...props}
    />
  );
}
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

export function ContextMenuShortcut({
  className,
  children,
  ...props
}: ContextMenuShortcutProps): React.JSX.Element {
  return (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props}>
      {children}
    </span>
  );
}
ContextMenuShortcut.displayName = "ContextMenuShortcut";
