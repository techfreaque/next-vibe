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
  ref: RefObject<Element | { getBoundingClientRect: () => DOMRect } | null>,
  defaultSize: ElementSize = { width: 0, height: 0 },
): ElementSize {
  const [size, setSize] = useState<ElementSize>(defaultSize);

  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }

    if (!(target instanceof Element)) {
      const rect = target.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
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

    observer.observe(target);

    return (): void => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
