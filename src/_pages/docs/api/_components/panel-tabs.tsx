"use client";

/**
 * Tabs over server-rendered panels. Every panel stays in the HTML (inactive
 * ones are `hidden`), so crawlers and no-JS readers get all of them.
 */

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";
import { useState } from "react";

export function PanelTabs({
  labels,
  panels,
}: {
  labels: string[];
  panels: ReactNode[];
}): JSX.Element {
  const [active, setActive] = useState(0);
  return (
    <Div className="flex min-w-0 flex-col gap-4">
      <Div className="relative min-w-0 rounded-xl border border-border bg-muted/40">
        <Div
          role="tablist"
          className="flex gap-1.5 overflow-x-auto p-1.5 pr-10 [scrollbar-width:none]"
        >
          {labels.map((label, index) => (
            <Button
              key={label}
              type="button"
              size="sm"
              variant="ghost"
              role="tab"
              aria-selected={index === active}
              className={cn(
                "h-9 shrink-0 px-3.5",
                index === active
                  ? "bg-background text-foreground shadow-sm hover:bg-background"
                  : "text-muted-foreground hover:bg-background/60",
              )}
              onClick={(): void => setActive(index)}
            >
              {label}
            </Button>
          ))}
        </Div>
        <Span className="pointer-events-none absolute inset-y-0 right-0 w-10 rounded-r-xl bg-gradient-to-l from-muted to-transparent" />
      </Div>
      {panels.map((panel, index) => (
        <Div
          key={labels[index] ?? index}
          role="tabpanel"
          className={cn("min-w-0", index === active ? "block" : "hidden")}
        >
          {panel}
        </Div>
      ))}
    </Div>
  );
}
