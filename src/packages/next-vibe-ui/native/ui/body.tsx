import React from "react";
import { ScrollView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BodyProps } from "../../web/ui/body";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";

const StyledSafeArea = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const _StyledContent = styled(View);


export default function Body({
  children,
  className,
}: BodyProps): React.JSX.Element {
  return (
    <StyledSafeArea className={cn("flex-1", className)}>
      <StyledScrollView
        scrollEnabled={true}
        keyboardDismissMode={Platform.select({
          ios: "interactive",
          android: "on-drag",
        })}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {children}
      </StyledScrollView>
    </StyledSafeArea>
  );
} 