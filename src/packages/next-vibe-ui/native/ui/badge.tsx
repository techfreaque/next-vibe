import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import { View } from "react-native";

import type { BadgeProps } from "@/packages/next-vibe-ui/web/ui/badge";
import { badgeTextVariants, badgeVariants } from "@/packages/next-vibe-ui/web/ui/badge";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { Text, TextClassContext } from "./text";

const StyledView = styled(View, { className: "style" });

function Badge({ variant, children, className, style }: BadgeProps): React.JSX.Element {
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
