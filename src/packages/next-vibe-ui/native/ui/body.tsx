import React from "react";
import { ScrollView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BodyProps } from "../../web/ui/body";
import { styled } from "nativewind";
import { cn } from "../lib/utils";

const StyledSafeArea = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledContent = styled(View);


export default function Body({
  children,
  className,
}: BodyProps) {
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