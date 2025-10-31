import * as SwitchPrimitives from "@rn-primitives/switch";
import * as React from "react";
import { Platform } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

// Cross-platform props interface
export interface SwitchBaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
  value?: string;
  required?: boolean;
}

import { useColorScheme } from "../lib/useColorScheme";
import { cn } from "../lib/utils";

// Native switch props that align with web interface
type NativeSwitchProps = SwitchBaseProps;

const SwitchWeb = React.forwardRef<
  SwitchPrimitives.RootRef,
  NativeSwitchProps
>(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
  const isChecked = checked ?? false;
  const handleCheckedChange = onCheckedChange ?? (() => {});
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer flex-row h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed",
        isChecked ? "bg-primary" : "bg-input",
        disabled && "opacity-50",
        className,
      ) as never}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-md shadow-foreground/5 ring-0 transition-transform",
          isChecked ? "translate-x-5" : "translate-x-0",
        ) as never}
      />
    </SwitchPrimitives.Root>
  );
});

SwitchWeb.displayName = "SwitchWeb";

const RGB_COLORS = {
  light: {
    primary: "rgb(24, 24, 27)",
    input: "rgb(228, 228, 231)",
  },
  dark: {
    primary: "rgb(250, 250, 250)",
    input: "rgb(39, 39, 42)",
  },
} as const;

const SwitchNative = React.forwardRef<
  SwitchPrimitives.RootRef,
  NativeSwitchProps
>(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
  const { colorScheme } = useColorScheme();
  const isChecked = checked ?? false;
  const handleCheckedChange = onCheckedChange ?? (() => {});
  const translateX = useDerivedValue(() => (isChecked ? 18 : 0));
  const animatedRootStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [0, 18],
        [RGB_COLORS[colorScheme].input, RGB_COLORS[colorScheme].primary],
      ),
    };
  });
  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(translateX.value, { duration: 200 }) },
    ],
  }));
  return (
    <Animated.View
      style={animatedRootStyle}
      className={cn(
        "h-8 w-[46px] rounded-full",
        disabled && "opacity-50",
      ) as never}
    >
      <SwitchPrimitives.Root
        className={cn(
          "flex-row h-8 w-[46px] shrink-0 items-center rounded-full border-2 border-transparent",
          isChecked ? "bg-primary" : "bg-input",
          className,
        ) as never}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        {...props}
        ref={ref}
      >
        <Animated.View style={animatedThumbStyle}>
          <SwitchPrimitives.Thumb
            className={
              "h-7 w-7 rounded-full bg-background shadow-md shadow-foreground/25 ring-0" as never
            }
          />
        </Animated.View>
      </SwitchPrimitives.Root>
    </Animated.View>
  );
});
SwitchNative.displayName = "SwitchNative";

const Switch = Platform.select({
  web: SwitchWeb,
  default: SwitchNative,
});

export { Switch };
export type { NativeSwitchProps as SwitchProps };
