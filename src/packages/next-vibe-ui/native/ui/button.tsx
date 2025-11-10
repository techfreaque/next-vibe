import * as React from "react";
import { Pressable, Text as RNText } from "react-native";
import { styled } from "nativewind";

import type { ButtonProps } from "@/packages/next-vibe-ui/web/ui/button";
import {
  buttonTextVariants,
  buttonVariants,
} from "@/packages/next-vibe-ui/web/ui/button";
import { cn } from "next-vibe/shared/utils/utils";

const StyledPressable = styled(Pressable);
const StyledText = styled(RNText);

function Button({
  className,
  variant,
  size,
  disabled,
  children,
  onClick,
  // TODO: Add asChild support for native
  // asChild,
}: ButtonProps): React.JSX.Element {
  // Helper to wrap text strings in Text components for React Native
  const renderChildren = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === "string") {
      return (
        <StyledText className={buttonTextVariants({ variant, size })}>
          {content}
        </StyledText>
      );
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
    <StyledPressable
      disabled={disabled}
      onPress={onClick as () => void}
      className={cn(
        disabled && "opacity-50",
        buttonVariants({ variant, size, className }),
      )}
    >
      {renderChildren(children)}
    </StyledPressable>
  );
}

Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
