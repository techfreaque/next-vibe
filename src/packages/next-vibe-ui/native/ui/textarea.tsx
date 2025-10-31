import * as React from "react";
import { TextInput } from "react-native";

import { cn } from "../lib/utils";

// Import cross-platform interface from web
import type { TextareaBaseProps } from "../../../web/ui/textarea";

// Native extends base with native-specific props only
export type { TextareaBaseProps };
export interface TextareaProps extends TextareaBaseProps {
  placeholderClassName?: string;
  editable?: boolean;
  numberOfLines?: number;
  multiline?: boolean;
}

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
      <TextInput
        ref={ref}
        className={cn(
          "web:flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground web:ring-offset-background placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          !isEditable && "opacity-50 web:cursor-not-allowed",
          className,
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        multiline={multiline}
        numberOfLines={lines}
        textAlignVertical="top"
        onChangeText={onChangeText}
        editable={isEditable}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
