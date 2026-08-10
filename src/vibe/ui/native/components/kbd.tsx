import { styled } from "nativewind";
import * as React from "react";
import type { TextStyle } from "react-native";
import { Text } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import type { KbdMouseEvent, KbdProps } from "../../web/components/kbd";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToTextStyle } from "../utils/style-converter";

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
