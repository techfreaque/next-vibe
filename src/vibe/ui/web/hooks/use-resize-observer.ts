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

    // Apply the new size on the next frame, not inside the observer callback.
    // A synchronous setState here re-renders consumers that resize OTHER
    // observed elements (the chat input height becomes the messages list's
    // bottom padding, which the messages ResizeObserver watches) within the
    // same frame, and the browser reports "ResizeObserver loop completed with
    // undelivered notifications" as an uncaught error.
    const pending: { frame: number | null } = { frame: null };
    const observer = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) {
        return;
      }
      const next: ElementSize = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };
      if (pending.frame !== null) {
        cancelAnimationFrame(pending.frame);
      }
      pending.frame = requestAnimationFrame(() => {
        pending.frame = null;
        setSize((prev) =>
          prev.width === next.width && prev.height === next.height
            ? prev
            : next,
        );
      });
    });

    observer.observe(target);

    return (): void => {
      if (pending.frame !== null) {
        cancelAnimationFrame(pending.frame);
      }
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
