/**
 * PhoneField Component for React Native
 * TODO: Implement full phone number formatting and validation
 * Currently a simple TextInput with phone keyboard
 */
import React from "react";
import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

import { cn } from "../lib/utils";

interface PhoneFieldProps extends Omit<TextInputProps, "keyboardType"> {
  className?: string;
}

export const PhoneField = React.forwardRef<TextInput, PhoneFieldProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        keyboardType="phone-pad"
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

PhoneField.displayName = "PhoneField";
