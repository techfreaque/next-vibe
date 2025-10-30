declare module '@rn-primitives/checkbox' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root } from '@rn-primitives/checkbox/dist/index';

  // Declare components with ForwardRef types for className support
  export const Indicator: React.ForwardRefExoticComponent<IndicatorProps & React.RefAttributes<IndicatorRef>>;

  // Props types with className for NativeWind support
  export type RootProps = PressableProps & {
    className?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    asChild?: boolean;
  };

  export type IndicatorProps = ViewProps & {
    className?: string;
    forceMount?: true | undefined;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof Pressable>;
  export type IndicatorRef = React.ElementRef<typeof View>;
}
