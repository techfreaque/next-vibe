import type { ReactNode } from "react";

// Cross-platform props interface
export interface KeyboardAvoidingViewProps {
  children?: ReactNode;
  className?: string;
  behavior?: "height" | "position" | "padding";
  keyboardVerticalOffset?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any; // Cross-platform: CSSProperties on web, StyleProp<ViewStyle> on native
}

/**
 * Platform-agnostic KeyboardAvoidingView component for web
 * On web, keyboard handling is automatic, so this is just a passthrough div
 */
export function KeyboardAvoidingView({ children, className, style }: KeyboardAvoidingViewProps): React.JSX.Element {
  // On web, we don't need special keyboard handling
  // Just render a div with the provided props
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
