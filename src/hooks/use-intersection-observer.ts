"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * Options for the intersection observer
 */
export interface IntersectionOptions {
  /** The element that is used as the viewport for checking visibility of the target */
  root?: Element | null;
  /** Margin around the root */
  rootMargin?: string;
  /** Threshold(s) at which to trigger callback */
  threshold?: number | number[];
  /** Whether to unobserve the target once it intersects */
  triggerOnce?: boolean;
}

/**
 * Result of the intersection observer hook
 */
export interface IntersectionResult {
  /** Whether the target element is intersecting with the root */
  isIntersecting: boolean;
  /** The intersection observer entry */
  entry: IntersectionObserverEntry | null;
}

/**
 * Hook to observe when an element intersects with the viewport or a specified root element
 *
 * @param options - Configuration options for the intersection observer
 * @returns A tuple containing the ref to attach to the target element and the intersection result
 */
export function useIntersectionObserver<T extends Element>(
  options: IntersectionOptions = {},
): [RefObject<T | null>, IntersectionResult] {
  const { root = null, rootMargin = "0px", threshold = 0, triggerOnce = false } = options;

  const ref = useRef<T>(null);
  const [result, setResult] = useState<IntersectionResult>({
    isIntersecting: false,
    entry: null,
  });

  useEffect((): (() => void) => {
    const node = ref.current;

    if (!node) {
      return (): void => {
        // No cleanup needed when node is null
      };
    }

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]): void => {
        setResult({
          isIntersecting: entry.isIntersecting,
          entry,
        });

        // Unobserve if triggerOnce is true and element is intersecting
        if (triggerOnce && entry.isIntersecting && node) {
          observer.unobserve(node);
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(node);

    return (): void => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, triggerOnce]);

  return [ref, result];
}
