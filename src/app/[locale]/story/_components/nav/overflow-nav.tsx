"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { MoreHorizontal } from "next-vibe-ui/ui/icons/MoreHorizontal";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import {
  type JSX,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";
import type { NavChildItem, NavItemType } from "./nav-constants";

interface OverflowNavProps {
  navigationItems: NavItemType[];
  locale: CountryLanguage;
  totalModelCount: number;
}

// Renders a single top-level nav item as a dropdown-menu item (for overflow)
function OverflowNavItem({
  item,
  locale,
  t,
}: {
  item: NavItemType;
  locale: CountryLanguage;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
}): JSX.Element {
  if (item.children) {
    return (
      <>
        {item.children.map((child: NavChildItem) => (
          <OverflowChildItem
            key={child.title}
            child={child}
            locale={locale}
            t={t}
          />
        ))}
      </>
    );
  }

  return (
    <Link href={`/${locale}${item.href}`} className="w-full">
      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
        {item.icon}
        <Span>{t(item.title)}</Span>
      </DropdownMenuItem>
    </Link>
  );
}

function OverflowChildItem({
  child,
  locale,
  t,
}: {
  child: NavChildItem;
  locale: CountryLanguage;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
}): JSX.Element {
  if (child.disabled && child.disabledReason) {
    return (
      <DropdownMenuItem
        key={child.title}
        className="flex items-center gap-2 opacity-50 cursor-not-allowed"
        disabled
      >
        {child.icon}
        <Span>{t(child.title)}</Span>
      </DropdownMenuItem>
    );
  }

  return (
    <Link href={`/${locale}${child.href}`} className="w-full">
      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
        {child.icon}
        <Span>{t(child.title)}</Span>
      </DropdownMenuItem>
    </Link>
  );
}

// Renders a top-level nav item inline (visible items)
function InlineNavItem({
  item,
  locale,
  t,
  totalModelCount,
}: {
  item: NavItemType;
  locale: CountryLanguage;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
  totalModelCount: number;
}): JSX.Element {
  if (item.children) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="px-2 py-3 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5"
          >
            {item.icon}
            {t(item.title)}
            <ChevronDown className="h-4 w-4 ml-0.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 bg-white dark:bg-gray-900 shadow-md border rounded-md"
        >
          {item.children.map((child) => {
            if (child.disabled && child.disabledReason) {
              return (
                <DropdownMenuItem
                  key={child.title}
                  className="flex items-center gap-2 opacity-50 cursor-not-allowed"
                  disabled
                >
                  {child.icon}
                  <P className="text-sm">{t(child.title)}</P>
                </DropdownMenuItem>
              );
            }
            return (
              <Link
                key={child.title}
                href={`/${locale}${child.href}`}
                className="w-full font-medium"
              >
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  {child.icon}
                  <Div>
                    <P className="text-sm">{t(child.title)}</P>
                    <P className="text-xs text-gray-500 dark:text-gray-400">
                      {t(child.description, { modelCount: totalModelCount })}
                    </P>
                  </Div>
                </DropdownMenuItem>
              </Link>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href={`/${locale}${item.href}`}>
      <Button
        variant="ghost"
        className="px-2 py-3 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5"
      >
        {item.icon}
        {t(item.title)}
      </Button>
    </Link>
  );
}

const MORE_BTN_WIDTH = 44; // width of the "..." button incl gap

export function OverflowNav({
  navigationItems,
  locale,
  totalModelCount,
}: OverflowNavProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleCount, setVisibleCount] = useState(navigationItems.length);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const containerWidth = container.offsetWidth;
    let usedWidth = 0;
    let count = 0;

    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) {
        continue;
      }
      // scrollWidth gives natural width even when the el is hidden via overflow
      const itemWidth = el.scrollWidth + 4; // 4px gap

      const wouldOverflow = usedWidth + itemWidth > containerWidth;
      const hasMoreAfter = i < navigationItems.length - 1;

      if (wouldOverflow) {
        break;
      }

      // If this is the last item that fits but there are more after,
      // reserve space for the "..." button
      const afterThis = navigationItems.length - i - 1;
      const needsMoreBtn = afterThis > 0;
      const availableWithMore = containerWidth - MORE_BTN_WIDTH;

      if (needsMoreBtn && usedWidth + itemWidth > availableWithMore) {
        // This item fits full-width but not when we account for "..." button
        break;
      }

      usedWidth += itemWidth;
      count++;

      if (!hasMoreAfter) {
        break;
      }
    }

    setVisibleCount(count);
  }, [navigationItems.length]);

  useLayoutEffect(() => {
    recalculate();
  }, [recalculate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const observer = new ResizeObserver(recalculate);
    observer.observe(container);
    return (): void => observer.disconnect();
  }, [recalculate]);

  const overflowItems = navigationItems.slice(visibleCount);

  return (
    <Div
      ref={containerRef}
      className="flex items-center gap-1 overflow-hidden w-full"
    >
      {navigationItems.map((item, i) => (
        <Div
          key={item.title}
          ref={(el: HTMLDivElement | null) => {
            itemRefs.current[i] = el;
          }}
          className={cn("shrink-0", i >= visibleCount && "invisible absolute")}
        >
          <InlineNavItem
            item={item}
            locale={locale}
            t={t}
            totalModelCount={totalModelCount}
          />
        </Div>
      ))}

      {overflowItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-9 w-9"
              aria-label="More navigation items"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            {overflowItems.map((item) => (
              <OverflowNavItem
                key={item.title}
                item={item}
                locale={locale}
                t={t}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Div>
  );
}
