/**
 * Command Component for React Native
 * TODO: Implement command palette with search and keyboard navigation
 * Currently a simple container with search input
 */
import type { ReactNode } from "react";
import React from "react";
import type { ViewProps } from "react-native";
import { Pressable, Text as RNText, TextInput, View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";

// Import all cross-platform type definitions from web (source of truth)
import type {
  CommandProps,
  CommandInputProps,
  CommandListProps,
  CommandGroupProps,
  CommandItemProps,
  CommandSeparatorProps,
} from "next-vibe-ui/ui/command";

export const Command = React.forwardRef<View, CommandProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          "flex flex-col overflow-hidden rounded-md border border-border bg-popover text-popover-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </View>
    );
  },
);

export const CommandInput = React.forwardRef<TextInput, CommandInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

CommandInput.displayName = "CommandInput";

export const CommandList = React.forwardRef<View, CommandListProps>(
  ({ className, children, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("max-h-[300px] overflow-y-auto", className)}
      {...props}
    >
      {children}
    </View>
  ),
);

CommandList.displayName = "CommandList";

export const CommandEmpty = React.forwardRef<View, Omit<ViewProps, 'children'> & {
  children?: ReactNode;
  className?: string;
}>(
  ({ className, children, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    >
      {children}
    </View>
  ),
);

CommandEmpty.displayName = "CommandEmpty";

export const CommandGroup = React.forwardRef<View, CommandGroupProps>(
  ({ className, children, heading, ...props }, ref) => (
    <View ref={ref} className={cn("overflow-hidden p-1", className)} {...props}>
      {heading && (
        <RNText className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </RNText>
      )}
      {children}
    </View>
  ),
);

CommandGroup.displayName = "CommandGroup";

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  CommandItemProps
>(({ className, children, onPress, ...props }, ref) => (
  <Pressable
    ref={ref}
    onPress={onPress}
    className={cn(
      "relative flex flex-row items-center rounded-sm px-2 py-1.5 text-sm active:bg-accent active:text-accent-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </Pressable>
));

CommandItem.displayName = "CommandItem";

export const CommandSeparator = React.forwardRef<View, CommandSeparatorProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  ),
);

CommandSeparator.displayName = "CommandSeparator";

// Note: CommandDialog and CommandShortcut are web-only components
// They are not implemented for React Native
