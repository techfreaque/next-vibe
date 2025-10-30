declare module '@rn-primitives/toggle-group' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root, useItemContext, useRootContext, utils } from '@rn-primitives/toggle-group/dist/index';

  // Declare components with ForwardRef types for className support
  export const Item: React.ForwardRefExoticComponent<ItemProps & React.RefAttributes<ItemRef>>;

  // Props types with className for NativeWind support
  interface SingleRootProps {
    type: 'single';
    value: string | undefined;
    onValueChange: (val: string | undefined) => void;
  }

  interface MultipleRootProps {
    type: 'multiple';
    value: string[];
    onValueChange: (val: string[]) => void;
  }

  export type RootProps = (SingleRootProps | MultipleRootProps) & ViewProps & {
    className?: string;
    disabled?: boolean;
    rovingFocus?: boolean;
    orientation?: 'horizontal' | 'vertical';
    dir?: 'ltr' | 'rtl';
    loop?: boolean;
    asChild?: boolean;
  };

  export type ItemProps = PressableProps & {
    className?: string;
    value: string;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type ItemRef = React.ElementRef<typeof Pressable>;
}
