/**
 * BottomSheet Component Aliases
 * Aliases for Sheet components to provide BottomSheet naming convention
 */

// BottomSheetView is just a View wrapper
import { styled } from "nativewind";
import type { ReactNode } from "react";
import React from "react";
import { View } from "react-native";

export {
  Sheet as BottomSheet,
  SheetClose as BottomSheetCloseTrigger,
  SheetContent as BottomSheetContent,
  SheetTrigger as BottomSheetOpenTrigger,
} from "./sheet";

const StyledView = styled(View, { className: "style" });

interface BottomSheetViewProps {
  children: ReactNode;
  className?: string;
}

export function BottomSheetView({
  children,
  className,
}: BottomSheetViewProps): React.JSX.Element {
  return <StyledView className={className}>{children}</StyledView>;
}

BottomSheetView.displayName = "BottomSheetView";
