import * as React from "react";
import { View, Text as RNText } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import type { DivProps } from "@/packages/next-vibe-ui/web/ui/div";

const StyledView = styled(View, { className: "style" });

export function Div({
  className,
  children,
  ...props
}: DivProps): React.JSX.Element {
  // Helper to wrap text strings in Text components for React Native
  const renderChildren = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === "string" || typeof content === "number") {
      return <RNText>{content}</RNText>;
    }

    if (Array.isArray(content)) {
      return content.map((child, index) => (
        <React.Fragment key={index}>{renderChildren(child)}</React.Fragment>
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
