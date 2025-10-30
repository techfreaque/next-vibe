declare module '@rn-primitives/dialog' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, Text, TextProps, View, ViewProps } from 'react-native';

  export { Root, Portal, Trigger, Close, useRootContext } from '@rn-primitives/dialog/dist/index';

  export const Overlay: React.ForwardRefExoticComponent<OverlayProps & React.RefAttributes<OverlayRef>>;
  export const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<ContentRef>>;
  export const Title: React.ForwardRefExoticComponent<TitleProps & React.RefAttributes<TitleRef>>;
  export const Description: React.ForwardRefExoticComponent<DescriptionProps & React.RefAttributes<DescriptionRef>>;

  export type OverlayProps = PressableProps & {
    className?: string;
    forceMount?: true | undefined;
    closeOnPress?: boolean;
  };
  export type ContentProps = ViewProps & {
    className?: string;
    forceMount?: true | undefined;
    onOpenAutoFocus?: (ev: Event) => void;
    onCloseAutoFocus?: (ev: Event) => void;
    onEscapeKeyDown?: (ev: Event) => void;
    onInteractOutside?: (ev: Event) => void;
    onPointerDownOutside?: (ev: Event) => void;
  };
  export type TitleProps = TextProps & { className?: string; asChild?: boolean };
  export type DescriptionProps = TextProps & { className?: string; asChild?: boolean };
  export type CloseProps = PressableProps & { className?: string; asChild?: boolean };
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

  export type OverlayRef = Pressable;
  export type ContentRef = View;
  export type TitleRef = Text;
  export type DescriptionRef = Text;
  export type CloseRef = Pressable;
  export type TriggerRef = Pressable;
  export type RootRef = View;
}
