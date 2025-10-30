declare module '@rn-primitives/toggle' {
  import type * as React from 'react';
  import type { Pressable, PressableProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root } from '@rn-primitives/toggle/dist/index';

  // Props types with className for NativeWind support
  export type RootProps = PressableProps & {
    className?: string;
    pressed: boolean;
    onPressedChange: (pressed: boolean) => void;
    disabled?: boolean;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof Pressable>;
}
