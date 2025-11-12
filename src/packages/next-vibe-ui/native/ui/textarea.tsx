import * as React from "react";
import type { TextInputProps } from "react-native";
import { TextInput, View } from "react-native";
import { styled } from "nativewind";

import type { TextareaProps as WebTextareaProps } from "@/packages/next-vibe-ui/web/ui/textarea";

import { cn } from "../lib/utils";

// Styled View for NativeWind - TextInput cannot be styled (animations not supported)
const StyledView = styled(View, { className: "style" });

// Native textarea props combine web interface with native TextInput props
export type TextareaProps = WebTextareaProps &
  Omit<TextInputProps, "className" | "disabled" | "minRows" | "variant">;

function Textarea({
  className,
  multiline = true,
  numberOfLines,
  onChangeText,
  minRows = 4,
  editable,
  disabled,
  style,
  ...props
}: TextareaProps): React.JSX.Element {
  // Use minRows as numberOfLines if not explicitly set
  const lines = numberOfLines ?? minRows;

  // Handle disabled state
  const isEditable = editable !== undefined ? editable : !disabled;

  return (
    <StyledView
      className={cn(
        "flex min-h-[80px] w-full flex-row rounded-md border border-input bg-background px-3 py-2 shadow-sm",
        !isEditable && "opacity-50",
        className,
      )}
      pointerEvents="box-none"
    >
      <TextInput
        className="flex-1 text-base text-foreground"
        style={style}
        placeholderTextColor="hsl(var(--muted-foreground))"
        multiline={multiline}
        numberOfLines={lines}
        textAlignVertical="top"
        onChangeText={onChangeText}
        editable={isEditable}
        {...props}
      />
    </StyledView>
  );
}

export { Textarea };
