/**
 * Styled wrappers for third-party components to add className support via NativeWind v5
 *
 * NativeWind v5 uses import rewrites to add className support to core React Native components.
 * For third-party components (react-native-reanimated, etc.), we need to use
 * the styled() API to explicitly add className support.
 *
 * @rn-primitives styled components are now defined locally in each component file
 * to avoid type instantiation issues with nativewind's styled() function.
 *
 * @see https://www.nativewind.dev/v5/guides/third-party-components
 */

import { styled } from "nativewind";
import Animated from "react-native-reanimated";

/**
 * Styled Animated.View with className support
 * Use this instead of Animated.View when you need className prop
 */
export const StyledAnimatedView = styled(Animated.View, {
  className: "style",
});

/**
 * Styled Animated.Text with className support
 */
export const StyledAnimatedText = styled(Animated.Text, {
  className: "style",
});

/**
 * Styled Animated.ScrollView with className support
 */
export const StyledAnimatedScrollView = styled(Animated.ScrollView, {
  className: "style",
});
