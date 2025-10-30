declare module '@rn-primitives/progress' {
  import type * as React from 'react';
  import type { View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root } from '@rn-primitives/progress/dist/index';

  // Declare components with ForwardRef types for className support
  export const Indicator: React.ForwardRefExoticComponent<IndicatorProps & React.RefAttributes<IndicatorRef>>;

  // Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    value?: number | null | undefined;
    max?: number;
    getValueLabel?(value: number, max: number): string;
    asChild?: boolean;
  };

  export type IndicatorProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type IndicatorRef = React.ElementRef<typeof View>;
}
