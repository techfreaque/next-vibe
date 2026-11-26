"use client";

import { Div, type DivRefObject } from "next-vibe/ui/components/div";
import type { JSX, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

function hasWidgetFeedback(content: HTMLElement): boolean {
  if (content.innerText.trim()) {
    return true;
  }
  // Preserve a custom control or explicitly accessible visual-only state.
  return [
    ...content.querySelectorAll(
      "button, a[href], input, select, textarea, [aria-label], [aria-labelledby], img[alt], canvas",
    ),
  ].some(
    (element) =>
      element.getClientRects().length > 0 &&
      !element.closest('[hidden], [aria-hidden="true"]') &&
      getComputedStyle(element).visibility === "visible",
  );
}

/** Supplies read feedback for a silent widget without replacing its mounted form. */
export function AdminSilentRead({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}): JSX.Element {
  const containerRef = useRef<DivRefObject>(null);
  const frameRef = useRef(0);
  const [silent, setSilent] = useState(false);
  const needsFeedback = Boolean(fallback);

  useEffect(() => {
    if (!needsFeedback) {
      return;
    }
    const content = containerRef.current;
    if (!(content instanceof HTMLElement)) {
      return;
    }
    const measure = (): void => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        setSilent(!hasWidgetFeedback(content));
      });
    };
    const observer = new MutationObserver(measure);
    observer.observe(content, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        "class",
        "style",
        "hidden",
        "aria-hidden",
        "aria-label",
        "aria-labelledby",
      ],
    });
    measure();
    return (): void => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [needsFeedback]);

  return (
    <>
      {needsFeedback && silent && fallback}
      <Div ref={containerRef} className="contents">
        {children}
      </Div>
    </>
  );
}
