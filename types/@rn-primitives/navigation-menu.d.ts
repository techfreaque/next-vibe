declare module '@rn-primitives/navigation-menu' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root, Portal, useItemContext, useRootContext } from '@rn-primitives/navigation-menu/dist/index';

  // Declare components with ForwardRef types for className support
  export const Item: React.ForwardRefExoticComponent<ItemProps & React.RefAttributes<ItemRef>>;
  export const Trigger: React.ForwardRefExoticComponent<TriggerProps & React.RefAttributes<TriggerRef>>;
  export const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<ContentRef>>;
  export const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<LinkRef>>;
  export const List: React.ForwardRefExoticComponent<ListProps & React.RefAttributes<ListRef>>;
  export const Indicator: React.ForwardRefExoticComponent<IndicatorProps & React.RefAttributes<IndicatorRef>>;
  export const Viewport: React.ForwardRefExoticComponent<ViewportProps & React.RefAttributes<ViewportRef>>;

  // Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    value: string | undefined;
    onValueChange: (value: string | undefined) => void;
    delayDuration?: number;
    skipDelayDuration?: number;
    dir?: 'ltr' | 'rtl';
    orientation?: 'horizontal' | 'vertical';
    asChild?: boolean;
  };

  export type ItemProps = ViewProps & {
    className?: string;
    value: string | undefined;
    asChild?: boolean;
  };

  export type TriggerProps = PressableProps & {
    className?: string;
    asChild?: boolean;
  };

  export type ContentProps = ViewProps & {
    className?: string;
    forceMount?: true | undefined;
    alignOffset?: number;
    insets?: { top?: number; bottom?: number; left?: number; right?: number };
    avoidCollisions?: boolean;
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'bottom';
    sideOffset?: number;
    disablePositioningStyle?: boolean;
    loop?: boolean;
    onCloseAutoFocus?: (event: Event) => void;
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: Event) => void;
    onFocusOutside?: (event: Event) => void;
    onInteractOutside?: (event: Event) => void;
    collisionBoundary?: Element | null | Array<Element | null>;
    sticky?: 'partial' | 'always';
    hideWhenDetached?: boolean;
    asChild?: boolean;
  };

  export type LinkProps = PressableProps & {
    className?: string;
    active?: boolean;
    asChild?: boolean;
  };

  export type ListProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type IndicatorProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type ViewportProps = ViewProps & {
    className?: string;
  };

  interface PortalProps {
    children: React.ReactNode;
    hostName?: string;
    container?: HTMLElement | null | undefined;
    forceMount?: true | undefined;
  }

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type ItemRef = React.ElementRef<typeof View>;
  export type TriggerRef = React.ElementRef<typeof Pressable>;
  export type ContentRef = React.ElementRef<typeof View>;
  export type LinkRef = React.ElementRef<typeof Pressable>;
  export type ListRef = React.ElementRef<typeof View>;
  export type IndicatorRef = React.ElementRef<typeof View>;
  export type ViewportRef = React.ElementRef<typeof View>;
}
