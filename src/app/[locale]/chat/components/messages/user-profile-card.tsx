/**
 * User Profile Hover Card (Reddit-style)
 * Shows user post count and recent posts
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ChatMessage } from "../../lib/storage/types";
import { formatRelativeTime } from "../../lib/utils/formatting";

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
  const userMessages = messages.filter((m) => m.author?.id === userId);

  const postCount = userMessages.length;
  const recentPosts = userMessages.slice(-5).reverse(); // Last 5 posts, newest first

  return (
    <div
      className={cn(
        "fixed z-50",
        "w-80 p-4 rounded-lg",
        "bg-background/95 backdrop-blur-md",
        "border border-border shadow-2xl",
        "animate-in fade-in-0 zoom-in-95 duration-150",
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y + 10}px`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
        <div className="flex-1">
          <div className="font-bold text-sm text-foreground">{userName}</div>
          <div className="text-xs text-muted-foreground">
            {t("app.chat.userProfile.postCount", { count: postCount })}
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground mb-2">
            {t("app.chat.userProfile.recentPosts")}
          </div>
          {recentPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => onPostClick?.(post.id)}
              className="w-full text-left p-2 rounded hover:bg-accent/50 transition-colors"
            >
              <div className="text-xs text-muted-foreground mb-1">
                {formatRelativeTime(post.timestamp)}
              </div>
              <div className="text-sm text-foreground/90 line-clamp-2">
                {post.content.substring(0, 100)}
                {post.content.length > 100 && "..."}
              </div>
            </button>
          ))}
        </div>
      )}

      {postCount === 0 && (
        <div className="text-xs text-muted-foreground text-center py-4">
          {t("app.chat.userProfile.noPostsYet")}
        </div>
      )}
    </div>
  );
}
