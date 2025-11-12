import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View } from "react-native";
import { styled } from "nativewind";

// Import ALL types from web - ZERO definitions here
import type { LiProps, LiMouseEvent } from "@/packages/next-vibe-ui/web/ui/li";

// Styled components for NativeWind support
const StyledView = styled(View, { className: "style" });

function Li({
  className,
  children,
  style: _style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  value,
  ...props
}: LiProps): React.JSX.Element {
  const handlePress = onClick
    ? (): void => {
        const event: LiMouseEvent = {
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
        const event: LiMouseEvent = {
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
        const event: LiMouseEvent = {
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

  return (
    <StyledView
      className={cn(className)}
      onTouchEnd={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityValue={value !== undefined ? { text: String(value) } : undefined}
      {...props}
    >
      {children}
    </StyledView>
  );
}

export { Li };
