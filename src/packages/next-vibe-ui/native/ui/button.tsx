import * as React from "react";
import { Pressable, Text as RNText } from "react-native";
import { styled } from "nativewind";

import type {
  ButtonProps,
  ButtonMouseEvent,
} from "@/packages/next-vibe-ui/web/ui/button";
import {
  buttonTextVariants,
  buttonVariants,
} from "@/packages/next-vibe-ui/web/ui/button";
import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

const StyledPressable = styled(Pressable, { className: "style" });
const StyledText = styled(RNText, { className: "style" });

function Button({
  className,
  variant,
  size,
  disabled,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  title,
  type: _type,
  suppressHydrationWarning: _suppressHydrationWarning,
  role: _role,
  tabIndex: _tabIndex,
  asChild: _asChild,
  ...props
}: ButtonProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const handlePress =
    onClick && !disabled
      ? (): void => {
          const event: ButtonMouseEvent = {
            stopPropagation: (): void => {
              // No-op for React Native
            },
          };
          onClick(event);
        }
      : undefined;

  const renderChildren = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === "string") {
      return (
        <StyledText className={buttonTextVariants({ variant, size })}>
          {content}
        </StyledText>
      );
    }

    if (Array.isArray(content)) {
      return content.map((child, index) => {
        // For array children, only wrap strings in StyledText
        // Leave React elements (like icons) as-is
        if (typeof child === "string") {
          return (
            <StyledText
              key={index}
              className={buttonTextVariants({ variant, size })}
            >
              {child}
            </StyledText>
          );
        }
        return <React.Fragment key={index}>{child}</React.Fragment>;
      });
    }

    // For React elements (like icons), return as-is without wrapping
    return content;
  };

  return (
    <StyledPressable
      disabled={disabled}
      onPress={handlePress}
      onPressIn={onMouseEnter}
      onPressOut={onMouseLeave}
      accessibilityLabel={title}
      accessibilityRole="button"
      {...applyStyleType({
        nativeStyle,
        className: cn(
          disabled && "opacity-50",
          buttonVariants({ variant, size, className }),
        ),
      })}
      {...props}
    >
      {renderChildren(children)}
    </StyledPressable>
  );
}

Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
