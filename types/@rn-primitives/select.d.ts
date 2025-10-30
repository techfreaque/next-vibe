declare module '@rn-primitives/select' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, Text, TextProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root, Portal, ScrollDownButton, ScrollUpButton, Viewport, useItemContext, useRootContext } from '@rn-primitives/select/dist/index';

  // Declare components with ForwardRef types for className support
  export const Trigger: React.ForwardRefExoticComponent<TriggerProps & React.RefAttributes<TriggerRef>>;
  export const Value: React.ForwardRefExoticComponent<ValueProps & React.RefAttributes<ValueRef>>;
  export const Overlay: React.ForwardRefExoticComponent<OverlayProps & React.RefAttributes<OverlayRef>>;
  export const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<ContentRef>>;
  export const Item: React.ForwardRefExoticComponent<ItemProps & React.RefAttributes<ItemRef>>;
  export const ItemText: React.ForwardRefExoticComponent<ItemTextProps & React.RefAttributes<ItemTextRef>>;
  export const ItemIndicator: React.ForwardRefExoticComponent<ItemIndicatorProps & React.RefAttributes<ItemIndicatorRef>>;
  export const Group: React.ForwardRefExoticComponent<GroupProps & React.RefAttributes<GroupRef>>;
  export const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<LabelRef>>;
  export const Separator: React.ForwardRefExoticComponent<SeparatorProps & React.RefAttributes<SeparatorRef>>;

  // Props types with className for NativeWind support
  export type Option = {
    value: string;
    label: string;
  } | undefined;

  export type RootProps = ViewProps & {
    className?: string;
    value?: Option;
    defaultValue?: Option;
    onValueChange?: (option: Option) => void;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    dir?: 'ltr' | 'rtl';
    name?: string;
    required?: boolean;
    asChild?: boolean;
  };

  export type TriggerProps = PressableProps & {
    className?: string;
    asChild?: boolean;
  };

  export type ValueProps = TextProps & {
    className?: string;
    placeholder: string;
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
    position?: 'popper' | 'item-aligned' | undefined;
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

  export type ItemProps = PressableProps & {
    className?: string;
    value: string;
    label: string;
    closeOnPress?: boolean;
    asChild?: boolean;
  };

  export type ItemTextProps = TextProps & {
    className?: string;
    asChild?: boolean;
  };

  export type ItemIndicatorProps = ViewProps & {
    className?: string;
    forceMount?: true | undefined;
    asChild?: boolean;
  };

  export type GroupProps = ViewProps & {
    className?: string;
    asChild?: boolean;
  };

  export type LabelProps = TextProps & {
    className?: string;
    asChild?: boolean;
  };

  export type SeparatorProps = ViewProps & {
    className?: string;
    decorative?: boolean;
    asChild?: boolean;
  };

  interface PortalProps {
    children: React.ReactNode;
    hostName?: string;
    container?: HTMLElement | null | undefined;
    forceMount?: true | undefined;
  }

  export type ScrollDownButtonProps = PressableProps & {
    className?: string;
    asChild?: boolean;
  };

  export type ScrollUpButtonProps = PressableProps & {
    className?: string;
    asChild?: boolean;
  };

  export type ViewportProps = ViewProps & {
    className?: string;
  };

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type TriggerRef = React.ElementRef<typeof Pressable> & {
    open: () => void;
    close: () => void;
  };
  export type ValueRef = React.ElementRef<typeof Text>;
  export type OverlayRef = React.ElementRef<typeof Pressable>;
  export type ContentRef = React.ElementRef<typeof View>;
  export type ItemRef = React.ElementRef<typeof Pressable>;
  export type ItemTextRef = React.ElementRef<typeof Text>;
  export type ItemIndicatorRef = React.ElementRef<typeof View>;
  export type GroupRef = React.ElementRef<typeof View>;
  export type LabelRef = React.ElementRef<typeof Text>;
  export type SeparatorRef = React.ElementRef<typeof View>;
  export type ScrollDownButtonRef = React.ElementRef<typeof Pressable>;
  export type ScrollUpButtonRef = React.ElementRef<typeof Pressable>;
  export type ViewportRef = React.ElementRef<typeof View>;
}
