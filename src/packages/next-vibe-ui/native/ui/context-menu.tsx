import * as ContextMenuPrimitive from "@rn-primitives/context-menu";
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

// Cross-platform type definitions
export interface ContextMenuSubTriggerProps {
  className?: string;
  inset?: boolean;
  children?: React.ReactNode;
}

export interface ContextMenuSubContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ContextMenuContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ContextMenuItemProps {
  className?: string;
  inset?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface ContextMenuCheckboxItemProps {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface ContextMenuRadioItemProps {
  className?: string;
  value?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface ContextMenuLabelProps {
  className?: string;
  inset?: boolean;
  children?: React.ReactNode;
}

export interface ContextMenuSeparatorProps {
  className?: string;
}

export interface ContextMenuShortcutProps {
  className?: string;
  children?: React.ReactNode;
}

// Local styled components - use direct primitives to avoid type instantiation issues
// The styled() function from nativewind has overly complex type inference for these components
const StyledContextMenuSubTrigger = ContextMenuPrimitive.SubTrigger;
const StyledContextMenuSubContent = ContextMenuPrimitive.SubContent;
const StyledContextMenuContent = ContextMenuPrimitive.Content;
const StyledContextMenuItem = ContextMenuPrimitive.Item;
const StyledContextMenuCheckboxItem = ContextMenuPrimitive.CheckboxItem;
const StyledContextMenuRadioItem = ContextMenuPrimitive.RadioItem;
const StyledContextMenuLabel = ContextMenuPrimitive.Label;
const StyledContextMenuSeparator = ContextMenuPrimitive.Separator;
const StyledContextMenuItemIndicator = ContextMenuPrimitive.ItemIndicator;

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  ContextMenuPrimitive.SubTriggerRef,
  ContextMenuSubTriggerProps & ContextMenuPrimitive.SubTriggerProps
>(({ className, inset, children, ...props }, ref) => {
  const { open } = ContextMenuPrimitive.useSubContext();
  const Icon =
    Platform.OS === "web" ? ChevronRight : open ? ChevronUp : ChevronDown;

  const renderChildren = () => {
    if (typeof children === "function") {
      return (children as (props: { pressed: boolean }) => React.ReactNode)({ pressed: open });
    }
    return children;
  };

  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm native:text-lg text-primary",
        open && "native:text-accent-foreground",
      )}
    >
      <StyledContextMenuSubTrigger
        ref={ref}
        className={cn(
          "flex flex-row web:cursor-default web:select-none items-center gap-2 web:focus:bg-accent active:bg-accent web:hover:bg-accent rounded-sm px-2 py-1.5 native:py-2 web:outline-none",
          open && "bg-accent",
          inset && "pl-8",
          className,
        )}
        {...props}
      >
        {renderChildren()}
        <Icon size={18} className="ml-auto text-foreground" />
      </StyledContextMenuSubTrigger>
    </TextClassContext.Provider>
  );
});
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  ContextMenuPrimitive.SubContentRef,
  ContextMenuSubContentProps & ContextMenuPrimitive.SubContentProps
>(({ className, ...props }, ref) => {
  const { open } = ContextMenuPrimitive.useSubContext();
  return (
    <StyledContextMenuSubContent
      ref={ref}
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-md border mt-1 border-border bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        open
          ? "web:animate-in web:fade-in-0 web:zoom-in-95"
          : "web:animate-out web:fade-out-0 web:zoom-out",
        className,
      )}
      {...props}
    />
  );
});
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  ContextMenuPrimitive.ContentRef,
  ContextMenuContentProps & ContextMenuPrimitive.ContentProps & {
    overlayStyle?: StyleProp<ViewStyle>;
    overlayClassName?: string;
    portalHost?: string;
  }
>(
  (
    { className, overlayClassName, overlayStyle, portalHost, ...props },
    ref,
  ) => {
    const { open } = ContextMenuPrimitive.useRootContext();
    return (
      <ContextMenuPrimitive.Portal hostName={portalHost}>
        <ContextMenuPrimitive.Overlay
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
          <StyledContextMenuContent
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
        </ContextMenuPrimitive.Overlay>
      </ContextMenuPrimitive.Portal>
    );
  },
);
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  ContextMenuPrimitive.ItemRef,
  ContextMenuItemProps & ContextMenuPrimitive.ItemProps
>(({ className, inset, ...props }, ref) => (
  // eslint-disable-next-line i18next/no-literal-string
  <TextClassContext.Provider value="select-none text-sm native:text-lg text-popover-foreground web:group-focus:text-accent-foreground">
    <StyledContextMenuItem
      ref={ref}
      className={cn(
        "relative flex flex-row web:cursor-default items-center gap-2 rounded-sm px-2 py-1.5 native:py-2 web:outline-none web:focus:bg-accent active:bg-accent web:hover:bg-accent group",
        inset && "pl-8",
        props.disabled && "opacity-50 web:pointer-events-none",
        className,
      )}
      {...props}
    />
  </TextClassContext.Provider>
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  ContextMenuPrimitive.CheckboxItemRef,
  ContextMenuCheckboxItemProps & ContextMenuPrimitive.CheckboxItemProps
>(({ className, children, disabled, ...props }, ref) => {
  const renderChildren = () => {
    if (typeof children === "function") {
      return (children as (props: { pressed: boolean }) => React.ReactNode)({ pressed: false });
    }
    return children;
  };

  return (
    <StyledContextMenuCheckboxItem
      ref={ref}
      className={cn(
        "relative flex flex-row web:cursor-default items-center web:group rounded-sm py-1.5 native:py-2 pl-8 pr-2 web:outline-none web:focus:bg-accent active:bg-accent",
        disabled && "web:pointer-events-none opacity-50",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledContextMenuItemIndicator>
          <Check size={14} strokeWidth={3} className="text-foreground" />
        </StyledContextMenuItemIndicator>
      </View>
      {renderChildren()}
    </StyledContextMenuCheckboxItem>
  );
});
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  ContextMenuPrimitive.RadioItemRef,
  ContextMenuRadioItemProps & ContextMenuPrimitive.RadioItemProps
>(({ className, children, disabled, ...props }, ref) => (
  <StyledContextMenuRadioItem
    ref={ref}
    className={cn(
      "relative flex flex-row web:cursor-default web:group items-center rounded-sm py-1.5 native:py-2 pl-8 pr-2 web:outline-none web:focus:bg-accent active:bg-accent",
      disabled && "web:pointer-events-none opacity-50",
      className,
    )}
    {...props}
  >
    <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <StyledContextMenuItemIndicator>
        <View className="bg-foreground h-2 w-2 rounded-full" />
      </StyledContextMenuItemIndicator>
    </View>
    {children}
  </StyledContextMenuRadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  ContextMenuPrimitive.LabelRef,
  ContextMenuLabelProps & ContextMenuPrimitive.LabelProps
>(({ className, inset, ...props }, ref) => (
  <StyledContextMenuLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm native:text-base font-semibold text-foreground web:cursor-default",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  ContextMenuPrimitive.SeparatorRef,
  ContextMenuSeparatorProps & ContextMenuPrimitive.SeparatorProps
>(({ className, ...props }, ref) => (
  <StyledContextMenuSeparator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({
  className,
  ...props
}: ContextMenuShortcutProps & TextProps): React.JSX.Element => {
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
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
