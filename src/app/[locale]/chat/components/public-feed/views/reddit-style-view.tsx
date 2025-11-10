"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import {
  ArrowBigDown,
  ArrowBigUp,
  Award,
  Flame,
  Heart,
  MessageSquare,
  Plus,
  Search,
  TrendingUp,
} from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks/hooks";
import { getModelById } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface RedditStyleViewProps {
  chat: UseChatReturn;
  locale: CountryLanguage;
}

type SortMode = "hot" | "rising" | "new" | "following";

interface ThreadItem {
  id: string;
  title: string;
  category: string;
  timestamp: Date;
  authorId: string | null;
  authorName: string;
  modelNames: string[];
  messageCount: number;
  upvotes: number;
  downvotes: number;
  score: number;
  hasBestAnswer: boolean;
  isRising: boolean;
  userVote?: 1 | -1 | 0;
}

export function RedditStyleView({
  chat,
  locale,
}: RedditStyleViewProps): JSX.Element {
  const { t } = simpleT(locale);
  const [sortMode, setSortMode] = useState<SortMode>("hot");
  const [searchQuery, setSearchQuery] = useState("");

  // Convert threads to Reddit-style items
  const threadItems = useMemo(() => {
    const threads = Object.values(chat.threads).filter(
      (thread) => thread.rootFolderId === "public",
    );

    const items: ThreadItem[] = threads.map((thread) => {
      const messages = Object.values(chat.messages).filter(
        (msg) => msg.threadId === thread.id,
      );

      // Calculate votes
      const upvotes = messages.reduce(
        (sum, msg) => sum + (msg.upvotes ?? 0),
        0,
      );
      const downvotes = messages.reduce(
        (sum, msg) => sum + (msg.downvotes ?? 0),
        0,
      );
      const score = upvotes - downvotes;

      // Get unique model names (display names, not IDs)
      const modelNames = [
        ...new Set(
          messages
            .filter((msg) => msg.model)
            .map((msg) => {
              try {
                return getModelById(msg.model!).name;
              } catch {
                return msg.model as string;
              }
            }),
        ),
      ];

      // Check if thread has a "best answer" (high upvoted AI response)
      const hasBestAnswer = messages.some(
        (msg) => msg.role === "assistant" && (msg.upvotes ?? 0) > 50,
      );

      // Determine if rising (recent + growing engagement)
      const hoursSinceCreation =
        (Date.now() - thread.createdAt.getTime()) / (1000 * 60 * 60);
      const isRising = hoursSinceCreation < 24 && score > 10;

      // Get category from folder name if available
      let category = "General";
      if (thread.folderId) {
        const folder = chat.folders[thread.folderId];
        if (folder) {
          category = folder.name;
        }
      }

      // Get author name from first message
      const firstMessage = messages
        .filter((msg) => msg.role === "user")
        .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
      const authorName = firstMessage?.authorName
        ? `u/${firstMessage.authorName}`
        : "u/anonymous";

      return {
        id: thread.id,
        title: thread.title ?? "Untitled Thread",
        category,
        timestamp: thread.createdAt,
        authorId: thread.userId,
        authorName,
        modelNames,
        messageCount: messages.length,
        upvotes,
        downvotes,
        score,
        hasBestAnswer,
        isRising,
        userVote: 0, // TODO: Track user votes
      };
    });

    return items;
  }, [chat.threads, chat.messages, chat.folders]);

  // Filter and sort threads
  const displayedThreads = useMemo(() => {
    let filtered = [...threadItems];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(query));
    }

    // Sort based on mode
    switch (sortMode) {
      case "hot":
        // Hot algorithm: score / (time + 2)^1.5
        filtered = filtered.toSorted((a, b) => {
          const hoursA =
            (Date.now() - a.timestamp.getTime()) / (1000 * 60 * 60) + 2;
          const hoursB =
            (Date.now() - b.timestamp.getTime()) / (1000 * 60 * 60) + 2;
          const hotA = a.score / Math.pow(hoursA, 1.5);
          const hotB = b.score / Math.pow(hoursB, 1.5);
          return hotB - hotA;
        });
        break;
      case "rising":
        // Rising: recent with growing engagement
        filtered = filtered.filter((t) => t.isRising);
        filtered = filtered.toSorted(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
        );
        break;
      case "new":
        // New: chronological
        filtered = filtered.toSorted(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
        );
        break;
      case "following":
        // Following: threads from followed users (TODO: implement user following feature)
        // For now, show chronological until following is implemented
        filtered = filtered.toSorted(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
        );
        break;
    }

    return filtered;
  }, [threadItems, sortMode, searchQuery]);

  const handleThreadClick = (threadId: string): void => {
    chat.navigateToThread(threadId);
  };

  const handleVote = (
    threadId: string,
    vote: 1 | -1,
    e: React.MouseEvent,
  ): void => {
    e.stopPropagation();
    // Vote on the first message of the thread (thread starter)
    const threadMessages = Object.values(chat.messages).filter(
      (msg) => msg.threadId === threadId,
    );
    const firstMessage = threadMessages.toSorted(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    )[0];
    if (firstMessage && chat.voteMessage) {
      chat.voteMessage(firstMessage.id, vote);
    }
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {
      return t("app.chat.publicFeed.timestamp.justNow");
    }
    if (hours < 24) {
      return t("app.chat.publicFeed.timestamp.hoursAgo", {
        count: hours.toString(),
      });
    }
    if (days < 30) {
      return t("app.chat.publicFeed.timestamp.daysAgo", {
        count: days.toString(),
      });
    }
    return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
  };

  return (
    <Div className="h-full flex flex-col overflow-hidden">
      <Div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-400/30 hover:scrollbar-thumb-blue-500/50 scrollbar-thumb-rounded-full">
        <Div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pt-20 pb-8">
          {/* Forum Header */}
          <Div className="mb-6 flex flex-col gap-2">
            <Span className="text-3xl font-bold">
              {t("app.chat.publicFeed.header.title")}
            </Span>
            <Span className="text-muted-foreground block">
              {t("app.chat.publicFeed.header.description")}
            </Span>
          </Div>

          {/* Header with Sort and Search */}
          <Div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b mb-4 pb-4">
            {/* Sort Buttons */}
            <Div className="flex gap-1 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortMode("hot")}
                className={cn(
                  "bg-card backdrop-blur-sm shadow-sm hover:bg-accent gap-2",
                  sortMode === "hot" &&
                    "bg-primary/10 text-primary hover:bg-primary/20",
                )}
              >
                <Flame className="h-4 w-4" />
                {t("app.chat.publicFeed.sort.hot")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortMode("rising")}
                className={cn(
                  "bg-card backdrop-blur-sm shadow-sm hover:bg-accent gap-2",
                  sortMode === "rising" &&
                    "bg-primary/10 text-primary hover:bg-primary/20",
                )}
              >
                <TrendingUp className="h-4 w-4" />
                {t("app.chat.publicFeed.sort.rising")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortMode("new")}
                className={cn(
                  "bg-card backdrop-blur-sm shadow-sm hover:bg-accent gap-2",
                  sortMode === "new" &&
                    "bg-primary/10 text-primary hover:bg-primary/20",
                )}
              >
                <Plus className="h-4 w-4" />
                {t("app.chat.publicFeed.sort.new")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortMode("following")}
                className={cn(
                  "bg-card backdrop-blur-sm shadow-sm hover:bg-accent gap-2",
                  sortMode === "following" &&
                    "bg-primary/10 text-primary hover:bg-primary/20",
                )}
              >
                <Heart className="h-4 w-4" />
                {t("app.chat.publicFeed.sort.following")}
              </Button>
            </Div>

            {/* Search Bar */}
            <Div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("app.chat.publicFeed.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </Div>
          </Div>

          {/* Thread List */}
          <Div className="flex flex-col gap-2">
            {displayedThreads.length === 0 ? (
              <Div className="text-center py-12 text-muted-foreground">
                <Span className="text-lg">
                  {searchQuery
                    ? t("app.chat.publicFeed.noResults")
                    : t("app.chat.publicFeed.noThreads")}
                </Span>
              </Div>
            ) : (
              displayedThreads.map((thread) => (
                <Div
                  key={thread.id}
                  onClick={() => handleThreadClick(thread.id)}
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
                      className={cn(
                        "h-6 w-6 hover:text-orange-500",
                        thread.userVote === 1 && "text-orange-500",
                      )}
                      onClick={(e) => handleVote(thread.id, 1, e)}
                    >
                      <ArrowBigUp className="h-5 w-5" />
                    </Button>
                    <Span
                      className={cn(
                        "font-bold text-sm",
                        thread.score > 0 && "text-orange-500",
                        thread.score < 0 && "text-blue-500",
                      )}
                    >
                      {thread.score}
                    </Span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6 hover:text-blue-500",
                        thread.userVote === -1 && "text-blue-500",
                      )}
                      onClick={(e) => handleVote(thread.id, -1, e)}
                    >
                      <ArrowBigDown className="h-5 w-5" />
                    </Button>
                  </Div>

                  {/* Content Section */}
                  <Div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* Title Row */}
                    <Div className="font-semibold text-base line-clamp-2 hover:underline">
                      {thread.title}
                    </Div>

                    {/* Metadata Row */}
                    <Div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {thread.category}
                      </Badge>
                      <Span>{formatTimestamp(thread.timestamp)}</Span>
                      <Span className="hover:underline">
                        {thread.authorName}
                      </Span>
                      {thread.modelNames.length > 0 && (
                        <Span className="text-blue-500 font-medium">
                          {thread.modelNames.join(", ")}
                        </Span>
                      )}
                      {thread.hasBestAnswer && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1"
                        >
                          <Award className="h-3 w-3" />
                          {t("app.chat.publicFeed.bestAnswer")}
                        </Badge>
                      )}
                    </Div>

                    {/* Stats Row */}
                    <Div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                      <Div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <Span>
                          {thread.messageCount}{" "}
                          {t("app.chat.publicFeed.comments")}
                        </Span>
                      </Div>
                      {thread.isRising && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0 bg-green-500/10 text-green-600 dark:text-green-400"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {t("app.chat.publicFeed.rising")}
                        </Badge>
                      )}
                    </Div>
                  </Div>
                </Div>
              ))
            )}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
