import * as SwitchPrimitives from "@rn-primitives/switch";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import type { SwitchRootProps } from "@/packages/next-vibe-ui/web/ui/switch";

import { useColorScheme } from "../lib/useColorScheme";
import { convertCSSToViewStyle, styledNative } from "../utils/style-converter";

// Re-export all types from web
export type { SwitchRootProps };

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const THUMB_CLASSNAME =
  "h-7 w-7 rounded-full bg-background shadow-md shadow-foreground/25 ring-0";
/* eslint-enable i18next/no-literal-string */

const StyledAnimatedView = styledNative(Animated.View);
const StyledSwitchRoot = styledNative(SwitchPrimitives.Root);
const StyledSwitchThumb = styledNative(SwitchPrimitives.Thumb);

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

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  defaultChecked,
  className,
  style,
  onBlur,
  children,
  id,
}: SwitchRootProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  const { colorScheme } = useColorScheme();

  // Handle controlled/uncontrolled state with defaultChecked
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked ?? false,
  );
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? (checked ?? false) : internalChecked;

  const handleCheckedChange = React.useCallback(
    (newChecked: boolean) => {
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
      onBlur?.();
    },
    [isControlled, onCheckedChange, onBlur],
  );

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
      style={[animatedRootStyle, nativeStyle]}
      className={cn(
        "h-8 w-[46px] rounded-full",
        disabled && "opacity-50",
        className,
      )}
      nativeID={id}
    >
      <StyledSwitchRoot
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
      >
        <StyledAnimatedView style={animatedThumbStyle}>
          <StyledSwitchThumb className={THUMB_CLASSNAME} />
        </StyledAnimatedView>
      </StyledSwitchRoot>
      {children}
    </StyledAnimatedView>
  );
}
Switch.displayName = "Switch";
