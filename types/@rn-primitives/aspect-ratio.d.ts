declare module '@rn-primitives/aspect-ratio' {
  import type * as React from 'react';
  import type { View, ViewProps } from 'react-native';

  // Re-export all original types
  export * from '@rn-primitives/aspect-ratio/dist/index';

  // Augment Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    ratio?: number;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
}
