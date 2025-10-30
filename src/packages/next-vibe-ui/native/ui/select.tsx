import * as SelectPrimitive from "@rn-primitives/select";
import * as React from "react";
import type { JSX } from "react";
import { Platform, StyleSheet, View as RNView } from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";

import { StyledAnimatedView } from "../lib/styled";
import type { WithClassName, ViewPropsWithClassName } from "../lib/types";
import { cn } from "../lib/utils";
import { Check } from "./icons/Check";
import { ChevronDown } from "./icons/ChevronDown";
import { ChevronUp } from "./icons/ChevronUp";

// Type-safe View component with className support for NativeWind
const View = RNView as React.ComponentType<ViewPropsWithClassName>;

type Option = SelectPrimitive.Option;

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

// Type-safe wrapper for primitives that accept className at runtime
// Using WithClassName to preserve all original props while adding className support
const StyledSelectTrigger = SelectPrimitive.Trigger as React.ForwardRefExoticComponent<
  WithClassName<SelectPrimitive.TriggerProps> & React.RefAttributes<SelectPrimitive.TriggerRef>
>;
const StyledSelectContent = SelectPrimitive.Content as React.ForwardRefExoticComponent<
  WithClassName<SelectPrimitive.ContentProps> & React.RefAttributes<SelectPrimitive.ContentRef>
>;
const StyledSelectLabel = SelectPrimitive.Label as React.ForwardRefExoticComponent<
  WithClassName<SelectPrimitive.LabelProps> & React.RefAttributes<SelectPrimitive.LabelRef>
>;
const StyledSelectItem = SelectPrimitive.Item as React.ForwardRefExoticComponent<
  WithClassName<SelectPrimitive.ItemProps> & React.RefAttributes<SelectPrimitive.ItemRef>
>;
const StyledSelectSeparator = SelectPrimitive.Separator as React.ForwardRefExoticComponent<
  WithClassName<SelectPrimitive.SeparatorProps> & React.RefAttributes<SelectPrimitive.SeparatorRef>
>;
const StyledSelectScrollUpButton = SelectPrimitive.ScrollUpButton as React.ComponentType<
  WithClassName<SelectPrimitive.ScrollUpButtonProps>
>;
const StyledSelectScrollDownButton = SelectPrimitive.ScrollDownButton as React.ComponentType<
  WithClassName<SelectPrimitive.ScrollDownButtonProps>
>;
const StyledSelectItemText = SelectPrimitive.ItemText as React.ForwardRefExoticComponent<
  WithClassName<SelectPrimitive.ItemTextProps> & React.RefAttributes<SelectPrimitive.ItemTextRef>
>;

const SelectTrigger = React.forwardRef<
  SelectPrimitive.TriggerRef,
  WithClassName<SelectPrimitive.TriggerProps & { children?: React.ReactNode; disabled?: boolean }>
