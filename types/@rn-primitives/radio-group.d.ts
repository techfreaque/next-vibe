declare module '@rn-primitives/radio-group' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root } from '@rn-primitives/radio-group/dist/index';

  // Declare components with ForwardRef types for className support
  export const Item: React.ForwardRefExoticComponent<ItemProps & React.RefAttributes<ItemRef>>;
  export const Indicator: React.ForwardRefExoticComponent<IndicatorProps & React.RefAttributes<IndicatorRef>>;

  // Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    value: string | undefined;
    onValueChange: (val: string) => void;
    disabled?: boolean;
    asChild?: boolean;
  };

  export type ItemProps = PressableProps & {
    className?: string;
    value: string;
    'aria-labelledby'?: string;
    asChild?: boolean;
  };

  export type IndicatorProps = ViewProps & {
    className?: string;
    forceMount?: true | undefined;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type ItemRef = React.ElementRef<typeof Pressable>;
  export type IndicatorRef = React.ElementRef<typeof View>;
}
