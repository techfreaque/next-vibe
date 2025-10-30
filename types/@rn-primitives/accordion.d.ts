declare module '@rn-primitives/accordion' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, View, ViewProps } from 'react-native';

  // Re-export all original types
  export * from '@rn-primitives/accordion/dist/index';

  // Augment Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    type: 'single' | 'multiple';
    defaultValue?: string | string[];
    value?: string | string[];
    onValueChange?: ((value: string | undefined) => void) | ((value: string[]) => void);
    disabled?: boolean;
    collapsible?: boolean;
    dir?: 'ltr' | 'rtl';
    orientation?: 'vertical' | 'horizontal';
    asChild?: boolean;
  };

  export type ItemProps = ViewProps & {
    className?: string;
    value: string;
    disabled?: boolean;
    asChild?: boolean;
  };

  export type HeaderProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type TriggerProps = PressableProps & {
    className?: string;
    asChild?: boolean;
  };

  export type ContentProps = ViewProps & {
    className?: string;
    forceMount?: true | undefined;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type ItemRef = React.ElementRef<typeof View>;
  export type HeaderRef = React.ElementRef<typeof View>;
  export type TriggerRef = React.ElementRef<typeof Pressable>;
  export type ContentRef = React.ElementRef<typeof View>;
}
