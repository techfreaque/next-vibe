import { View } from "react-native";
import { styled } from "nativewind";

import type { BadgeProps } from "@/packages/next-vibe-ui/web/ui/badge";
import {
  badgeTextVariants,
  badgeVariants,
} from "@/packages/next-vibe-ui/web/ui/badge";
import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";
import { TextClassContext } from "./text";

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
        {children}
      </StyledView>
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
