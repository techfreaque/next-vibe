import * as DropdownMenuPrimitive from "@rn-primitives/dropdown-menu";
import * as React from "react";
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type TextProps,
  View,
  type ViewStyle,
} from "react-native";

import { cn } from "next-vibe/shared/utils/utils";
import { Check } from "./icons/Check";
import { ChevronDown } from "./icons/ChevronDown";
import { ChevronRight } from "./icons/ChevronRight";
import { ChevronUp } from "./icons/ChevronUp";
import { Span } from "./span";
import { TextClassContext } from "./text";

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_ITEM = "select-none text-sm text-lg text-popover-foreground group-focus:text-accent-foreground";
/* eslint-enable i18next/no-literal-string */

// Cross-platform type definitions for native
export interface DropdownMenuSubTriggerProps {
  className?: string;
  inset?: boolean;
  children?: React.ReactNode;
}

export interface DropdownMenuSubContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuItemProps {
  className?: string;
  inset?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface DropdownMenuCheckboxItemProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface DropdownMenuRadioItemProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuLabelProps {
  className?: string;
  inset?: boolean;
  children?: React.ReactNode;
}

export interface DropdownMenuSeparatorProps {
  className?: string;
}

export interface DropdownMenuShortcutProps {
  className?: string;
  children?: React.ReactNode;
}

// Local styled components - use direct primitives to avoid type instantiation issues
// The styled() function from nativewind has overly complex type inference for these components
const StyledDropdownMenuSubTrigger = DropdownMenuPrimitive.SubTrigger;
const StyledDropdownMenuSubContent = DropdownMenuPrimitive.SubContent;
const StyledDropdownMenuContent = DropdownMenuPrimitive.Content;
const StyledDropdownMenuItem = DropdownMenuPrimitive.Item;
const StyledDropdownMenuCheckboxItem = DropdownMenuPrimitive.CheckboxItem;
const StyledDropdownMenuRadioItem = DropdownMenuPrimitive.RadioItem;
const StyledDropdownMenuLabel = DropdownMenuPrimitive.Label;
const StyledDropdownMenuSeparator = DropdownMenuPrimitive.Separator;
const StyledDropdownMenuItemIndicator = DropdownMenuPrimitive.ItemIndicator;

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps & DropdownMenuPrimitive.SubTriggerProps): React.JSX.Element {
  const { open } = DropdownMenuPrimitive.useSubContext();
  const Icon =
    Platform.OS === "web" ? ChevronRight : open ? ChevronUp : ChevronDown;
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm text-lg text-primary",
        open && "text-accent-foreground",
      )}
    >
      <StyledDropdownMenuSubTrigger
        className={cn(
          "flex flex-row cursor-default select-none gap-2 items-center focus:bg-accent hover:bg-accent active:bg-accent rounded-sm px-2 py-1.5 py-2 outline-none",
          open && "bg-accent",
          inset && "pl-8",
          className,
        )}
        {...props}
      >
        {typeof children === "function"
          ? (
              children as (props: { pressed: boolean }) => React.ReactNode
            )({ pressed: open })
          : children}
        <Icon size={18} className="ml-auto text-foreground" />
      </StyledDropdownMenuSubTrigger>
    </TextClassContext.Provider>
  );
}
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

function DropdownMenuSubContent({
  className,
  ...props
}: DropdownMenuSubContentProps & DropdownMenuPrimitive.SubContentProps): React.JSX.Element {
  const { open } = DropdownMenuPrimitive.useSubContext();
  return (
    <StyledDropdownMenuSubContent
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-md border border-border mt-1 bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        open
          ? "animate-in fade-in-0 zoom-in-95"
          : "animate-out fade-out-0 zoom-out",
        className,
      )}
      {...props}
    />
  );
}
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

function DropdownMenuContent({
  className,
  overlayClassName,
  overlayStyle,
  portalHost,
  ...props
}: DropdownMenuContentProps &
  DropdownMenuPrimitive.ContentProps & {
    overlayStyle?: StyleProp<ViewStyle>;
    overlayClassName?: string;
    portalHost?: string;
  }): React.JSX.Element {
  const { open } = DropdownMenuPrimitive.useRootContext();
  return (
    <DropdownMenuPrimitive.Portal hostName={portalHost}>
      <DropdownMenuPrimitive.Overlay
        style={
          overlayStyle
            ? StyleSheet.flatten([
                Platform.OS !== "web" ? StyleSheet.absoluteFill : undefined,
                overlayStyle,
              ])
            : Platform.OS !== "web"
              ? StyleSheet.absoluteFill
              : undefined
        }
        className={overlayClassName}
      >
        <StyledDropdownMenuContent
          className={cn(
            "z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            open
              ? "animate-in fade-in-0 zoom-in-95"
              : "animate-out fade-out-0 zoom-out-95",
            className,
          )}
          {...props}
        />
      </DropdownMenuPrimitive.Overlay>
    </DropdownMenuPrimitive.Portal>
  );
}
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

function DropdownMenuItem({
  className,
  inset,
  ...props
}: DropdownMenuItemProps & DropdownMenuPrimitive.ItemProps): React.JSX.Element {
  return (
    <TextClassContext.Provider
      value={TEXT_CLASS_ITEM}
    >
      <StyledDropdownMenuItem
        className={cn(
          "relative flex flex-row cursor-default gap-2 items-center rounded-sm px-2 py-1.5 py-2 outline-none focus:bg-accent active:bg-accent hover:bg-accent group",
          inset && "pl-8",
          props.disabled && "opacity-50 pointer-events-none",
          className,
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: DropdownMenuCheckboxItemProps & DropdownMenuPrimitive.CheckboxItemProps): React.JSX.Element {
  return (
    <StyledDropdownMenuCheckboxItem
      className={cn(
        "relative flex flex-row cursor-default items-center group rounded-sm py-1.5 py-2 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
        props.disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledDropdownMenuItemIndicator>
          <Check size={14} strokeWidth={3} className="text-foreground" />
        </StyledDropdownMenuItemIndicator>
      </View>
      {typeof children === "function"
        ? (children as (props: { pressed: boolean }) => React.ReactNode)({
            pressed: false,
          })
        : children}
    </StyledDropdownMenuCheckboxItem>
  );
}
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps & DropdownMenuPrimitive.RadioItemProps): React.JSX.Element {
  return (
    <StyledDropdownMenuRadioItem
      className={cn(
        "relative flex flex-row cursor-default group items-center rounded-sm py-1.5 py-2 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
        className,
      )}
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledDropdownMenuItemIndicator>
          <View className="bg-foreground h-2 w-2 rounded-full" />
        </StyledDropdownMenuItemIndicator>
      </View>
      {children}
    </StyledDropdownMenuRadioItem>
  );
}
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps & DropdownMenuPrimitive.LabelProps): React.JSX.Element {
  return (
    <StyledDropdownMenuLabel
      className={cn(
        "px-2 py-1.5 text-sm text-base font-semibold text-foreground cursor-default",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps & DropdownMenuPrimitive.SeparatorProps): React.JSX.Element {
  return (
    <StyledDropdownMenuSeparator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: DropdownMenuShortcutProps & TextProps): React.JSX.Element => {
  return (
    <Span
      className={cn(
        "ml-auto text-xs text-sm tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
