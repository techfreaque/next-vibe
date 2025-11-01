/**
 * NativeWind type definitions for React Native components
 *
 * NativeWind v5 normally generates these types automatically when running the Metro bundler.
 * However, when running TypeScript type checking without Metro (e.g., in vibe check),
 * these types need to be provided manually.
 *
 * This file provides the same type augmentations that NativeWind would generate,
 * allowing className props on React Native components.
 */

import type { ComponentProps } from 'react';

declare module 'react-native' {
  // Augment existing React Native component props with className
  export interface ViewProps {
    className?: string;
  }

  export interface TextProps {
    className?: string;
  }

  export interface ImageProps {
    className?: string;
  }

  export interface PressableProps {
    className?: string;
  }

  export interface ScrollViewProps {
    className?: string;
  }

  export interface TextInputProps {
    className?: string;
    placeholderClassName?: string;
  }

  export interface FlatListProps<ItemT> {
    className?: string;
  }

  export interface SwitchProps {
    className?: string;
  }

  export interface ButtonProps {
    className?: string;
  }
}

declare module 'react-native-reanimated' {
  export interface AnimateProps<P> {
    className?: string;
  }
}

declare module 'lucide-react-native' {
  export interface LucideProps {
    className?: string;
  }
}

declare module '@rn-primitives/types' {
  interface SlottableViewProps {
    className?: string;
    asChild?: boolean;
    children?: React.ReactNode;
  }

  interface SlottableTextProps {
    className?: string;
    asChild?: boolean;
    children?: React.ReactNode;
  }

  interface SlottablePressableProps {
    className?: string;
    asChild?: boolean;
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
  }
}

declare module '@rn-primitives/alert-dialog' {
  interface OverlayProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface TitleProps {
    className?: string;
  }

  interface DescriptionProps {
    className?: string;
  }

  interface ActionProps {
    className?: string;
  }

  interface CancelProps {
    className?: string;
  }
}

declare module '@rn-primitives/dialog' {
  interface OverlayProps {
    className?: string;
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
  }

  interface ContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface TitleProps {
    className?: string;
  }

  interface DescriptionProps {
    className?: string;
  }

  interface CloseProps {
    className?: string;
  }

  interface TriggerProps {
    className?: string;
  }
}

declare module '@rn-primitives/context-menu' {
  interface SubTriggerProps {
    className?: string;
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
  }

  interface SubContentProps {
    className?: string;
  }

  interface ContentProps {
    className?: string;
  }

  interface ItemProps {
    className?: string;
    disabled?: boolean;
  }

  interface CheckboxItemProps {
    className?: string;
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
    disabled?: boolean;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    closeOnPress?: boolean;
    textValue?: string;
  }

  interface RadioItemProps {
    className?: string;
    children?: React.ReactNode;
    value: string;
    textValue?: string;
    closeOnPress?: boolean;
    disabled?: boolean;
  }

  interface LabelProps {
    className?: string;
  }

  interface SeparatorProps {
    className?: string;
  }
}

declare module '@rn-primitives/slot' {
  import type * as React from 'react';
  import type { ViewProps as RNViewProps, View as RNView, PressableProps as RNPressableProps, TextProps as RNTextProps, Text as RNText, ImageProps as RNImageProps, Image as RNImage } from 'react-native';

  export const Pressable: React.ForwardRefExoticComponent<RNPressableProps & { className?: string } & React.RefAttributes<RNView>>;
  export const View: React.ForwardRefExoticComponent<RNViewProps & { className?: string } & React.RefAttributes<RNView>>;
  export const Text: React.ForwardRefExoticComponent<RNTextProps & { className?: string } & React.RefAttributes<RNText>>;
  export const Image: React.ForwardRefExoticComponent<RNImageProps & { className?: string; children?: React.ReactNode } & React.RefAttributes<RNImage>>;
}

declare module '@rn-primitives/table' {
  interface RootProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface HeaderProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface BodyProps {
    className?: string;
    style?: any;
    children?: React.ReactNode;
  }

  interface FooterProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface RowProps {
    className?: string;
    children?: React.ReactNode;
    onPress?: () => void;
  }

