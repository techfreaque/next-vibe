import React from "react";
import Svg, { Rect } from "react-native-svg";

export const SiAndroid = ({ className }: { className?: string }): JSX.Element => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <Rect width="24" height="24" fill="#3DDC84" />
  </Svg>
);
