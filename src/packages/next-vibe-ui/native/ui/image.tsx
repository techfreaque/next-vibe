import * as React from "react";
import { Image as RNImage } from "react-native";

import type { ImageProps } from "@/packages/next-vibe-ui/web/ui/image";
import { convertCSSToImageStyle } from "../utils/style-converter";

export type { ImageProps } from "@/packages/next-vibe-ui/web/ui/image";

/**
 * Image component for React Native
 * Wraps React Native Image to maintain consistent export pattern
 *
 * @param props - ImageProps from web version
 * @returns React Native Image component
 */
export function Image({
  src,
  alt,
  width,
  height,
  fill: _fill,
  fetchPriority: _fetchPriority,
  priority: _priority,
  className: _className,
  style,
  onLoad,
  onError,
}: ImageProps): React.JSX.Element {
  const uri = typeof src === "string" ? src : "";

  // Convert web style (CSSProperties) to React Native ImageStyle
  // Note: Only compatible properties will work, incompatible ones are ignored
  const nativeStyle = style ? convertCSSToImageStyle(style) : undefined;

  return (
    <RNImage
      source={{ uri }}
      style={[
        width !== undefined && { width },
        height !== undefined && { height },
        nativeStyle,
      ]}
      accessibilityLabel={alt}
      accessible={!!alt}
      onLoad={onLoad}
      onError={onError}
    />
  );
}

Image.displayName = "Image";

