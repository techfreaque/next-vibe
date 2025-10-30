declare module '@rn-primitives/label' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, Text as RNText, TextProps as RNTextProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root } from '@rn-primitives/label/dist/index';

  // Declare components with ForwardRef types for className support
  export const Text: React.ForwardRefExoticComponent<TextProps & React.RefAttributes<TextRef>>;

  // Props types with className for NativeWind support
  export type RootProps = PressableProps & {
    className?: string;
    children: React.ReactNode;
    asChild?: boolean;
  };

  export type TextProps = RNTextProps & {
    className?: string;
    nativeID?: string;
    htmlFor?: string;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof Pressable>;
  export type TextRef = React.ElementRef<typeof RNText>;
}
