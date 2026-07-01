import { styled } from "nativewind";
import { cn } from "next-vibe/core/utils/utils";
import { convertCSSToViewStyle } from "next-vibe/ui/native/utils/style-converter";
import type { BadgeProps } from "next-vibe/ui/web/ui/badge";
import { badgeTextVariants, badgeVariants } from "next-vibe/ui/web/ui/badge";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import { View } from "react-native";

import { Text, TextClassContext } from "./text";

const StyledView = styled(View, { className: "style" });

function Badge({
  variant,
  children,
  className,
  style,
}: BadgeProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn(badgeVariants({ variant }), className),
        })}
      >
        <Text>{children}</Text>
      </StyledView>
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
