import * as React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import type { SkeletonProps } from "@/packages/next-vibe-ui/web/ui/skeleton";
import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";

const duration = 1000;

function Skeleton({
  className,
  style,
  children,
  ...props
}: SkeletonProps): React.JSX.Element {
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

  const convertedStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Extract id from props if present and map to nativeID
  const { id, ...restProps } = props as { id?: string };

  return (
    <Animated.View
      nativeID={id}
      style={[animStyle, convertedStyle]}
      className={cn("rounded-md bg-secondary dark:bg-muted", className)}
      {...restProps}
    >
      {children}
    </Animated.View>
  );
}

export { Skeleton };
