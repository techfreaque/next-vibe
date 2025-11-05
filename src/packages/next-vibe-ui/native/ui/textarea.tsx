import * as React from "react";
import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

import type { TextareaProps as WebTextareaProps } from "@/packages/next-vibe-ui/web/ui/textarea";

import { cn } from "../lib/utils";
import { Div } from "./div";

// Native textarea props combine web interface with native TextInput props
export type TextareaProps = WebTextareaProps &
  Omit<TextInputProps, "className" | "disabled" | "minRows" | "variant">;

const Textarea = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextareaProps
>(
  (
    {
      className,
      multiline = true,
      numberOfLines,
      placeholderClassName: _placeholderClassName,
      onChangeText,
      minRows = 4,
      editable,
      disabled,
      style,
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
        )}
      >
        <TextInput
          ref={ref}
          style={[
            {
              outlineWidth: 0,
              // TextInput handles: text color, size, flex - NO border/background (wrapper handles that)
              flex: 1,
            },
            style,
          ]}
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
