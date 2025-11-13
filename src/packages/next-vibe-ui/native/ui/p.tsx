import { Text } from "react-native";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";

import type { PProps } from "../../web/ui/typography";

const StyledText = styled(Text, { className: "style" });

export function P({
  className,
  children,
}: PProps): React.JSX.Element {
  return (
    <StyledText
      className={cn("leading-7 text-foreground", className)}
    >
      {children}
    </StyledText>
  );
}
