declare module '@rn-primitives/slider' {
  import type * as React from 'react';
  import type { View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root } from '@rn-primitives/slider/dist/index';

  // Declare components with ForwardRef types for className support
  export const Track: React.ForwardRefExoticComponent<TrackProps & React.RefAttributes<TrackRef>>;
  export const Range: React.ForwardRefExoticComponent<RangeProps & React.RefAttributes<RangeRef>>;
  export const Thumb: React.ForwardRefExoticComponent<ThumbProps & React.RefAttributes<ThumbRef>>;

  // Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    value: number;
    disabled?: boolean;
    min?: number;
    max?: number;
    dir?: 'ltr' | 'rtl';
    inverted?: boolean;
    step?: number;
    onValueChange?: (value: number[]) => void;
    asChild?: boolean;
  };

  export type TrackProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type RangeProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type ThumbProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type TrackRef = React.ElementRef<typeof View>;
  export type RangeRef = React.ElementRef<typeof View>;
  export type ThumbRef = React.ElementRef<typeof View>;
}
