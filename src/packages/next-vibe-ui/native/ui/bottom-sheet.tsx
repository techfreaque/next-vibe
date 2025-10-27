/**
 * BottomSheet Component Aliases
 * Aliases for Sheet components to provide BottomSheet naming convention
 */

export {
  Sheet as BottomSheet,
  SheetTrigger as BottomSheetOpenTrigger,
  SheetClose as BottomSheetCloseTrigger,
  SheetContent as BottomSheetContent,
} from "./sheet";

// BottomSheetView is just a View wrapper
import type { ReactNode } from "react";
import React from "react";
import { View } from "react-native";

interface BottomSheetViewProps {
  children: ReactNode;
  hadHeader?: boolean;
  className?: string;
}

export function BottomSheetView({
  children,
  hadHeader,
  className,
}: BottomSheetViewProps): React.JSX.Element {
  return (
    <View className={className}>
      {children}
    </View>
  );
}

BottomSheetView.displayName = "BottomSheetView";