  interface HeadProps {
    className?: string;
    children?: React.ReactNode;
    style?: any;
  }

  interface CellProps {
    className?: string;
    children?: React.ReactNode;
    style?: any;
  }
}

declare module '@shopify/flash-list' {
  interface FlashListProps<T> {
    className?: string;
  }
}

declare module 'react-native' {
  export interface ActivityIndicatorProps {
    className?: string;
  }
}

// Additional @rn-primitives modules
declare module '@rn-primitives/aspect-ratio' {
  interface RootProps {
    className?: string;
  }
}

declare module '@rn-primitives/checkbox' {
  interface RootProps {
    className?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
  }

  interface IndicatorProps {
    className?: string;
  }
}

declare module '@rn-primitives/collapsible' {
  interface RootProps {
    className?: string;
  }

  interface TriggerProps {
    className?: string;
  }

  interface ContentProps {
    className?: string;
  }
}

declare module '@rn-primitives/dropdown-menu' {
  interface SubTriggerProps {
    className?: string;
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
  }

  interface SubContentProps {
    className?: string;
  }

  interface ContentProps {
    className?: string;
  }

  interface ItemProps {
    className?: string;
    disabled?: boolean;
  }

  interface CheckboxItemProps {
    className?: string;
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
    disabled?: boolean;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    closeOnPress?: boolean;
    textValue?: string;
  }

  interface RadioItemProps {
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    value: string;
    textValue?: string;
    closeOnPress?: boolean;
  }

  interface LabelProps {
    className?: string;
  }

  interface SeparatorProps {
    className?: string;
  }

  interface TriggerProps {
    className?: string;
  }
}

declare module '@rn-primitives/hover-card' {
  import type { ViewProps } from 'react-native';
  import type { PositionedContentProps } from '@rn-primitives/types';

  interface RootProps {
    className?: string;
  }

  interface TriggerProps {
    className?: string;
  }

  interface ContentProps extends ViewProps, PositionedContentProps {
    className?: string;
    asChild?: boolean;
    children?: React.ReactNode;
  }
}

declare module '@rn-primitives/label' {
  interface RootProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module '@rn-primitives/menubar' {
  interface RootProps {
    className?: string;
    value?: string | undefined;
    onValueChange?: (value: string | undefined) => void;
    children?: React.ReactNode;
  }

  interface MenuProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface TriggerProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface SubTriggerProps {
    className?: string;
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
  }

  interface SubContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ItemProps {
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
  }

  interface CheckboxItemProps {
    className?: string;
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
    disabled?: boolean;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    closeOnPress?: boolean;
    textValue?: string;
  }

  interface RadioItemProps {
    className?: string;
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
    value: string;
    textValue?: string;
    closeOnPress?: boolean;
    disabled?: boolean;
  }

  interface LabelProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface SeparatorProps {
    className?: string;
  }
}

declare module '@rn-primitives/navigation-menu' {
  interface RootProps {
    className?: string;
    children?: React.ReactNode;
    value?: string | undefined;
    onValueChange?: (value: string | undefined) => void;
    delayDuration?: number;
    skipDelayDuration?: number;
    dir?: 'ltr' | 'rtl';
    orientation?: 'horizontal' | 'vertical';
  }

  interface ListProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ItemProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface TriggerProps {
    className?: string;
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
  }

  interface ContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface LinkProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface IndicatorProps {
    className?: string;
  }

  interface ViewportProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module '@rn-primitives/popover' {
  interface RootProps {
    className?: string;
  }

  interface TriggerProps {
    className?: string;
  }

  interface ContentProps {
    className?: string;
    children?: React.ReactNode;
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
  }

  interface CloseProps {
    className?: string;
  }
}

declare module '@rn-primitives/progress' {
  interface RootProps {
    className?: string;
    value?: number | null | undefined;
  }

  interface IndicatorProps {
    className?: string;
  }
}

declare module '@rn-primitives/radio-group' {
  interface RootProps {
    className?: string;
  }

  interface ItemProps {
    className?: string;
  }

