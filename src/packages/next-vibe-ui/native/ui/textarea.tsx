import * as React from "react";
import type { TextInputProps } from "react-native";
import { TextInput, View } from "react-native";
import { styled } from "nativewind";
import { cva, type VariantProps } from "class-variance-authority";

import type { TextareaProps } from "@/packages/next-vibe-ui/web/ui/textarea";

import { cn } from "../lib/utils";

const StyledView = styled(View, { className: "style" });

// Native textarea variants using CVA
export const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-input",
        ghost: "border-none bg-transparent rounded-t-md rounded-b-none px-6 pb-4 border-b py-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Textarea({
  className,
  variant,
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
        textareaVariants({ variant }),
        "flex-row",
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
