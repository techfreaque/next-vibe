/**
 * AutocompleteField Component for React Native
 * TODO: Implement full autocomplete functionality
 * Currently a simple TextInput wrapper
 */
import type { ReactNode } from "react";
import React from "react";
import type { TextInputProps } from "react-native";
import { TextInput, View } from "react-native";

import { cn } from "../lib/utils";

interface AutocompleteFieldProps extends TextInputProps {
  children?: ReactNode;
  className?: string;
}

export const AutocompleteField = React.forwardRef<
  TextInput,
  AutocompleteFieldProps
>(({ className, children, ...props }, ref) => {
  return (
    <View className={cn("flex flex-col", className)}>
      <TextInput
        ref={ref}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      {children}
    </View>
  );
});

AutocompleteField.displayName = "AutocompleteField";
