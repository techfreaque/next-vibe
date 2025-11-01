/// <reference path="../../../../../nativewind-env.d.ts" />
import * as React from "react";
import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

import { cn } from "../lib/utils";

// Import all public types from web version (web is source of truth)
import type { InputProps as WebInputProps } from "next-vibe-ui/ui/input";
import { Div } from "./div";

// Native input props combine web interface with native TextInput props
// Exclude conflicting event handlers - onKeyPress has different signatures on web/native
type NativeInputProps = Omit<WebInputProps, "onKeyPress"> &
  Omit<TextInputProps, "className" | "disabled" | "onKeyPress"> & {
    onKeyPress?: TextInputProps["onKeyPress"]; // Use native signature
  };

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  NativeInputProps
>(({ className, onChangeText, disabled, editable, ...props }, ref) => {
  return (
    <Div
      className={cn(
        // Wrapper handles: border, background, padding, rounded corners
        "flex h-10 native:h-12 w-full rounded-md border border-input bg-background px-3 py-2",
        disabled && "opacity-50",
        className,
      )}
    >
      <TextInput
        ref={ref}
        className={cn(
          // Input handles: text color, size, flex - NO border/background (wrapper handles that)
          "flex-1 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground border-0",
        )}
        style={{ outlineWidth: 0 }} // Remove any default outline/border
        placeholderTextColor="rgb(var(--muted-foreground))"
        onChangeText={onChangeText}
        editable={editable !== undefined ? editable : !disabled}
        {...props}
      />
    </Div>
  );
});

Input.displayName = "Input";

export { Input };
