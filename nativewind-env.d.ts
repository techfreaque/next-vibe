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
  }

  interface SlottableTextProps {
    className?: string;
    asChild?: boolean;
  }

  interface SlottablePressableProps {
    className?: string;
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
    children?: React.ReactNode;
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
    children?: React.ReactNode;
    disabled?: boolean;
  }

  interface RadioItemProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface LabelProps {
    className?: string;
  }

  interface SeparatorProps {
    className?: string;
  }
}

declare module '@rn-primitives/accordion' {
  interface RootProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ItemProps {
    className?: string;
  }

  interface HeaderProps {
    className?: string;
  }

  interface TriggerProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ContentProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module '@rn-primitives/slot' {
  interface ViewProps {
    className?: string;
  }
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

declare module '@rn-primitives/avatar' {
  interface RootProps {
    className?: string;
    alt?: string;
  }

  interface ImageProps {
    className?: string;
  }

  interface FallbackProps {
    className?: string;
  }
}

declare module '@rn-primitives/checkbox' {
  interface RootProps {
    className?: string;
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
    children?: React.ReactNode;
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
    children?: React.ReactNode;
    disabled?: boolean;
  }

  interface RadioItemProps {
    className?: string;
    children?: React.ReactNode;
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

declare module '@rn-primitives/label' {
  interface RootProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
    children?: React.ReactNode;
    nativeID?: string;
  }
}

declare module '@rn-primitives/menubar' {
  interface RootProps {
    className?: string;
  }

  interface MenuProps {
    className?: string;
  }

  interface TriggerProps {
    className?: string;
  }

  interface SubTriggerProps {
    className?: string;
    children?: React.ReactNode;
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
    children?: React.ReactNode;
    disabled?: boolean;
  }

  interface RadioItemProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface LabelProps {
    className?: string;
  }

  interface SeparatorProps {
    className?: string;
  }
}

declare module '@rn-primitives/navigation-menu' {
  interface RootProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ListProps {
    className?: string;
  }

  interface ItemProps {
    className?: string;
  }

  interface TriggerProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface ContentProps {
    className?: string;
    children?: React.ReactNode;
  }

  interface LinkProps {
    className?: string;
  }

  interface IndicatorProps {
    className?: string;
  }

  interface ViewportProps {
    className?: string;
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
  }

  interface CloseProps {
    className?: string;
  }
}

declare module '@rn-primitives/progress' {
  interface RootProps {
    className?: string;
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
    disabled?: boolean;
  }

  interface IndicatorProps {
    className?: string;
  }
}

declare module '@rn-primitives/select' {
  interface TriggerProps {
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
  }

  interface ValueProps {
    className?: string;
  }

  interface ContentProps {
    className?: string;
  }

  interface ItemProps {
    className?: string;
    disabled?: boolean;
  }

  interface ItemTextProps {
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
  }

  interface ContentProps {
    className?: string;
  }
}

declare module '@rn-primitives/toggle' {
  interface RootProps {
    className?: string;
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
  }
}

declare module '@rn-primitives/tooltip' {
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

// Augment JSX namespace for className support
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      className?: string;
    }
  }
}

// Ensure this file is treated as a module
declare const __module: unique symbol;
export type { __module };
