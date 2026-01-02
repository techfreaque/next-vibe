"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import { Check, ChevronDown, ChevronUp } from "@/packages/next-vibe-ui/web/ui/icons";

import type { StyleType } from "../utils/style-type";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export type SelectGroupProps = {
  children?: React.ReactNode;
} & StyleType;

export type SelectValueProps = {
  placeholder?: string;
} & StyleType;

export type SelectTriggerProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  id?: string;
} & StyleType;

export type SelectLabelProps = {
  children?: React.ReactNode;
} & StyleType;

export type SelectContentProps = {
  children?: React.ReactNode;
  position?: "popper" | "item-aligned";
} & StyleType;

export type SelectItemProps = {
  value: string;
  label?: string;
  children?: React.ReactNode;
  disabled?: boolean;
} & StyleType;

export type SelectSeparatorProps = StyleType;

export function Select({ children, ...props }: SelectRootProps): React.JSX.Element {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
}
Select.displayName = SelectPrimitive.Root.displayName;

export function SelectGroup({
  className,
  style,
  children,
  ...props
}: SelectGroupProps): React.JSX.Element {
  return (
    <SelectPrimitive.Group className={className} style={style} {...props}>
      {children}
    </SelectPrimitive.Group>
  );
}
SelectGroup.displayName = SelectPrimitive.Group.displayName;

export function SelectValue({
  className,
  style,
  placeholder,
  ...props
}: SelectValueProps): React.JSX.Element {
  return (
    <SelectPrimitive.Value
      className={className}
      style={style}
      placeholder={placeholder}
      {...props}
    />
  );
}
SelectValue.displayName = SelectPrimitive.Value.displayName;

export function SelectTrigger({
  className,
  style,
  children,
  ...props
}: SelectTriggerProps): React.JSX.Element {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export function SelectScrollUpButton({
  className,
  style,
  ...props
}: SelectLabelProps): React.JSX.Element {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      style={style}
      {...props}
    >
      <ChevronUp />
    </SelectPrimitive.ScrollUpButton>
  );
}
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

export function SelectScrollDownButton({
  className,
  style,
  ...props
}: SelectLabelProps): React.JSX.Element {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      style={style}
      {...props}
    >
      <ChevronDown />
    </SelectPrimitive.ScrollDownButton>
  );
}
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

export function SelectContent({
  className,
  style,
  children,
  position = "popper",
  ...props
}: SelectContentProps): React.JSX.Element {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "relative z-[9999] max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        style={style}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
SelectContent.displayName = SelectPrimitive.Content.displayName;

export function SelectLabel({ className, style, ...props }: SelectLabelProps): React.JSX.Element {
  return (
    <SelectPrimitive.Label
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      style={style}
      {...props}
    />
  );
}
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export function SelectItem({
  className,
  style,
  children,
  ...props
}: SelectItemProps): React.JSX.Element {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        props.disabled && "pointer-events-none opacity-50",
        className,
      )}
      style={style}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
SelectItem.displayName = SelectPrimitive.Item.displayName;

export function SelectSeparator({
  className,
  style,
  ...props
}: SelectSeparatorProps): React.JSX.Element {
  return (
    <SelectPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      style={style}
      {...props}
    />
  );
}
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
