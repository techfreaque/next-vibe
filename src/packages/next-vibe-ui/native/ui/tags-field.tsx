/**
 * TagsField Component for React Native
 * TODO: Implement full tags input functionality with add/remove
 * Currently a simple TextInput wrapper
 */
import type { ReactNode } from "react";
import React from "react";
import type { TextInputProps } from "react-native";
import { TextInput, View } from "react-native";

import { cn } from "../lib/utils";

interface TagsFieldProps extends TextInputProps {
  children?: ReactNode;
  className?: string;
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

export const TagsField = React.forwardRef<TextInput, TagsFieldProps>(
  ({ className, children, ...props }, ref) => {
    // TODO: Implement tags and onTagsChange functionality
    return (
      <View className={cn("flex flex-col gap-2", className)}>
        <TextInput
          ref={ref}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        {children}
      </View>
    );
  },
);

TagsField.displayName = "TagsField";
