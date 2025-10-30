declare module '@rn-primitives/avatar' {
  import type * as React from 'react';
  import type { Image as RNImage, ImageProps as RNImageProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root } from '@rn-primitives/avatar/dist/index';

  // Declare components with ForwardRef types for className support
  export const Image: React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<ImageRef>>;
  export const Fallback: React.ForwardRefExoticComponent<FallbackProps & React.RefAttributes<FallbackRef>>;

  // Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    alt: string;
    asChild?: boolean;
  };

  export type ImageProps = Omit<RNImageProps, 'alt'> & {
    className?: string;
    children?: React.ReactNode;
    onLoadingStatusChange?: (status: 'error' | 'loaded') => void;
    asChild?: boolean;
  };

  export type FallbackProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type ImageRef = React.ElementRef<typeof Image>;
  export type FallbackRef = React.ElementRef<typeof View>;
}
