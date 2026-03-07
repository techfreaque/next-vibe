/**
 * Public Feed Widget
 * Renders the public community feed with enriched thread data
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowBigDown } from "next-vibe-ui/ui/icons/ArrowBigDown";
import { ArrowBigUp } from "next-vibe-ui/ui/icons/ArrowBigUp";
import { Award } from "next-vibe-ui/ui/icons/Award";
import { Flame } from "next-vibe-ui/ui/icons/Flame";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import React, { useState } from "react";

import { useWidgetContext } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { DefaultFolderId } from "../../config";
import { useChatNavigationStore } from "../../hooks/use-chat-navigation-store";
import type definition from "../definition";
import type {
  PublicFeedGetResponseOutput,
  PublicFeedItem,
} from "../definition";
import { FeedSortMode } from "../definition";
import { scopedTranslation } from "../i18n";

type SortMode = (typeof FeedSortMode)[keyof typeof FeedSortMode];

/**
 * Props for custom widget — matches the customWidgetObject pattern
 */
interface CustomWidgetProps {
  field: {
    value: PublicFeedGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

function formatTimestamp(date: Date, locale: string): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) {
    return "just now";
  }
  if (hours < 24) {
    return `${hours.toString()}h ago`;
  }
  if (days < 30) {
    return `${days.toString()}d ago`;
  }
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

function FeedThreadRow({ item }: { item: PublicFeedItem }): React.JSX.Element {
  const { locale } = useWidgetContext();
  const { t } = scopedTranslation.scopedT(locale);
  const setNavigation = useChatNavigationStore((s) => s.setNavigation);

  const handleClick = (): void => {
    setNavigation({
      activeThreadId: item.id,
      currentRootFolderId: DefaultFolderId.PUBLIC,
      currentSubFolderId: item.folderId ?? null,
    });
    const url = item.folderId
      ? `/${locale}/threads/${DefaultFolderId.PUBLIC}/${item.folderId}/${item.id}`
      : `/${locale}/threads/${DefaultFolderId.PUBLIC}/${item.id}`;
    window.history.pushState(null, "", url);
  };

  const hoursSinceCreation =
    (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60);
  const isRising = hoursSinceCreation < 24 && item.score > 0;

  return (
    <Div
      onClick={handleClick}
      className={cn(
        "border rounded-lg hover:bg-accent/50 hover:border-primary/20 transition-all duration-200 cursor-pointer",
        "flex gap-3 p-3 hover:shadow-md",
      )}
    >
      {/* Vote Section */}
      <Div className="flex flex-col items-center gap-1 min-w-12">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:text-orange-500"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowBigUp className="h-5 w-5" />
        </Button>
        <Span
          className={cn(
            "font-bold text-sm",
            item.score > 0 && "text-orange-500",
            item.score < 0 && "text-blue-500",
          )}
        >
          {item.score}
        </Span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:text-blue-500"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowBigDown className="h-5 w-5" />
        </Button>
      </Div>

      {/* Content Section */}
      <Div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Title */}
        <Div className="font-semibold text-base line-clamp-2 hover:underline">
          {item.title}
        </Div>

        {/* Metadata Row */}
        <Div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {item.folderName && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              {item.folderName}
            </Badge>
          )}
          <Span>{formatTimestamp(new Date(item.createdAt), locale)}</Span>
          {item.authorName && (
            <Span className="hover:underline">u/{item.authorName}</Span>
          )}
          {item.modelNames.length > 0 && (
            <Span className="text-blue-500 font-medium">
              {item.modelNames.join(", ")}
            </Span>
          )}
          {item.authorCount > 1 && <Span>{item.authorCount} participants</Span>}
        </Div>

        {/* Stats Row */}
        <Div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
          <Div className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <Span>{item.messageCount} messages</Span>
          </Div>
          {isRising && (
            <Badge
              variant="secondary"
              className="text-xs px-1.5 py-0 bg-green-500/10 text-green-600 dark:text-green-400"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              <Span>{t("sortMode.rising")}</Span>
            </Badge>
          )}
          {item.score > 50 && (
            <Badge
              variant="secondary"
              className="text-xs px-1.5 py-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1"
            >
              <Award className="h-3 w-3" />
              <Span>{t("sortMode.hot")}</Span>
            </Badge>
          )}
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Main public feed view — sort tabs + search + thread list
 */
function PublicFeedView({
  items,
}: {
  items: PublicFeedItem[];
}): React.JSX.Element {
  const { locale } = useWidgetContext();
  const { t } = scopedTranslation.scopedT(locale);
  const [sortMode, setSortMode] = useState<SortMode>(FeedSortMode.HOT);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = items.filter((item) =>
    searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  );

  const sorted = [...filtered].toSorted((a, b) => {
    if (sortMode === FeedSortMode.HOT) {
      const hoursA =
        (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60) + 2;
      const hoursB =
        (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60) + 2;
      return b.score / Math.pow(hoursB, 1.5) - a.score / Math.pow(hoursA, 1.5);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Div className="h-full flex flex-col overflow-hidden">
      <Div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-400/30 hover:scrollbar-thumb-blue-500/50 scrollbar-thumb-rounded-full">
        <Div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pt-20 pb-8">
          {/* Header */}
          <Div className="mb-6 flex flex-col gap-2">
            <Span className="text-3xl font-bold">{t("get.title")}</Span>
            <Span className="text-muted-foreground block">
              {t("get.description")}
            </Span>
          </Div>

          {/* Sort + Search */}
          <Div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b mb-4 pb-4">
            <Div className="flex gap-1 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortMode(FeedSortMode.HOT)}
                className={cn(
                  "bg-card backdrop-blur-sm shadow-sm hover:bg-accent gap-2",
                  sortMode === FeedSortMode.HOT &&
                    "bg-primary/10 text-primary hover:bg-primary/20",
                )}
              >
                <Flame className="h-4 w-4" />
                {t("sortMode.hot")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortMode(FeedSortMode.RISING)}
                className={cn(
                  "bg-card backdrop-blur-sm shadow-sm hover:bg-accent gap-2",
                  sortMode === FeedSortMode.RISING &&
                    "bg-primary/10 text-primary hover:bg-primary/20",
                )}
              >
                <TrendingUp className="h-4 w-4" />
                {t("sortMode.rising")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortMode(FeedSortMode.NEW)}
                className={cn(
                  "bg-card backdrop-blur-sm shadow-sm hover:bg-accent gap-2",
                  sortMode === FeedSortMode.NEW &&
                    "bg-primary/10 text-primary hover:bg-primary/20",
                )}
              >
                <Plus className="h-4 w-4" />
                {t("sortMode.new")}
              </Button>
            </Div>

            <Div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("get.search.description")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </Div>
          </Div>

          {/* Thread List */}
          <Div className="flex flex-col gap-2">
            {sorted.length === 0 ? (
              <Div className="text-center py-12 text-muted-foreground">
                <Span className="text-lg">
                  {t("get.errors.notFound.title")}
                </Span>
              </Div>
            ) : (
              sorted.map((item) => <FeedThreadRow key={item.id} item={item} />)
            )}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

/**
 * Container widget — receives field data from EndpointsPage
 */
export function PublicFeedContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const items = field.value?.items ?? [];
  return <PublicFeedView items={items} />;
}
