import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View, Pressable, type AccessibilityRole } from "react-native";
import { styled } from "nativewind";

import type { OlProps, OlMouseEvent } from "@/packages/next-vibe-ui/web/ui/ol";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

const StyledPressable = styled(Pressable, { className: "style" });
const StyledView = styled(View, { className: "style" });

function Ol({
  className,
  children,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  start,
  role,
  "aria-label": ariaLabel,
  id,
}: OlProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const handlePress = onClick
    ? (): void => {
        const event: OlMouseEvent = {
          preventDefault: (): void => {
            // No-op for native
          },
          stopPropagation: (): void => {
            // No-op for native
          },
        };
        onClick(event);
      }
    : undefined;

  const handlePressIn = onMouseEnter
    ? (): void => {
        const event: OlMouseEvent = {
          preventDefault: (): void => {
            // No-op for native
          },
          stopPropagation: (): void => {
            // No-op for native
          },
        };
        onMouseEnter(event);
      }
    : undefined;

  const handlePressOut = onMouseLeave
    ? (): void => {
        const event: OlMouseEvent = {
          preventDefault: (): void => {
            // No-op for native
          },
          stopPropagation: (): void => {
            // No-op for native
          },
        };
        onMouseLeave(event);
      }
    : undefined;

  // Native doesn't support list styling (start, reversed, type, style) - these are CSS-only
  // But we accept them for API compatibility

  // Valid React Native accessibility roles
  const validRoles: AccessibilityRole[] = [
    'none', 'button', 'link', 'search', 'image', 'keyboardkey', 'text',
    'adjustable', 'imagebutton', 'header', 'summary', 'alert', 'checkbox',
    'combobox', 'menu', 'menubar', 'menuitem', 'progressbar', 'radio',
    'radiogroup', 'scrollbar', 'spinbutton', 'switch', 'tab', 'tablist',
    'timer', 'toolbar', 'list', 
  ];

  const accessibilityRole: AccessibilityRole | undefined =
    role && validRoles.includes(role as AccessibilityRole)
      ? (role as AccessibilityRole)
      : undefined;

  // If we have click handlers, use Pressable, otherwise use View
  if (onClick || onMouseEnter || onMouseLeave) {
    return (
      <StyledPressable
        {...applyStyleType({ nativeStyle, className: cn(className) })}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={ariaLabel}
        accessibilityValue={start !== undefined ? { text: String(start) } : undefined}
        nativeID={id}
      >
        {children}
      </StyledPressable>
    );
  }

  return (
    <StyledView
      {...applyStyleType({ nativeStyle, className: cn(className) })}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={ariaLabel}
      accessibilityValue={start !== undefined ? { text: String(start) } : undefined}
      nativeID={id}
    >
      {children}
    </StyledView>
  );
}

export { Ol };
