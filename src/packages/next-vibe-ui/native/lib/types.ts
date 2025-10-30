/**
 * NativeWind className support for React Native components
 *
 * These types add className prop support to React Native base components.
 * This is necessary because NativeWind type generation is not configured
 * in this environment.
 */

import type { ComponentPropsWithoutRef } from 'react';
import type {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';

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
