import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import type { BodyProps } from "../../web/ui/body";

const StyledSafeAreaView = styled(SafeAreaView, { className: "style" });

export function Body({ children, className }: BodyProps): React.JSX.Element {
  return (
    <StyledSafeAreaView className={className}>{children}</StyledSafeAreaView>
  );
}
