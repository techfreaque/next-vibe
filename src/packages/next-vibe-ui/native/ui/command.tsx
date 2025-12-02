"use client";

import { MagnifyingGlassIcon } from "next-vibe-ui/ui/icons";
import * as React from "react";
import {
  Pressable,
  ScrollView,
  Text as RNText,
  TextInput,
  View,
} from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";
import { Dialog, DialogContent } from "./dialog";

// Import all cross-platform type definitions from web (source of truth)
import type {
  CommandDialogProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandInputProps,
  CommandItemProps,
  CommandListProps,
  CommandProps,
  CommandSeparatorProps,
  CommandShortcutProps,
} from "@/packages/next-vibe-ui/web/ui/command";

const StyledView = styled(View, { className: "style" });
const StyledPressable = styled(Pressable, { className: "style" });
const StyledScrollView = styled(ScrollView, { className: "style" });
const StyledTextInput = styled(TextInput, { className: "style" });

function Command({
  className,
  style,
  children,
  id,
  shouldFilter: _shouldFilter,
}: CommandProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
          className,
        ),
      })}
      nativeID={id}
    >
      {children}
    </StyledView>
  );
}
Command.displayName = "Command";

const CommandDialog = ({
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
CommandDialog.displayName = "CommandDialog";

function CommandInput({
  className,
  style,
  placeholder,
  value,
  onValueChange,
}: CommandInputProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      className="flex items-center border-b px-3"
      data-cmdk-input-wrapper=""
    >
      <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <StyledTextInput
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className,
          ),
        })}
        placeholder={placeholder}
        value={value}
        onChangeText={onValueChange}
      />
    </StyledView>
  );
}

CommandInput.displayName = "CommandInput";

function CommandList({
  className,
  style,
  children,
}: CommandListProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledScrollView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "max-h-[300px] overflow-y-auto overflow-x-hidden",
          className,
        ),
      })}
    >
      {children}
    </StyledScrollView>
  );
}

CommandList.displayName = "CommandList";

function CommandEmpty({
  className,
  style,
  children,
}: CommandEmptyProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn("py-6 text-center text-sm", className),
      })}
    >
      {children}
    </StyledView>
  );
}

CommandEmpty.displayName = "CommandEmpty";

function CommandGroup({
  className,
  style,
  children,
  heading,
}: CommandGroupProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
          className,
        ),
      })}
    >
      {heading && (
        <RNText className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </RNText>
      )}
      {children}
    </StyledView>
  );
}

CommandGroup.displayName = "CommandGroup";

function CommandSeparator({
  className,
  style,
}: CommandSeparatorProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn("-mx-1 h-px bg-border", className),
      })}
    />
  );
}
CommandSeparator.displayName = "CommandSeparator";

function CommandItem({
  className,
  style,
  children,
  disabled,
  value,
  onPress,
  onSelect,
}: CommandItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const handlePress = (): void => {
    // For native, call onSelect with the value if provided, otherwise empty string
    // In practice, native apps using this component should use onPress instead
    if (onSelect) {
      onSelect(value || "");
    }
    if (onPress) {
      onPress();
    }
  };

  return (
    <StyledPressable
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          disabled && "pointer-events-none opacity-50",
          className,
        ),
      })}
      onPress={handlePress}
      disabled={disabled}
    >
      {children}
    </StyledPressable>
  );
}

CommandItem.displayName = "CommandItem";

const CommandShortcut = ({
  className,
  style,
  children,
}: CommandShortcutProps): React.JSX.Element => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <RNText
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "ml-auto text-xs tracking-widest text-muted-foreground",
          className,
        ),
      })}
    >
      {children}
    </RNText>
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
