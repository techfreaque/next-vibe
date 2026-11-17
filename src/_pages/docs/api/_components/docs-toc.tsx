"use client";

/**
 * Table of contents for the API docs.
 * - DocsToc: sticky desktop sidebar that highlights the section in view.
 * - DocsMobileToc: sticky bar on phones that expands into the same list.
 * Both render every link on the server; JS only adds the highlight and the
 * open/close toggle.
 */

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { List } from "next-vibe/ui/components/icons/List";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Nav } from "next-vibe/ui/components/nav";
import { Span } from "next-vibe/ui/components/span";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import {
  addWindowListener,
  getDocumentScrollHeight,
  getElementById,
  getScrollY,
} from "next-vibe/ui/lib/dom";
import { getScreenHeight } from "next-vibe/ui/lib/screen";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";
import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
}

export interface TocGroup {
  label: string;
  items: TocItem[];
}

/** A section is active once its top passes this share of the viewport. */
const ACTIVE_LINE_RATIO = 0.35;

function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const logger = useLogger();
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|");
    const update = (): void => {
      const line = getScreenHeight(logger) * ACTIVE_LINE_RATIO;
      let current: string | null = sectionIds[0] ?? null;
      for (const id of sectionIds) {
        const el = getElementById(id);
        if (el !== null && el.getBoundingClientRect().top <= line) {
          current = id;
        }
      }
      // Bottom of the page: the last section may never reach the line.
      const atBottom =
        getScreenHeight(logger) + getScrollY() >= getDocumentScrollHeight() - 4;
      if (atBottom) {
        current = sectionIds[sectionIds.length - 1] ?? current;
      }
      setActive(current);
    };
    update();
    const offScroll = addWindowListener("scroll", update, { passive: true });
    const offResize = addWindowListener("resize", update);
    return (): void => {
      offScroll();
      offResize();
    };
  }, [key, logger]);

  return active;
}

function TocList({
  groups,
  active,
  onNavigate,
}: {
  groups: TocGroup[];
  active: string | null;
  onNavigate?: () => void;
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      {groups.map((group) => (
        <Div key={group.label} className="flex flex-col">
          <Span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
            {group.label}
          </Span>
          <Div className="flex flex-col border-l border-border">
            {group.items.map((item) => {
              const isActive = item.id === active;
              return (
                <ExternalLink
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={onNavigate}
                  className={cn(
                    "-ml-px block border-l-2 py-[5px] pl-3.5 text-[13px] leading-5",
                    isActive
                      ? "border-primary font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
                  )}
                >
                  {item.label}
                </ExternalLink>
              );
            })}
          </Div>
        </Div>
      ))}
    </Div>
  );
}

export function DocsToc({
  groups,
  title,
}: {
  groups: TocGroup[];
  title: string;
}): JSX.Element {
  const ids = groups.flatMap((group) => group.items.map((item) => item.id));
  const active = useActiveSection(ids);
  return (
    <Nav className="flex flex-col gap-4">
      <Span className="text-sm font-semibold text-foreground">{title}</Span>
      <TocList groups={groups} active={active} />
    </Nav>
  );
}

export function DocsMobileToc({
  groups,
  title,
}: {
  groups: TocGroup[];
  title: string;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const ids = groups.flatMap((group) => group.items.map((item) => item.id));
  const active = useActiveSection(ids);
  const activeLabel =
    groups.flatMap((group) => group.items).find((item) => item.id === active)
      ?.label ?? title;

  return (
    <>
      {open && (
        <Div
          ariaLabel={title}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={(): void => setOpen(false)}
        />
      )}
      <Div
        className={cn(
          "sticky top-16 z-40 -mx-4 border-b border-border bg-background px-4 sm:-mx-6 sm:px-6 lg:hidden",
          open ? "shadow-lg" : "shadow-sm",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          aria-expanded={open}
          data-testid="docs-toc-toggle"
          className="h-12 w-full justify-between gap-2 px-0 hover:bg-transparent"
          onClick={(): void => setOpen((value) => !value)}
        >
          <Span className="flex min-w-0 items-center gap-2">
            <List className="h-4 w-4 shrink-0 text-primary" />
            <Span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </Span>
            <Span className="truncate text-sm font-medium text-foreground">
              {activeLabel}
            </Span>
          </Span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </Button>
        <Div
          className={cn(
            "max-h-[65vh] overflow-y-auto border-t border-border pt-3 pb-6 [mask-image:linear-gradient(to_bottom,black_90%,transparent)]",
            open ? "block" : "hidden",
          )}
        >
          <Nav>
            <TocList
              groups={groups}
              active={active}
              onNavigate={(): void => setOpen(false)}
            />
          </Nav>
        </Div>
      </Div>
    </>
  );
}
