import * as SwitchPrimitives from "@rn-primitives/switch";
import * as React from "react";
import { Platform } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { styled } from "nativewind";

import type { SwitchBaseProps } from "next-vibe-ui/ui/switch";

import { useColorScheme } from "../lib/useColorScheme";
import { cn } from "next-vibe/shared/utils/utils";

type NativeSwitchProps = SwitchBaseProps;

const StyledAnimatedView = styled(Animated.View);
const StyledSwitchRoot = styled(SwitchPrimitives.Root);
const StyledSwitchThumb = styled(SwitchPrimitives.Thumb);

const SwitchWeb = React.forwardRef<
  SwitchPrimitives.RootRef,
  NativeSwitchProps
>(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
  const isChecked = checked ?? false;
  const handleCheckedChange = onCheckedChange ?? ((_checked: boolean): void => {
    return;
  });
  return (
    <StyledSwitchRoot
      // eslint-disable-next-line i18n/no-literal-string
      className={cn(
        "peer flex-row h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed",
        isChecked ? "bg-primary" : "bg-input",
        disabled && "opacity-50",
        className,
      )}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
      {...props}
      ref={ref}
    >
      <StyledSwitchThumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-md shadow-foreground/5 ring-0 transition-transform",
          isChecked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </StyledSwitchRoot>
  );
});

SwitchWeb.displayName = "SwitchWeb";

// eslint-disable-next-line i18n/no-literal-string
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
  const handleCheckedChange = onCheckedChange ?? ((_checked: boolean): void => {
    return;
  });
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
    <StyledAnimatedView
      style={animatedRootStyle}
      className={cn(
        "h-8 w-[46px] rounded-full",
        disabled && "opacity-50",
      )}
    >
      <StyledSwitchRoot
        className={cn(
          "flex-row h-8 w-[46px] shrink-0 items-center rounded-full border-2 border-transparent",
          isChecked ? "bg-primary" : "bg-input",
          className,
        )}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        {...props}
        ref={ref}
      >
        <StyledAnimatedView style={animatedThumbStyle}>
          <StyledSwitchThumb
            // eslint-disable-next-line i18n/no-literal-string
            className={
              "h-7 w-7 rounded-full bg-background shadow-md shadow-foreground/25 ring-0"
            }
          />
        </StyledAnimatedView>
      </StyledSwitchRoot>
    </StyledAnimatedView>
  );
});
SwitchNative.displayName = "SwitchNative";

const Switch = Platform.select({
  web: SwitchWeb,
  default: SwitchNative,
});

export { Switch };
export type { NativeSwitchProps as SwitchProps };
