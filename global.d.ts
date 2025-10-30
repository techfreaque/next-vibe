declare global {
  namespace ReactNative {
    interface ViewProps {
      className?: string;
      cssInterop?: boolean;
    }

    interface TextProps {
      className?: string;
      cssInterop?: boolean;
    }

    interface PressableProps {
      className?: string;
      cssInterop?: boolean;
    }

    interface ImagePropsBase {
      className?: string;
      cssInterop?: boolean;
    }

    interface PressableStateCallbackType {
      pressed: boolean;
    }
  }
}

// Ensure this file is treated as a module
declare const __module: unique symbol;
export type { __module };
