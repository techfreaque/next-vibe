/**
 * BottomSheet Component Aliases
 * Aliases for Sheet components to provide BottomSheet naming convention
 */

// BottomSheetView is just a View wrapper
import type { ReactNode } from "react";
import React from "react";
import { View } from "react-native";

export {
  Sheet as BottomSheet,
  SheetClose as BottomSheetCloseTrigger,
  SheetContent as BottomSheetContent,
  SheetTrigger as BottomSheetOpenTrigger,
} from "./sheet";

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
  return <View className={className}>{children}</View>;
}

BottomSheetView.displayName = "BottomSheetView";
