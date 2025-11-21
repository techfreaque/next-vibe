import { Link as ExpoLink } from "expo-router";
import { Text as RNText, View } from "react-native";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import type { LinkProps } from "@/packages/next-vibe-ui/web/ui/link";
import { type ReactNode, Children, isValidElement } from "react";

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
function hasInteractiveChildren(children: ReactNode): boolean {
  let hasInteractive = false;

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      // Check if it's a Button or other pressable component
      const componentType = child.type;
      if (
        typeof componentType === "function" ||
        typeof componentType === "object"
      ) {
        const displayName =
          ("displayName" in componentType
            ? componentType.displayName
            : undefined) ??
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
  children,
  href,
  target,
  rel,
  onClick,
}: LinkProps): JSX.Element {
  // If children contain interactive elements, use View instead of Text
  const useView = hasInteractiveChildren(children);

  if (useView) {
    return (
      <ExpoLink href={href} asChild target={target} rel={rel} onPress={onClick}>
        <StyledView className={cn(className, "self-start")}>
          {children}
        </StyledView>
      </ExpoLink>
    );
  }

  return (
    <ExpoLink href={href} target={target} rel={rel} onPress={onClick}>
      <StyledText className={className}>{children}</StyledText>
    </ExpoLink>
  );
}

Link.displayName = "Link";
