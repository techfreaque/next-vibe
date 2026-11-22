"use client";

import { Div } from "next-vibe/ui/components/div";
import { getElementById } from "next-vibe/ui/lib/dom";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { type JSX, type ReactNode, useEffect, useState } from "react";

export function MobileStartBar({
  targetId,
  children,
}: {
  targetId: string;
  children: ReactNode;
}): JSX.Element {
  const [offscreen, setOffscreen] = useState(false);
  useEffect(() => {
    const target = getElementById(targetId);
    if (target === null) {
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      setOffscreen(entries.every((entry) => !entry.isIntersecting));
    });
    observer.observe(target);
    return (): void => observer.disconnect();
  }, [targetId]);

  return (
    <Div
      data-testid="skill-mobile-bar"
      aria-hidden={!offscreen}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur transition-transform lg:hidden",
        offscreen ? "translate-y-0" : "translate-y-full",
      )}
    >
      {children}
    </Div>
  );
}