  interface IndicatorProps {
    className?: string;
  }
}

declare module '@rn-primitives/select' {
  interface TriggerProps {
    className?: string;
  }

  interface ValueProps {
    className?: string;
  }

  interface ContentProps {
    className?: string;
  }

  interface ItemProps {
    className?: string;
  }

  interface ItemTextProps {
    className?: string;
  }

  interface ItemIndicatorProps {
    className?: string;
  }

  interface GroupProps {
    className?: string;
  }

  interface LabelProps {
    className?: string;
  }

  interface SeparatorProps {
    className?: string;
  }

  interface ScrollUpButtonProps {
    className?: string;
  }

  interface ScrollDownButtonProps {
    className?: string;
  }

  interface OverlayProps {
    className?: string;
  }

  interface ViewportProps {
    className?: string;
  }

  interface PortalProps {
    className?: string;
  }
}

declare module '@rn-primitives/separator' {
  interface RootProps {
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  }
}

declare module '@rn-primitives/slider' {
  interface RootProps {
    className?: string;
  }

  interface TrackProps {
    className?: string;
  }

  interface RangeProps {
    className?: string;
  }

  interface ThumbProps {
    className?: string;
  }
}

declare module '@rn-primitives/switch' {
  interface RootProps {
    className?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    onKeyDown?: (ev: KeyboardEvent<Element>) => void;
  }

  interface ThumbProps {
    className?: string;
  }
}

declare module '@rn-primitives/tabs' {
  interface RootProps {
    className?: string;
  }

  interface ListProps {
    className?: string;
  }

  interface TriggerProps {
    className?: string;
    disabled?: boolean;
    value: string;
  }

  interface ContentProps {
    className?: string;
    value: string;
  }
}

declare module '@rn-primitives/toggle' {
  interface RootProps {
    className?: string;
    pressed: boolean;
    onPressedChange: (pressed: boolean) => void;
    disabled?: boolean;
  }
}

declare module '@rn-primitives/toggle-group' {
  interface RootProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ItemProps {
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    value: string;
  }
}

declare module '@rn-primitives/tooltip' {
  import type { ViewStyle } from 'react-native';

  interface RootProps {
    className?: string;
    onOpenChange?: (open: boolean) => void;
    delayDuration?: number;
    skipDelayDuration?: number;
    disableHoverableContent?: boolean;
  }

  interface TriggerProps {
    className?: string;
    children?: React.ReactNode;
    asChild?: boolean;
  }

  interface ContentProps {
    className?: string;
    children?: React.ReactNode;
    sideOffset?: number;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    alignOffset?: number;
    avoidCollisions?: boolean;
    forceMount?: true | undefined;
    style?: ViewStyle;
    disablePositioningStyle?: boolean;
    loop?: boolean;
    onCloseAutoFocus?: (event: Event) => void;
    onEscapeKeyDown?: (event: Event) => void;
    onPointerDownOutside?: (event: Event) => void;
    onFocusOutside?: (event: Event) => void;
    onInteractOutside?: (event: Event) => void;
    asChild?: boolean;
  }

  interface PortalProps {
    children: React.ReactNode;
    hostName?: string;
    container?: HTMLElement | null | undefined;
  }

  interface OverlayProps {
    className?: string;
    children?: React.ReactNode;
    forceMount?: true | undefined;
    closeOnPress?: boolean;
    style?: ViewStyle;
    asChild?: boolean;
  }
}

declare module '@rn-primitives/accordion' {
  interface RootProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ItemProps {
    className?: string;
    value: string;
    children?: React.ReactNode;
  }

  interface TriggerProps {
    className?: string;
    children?: React.ReactNode;
    asChild?: boolean;
  }

  interface HeaderProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ContentProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module '@rn-primitives/avatar' {
  interface RootProps {
    className?: string;
    alt: string;
    children?: React.ReactNode;
  }

  interface ImageProps {
    className?: string;
    src?: string;
    alt?: string;
  }

  interface FallbackProps {
    className?: string;
    children?: React.ReactNode;
  }
}

// Augment JSX namespace for className support
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      className?: string;
    }
  }
}

// Ensure this file is treated as a module
export {};
