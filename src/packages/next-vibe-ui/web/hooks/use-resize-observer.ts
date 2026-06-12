"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

/**
 * Observes size changes of a DOM element via ResizeObserver.
 * Returns the element's content rect dimensions.
 */
export function useResizeObserver(
  ref: RefObject<Element | null>,
  defaultSize: ElementSize = { width: 0, height: 0 },
): ElementSize {
  const [size, setSize] = useState<ElementSize>(defaultSize);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(ref.current);

    return (): void => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
