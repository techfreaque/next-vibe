declare module '@rn-primitives/collapsible' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, View, ViewProps } from 'react-native';

  // Re-export all original types
  export * from '@rn-primitives/collapsible/dist/index';

  // Augment Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
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
  export type TriggerRef = React.ElementRef<typeof Pressable>;
  export type ContentRef = React.ElementRef<typeof View>;
}
