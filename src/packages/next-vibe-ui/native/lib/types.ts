/**
 * NativeWind className support for React Native components
 *
 * These types add className prop support to React Native base components.
 * This is necessary because NativeWind type generation is not configured
 * in this environment.
 */

import type { ComponentPropsWithoutRef } from "react";
import type { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";

export type ViewPropsWithClassName = ComponentPropsWithoutRef<typeof View> & {
  className?: string;
};

export type TextPropsWithClassName = ComponentPropsWithoutRef<typeof Text> & {
  className?: string;
};

export type PressablePropsWithClassName = ComponentPropsWithoutRef<typeof Pressable> & {
  className?: string;
};

export type ImagePropsWithClassName = ComponentPropsWithoutRef<typeof Image> & {
  className?: string;
};

export type ScrollViewPropsWithClassName = ComponentPropsWithoutRef<typeof ScrollView> & {
  className?: string;
};

export type TextInputPropsWithClassName = ComponentPropsWithoutRef<typeof TextInput> & {
  className?: string;
};

/**
 * Utility type to add className support to any component props
 */
export type WithClassName<T> = T & { className?: string };

/**
 * Extended slottable types with className support for NativeWind
 * These extend the @rn-primitives slottable types to include className
 */
import type {
  SlottablePressableProps as RNPSlottablePressableProps,
  SlottableTextProps as RNPSlottableTextProps,
  SlottableViewProps as RNPSlottableViewProps,
} from "@rn-primitives/types";

export type SlottableTextPropsWithClassName = RNPSlottableTextProps & {
  className?: string;
};

export type SlottableViewPropsWithClassName = RNPSlottableViewProps & {
  className?: string;
};

export type SlottablePressablePropsWithClassName = RNPSlottablePressableProps & {
  className?: string;
};

/**
 * Type helper to extract component props with className support
 * This is used to work around the fact that @rn-primitives uses type aliases
 * which cannot be augmented via module declaration merging
 */
export type WithClassNameProps<T> = T extends { className?: string }
  ? T
  : T & { className?: string };
