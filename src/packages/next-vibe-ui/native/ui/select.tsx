import * as SelectPrimitive from "@rn-primitives/select";
import * as React from "react";
import type { JSX } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { styled } from "nativewind";

import type { WithClassName } from "../lib/types";
import { cn } from "next-vibe/shared/utils/utils";
import { Check } from "./icons/Check";
import { ChevronDown } from "./icons/ChevronDown";
import { ChevronUp } from "./icons/ChevronUp";

import type {
  SelectRootProps,
  SelectGroupProps,
  SelectValueProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
  SelectLabelProps,
  SelectSeparatorProps,
} from "@/packages/next-vibe-ui/web/ui/select";

const StyledAnimatedView = styled(Animated.View, { className: "style" });

type Option = SelectPrimitive.Option;

function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  ...props
}: SelectRootProps): JSX.Element {
  // Convert string value to Option for native primitive
  const nativeValue = value ? { label: value, value } : undefined;
  const nativeDefaultValue = defaultValue
    ? { label: defaultValue, value: defaultValue }
    : undefined;
  const nativeOnValueChange = onValueChange
    ? (option?: SelectPrimitive.Option): void => {
        if (option?.value) {
          onValueChange(option.value);
        }
      }
    : undefined;

  return (
    <SelectPrimitive.Root
      value={nativeValue}
      defaultValue={nativeDefaultValue}
      onValueChange={nativeOnValueChange}
      {...props}
    >
      {children}
    </SelectPrimitive.Root>
  );
}
Select.displayName = SelectPrimitive.Root.displayName;

function SelectGroup({
  className,
  children,
  ...props
}: SelectGroupProps): JSX.Element {
  return (
    <SelectPrimitive.Group className={className} {...props}>
      {children}
    </SelectPrimitive.Group>
  );
}
SelectGroup.displayName = SelectPrimitive.Group.displayName;

function SelectValue({
  className,
  placeholder,
}: SelectValueProps): JSX.Element {
  return (
    <SelectPrimitive.Value
      className={className}
      placeholder={placeholder ?? ""}
    />
  );
}
SelectValue.displayName = SelectPrimitive.Value.displayName;

function SelectTrigger({
  className,
  children,
  ...props
}: SelectTriggerProps): JSX.Element {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-full flex-row items-center justify-between whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-base text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Trigger>
  );
}
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = ({
  className,
  ...props
}: WithClassName<SelectPrimitive.ScrollUpButtonProps>): JSX.Element => {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn("flex items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronUp size={14} />
    </SelectPrimitive.ScrollUpButton>
  );
};

const SelectScrollDownButton = ({
  className,
  ...props
}: WithClassName<SelectPrimitive.ScrollDownButtonProps>): JSX.Element => {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn("flex items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronDown size={14} />
    </SelectPrimitive.ScrollDownButton>
  );
};

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: SelectContentProps): JSX.Element {
  const { open } = SelectPrimitive.useRootContext();

  const animatedViewClassName = "z-50";
  const contentClassName = cn(
    "relative z-50 max-h-96 min-w-[8rem] rounded-md border border-border bg-popover shadow-md shadow-foreground/10 py-2 px-1 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    position === "popper" &&
      "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
    open ? "animate-in fade-in-0" : "animate-out fade-out-0",
    className,
  );
  const viewportClassName = cn(
    "p-1",
    position === "popper" &&
      "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
  );

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <StyledAnimatedView
          className={animatedViewClassName}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <SelectPrimitive.Content
            position={position}
            className={contentClassName}
            {...props}
          >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport className={viewportClassName}>
              {children}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
          </SelectPrimitive.Content>
        </StyledAnimatedView>
      </SelectPrimitive.Overlay>
    </SelectPrimitive.Portal>
  );
}
SelectContent.displayName = SelectPrimitive.Content.displayName;

function SelectLabel({ className, ...props }: SelectLabelProps): JSX.Element {
  return (
    <SelectPrimitive.Label
      className={cn(
        "py-1.5 pb-2 pl-8 pl-10 pr-2 text-popover-foreground text-sm text-base font-semibold",
        className,
      )}
      {...props}
    />
  );
}
SelectLabel.displayName = SelectPrimitive.Label.displayName;

function SelectItem({
  className,
  value,
  label,
  children: _children,
  ...props
}: SelectItemProps): JSX.Element {
  return (
    <SelectPrimitive.Item
      value={value}
      label={label ?? value}
      className={cn(
        "relative flex flex-row w-full items-center rounded-sm py-1.5 py-2 pl-8 pl-10 pr-2 active:bg-accent",
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        props.disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <View className="absolute left-2 left-3.5 flex h-3.5 pt-px w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check size={16} strokeWidth={3} />
        </SelectPrimitive.ItemIndicator>
      </View>
      <SelectPrimitive.ItemText className="text-sm text-lg text-popover-foreground text-base" />
    </SelectPrimitive.Item>
  );
}
SelectItem.displayName = SelectPrimitive.Item.displayName;

function SelectSeparator({
  className,
  ...props
}: SelectSeparatorProps): JSX.Element {
  return (
    <SelectPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}
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
