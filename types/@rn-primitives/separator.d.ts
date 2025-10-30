declare module '@rn-primitives/separator' {
  import type * as React from 'react';
  import type { View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root } from '@rn-primitives/separator/dist/index';

  // Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
}
