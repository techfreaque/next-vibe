"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface ContextMenuRootProps {
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface ContextMenuTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

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

export interface ContextMenuSubTriggerProps {
  className?: string;
  children?: React.ReactNode;
  inset?: boolean;
}

export interface ContextMenuSubContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ContextMenuContentProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onCloseAutoFocus?: (event: Event) => void;
  forceMount?: true;
}

export interface ContextMenuItemProps {
  className?: string;
  children?: React.ReactNode;
  inset?: boolean;
  key?: string | number;
  onSelect?: (event: Event) => void;
  disabled?: boolean;
  asChild?: boolean;
  onClick?: () => void;
}

export interface ContextMenuCheckboxItemProps {
  className?: string;
  children?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface ContextMenuRadioItemProps {
  className?: string;
  children?: React.ReactNode;
  value?: string;
}

export interface ContextMenuLabelProps {
  className?: string;
  children?: React.ReactNode;
  inset?: boolean;
}

export interface ContextMenuSeparatorProps {
  className?: string;
}

export interface ContextMenuShortcutProps {
  className?: string;
  children?: React.ReactNode;
}

export function ContextMenu({
  children,
  ...props
}: ContextMenuRootProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Root {...props}>{children}</ContextMenuPrimitive.Root>
  );
}
ContextMenu.displayName = ContextMenuPrimitive.Root.displayName;

export function ContextMenuTrigger({
  children,
  asChild,
  ...props
}: ContextMenuTriggerProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </ContextMenuPrimitive.Trigger>
  );
}
ContextMenuTrigger.displayName = ContextMenuPrimitive.Trigger.displayName;

export function ContextMenuGroup({
  children,
}: ContextMenuGroupProps): React.JSX.Element {
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

export function ContextMenuSub({
  children,
  ...props
}: ContextMenuSubProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Sub {...props}>{children}</ContextMenuPrimitive.Sub>
  );
}
ContextMenuSub.displayName = ContextMenuPrimitive.Sub.displayName;

export function ContextMenuRadioGroup({
  children,
  ...props
}: ContextMenuRadioGroupProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.RadioGroup {...props}>
      {children}
    </ContextMenuPrimitive.RadioGroup>
  );
}
ContextMenuRadioGroup.displayName = ContextMenuPrimitive.RadioGroup.displayName;

export function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        inset && "pl-8",
        className,
      )}
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
  ...props
}: ContextMenuSubContentProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  );
}
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

export function ContextMenuContent({
  className,
  ...props
}: ContextMenuContentProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

export function ContextMenuItem({
  className,
  inset,
  children,
  ...props
}: ContextMenuItemProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Item>
  );
}
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

export function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: ContextMenuCheckboxItemProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.CheckboxItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
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
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName;

export function ContextMenuRadioItem({
  className,
  children,
  value,
  ...props
}: ContextMenuRadioItemProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
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
  inset,
  children,
  ...props
}: ContextMenuLabelProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Label>
  );
}
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

export function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuSeparatorProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
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
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    >
      {children}
    </span>
  );
}
ContextMenuShortcut.displayName = "ContextMenuShortcut";
