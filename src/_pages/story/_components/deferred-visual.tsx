"use client";

import type { DivRefObject } from "next-vibe/ui/components/div";
import { Div } from "next-vibe/ui/components/div";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

/** Start mounting this far before the block scrolls into view. */
const PREFETCH_MARGIN = "800px 0px";
/** Mount anyway once the browser is idle, so every demo exists eventually. */
const IDLE_TIMEOUT_MS = 2500;

interface DeferredVisualProps {
  children: ReactNode;
  /** Reserved height while unmounted - keeps layout stable (no CLS). */
  placeholderClassName: string;
}

/**
 * Defers rendering heavy demo visuals (real chat components) until they are
 * near the viewport or the browser is idle. Headings and copy around them stay
 * server-rendered for SEO; only the interactive mock is postponed, which keeps
 * hydration on phones short.
 */
export function DeferredVisual({
  children,
  placeholderClassName,
}: DeferredVisualProps): JSX.Element {
  const ref = useRef<DivRefObject>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      return undefined;
    }
    const node = ref.current;
    if (!(node instanceof Element)) {
      setMounted(true);
      return undefined;
    }
    const mount = (): void => setMounted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          mount();
        }
      },
      { rootMargin: PREFETCH_MARGIN },
    );
    observer.observe(node);

    const hasIdle = typeof requestIdleCallback === "function";
    const idleHandle = hasIdle
      ? requestIdleCallback(mount, { timeout: IDLE_TIMEOUT_MS })
      : undefined;
    const timeoutHandle = hasIdle
      ? undefined
      : setTimeout(mount, IDLE_TIMEOUT_MS);

    return (): void => {
      observer.disconnect();
      if (idleHandle !== undefined) {
        cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
    };
  }, [mounted]);

  if (mounted) {
    return <>{children}</>;
  }

  return (
    <Div
      ref={ref}
      aria-hidden={true}
      className={cn(
        "w-full rounded-2xl border border-border/60 bg-muted/30",
        placeholderClassName,
      )}
    />
  );
}
