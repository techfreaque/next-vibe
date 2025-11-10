"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface DropdownMenuRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children?: React.ReactNode;
}

export interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface DropdownMenuGroupProps {
  children?: React.ReactNode;
}

export interface DropdownMenuPortalProps {
  children?: React.ReactNode;
  forceMount?: true;
  container?: HTMLElement | null;
}

export interface DropdownMenuSubProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface DropdownMenuRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

export interface DropdownMenuSubTriggerProps {
  className?: string;
  children?: React.ReactNode;
  inset?: boolean;
}

export interface DropdownMenuSubContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuContentProps {
  className?: string;
  children?: React.ReactNode;
  sideOffset?: number;
  align?: "start" | "center" | "end";
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onCloseAutoFocus?: (event: Event) => void;
  forceMount?: true;
}

export interface DropdownMenuItemProps {
  className?: string;
  children?: React.ReactNode;
  inset?: boolean;
  key?: string | number;
  onSelect?: (event: Event) => void;
  disabled?: boolean;
  asChild?: boolean;
  onClick?: () => void;
}

export interface DropdownMenuCheckboxItemProps {
  className?: string;
  children?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface DropdownMenuRadioItemProps {
  className?: string;
  children?: React.ReactNode;
  value?: string;
}

export interface DropdownMenuLabelProps {
  className?: string;
  children?: React.ReactNode;
  inset?: boolean;
}

export interface DropdownMenuSeparatorProps {
  className?: string;
}

export interface DropdownMenuShortcutProps {
  className?: string;
  children?: React.ReactNode;
}

export function DropdownMenu({ children, ...props }: DropdownMenuRootProps): React.JSX.Element {
  return <DropdownMenuPrimitive.Root {...props}>{children}</DropdownMenuPrimitive.Root>;
}
DropdownMenu.displayName = DropdownMenuPrimitive.Root.displayName;

export function DropdownMenuTrigger({ children, asChild, ...props }: DropdownMenuTriggerProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
}
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

export function DropdownMenuGroup({ children }: DropdownMenuGroupProps): React.JSX.Element {
  return <DropdownMenuPrimitive.Group>{children}</DropdownMenuPrimitive.Group>;
}
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName;

export function DropdownMenuPortal({ children, forceMount, container }: DropdownMenuPortalProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Portal forceMount={forceMount} container={container}>
      {children}
    </DropdownMenuPrimitive.Portal>
  );
}
DropdownMenuPortal.displayName = DropdownMenuPrimitive.Portal.displayName;

export function DropdownMenuSub({ children, ...props }: DropdownMenuSubProps): React.JSX.Element {
  return <DropdownMenuPrimitive.Sub {...props}>{children}</DropdownMenuPrimitive.Sub>;
}
DropdownMenuSub.displayName = DropdownMenuPrimitive.Sub.displayName;

export function DropdownMenuRadioGroup({ children, ...props }: DropdownMenuRadioGroupProps): React.JSX.Element {
  return <DropdownMenuPrimitive.RadioGroup {...props}>{children}</DropdownMenuPrimitive.RadioGroup>;
}
DropdownMenuRadioGroup.displayName = DropdownMenuPrimitive.RadioGroup.displayName;

export function DropdownMenuSubTrigger({ className, inset, children, ...props }: DropdownMenuSubTriggerProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

export function DropdownMenuSubContent({ className, ...props }: DropdownMenuSubContentProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  );
}
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

export function DropdownMenuContent({ className, sideOffset = 4, ...props }: DropdownMenuContentProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export function DropdownMenuItem({ className, inset, children, ...props }: DropdownMenuItemProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export function DropdownMenuCheckboxItem({ className, children, checked, onCheckedChange, ...props }: DropdownMenuCheckboxItemProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      checked={checked ?? false}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

export function DropdownMenuRadioItem({ className, children, value, ...props }: DropdownMenuRadioItemProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      value={value ?? ""}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <DotFilledIcon className="h-4 w-4 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

export function DropdownMenuLabel({ className, inset, children, ...props }: DropdownMenuLabelProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Label>
  );
}
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

export function DropdownMenuShortcut({ className, children, ...props }: DropdownMenuShortcutProps): React.JSX.Element {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    >
      {children}
    </span>
  );
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
