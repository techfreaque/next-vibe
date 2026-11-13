import type { JSX } from "react";
/**
 * Alibaba Cloud logo for React Native (path from Simple Icons)
 */
import { Path, Svg } from "react-native-svg";

export function SiAlibabacloud({
  width = 24,
  height = 24,
  className,
}: {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}): JSX.Element {
  // className is accepted for compatibility but not used in React Native
  void className;
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="currentColor"
      accessibilityLabel="Alibaba Cloud"
      className={className}
    >
      <Path d="M3.996 4.517h5.291L8.01 6.324 4.153 7.506a1.668 1.668 0 0 0-1.165 1.601v5.786a1.668 1.668 0 0 0 1.165 1.6l3.857 1.183 1.277 1.807H3.996A3.996 3.996 0 0 1 0 15.487V8.513a3.996 3.996 0 0 1 3.996-3.996m16.008 0h-5.291l1.277 1.807 3.857 1.182c.715.227 1.17.889 1.165 1.601v5.786a1.668 1.668 0 0 1-1.165 1.6l-3.857 1.183-1.277 1.807h5.291A3.996 3.996 0 0 0 24 15.487V8.513a3.996 3.996 0 0 0-3.996-3.996m-4.007 8.345H8.002v-1.804h7.995Z" />
    </Svg>
  );
}
