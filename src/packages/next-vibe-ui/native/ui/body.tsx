import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import type { BodyProps } from "../../web/ui/body";

// Styled component defined locally to avoid type issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledSafeAreaView = styled(SafeAreaView) as any;

export default function Body({
  children,
  className,
}: BodyProps): React.JSX.Element {
  return (
    <StyledSafeAreaView className={className}>
        {children}
    </StyledSafeAreaView>
  );
}
