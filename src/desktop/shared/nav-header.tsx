"use client";

import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronRight } from "next-vibe/ui/ui/icons/ChevronRight";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetLocale,
  useWidgetNavigation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX, ReactNode } from "react";

/**
 * Shared navigation header for desktop widgets.
 * Shows full breadcrumb trail from the navigation stack.
 * Clicking a crumb pops back to that point in the stack.
 * Pass `right` for right-aligned content (e.g. a refresh button).
 */
export function DesktopNavHeader({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}): JSX.Element {
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const stack = navigation.stack;

  // Build crumbs from all previous stack entries (not the current one — that's `title`)
  const crumbs = stack.map((entry) => {
    const scopedT = entry.endpoint.scopedTranslation.scopedT(locale);
    return scopedT.t(entry.endpoint.title as never);
  });

  return (
    <Div className="flex items-center gap-1 px-2 py-2 border-b shrink-0 min-w-0">
      {/* Breadcrumb trail */}
      {crumbs.map((crumb, i) => {
        const stepsBack = crumbs.length - i;
        return (
          <Div key={i} className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground max-w-[120px] truncate"
              onClick={(): void => {
                navigation.pop(stepsBack);
              }}
            >
              {String(crumb)}
            </Button>
            <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
          </Div>
        );
      })}

      {/* Current page title */}
      <Span className="text-sm font-semibold truncate flex-1 min-w-0 px-1">
        {title}
      </Span>

      {/* Right slot */}
      {right ? <Div className="shrink-0 ml-auto">{right}</Div> : null}
    </Div>
  );
}
