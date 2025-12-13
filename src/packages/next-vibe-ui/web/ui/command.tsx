"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import { MagnifyingGlassIcon } from "next-vibe-ui/ui/icons";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

import { Dialog, DialogContent } from "./dialog";

// Command
export type CommandProps = {
  children?: React.ReactNode;
  id?: string;
  shouldFilter?: boolean;
} & StyleType;

export function Command({
  className,
  style,
  children,
  shouldFilter,
  id,
}: CommandProps): React.JSX.Element {
  return (
    <CommandPrimitive
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className,
      )}
      style={style}
      id={id}
      shouldFilter={shouldFilter}
    >
      {children}
    </CommandPrimitive>
  );
}
Command.displayName = CommandPrimitive.displayName;

// CommandDialog
export type CommandDialogProps = DialogProps;

export const CommandDialog = ({
  children,
  ...props
}: CommandDialogProps): React.JSX.Element => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

// CommandInput
export type CommandInputProps = {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
} & StyleType;

export function CommandInput({
  className,
  style,
  placeholder,
  value,
  onValueChange,
}: CommandInputProps): React.JSX.Element {
  return (
    <div className="flex items-center border-b px-3" data-cmdk-input-wrapper="">
      <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        style={style}
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
}

CommandInput.displayName = CommandPrimitive.Input.displayName;

// CommandList
export type CommandListProps = {
  children?: React.ReactNode;
} & StyleType;

export function CommandList({
  className,
  style,
  children,
}: CommandListProps): React.JSX.Element {
  return (
    <CommandPrimitive.List
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className,
      )}
      style={style}
    >
      {children}
    </CommandPrimitive.List>
  );
}

CommandList.displayName = CommandPrimitive.List.displayName;

// CommandEmpty
export type CommandEmptyProps = {
  children?: React.ReactNode;
} & StyleType;

export function CommandEmpty({
  className,
  style,
  children,
}: CommandEmptyProps): React.JSX.Element {
  return (
    <CommandPrimitive.Empty
      className={cn("py-6 text-center text-sm", className)}
      style={style}
    >
      {children}
    </CommandPrimitive.Empty>
  );
}

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

// CommandGroup
export type CommandGroupProps = {
  children?: React.ReactNode;
  heading?: string;
} & StyleType;

export function CommandGroup({
  className,
  style,
  children,
  heading,
}: CommandGroupProps): React.JSX.Element {
  return (
    <CommandPrimitive.Group
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      style={style}
      heading={heading}
    >
      {children}
    </CommandPrimitive.Group>
  );
}

CommandGroup.displayName = CommandPrimitive.Group.displayName;

export type CommandSeparatorProps = StyleType;

export function CommandSeparator({
  className,
  style,
}: CommandSeparatorProps): React.JSX.Element {
  return (
    <CommandPrimitive.Separator
      className={cn("-mx-1 h-px bg-border", className)}
      style={style}
    />
  );
}
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

// CommandItem
export type CommandItemProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  value?: string;
  onSelect?: (value: string) => void;
  onPress?: () => void;
} & StyleType;

export function CommandItem({
  className,
  style,
  children,
  disabled,
  value,
  onSelect,
}: CommandItemProps): React.JSX.Element {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      style={style}
      disabled={disabled}
      value={value}
      onSelect={onSelect}
    >
      {children}
    </CommandPrimitive.Item>
  );
}

CommandItem.displayName = CommandPrimitive.Item.displayName;

// CommandShortcut
export type CommandShortcutProps = {
  children?: React.ReactNode;
} & StyleType;

export const CommandShortcut = ({
  className,
  style,
  children,
}: CommandShortcutProps): React.JSX.Element => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
};
CommandShortcut.displayName = "CommandShortcut";
