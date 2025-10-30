declare module '@rn-primitives/hover-card' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root, Portal, useRootContext } from '@rn-primitives/hover-card/dist/index';

  // Declare components with ForwardRef types for className support
  export const Trigger: React.ForwardRefExoticComponent<TriggerProps & React.RefAttributes<TriggerRef>>;
  export const Overlay: React.ForwardRefExoticComponent<OverlayProps & React.RefAttributes<OverlayRef>>;
  export const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<ContentRef>>;

  // Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    onOpenChange?: (open: boolean) => void;
    openDelay?: number;
    closeDelay?: number;
    asChild?: boolean;
  };

  export type TriggerProps = PressableProps & {
    className?: string;
    asChild?: boolean;
  };

  export type OverlayProps = PressableProps & {
    className?: string;
    forceMount?: true | undefined;
    closeOnPress?: boolean;
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

  export interface PortalProps {
    children: React.ReactNode;
    hostName?: string;
    container?: HTMLElement | null | undefined;
    forceMount?: true | undefined;
  }

  // Ref types
  export type RootRef = View;
  export type TriggerRef = Pressable & {
    open: () => void;
    close: () => void;
  };
  export type OverlayRef = Pressable;
  export type ContentRef = View;
}
