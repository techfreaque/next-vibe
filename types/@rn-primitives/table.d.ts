declare module '@rn-primitives/table' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root } from '@rn-primitives/table/dist/index';

  // Declare components with ForwardRef types for className support
  export const Header: React.ForwardRefExoticComponent<HeaderProps & React.RefAttributes<HeaderRef>>;
  export const Row: React.ForwardRefExoticComponent<RowProps & React.RefAttributes<RowRef>>;
  export const Head: React.ForwardRefExoticComponent<HeadProps & React.RefAttributes<HeadRef>>;
  export const Body: React.ForwardRefExoticComponent<BodyProps & React.RefAttributes<BodyRef>>;
  export const Cell: React.ForwardRefExoticComponent<CellProps & React.RefAttributes<CellRef>>;
  export const Footer: React.ForwardRefExoticComponent<FooterProps & React.RefAttributes<FooterRef>>;

  // Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type HeaderProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type RowProps = PressableProps & {
    className?: string;
    asChild?: boolean;
  };

  export type HeadProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type BodyProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type CellProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type FooterProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type HeaderRef = React.ElementRef<typeof View>;
  export type RowRef = React.ElementRef<typeof Pressable>;
  export type HeadRef = React.ElementRef<typeof View>;
  export type BodyRef = React.ElementRef<typeof View>;
  export type CellRef = React.ElementRef<typeof View>;
  export type FooterRef = React.ElementRef<typeof View>;
}
