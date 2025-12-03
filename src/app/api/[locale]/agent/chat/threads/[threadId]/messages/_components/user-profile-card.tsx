/**
 * User Profile Hover Card (Reddit-style)
 * Shows user post count and recent posts
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { formatRelativeTime } from "@/app/[locale]/chat/lib/utils/formatting";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";

interface UserProfileCardProps {
  userId: string;
  userName: string;
  messages: ChatMessage[];
  position: { x: number; y: number };
  locale: CountryLanguage;
  onPostClick?: (messageId: string) => void;
}

export function UserProfileCard({
  userId,
  userName,
  messages,
  position,
  locale,
  onPostClick,
}: UserProfileCardProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get all messages from this user
  const userMessages = messages.filter((m) => m.authorId === userId);

  const postCount = userMessages.length;
  const recentPosts = userMessages.slice(-5).toReversed(); // Last 5 posts, newest first

  return (
    <Div
      style={{
        left: `${position.x}px`,
        top: `${position.y + 10}px`,
      }}
    >
      <Div
        className={cn(
          "fixed z-50",
          "w-80 p-4 rounded-lg",
          "bg-background/95 backdrop-blur-md",
          "border border-border shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 duration-150",
        )}
      >
        {/* Header */}
        <Div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
          <Div className="flex-1">
            <Div className="font-bold text-sm text-foreground">{userName}</Div>
            <Div className="text-xs text-muted-foreground">
              {t("app.chat.userProfile.postCount", { count: postCount })}
            </Div>
          </Div>
        </Div>

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <Div className="flex flex-col gap-2">
            <Div className="text-xs font-semibold text-muted-foreground mb-2">
              {t("app.chat.userProfile.recentPosts")}
            </Div>
            {recentPosts.map((post) => (
              <Button
                key={post.id}
                variant="ghost"
                size="unset"
                onClick={() => onPostClick?.(post.id)}
                className="w-full text-left p-2 rounded hover:bg-accent/50 transition-colors"
              >
                <Div className="text-xs text-muted-foreground mb-1">
                  {formatRelativeTime(post.createdAt.getTime())}
                </Div>
                <Div className="text-sm text-foreground/90 line-clamp-2">
                  {post.content.substring(0, 100)}
                  {post.content.length > 100 && "..."}
                </Div>
              </Button>
            ))}
          </Div>
        )}

        {postCount === 0 && (
          <Div className="text-xs text-muted-foreground text-center py-4">
            {t("app.chat.userProfile.noPostsYet")}
          </Div>
        )}
      </Div>
    </Div>
  );
}
