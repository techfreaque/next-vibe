import React from "react";
import { Image as RNImage } from "react-native";

// Cross-platform image props - essential subset that works on both platforms
export interface ImageProps {
  src: string | { uri: string };
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

// Re-export React Native Image for native
export const Image = RNImage;
