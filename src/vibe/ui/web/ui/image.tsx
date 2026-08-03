import NextImage from "next/image";
import type { JSX } from "react";

import type { StyleType } from "../utils/style-type";

export type ImageProps = {
  src: string;
  fetchPriority?: "high" | "low" | "auto";
  priority?: boolean;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  unoptimized?: boolean;
  onLoad?: () => void;
  onError?: () => void;
} & StyleType;

/**
 * Image component for web using Next.js Image
 * Wraps Next.js Image to maintain consistent export pattern
 */
export function Image({
  src,
  alt,
  width,
  height,
  fill,
  unoptimized,
  className,
  style,
  onLoad,
  onError,
}: ImageProps): JSX.Element {
  return (
    <NextImage
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      unoptimized={unoptimized}
      className={className}
      style={style}
      onLoad={onLoad}
      onError={onError}
      src={src}
    />
  );
}
