import type { JSX } from "react";
import { createElement } from "react";

import type { StyleType } from "../../web/utils/style-type";

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
 * TanStack Start implementation of Image - plain <img> tag.
 * Next.js image optimization is not available in TanStack Start.
 */
export function Image({
  src,
  alt,
  width,
  height,
  className,
  style,
  onLoad,
  onError,
}: ImageProps): JSX.Element {
  return createElement("img", {
    src,
    alt,
    width,
    height,
    className,
    style,
    onLoad,
    onError,
  });
}

export default Image;
