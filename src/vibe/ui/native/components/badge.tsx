import { styled } from "nativewind";
import { View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import type { BadgeProps } from "../../web/ui/badge";
import { badgeTextVariants, badgeVariants } from "../../web/ui/badge";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
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
