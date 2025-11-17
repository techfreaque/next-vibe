import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { Text } from "react-native";
import type { TextStyle } from "react-native";
import { styled } from "nativewind";
import { convertCSSToTextStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

import type { KbdProps, KbdMouseEvent } from "@/packages/next-vibe-ui/web/ui/kbd";

const StyledText = styled(Text, { className: "style" });

function Kbd({ className, children, style, onClick, ...props }: KbdProps): React.JSX.Element {
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
