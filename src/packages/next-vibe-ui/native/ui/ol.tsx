import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View } from "react-native";
import { styled } from "nativewind";

// Import ALL types from web - ZERO definitions here
import type { OlProps, OlMouseEvent } from "@/packages/next-vibe-ui/web/ui/ol";

// Styled components for NativeWind support
const StyledView = styled(View, { className: "style" });

function Ol({
  className,
  children,
  style: _style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  start,
  reversed: _reversed,
  type: _type,
  ...props
}: OlProps): React.JSX.Element {
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
  return (
    <StyledView
      className={cn(className)}
      onTouchEnd={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityValue={start !== undefined ? { text: String(start) } : undefined}
      {...props}
    >
      {children}
    </StyledView>
  );
}

export { Ol };
