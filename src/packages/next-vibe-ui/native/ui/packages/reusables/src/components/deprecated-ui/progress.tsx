import * as React from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { cn } from '../../lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof Animated.View>,
  Omit<React.ComponentPropsWithoutRef<typeof Animated.View>, 'style'> & {
    /**
     * Value between 0 and 100
     */
    progress: SharedValue<number>;
    rootClass?: string;
    style?: ViewStyle;
  }
>(({ progress, rootClass, className, style, ...props }, _ref) => {
  const stylez = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
        { overshootClamping: true }
      ),
    };
  });

  return (
    <View
      className={cn('rounded-xl h-4 bg-border overflow-hidden relative', rootClass)}
      role='progressbar'
    >
      <Animated.View {...props} style={[stylez, style]}>
        <View className={cn('h-4 bg-foreground', className)} />
      </Animated.View>
    </View>
  );
});

Progress.displayName = 'Progress';

export { Progress };
