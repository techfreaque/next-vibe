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
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, eslint-plugin-unicorn/require-module-specifiers -- Empty export to convert ambient module to ES module
export {};
