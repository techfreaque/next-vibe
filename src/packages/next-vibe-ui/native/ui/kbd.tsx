import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { Text } from "react-native";
import { styled } from "nativewind";

// Import ALL types from web - ZERO definitions here
import type { KbdProps, KbdMouseEvent } from "@/packages/next-vibe-ui/web/ui/kbd";

// Styled components for NativeWind support
const StyledText = styled(Text, { className: "style" });

function Kbd({ className, children, style: _style, onClick, ...props }: KbdProps): React.JSX.Element {
  const handlePress = onClick
    ? (): void => {
        const event: KbdMouseEvent = {
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

  return (
    <StyledText
      className={cn(className)}
      onPress={handlePress}
      {...props}
    >
      {children}
    </StyledText>
  );
}

export { Kbd };
