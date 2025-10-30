declare module '@rn-primitives/switch' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root } from '@rn-primitives/switch/dist/index';

  // Declare components with ForwardRef types for className support
  export const Thumb: React.ForwardRefExoticComponent<ThumbProps & React.RefAttributes<ThumbRef>>;

  // Props types with className for NativeWind support
  export type RootProps = PressableProps & {
    className?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    onKeyDown?: (ev: React.KeyboardEvent) => void;
    asChild?: boolean;
  };

  export type ThumbProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof Pressable>;
  export type ThumbRef = React.ElementRef<typeof View>;
}
