import * as ProgressPrimitive from "@rn-primitives/progress";
import * as React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

import { cn } from "next-vibe/shared/utils/utils";

// Import ALL types from web - ZERO definitions here
import type {
  ProgressRootProps,
  ProgressIndicatorProps,
} from "@/packages/next-vibe-ui/web/ui/progress";

const StyledProgressRoot = ProgressPrimitive.Root;
const StyledProgressIndicator = ProgressPrimitive.Indicator;

function Progress({
  className,
  value,
  max,
  getValueLabel,
  children,
}: ProgressRootProps): React.JSX.Element {
  return (
    <StyledProgressRoot
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
      value={value ?? undefined}
      max={max}
      getValueLabel={getValueLabel}
    >
      {children ?? <ProgressIndicator value={value} />}
    </StyledProgressRoot>
  );
}
Progress.displayName = ProgressPrimitive.Root.displayName;

function ProgressIndicator({
  className,
  value,
  ...props
}: ProgressIndicatorProps): React.JSX.Element {
  const progress = useDerivedValue(() => value ?? 0);

  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
        { overshootClamping: true },
      ),
    };
  });

  return (
    <StyledProgressIndicator
      asChild
      className={cn("h-full bg-foreground", className)}
      {...props}
    >
      <Animated.View style={indicator} />
    </StyledProgressIndicator>
  );
}
ProgressIndicator.displayName = ProgressPrimitive.Indicator.displayName;

export { Progress, ProgressIndicator };
