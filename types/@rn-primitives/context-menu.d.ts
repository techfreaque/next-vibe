declare module '@rn-primitives/context-menu' {
  import type * as React from 'react';
  import type { Pressable, PressableProps, Text, TextProps, View, ViewProps } from 'react-native';

  // Export components that don't need className augmentation
  export { Root, Portal, useRootContext, useSubContext } from '@rn-primitives/context-menu/dist/index';

  // Declare components with ForwardRef types for className support
  export const Trigger: React.ForwardRefExoticComponent<TriggerProps & React.RefAttributes<TriggerRef>>;
  export const Overlay: React.ForwardRefExoticComponent<OverlayProps & React.RefAttributes<OverlayRef>>;
  export const Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<ContentRef>>;
  export const Item: React.ForwardRefExoticComponent<ItemProps & React.RefAttributes<ItemRef>>;
  export const CheckboxItem: React.ForwardRefExoticComponent<CheckboxItemProps & React.RefAttributes<CheckboxItemRef>>;
  export const RadioGroup: React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<RadioGroupRef>>;
  export const RadioItem: React.ForwardRefExoticComponent<RadioItemProps & React.RefAttributes<RadioItemRef>>;
  export const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<LabelRef>>;
  export const Separator: React.ForwardRefExoticComponent<SeparatorProps & React.RefAttributes<SeparatorRef>>;
  export const Sub: React.ForwardRefExoticComponent<SubProps & React.RefAttributes<SubRef>>;
  export const SubTrigger: React.ForwardRefExoticComponent<SubTriggerProps & React.RefAttributes<SubTriggerRef>>;
  export const SubContent: React.ForwardRefExoticComponent<SubContentProps & React.RefAttributes<SubContentRef>>;
  export const ItemIndicator: React.ForwardRefExoticComponent<ItemIndicatorProps & React.RefAttributes<ItemIndicatorRef>>;
  export const Group: React.ForwardRefExoticComponent<GroupProps & React.RefAttributes<GroupRef>>;

  // Props types with className for NativeWind support
  export type RootProps = ViewProps & {
    className?: string;
    onOpenChange?: (open: boolean) => void;
    relativeTo?: 'longPress' | 'trigger';
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

  export type ItemProps = PressableProps & {
    className?: string;
    textValue?: string;
    closeOnPress?: boolean;
    asChild?: boolean;
  };

  export type CheckboxItemProps = PressableProps & {
    className?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    closeOnPress?: boolean;
    textValue?: string;
    asChild?: boolean;
  };

  export type RadioGroupProps = ViewProps & {
    className?: string;
    value: string | undefined;
    onValueChange: (value: string) => void;
    asChild?: boolean;
  };

  export type RadioItemProps = PressableProps & {
    className?: string;
    value: string;
    textValue?: string;
    closeOnPress?: boolean;
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

  export type SubProps = ViewProps & {
    className?: string;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (value: boolean) => void;
    asChild?: boolean;
  };

  export type SubTriggerProps = PressableProps & {
    className?: string;
    textValue?: string;
    asChild?: boolean;
  };

  export type SubContentProps = PressableProps & {
    className?: string;
    forceMount?: true | undefined;
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

  export interface PortalProps {
    children: React.ReactNode;
    hostName?: string;
    container?: HTMLElement | null | undefined;
    forceMount?: true | undefined;
  }

  // Ref types
  export type RootRef = React.ElementRef<typeof View>;
  export type TriggerRef = React.ElementRef<typeof Pressable> & {
    open: () => void;
    close: () => void;
  };
  export type OverlayRef = React.ElementRef<typeof Pressable>;
  export type ContentRef = React.ElementRef<typeof View>;
  export type ItemRef = React.ElementRef<typeof Pressable>;
  export type CheckboxItemRef = React.ElementRef<typeof Pressable>;
  export type RadioGroupRef = React.ElementRef<typeof View>;
  export type RadioItemRef = React.ElementRef<typeof Pressable>;
  export type LabelRef = React.ElementRef<typeof Text>;
  export type SeparatorRef = React.ElementRef<typeof View>;
  export type SubRef = React.ElementRef<typeof View>;
  export type SubTriggerRef = React.ElementRef<typeof Pressable>;
  export type SubContentRef = React.ElementRef<typeof Pressable>;
  export type ItemIndicatorRef = React.ElementRef<typeof View>;
  export type GroupRef = React.ElementRef<typeof View>;
}
