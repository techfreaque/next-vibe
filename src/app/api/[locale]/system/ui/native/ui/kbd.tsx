import { styled } from "nativewind";
import { cn } from "next-vibe/core/utils/utils";
import { convertCSSToTextStyle } from "next-vibe/ui/native/utils/style-converter";
import type { KbdMouseEvent, KbdProps } from "next-vibe/ui/web/ui/kbd";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";
import type { TextStyle } from "react-native";
import { Text } from "react-native";

const StyledText = styled(Text, { className: "style" });

function Kbd({
  className,
  children,
  style,
  onClick,
  ...props
}: KbdProps): React.JSX.Element {
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

  const nativeStyle: TextStyle | undefined = style
    ? convertCSSToTextStyle(style)
    : undefined;

  return (
    <StyledText
      onPress={handlePress}
      {...applyStyleType({
        nativeStyle,
        className: cn(className),
      })}
      {...props}
    >
      {children}
    </StyledText>
  );
}

export { Kbd };
