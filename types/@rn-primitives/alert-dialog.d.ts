declare module '@rn-primitives/alert-dialog' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, Text, TextProps, View, ViewProps } from 'react-native';

  // Export components from original package
  export { Root, Portal, Trigger, useRootContext } from '@rn-primitives/alert-dialog/dist/index';

  // Export Overlay component with className support
  export const Overlay: React.ForwardRefExoticComponent<OverlayProps & React.RefAttributes<OverlayRef>>;
  export const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<ContentRef>>;
  export const Title: React.ForwardRefExoticComponent<TitleProps & React.RefAttributes<TitleRef>>;
  export const Description: React.ForwardRefExoticComponent<DescriptionProps & React.RefAttributes<DescriptionRef>>;
  export const Action: React.ForwardRefExoticComponent<ActionProps & React.RefAttributes<ActionRef>>;
  export const Cancel: React.ForwardRefExoticComponent<CancelProps & React.RefAttributes<CancelRef>>;

  // Props types with className for NativeWind support
  export type OverlayProps = ViewProps & { className?: string; forceMount?: true | undefined };
  export type ContentProps = ViewProps & {
    className?: string;
    forceMount?: true | undefined;
    onOpenAutoFocus?: (ev: Event) => void;
    onCloseAutoFocus?: (ev: Event) => void;
    onEscapeKeyDown?: (ev: Event) => void;
  };
  export type TitleProps = TextProps & { className?: string; asChild?: boolean };
  export type DescriptionProps = TextProps & { className?: string; asChild?: boolean };
  export type ActionProps = PressableProps & { className?: string; asChild?: boolean };
  export type CancelProps = PressableProps & { className?: string; asChild?: boolean };
  export type TriggerProps = PressableProps & { className?: string; asChild?: boolean };
  export type RootProps = ViewProps & {
    className?: string;
    asChild?: boolean;
    open?: boolean;
    onOpenChange?: (value: boolean) => void;
    defaultOpen?: boolean;
  };
  interface PortalProps {
    children: React.ReactNode;
    hostName?: string;
    container?: HTMLElement | null | undefined;
    forceMount?: true | undefined;
  }

  // Ref types
  export type OverlayRef = React.ElementRef<typeof View>;
  export type ContentRef = React.ElementRef<typeof View>;
  export type TitleRef = React.ElementRef<typeof Text>;
  export type DescriptionRef = React.ElementRef<typeof Text>;
  export type ActionRef = React.ElementRef<typeof Pressable>;
  export type CancelRef = React.ElementRef<typeof Pressable>;
  export type TriggerRef = React.ElementRef<typeof Pressable>;
  export type RootRef = React.ElementRef<typeof View>;
}
