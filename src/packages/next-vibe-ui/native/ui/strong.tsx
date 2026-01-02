import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { Text } from "react-native";

export interface StrongTouchEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export interface StrongProps {
  children?: React.ReactNode;
  id?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  onPress?: (event: StrongTouchEvent) => void;
  className?: string;
}

function Strong({ className, children, ...props }: StrongProps): React.JSX.Element {
  return (
    <Text className={cn("font-bold", className)} {...props}>
      {children}
    </Text>
  );
}

export { Strong };
