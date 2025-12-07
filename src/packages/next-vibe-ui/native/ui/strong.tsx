import * as React from "react";
import { Text } from "react-native";
import { cn } from "next-vibe/shared/utils/utils";
import type { StyleType } from "../utils/style-type";

export interface StrongTouchEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export type StrongProps = {
  children?: React.ReactNode;
  id?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  onPress?: (event: StrongTouchEvent) => void;
} & StyleType;

function Strong({ className, children, style, ...props }: StrongProps): React.JSX.Element {
  return (
    <Text className={cn("font-bold", className)} style={style} {...props}>
      {children}
    </Text>
  );
}

export { Strong };
