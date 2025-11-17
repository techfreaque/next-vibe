import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

export type StyleType =
  | { style?: React.CSSProperties; className?: never }
  | {
      className?: string;
      style?: never;
    };

export function applyStyleType(props: {
  nativeStyle?: ViewStyle | TextStyle | ImageStyle;
  className?: string;
}): {
  style?: ViewStyle | TextStyle | ImageStyle;
  className?: string;
} {
  return props.className
    ? { className: props.className }
    : { style: props.nativeStyle };
}
