/// <reference types="nativewind/types" />

declare module "react-native" {
  // From react-native-css/types.d.ts
  interface ButtonProps {
    className?: string;
  }
  interface ScrollViewProps {
    contentContainerClassName?: string;
    indicatorClassName?: string;
  }
  interface FlatListProps<ItemT> {
    columnWrapperClassName?: string;
  }
  interface ImageBackgroundProps {
    imageClassName?: string;
  }
  interface ImagePropsBase {
    className?: string;
    cssInterop?: boolean;
  }
  interface ViewProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface TextInputProps {
    placeholderClassName?: string;
  }
  interface TextProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface SwitchProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface InputAccessoryViewProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface TouchableWithoutFeedbackProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface StatusBarProps {
    className?: string;
    cssInterop?: boolean;
  }
  interface KeyboardAvoidingViewProps {
    contentContainerClassName?: string;
  }
  interface ModalBaseProps {
    presentationClassName?: string;
  }

  // Additional props not in react-native-css
  interface PressableProps {
    className?: string;
    cssInterop?: boolean;
  }

  interface PressableStateCallbackType {
    pressed: boolean;
  }
}

declare module "react-native-reanimated" {
  interface AnimateProps<P> {
    className?: string;
  }
}

declare module "lucide-react-native" {
  interface LucideProps {
    className?: string;
  }
}
