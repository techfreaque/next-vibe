import * as ProgressPrimitive from "@rn-primitives/progress";
import * as React from "react";
import { Platform, View as RNView } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

import type { ProgressProps } from "next-vibe-ui/ui/progress";
import type { ViewPropsWithClassName } from "../lib/types";
import { cn } from "../lib/utils";

// Type-safe View component with className support for NativeWind
const View = RNView as React.ComponentType<ViewPropsWithClassName>;

const Progress = React.forwardRef<ProgressPrimitive.RootRef, ProgressProps>(
  function Progress({ className, indicatorClassName, value, max }, ref) {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className,
        )}
        value={value ?? undefined}
        max={max}
      >
        <Indicator value={value} className={indicatorClassName} />
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

function Indicator({
  value,
  className,
}: {
  value: number | undefined | null;
  className?: string;
}): React.JSX.Element {
  const progress = useDerivedValue(() => value ?? 0);

  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
        { overshootClamping: true },
      ),
    };
  });

  if (Platform.OS === "web") {
    return (
      <ProgressPrimitive.Indicator asChild className={cn("h-full w-full flex-1 bg-primary web:transition-all", className)}>
        <View
          style={{
            transform: `translateX(-${100 - (value ?? 0)}%)`,
          }}
        />
      </ProgressPrimitive.Indicator>
    );
  }

  return (
    <ProgressPrimitive.Indicator asChild className={cn("h-full bg-foreground", className)}>
      <Animated.View style={indicator} />
    </ProgressPrimitive.Indicator>
  );
}
