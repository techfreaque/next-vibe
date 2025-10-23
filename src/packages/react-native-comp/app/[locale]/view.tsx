import { View as RNView, type ViewProps as RNViewProps } from "react-native";

export type ViewProps = RNViewProps;

// Simple wrapper function component (no hooks, no forwardRef to avoid circular deps)
export function View2(props: ViewProps) {
  return <RNView {...props} />;
}

// Test: Re-export from react-native-css/components in app directory
export { View as View3 } from "react-native-css/components";
