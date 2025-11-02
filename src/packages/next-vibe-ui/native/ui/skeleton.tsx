import * as React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { ViewStyle } from "react-native";

import type { SkeletonProps } from "next-vibe-ui/ui/skeleton";
import { cn } from "../lib/utils";

const duration = 1000;

function Skeleton({ className, style: customStyle, ...props }: SkeletonProps): React.JSX.Element {
  const sv = useSharedValue(1);

  React.useEffect(() => {
    sv.value = withRepeat(
      withSequence(withTiming(0.5, { duration }), withTiming(1, { duration })),
      -1,
    );
  }, [sv]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: sv.value,
  }));

  return (
    <Animated.View
      style={[animStyle, customStyle as ViewStyle]}
      className={cn("rounded-md bg-secondary dark:bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
