import type { JSX } from "react";
/**
 * Z.ai (Zhipu AI, GLM models) logo for React Native (path from Simple Icons)
 */
import { Path, Svg } from "react-native-svg";

export function SiZdotai({
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
      accessibilityLabel="Z.ai"
      className={className}
    >
      <Path d="M12.606 1.806l-1.677 2.388c-0.258 0.374-0.697 0.606-1.161 0.606h-9.162V1.794C0.594 1.806 12.606 1.806 12.606 1.806zM24 1.806L9.6 22.206 0 22.206 14.4 1.806zM11.394 22.206l1.69-2.4c0.258-0.374 0.697-0.606 1.161-0.606h9.149v3.006H11.394z" />
    </Svg>
  );
}
