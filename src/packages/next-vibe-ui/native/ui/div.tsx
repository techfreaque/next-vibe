import * as React from "react";
import type { ViewProps } from "react-native";
import { View, Text as RNText } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";

// Styled View for NativeWind support
const StyledView = styled(View);

// Cross-platform props interface - use ViewProps directly
// Note: className is added via nativewind-env.d.ts module augmentation
export type DivProps = ViewProps & {
  className?: string;
};

/**
 * Platform-agnostic Div component for React Native
 * On native, this is a View component with NativeWind className support
 * Alias for View to provide more traditional web naming
 * Automatically wraps text strings in Text components for React Native
 */
export function Div({ className, children, ...props }: DivProps): React.JSX.Element {
  // Helper to wrap text strings in Text components for React Native
  const renderChildren = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === "string" || typeof content === "number") {
      return <RNText>{content}</RNText>;
    }

    if (Array.isArray(content)) {
      return content.map((child, index) => (
        <React.Fragment key={index}>
          {renderChildren(child)}
        </React.Fragment>
      ));
    }

    // Check if it's a React element with children
    if (React.isValidElement(content)) {
      const props = content.props as { children?: React.ReactNode };
      if (props?.children) {
        return React.cloneElement(content, {
          ...props,
          children: renderChildren(props.children),
        } as React.Attributes);
      }
    }

    return content;
  };

  return (
    <StyledView className={cn(className)} {...props}>
      {renderChildren(children)}
    </StyledView>
  );
}

Div.displayName = "Div";
