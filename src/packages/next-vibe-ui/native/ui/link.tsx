import { Link as ExpoLink } from "expo-router";
import { Text as RNText, View } from "react-native";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import { convertCSSToViewStyle } from "@/packages/next-vibe-ui/native/utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";
import type { LinkProps } from "@/packages/next-vibe-ui/web/ui/link";

const StyledText = styled(RNText, {
  className: "style",
});

const StyledView = styled(View, {
  className: "style",
});

/**
 * Checks if children contain interactive elements (Button, Pressable, etc.)
 * that need to be rendered in a View instead of Text
 */
function hasInteractiveChildren(children: React.ReactNode): boolean {
  let hasInteractive = false;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      // Check if it's a Button or other pressable component
      const componentType = child.type;
      if (typeof componentType === "function" || typeof componentType === "object") {
        const displayName =
          ("displayName" in componentType ? componentType.displayName : undefined) ??
          ("name" in componentType ? componentType.name : undefined);
        if (displayName === "Button" || displayName === "Pressable") {
          hasInteractive = true;
        }
      }
      if (componentType === "Pressable") {
        hasInteractive = true;
      }
    }
  });

  return hasInteractive;
}

export function Link({
  className,
  style,
  children,
  href,
}: LinkProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const textClassName = cn(
    "text-primary underline-offset-4 active:underline",
    className,
  );

  // If children contain interactive elements, use View instead of Text
  const useView = hasInteractiveChildren(children);

  if (useView) {
    return (
      <ExpoLink href={href} asChild>
        <StyledView
          {...applyStyleType({
            nativeStyle,
            className: cn(textClassName, "self-start"),
          })}
        >
          {children}
        </StyledView>
      </ExpoLink>
    );
  }

  return (
    <ExpoLink href={href}>
      <StyledText
        {...applyStyleType({
          nativeStyle,
          className: textClassName,
        })}
      >
        {children}
      </StyledText>
    </ExpoLink>
  );
}

Link.displayName = "Link";
