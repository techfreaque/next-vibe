import * as DropdownMenuPrimitive from "@rn-primitives/dropdown-menu";
import * as React from "react";
import {
  Platform,
  type StyleProp,
  StyleSheet,
  Text,
  type TextProps,
  View,
  type ViewStyle,
} from "react-native";

import { cn } from "../lib/utils";
import { Check } from "./icons/Check";
import { ChevronDown } from "./icons/ChevronDown";
import { ChevronRight } from "./icons/ChevronRight";
import { ChevronUp } from "./icons/ChevronUp";
import { Span } from "./span";
import { TextClassContext } from "./text";

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

const DropdownMenuSubTrigger = React.forwardRef<
  DropdownMenuPrimitive.SubTriggerRef,
  DropdownMenuSubTriggerProps & DropdownMenuPrimitive.SubTriggerProps
>(({ className, inset, children, ...props }, ref) => {
  const { open } = DropdownMenuPrimitive.useSubContext();
  const Icon =
    Platform.OS === "web" ? ChevronRight : open ? ChevronUp : ChevronDown;
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm native:text-lg text-primary",
        open && "native:text-accent-foreground",
      )}
    >
      <StyledDropdownMenuSubTrigger
        ref={ref}
        className={cn(
          "flex flex-row web:cursor-default web:select-none gap-2 items-center web:focus:bg-accent web:hover:bg-accent active:bg-accent rounded-sm px-2 py-1.5 native:py-2 web:outline-none",
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
});
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  DropdownMenuPrimitive.SubContentRef,
  DropdownMenuSubContentProps & DropdownMenuPrimitive.SubContentProps
>(({ className, ...props }, ref) => {
  const { open } = DropdownMenuPrimitive.useSubContext();
  return (
    <StyledDropdownMenuSubContent
      ref={ref}
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-md border border-border mt-1 bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        open
          ? "web:animate-in web:fade-in-0 web:zoom-in-95"
          : "web:animate-out web:fade-out-0 web:zoom-out",
        className,
      )}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  DropdownMenuPrimitive.ContentRef,
  DropdownMenuContentProps &
    DropdownMenuPrimitive.ContentProps & {
      overlayStyle?: StyleProp<ViewStyle>;
      overlayClassName?: string;
      portalHost?: string;
    }
>(
  (
    { className, overlayClassName, overlayStyle, portalHost, ...props },
    ref,
  ) => {
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
            ref={ref}
            className={cn(
              "z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md shadow-foreground/5 web:data-[side=bottom]:slide-in-from-top-2 web:data-[side=left]:slide-in-from-right-2 web:data-[side=right]:slide-in-from-left-2 web:data-[side=top]:slide-in-from-bottom-2",
              open
                ? "web:animate-in web:fade-in-0 web:zoom-in-95"
                : "web:animate-out web:fade-out-0 web:zoom-out-95",
              className,
            )}
            {...props}
          />
        </DropdownMenuPrimitive.Overlay>
      </DropdownMenuPrimitive.Portal>
    );
  },
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  DropdownMenuPrimitive.ItemRef,
  DropdownMenuItemProps & DropdownMenuPrimitive.ItemProps
>(({ className, inset, ...props }, ref) => (
  <TextClassContext.Provider
    value={
      "select-none text-sm native:text-lg text-popover-foreground web:group-focus:text-accent-foreground" // eslint-disable-line i18next/no-literal-string -- CSS class names
    }
  >
    <StyledDropdownMenuItem
      ref={ref}
      className={cn(
        "relative flex flex-row web:cursor-default gap-2 items-center rounded-sm px-2 py-1.5 native:py-2 web:outline-none web:focus:bg-accent active:bg-accent web:hover:bg-accent group",
        inset && "pl-8",
        props.disabled && "opacity-50 web:pointer-events-none",
        className,
      )}
      {...props}
    />
  </TextClassContext.Provider>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  DropdownMenuPrimitive.CheckboxItemRef,
  DropdownMenuCheckboxItemProps & DropdownMenuPrimitive.CheckboxItemProps
>(({ className, children, ...props }, ref) => (
  <StyledDropdownMenuCheckboxItem
    ref={ref}
    className={cn(
      "relative flex flex-row web:cursor-default items-center web:group rounded-sm py-1.5 native:py-2 pl-8 pr-2 web:outline-none web:focus:bg-accent active:bg-accent",
      props.disabled && "web:pointer-events-none opacity-50",
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
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  DropdownMenuPrimitive.RadioItemRef,
  DropdownMenuRadioItemProps & DropdownMenuPrimitive.RadioItemProps
>(({ className, children, ...props }, ref) => (
  <StyledDropdownMenuRadioItem
    ref={ref}
    className={cn(
      "relative flex flex-row web:cursor-default web:group items-center rounded-sm py-1.5 native:py-2 pl-8 pr-2 web:outline-none web:focus:bg-accent active:bg-accent",
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
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  DropdownMenuPrimitive.LabelRef,
  DropdownMenuLabelProps & DropdownMenuPrimitive.LabelProps
>(({ className, inset, ...props }, ref) => (
  <StyledDropdownMenuLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm native:text-base font-semibold text-foreground web:cursor-default",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  DropdownMenuPrimitive.SeparatorRef,
  DropdownMenuSeparatorProps & DropdownMenuPrimitive.SeparatorProps
>(({ className, ...props }, ref) => (
  <StyledDropdownMenuSeparator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: DropdownMenuShortcutProps & TextProps): React.JSX.Element => {
  return (
    <Span
      className={cn(
        "ml-auto text-xs native:text-sm tracking-widest text-muted-foreground",
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
