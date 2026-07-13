/**
 * NativeWind className support for React Native components
 *
 * These types add className prop support to React Native base components.
 * This is necessary because NativeWind type generation is not configured
 * in this environment.
 */

import type { SlottableTextProps as RNPSlottableTextProps } from "@rn-primitives/types";

export type SlottableTextPropsWithClassName = RNPSlottableTextProps & {
  className?: string;
};
