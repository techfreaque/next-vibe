import { View as RNView, type ViewProps as RNViewProps } from 'react-native';

export type ViewProps = RNViewProps;

// Simple wrapper function component (no hooks, no forwardRef to avoid circular deps)
export function View(props: ViewProps) {
  return <RNView {...props} />;
}
