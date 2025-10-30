declare module '@rn-primitives/tabs' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root, useRootContext, useTriggerContext } from '@rn-primitives/tabs/dist/index';

  // Declare components with ForwardRef types for className support
  export const List: React.ForwardRefExoticComponent<ListProps & React.RefAttributes<ListRef>>;
  export const Trigger: React.ForwardRefExoticComponent<TriggerProps & React.RefAttributes<TriggerRef>>;
  export const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<ContentRef>>;

  // Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    value: string;
    onValueChange: (value: string) => void;
    orientation?: 'horizontal' | 'vertical';
    dir?: 'ltr' | 'rtl';
    activationMode?: 'automatic' | 'manual';
    asChild?: boolean;
  };

  export type ListProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type TriggerProps = PressableProps & {
    className?: string;
    value: string;
    asChild?: boolean;
  };

  export type ContentProps = ViewProps & {
    className?: string;
    forceMount?: true | undefined;
    value: string;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type ListRef = React.ElementRef<typeof View>;
  export type TriggerRef = React.ElementRef<typeof Pressable>;
  export type ContentRef = React.ElementRef<typeof View>;
}
