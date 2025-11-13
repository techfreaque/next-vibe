import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View, Pressable, type AccessibilityRole } from "react-native";
import { styled } from "nativewind";

import type { UlProps, UlMouseEvent } from "@/packages/next-vibe-ui/web/ui/ul";

const StyledPressable = styled(Pressable, { className: "style" });
const StyledView = styled(View, { className: "style" });

function Ul({
  className,
  children,
  style: _style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  id: _id,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": _ariaLabelledby,
  "aria-describedby": _ariaDescribedby,
}: UlProps): React.JSX.Element {
  const handlePress = onClick
    ? (): void => {
        const event: UlMouseEvent = {
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
        const event: UlMouseEvent = {
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
        const event: UlMouseEvent = {
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
        className={cn(className)}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={ariaLabel}
      >
        {children}
      </StyledPressable>
    );
  }

  return (
    <StyledView
      className={cn(className)}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={ariaLabel}
    >
      {children}
    </StyledView>
  );
}

export { Ul };