>(({ className, children, ...props }, ref) => {
  const triggerClassName = cn(
    "flex flex-row h-10 native:h-12 items-center text-sm justify-between rounded-md border border-input bg-background px-3 py-2 web:ring-offset-background text-muted-foreground web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2 [&>span]:line-clamp-1",
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    props.disabled && "web:cursor-not-allowed opacity-50",
    className,
  );
  return (
    <StyledSelectTrigger ref={ref} {...({ className: triggerClassName, ...props } as any)}>
      <>
        {children}
        <ChevronDown size={16} aria-hidden={true} />
      </>
    </StyledSelectTrigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/**
 * Platform: WEB ONLY
 */
const SelectScrollUpButton = ({
  className,
  ...props
}: WithClassName<SelectPrimitive.ScrollUpButtonProps>): JSX.Element | null => {
  if (Platform.OS !== "web") {
    return null;
  }
  const scrollButtonClassName = cn(
    "flex web:cursor-default items-center justify-center py-1",
    className,
  );
  return (
    <StyledSelectScrollUpButton
      {...({ className: scrollButtonClassName, ...props } as any)}
    >
      <ChevronUp size={14} />
    </StyledSelectScrollUpButton>
  );
};

/**
 * Platform: WEB ONLY
 */
const SelectScrollDownButton = ({
  className,
  ...props
}: WithClassName<SelectPrimitive.ScrollDownButtonProps>): JSX.Element | null => {
  if (Platform.OS !== "web") {
    return null;
  }
  const scrollButtonClassName = cn(
    "flex web:cursor-default items-center justify-center py-1",
    className,
  );
  return (
    <StyledSelectScrollDownButton
      {...({ className: scrollButtonClassName, ...props } as any)}
    >
      <ChevronDown size={14} />
    </StyledSelectScrollDownButton>
  );
};

const SelectContent = React.forwardRef<
  SelectPrimitive.ContentRef,
  WithClassName<SelectPrimitive.ContentProps & { children?: React.ReactNode; position?: "popper" | "item-aligned" }> & { portalHost?: string }
>(({ className, children, position = "popper", portalHost, ...props }, ref) => {
  const { open } = SelectPrimitive.useRootContext();

  const animatedViewClassName = "z-50";
  const contentClassName = cn(
    "relative z-50 max-h-96 min-w-[8rem] rounded-md border border-border bg-popover shadow-md shadow-foreground/10 py-2 px-1 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    position === "popper" &&
      "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
    open
      ? "web:zoom-in-95 web:animate-in web:fade-in-0"
      : "web:zoom-out-95 web:animate-out web:fade-out-0",
    className,
  );
  const viewportClassName = cn(
    "p-1",
    position === "popper" &&
      "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
  );

  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <SelectPrimitive.Overlay
        style={Platform.OS !== "web" ? StyleSheet.absoluteFill : undefined}
      >
        <StyledAnimatedView className={animatedViewClassName} entering={FadeIn} exiting={FadeOut}>
          <StyledSelectContent
            ref={ref}
            {...({
              position,
              className: contentClassName,
              ...props,
            } as any)}
          >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport className={viewportClassName as any}>
              {children}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
          </StyledSelectContent>
        </StyledAnimatedView>
      </SelectPrimitive.Overlay>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  SelectPrimitive.LabelRef,
  WithClassName<SelectPrimitive.LabelProps>
>(({ className, ...props }, ref) => {
  const labelClassName = cn(
    "py-1.5 native:pb-2 pl-8 native:pl-10 pr-2 text-popover-foreground text-sm native:text-base font-semibold",
    className,
  );
  return (
    <StyledSelectLabel ref={ref} className={labelClassName} {...props} />
  );
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  SelectPrimitive.ItemRef,
  WithClassName<SelectPrimitive.ItemProps & { value: string; label: string; children?: React.ReactNode; disabled?: boolean }>
>(({ className, value, label, children: _children, ...props }, ref) => {
  const itemClassName = cn(
    "relative web:group flex flex-row w-full web:cursor-default web:select-none items-center rounded-sm py-1.5 native:py-2 pl-8 native:pl-10 pr-2 web:hover:bg-accent/50 active:bg-accent web:outline-none web:focus:bg-accent",
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    props.disabled && "web:pointer-events-none opacity-50",
    className,
  );
  const viewClassName = "absolute left-2 native:left-3.5 flex h-3.5 native:pt-px w-3.5 items-center justify-center";
  const itemTextClassName = "text-sm native:text-lg text-popover-foreground native:text-base web:group-focus:text-accent-foreground";
  return (
    <StyledSelectItem
      ref={ref}
      {...({
        value,
        label,
        className: itemClassName,
        ...props,
      } as any)}
    >
      <View className={viewClassName}>
        <SelectPrimitive.ItemIndicator>
          <Check size={16} strokeWidth={3} />
        </SelectPrimitive.ItemIndicator>
      </View>
      <StyledSelectItemText {...({ className: itemTextClassName } as any)} />
    </StyledSelectItem>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  SelectPrimitive.SeparatorRef,
  WithClassName<SelectPrimitive.SeparatorProps>
>(({ className, ...props }, ref) => {
  const separatorClassName = cn("-mx-1 my-1 h-px bg-muted", className);
  return (
    <StyledSelectSeparator
      ref={ref}
      className={separatorClassName}
      {...props}
    />
  );
});
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
