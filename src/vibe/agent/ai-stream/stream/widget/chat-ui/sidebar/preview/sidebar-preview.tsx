"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Palette } from "next-vibe/ui/components/icons/Palette";
import { Search } from "next-vibe/ui/components/icons/Search";
import { User } from "next-vibe/ui/components/icons/User";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { useWindowSize } from "next-vibe/ui/hooks/use-window-size";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import { scopedTranslation as studio } from "@/_pages/create/i18n";

import { useChatNavigationStore } from "../../../../../../chat/hooks/use-chat-navigation-store";
import { useSidebarCollapsed } from "../use-sidebar-collapsed";
import {
  AccountLinks,
  AccountSummary,
  type SidebarAccountProps,
} from "./account";
import { type SidebarPanel, SidebarPreviewContext } from "./context";
import { scopedTranslation } from "./i18n";
import type { SidebarVariant } from "./selection";

export function SidebarPreview({
  variant,
  children,
  ...account
}: SidebarAccountProps & {
  variant: SidebarVariant;
  children: ReactNode;
}): JSX.Element {
  const { locale } = account;
  const { t } = scopedTranslation.scopedT(locale);
  const studioName = studio.scopedT(locale).t("navName");
  const [panel, setPanel] = useState<SidebarPanel>("chats");
  const [folded, setFolded] = useState(false);
  const clearSearch = useChatNavigationStore((s) => s.setSidebarSearchQuery);
  const { width } = useWindowSize();
  const [, setCollapsed] = useSidebarCollapsed();
  const onOpenChat = useCallback((): void => {
    if (width < 930) {
      setCollapsed(true);
    }
  }, [width, setCollapsed]);
  const context = useMemo(
    () => ({ variant, panel, onOpenChat }),
    [variant, panel, onOpenChat],
  );
  const open = panel === "account";
  const toggleAccount = (): void => {
    setPanel(open ? "chats" : "account");
  };
  const selectRailPanel = (next: SidebarPanel): void => {
    setFolded(!folded && panel === next);
    if (next === "chats") {
      clearSearch("");
    }
    setPanel(next);
  };
  const summary = (
    <AccountSummary
      {...account}
      variant={variant}
      open={open}
      onToggle={toggleAccount}
    />
  );
  const railItem =
    "flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[11px] font-medium leading-tight hover:bg-accent";
  const studioLink = (
    <Link
      href={`/${locale}/create`}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold hover:bg-accent",
        variant === "C" && "border border-border bg-card",
      )}
    >
      <Span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Palette className="size-4" />
      </Span>
      <Span className="min-w-0 flex-1">
        {studioName}
        {variant === "A" && (
          <Span className="block text-xs font-normal text-muted-foreground">
            {t("studioHint")}
          </Span>
        )}
      </Span>
      <ArrowRight className="size-3.5 text-muted-foreground" />
    </Link>
  );
  return (
    <SidebarPreviewContext.Provider value={context}>
      <Div
        data-testid={`sidebar-${variant}`}
        data-rail-folded={folded || undefined}
        className="flex h-full min-h-0 flex-col overflow-hidden bg-background pt-16"
      >
        <Div
          className={cn(
            "flex min-h-0 flex-1 border-t border-border",
            variant === "B" ? "flex-row" : "flex-col",
          )}
        >
          {variant === "B" && (
            <Div className="flex w-16 shrink-0 flex-col gap-1 border-r border-border bg-muted/45 p-1.5">
              <Button
                variant="ghost"
                size="unset"
                className={cn(
                  railItem,
                  !folded &&
                    panel === "chats" &&
                    "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
                )}
                aria-expanded={!folded && panel === "chats"}
                onClick={() => selectRailPanel("chats")}
              >
                <MessageSquare />
                {t("chats")}
              </Button>
              <Link href={`/${locale}/create`} className={railItem}>
                <Palette className="size-4" />
                {studioName}
              </Link>
              <Button
                variant="ghost"
                size="unset"
                className={cn(
                  railItem,
                  !folded &&
                    panel === "search" &&
                    "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
                )}
                aria-expanded={!folded && panel === "search"}
                onClick={() => selectRailPanel("search")}
              >
                <Search />
                {t("search")}
              </Button>
              <Button
                variant="ghost"
                size="unset"
                className={cn(
                  railItem,
                  "mt-auto",
                  !folded &&
                    open &&
                    "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
                )}
                aria-expanded={!folded && open}
                onClick={() => selectRailPanel("account")}
              >
                <User />
                {t("account")}
              </Button>
            </Div>
          )}
          {!folded && (
            <Div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {variant === "C" && (
                <Div className="shrink-0 px-3 pt-3">{summary}</Div>
              )}
              {open && variant !== "A" ? (
                <Div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                  {variant === "B" && (
                    <Span className="mb-2 block text-base font-semibold">
                      {t("account")}
                    </Span>
                  )}
                  <AccountLinks {...account} />
                </Div>
              ) : (
                <Div className="flex min-h-0 flex-1 flex-col">{children}</Div>
              )}
              {variant !== "B" && (
                <Div className="shrink-0 border-t border-border/70 px-3 py-2">
                  {studioLink}
                </Div>
              )}
              {variant === "A" && (
                <Div className="flex min-h-0 max-h-[52%] shrink-0 flex-col border-t border-border bg-muted/25 p-2.5">
                  {open && (
                    <Div className="min-h-0 overflow-y-auto pb-2">
                      <AccountLinks {...account} />
                    </Div>
                  )}
                  <Div className="shrink-0">{summary}</Div>
                </Div>
              )}
              {variant === "B" && (
                <Div className="shrink-0 border-t border-border p-2">
                  {summary}
                </Div>
              )}
            </Div>
          )}
        </Div>
      </Div>
    </SidebarPreviewContext.Provider>
  );
}
