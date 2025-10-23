/**
 * Markdown Component for React Native
 * TODO: Implement markdown rendering using react-native-markdown-display or similar
 * Currently renders plain text
 */
import React from "react";
import { Text as RNText, View } from "react-native";

import { cn } from "../lib/utils";

interface MarkdownProps {
  children?: string;
  className?: string;
}

export const Markdown = React.forwardRef<View, MarkdownProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        <RNText className="text-sm text-foreground">{children}</RNText>
      </View>
    );
  },
);

Markdown.displayName = "Markdown";
