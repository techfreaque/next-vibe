import * as SelectPrimitive from "@rn-primitives/select";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { ViewStyle } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// Import ALL types from web (source of truth) - ZERO definitions in native
import type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectOption,
  SelectRootProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
} from "@/packages/next-vibe-ui/web/ui/select";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle, styledNative } from "../utils/style-converter";
import { Check, ChevronDown, ChevronUp } from "./icons";

const StyledAnimatedView = styledNative(Animated.View);
const StyledView = styledNative(View);
const StyledText = styledNative(Text);
const StyledPressable = styledNative(Pressable);

type Option = SelectPrimitive.Option;

export function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  defaultOpen, // Intentionally extracted - not used in React Native
  onOpenChange,
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  name, // Intentionally extracted - not used in React Native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  required, // Intentionally extracted - not used in React Native
}: SelectRootProps): React.JSX.Element {
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
      onOpenChange={onOpenChange}
      disabled={disabled}
    >
      {children}
    </SelectPrimitive.Root>
  );
}
Select.displayName = SelectPrimitive.Root.displayName;

export function SelectGroup({
  className,
  style,
  children,
  ...props
}: SelectGroupProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <SelectPrimitive.Group asChild {...props}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className,
        })}
      >
        {children}
      </StyledView>
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
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <SelectPrimitive.Value
      placeholder={placeholder ?? ""}
      {...applyStyleType({
        nativeStyle,
        className,
      })}
      {...props}
    />
  );
}
SelectValue.displayName = SelectPrimitive.Value.displayName;

export function SelectTrigger({
  className,
  style,
  children,
  disabled,
  ...props
}: SelectTriggerProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <SelectPrimitive.Trigger asChild disabled={disabled} {...props}>
      <StyledPressable
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            className,
          ),
        })}
        disabled={disabled}
      >
        <StyledView className="flex-1">{children}</StyledView>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </StyledPressable>
    </SelectPrimitive.Trigger>
  );
}
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export function SelectScrollUpButton({
  className,
  children,
  ...props
}: SelectLabelProps): React.JSX.Element {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      {children ?? <ChevronUp />}
    </SelectPrimitive.ScrollUpButton>
  );
}
SelectScrollUpButton.displayName = "SelectScrollUpButton";

export function SelectScrollDownButton({
  className,
  children,
  ...props
}: SelectLabelProps): React.JSX.Element {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      {children ?? <ChevronDown />}
    </SelectPrimitive.ScrollDownButton>
  );
}
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export function SelectContent({
  className,
  style,
  children,
  position = "popper",
  ...props
}: SelectContentProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  const animatedViewClassName = "z-[9999]";
  const contentClassName = cn(
    "relative z-[9999] max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    position === "popper" &&
      "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
    !nativeStyle && className,
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
          <SelectPrimitive.Content asChild position={position} {...props}>
            <StyledView
              {...applyStyleType({
                nativeStyle,
                className: contentClassName,
              })}
            >
              <SelectScrollUpButton />
              <StyledView className={viewportClassName}>
                <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
              </StyledView>
              <SelectScrollDownButton />
            </StyledView>
          </SelectPrimitive.Content>
        </StyledAnimatedView>
      </SelectPrimitive.Overlay>
    </SelectPrimitive.Portal>
  );
}
SelectContent.displayName = SelectPrimitive.Content.displayName;

export function SelectLabel({
  className,
  style,
  children,
  ...props
}: SelectLabelProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <SelectPrimitive.Label asChild {...props}>
      <StyledText
        {...applyStyleType({
          nativeStyle,
          className: cn("px-2 py-1.5 text-sm font-semibold", className),
        })}
      >
        {children}
      </StyledText>
    </SelectPrimitive.Label>
  );
}
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export function SelectItem({
  className,
  style,
  children,
  value,
  label,
  disabled,
  ...props
}: SelectItemProps): React.JSX.Element {
  // Use children as label if provided (for API consistency with web)
  const itemLabel =
    label ?? (typeof children === "string" ? children : undefined) ?? value;
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <SelectPrimitive.Item
      asChild
      value={value}
      label={itemLabel}
      disabled={disabled}
      {...props}
    >
      <StyledPressable
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
            disabled && "pointer-events-none opacity-50",
            className,
          ),
        })}
        disabled={disabled}
      >
        <StyledView className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <Check className="h-4 w-4" />
          </SelectPrimitive.ItemIndicator>
        </StyledView>
        <SelectPrimitive.ItemText />
      </StyledPressable>
    </SelectPrimitive.Item>
  );
}
SelectItem.displayName = SelectPrimitive.Item.displayName;

export function SelectSeparator({
  className,
  style,
  ...props
}: SelectSeparatorProps): React.JSX.Element {
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  return (
    <SelectPrimitive.Separator asChild {...props}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn("-mx-1 my-1 h-px bg-muted", className),
        })}
      />
    </SelectPrimitive.Separator>
  );
}
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// Export all types (re-exported from web - source of truth)
export type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectOption,
  SelectRootProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
};

// Export primitive Option type for internal use
export type { Option };
