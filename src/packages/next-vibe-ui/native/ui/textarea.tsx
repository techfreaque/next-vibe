/// <reference path="../../../../../nativewind-env.d.ts" />
import * as React from "react";
import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

// Import ALL types and variants from web (source of truth)
import type { TextareaBaseProps, TextareaProps as WebTextareaProps } from "next-vibe-ui/ui/textarea";

import { cn } from "../lib/utils";
import { Div } from "./div";

// Native textarea props combine web interface with native TextInput props
export type TextareaProps = WebTextareaProps & Omit<TextInputProps, "className" | "disabled" | "minRows" | "variant">;

const Textarea = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextareaProps
>(
  (
    {
      className,
      multiline = true,
      numberOfLines,
      placeholderClassName,
      onChangeText,
      minRows = 4,
      editable,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Use minRows as numberOfLines if not explicitly set
    const lines = numberOfLines ?? minRows;

    // Handle disabled state
    const isEditable = editable !== undefined ? editable : !disabled;

    return (
      <Div
        className={cn(
          // Wrapper handles: border, background, padding, rounded corners, min-height
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2",
          !isEditable && "opacity-50",
          className,
        )}>
        <TextInput
          ref={ref}
          className={cn(
            // TextInput handles: text color, size, flex - NO border/background (wrapper handles that)
            "flex-1 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground border-0",
          )}
          style={{ outlineWidth: 0 }} // Remove any default outline/border
          placeholderTextColor="rgb(var(--muted-foreground))"
          multiline={multiline}
          numberOfLines={lines}
          textAlignVertical="top"
          onChangeText={onChangeText}
          editable={isEditable}
          {...props}
        />
      </Div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
