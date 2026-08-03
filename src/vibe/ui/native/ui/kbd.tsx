import { styled } from "nativewind";
import { cn } from "../../../unified-ui/_shared/cn";
import * as React from "react";
import type { TextStyle } from "react-native";
import { Text } from "react-native";

import { convertCSSToTextStyle } from "../utils/style-converter";
import type { KbdMouseEvent, KbdProps } from "../../web/ui/kbd";
import { applyStyleType } from "../../web/utils/style-type";

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
