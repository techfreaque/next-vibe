/**
 * User ID Hover Card - Shows post count and list for a specific user in flat message view
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/db";
import {
  format4chanTimestamp,
  getIdColor,
  getShortId,
} from "@/app/[locale]/chat/lib/utils/formatting";
import { getPostsByUserId } from "./helpers";

interface UserIdHoverCardProps {
  userId: string;
  messages: ChatMessage[];
  position: { x: number; y: number };
  onPostClick?: (messageId: string) => void;
  locale: CountryLanguage;
}

/**
 * Hover card that displays all posts by a specific user ID
 */
export function UserIdHoverCard({
  userId,
  messages,
  position,
  onPostClick,
  locale,
}: UserIdHoverCardProps): JSX.Element {
  const { t } = simpleT(locale);
  const userPosts = getPostsByUserId(messages, userId);
  const postCount = userPosts.length;
  const idColor = getIdColor(userId);

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
          "w-72 p-3 rounded-lg",
          "bg-background/95 backdrop-blur-md",
          "border border-border shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 duration-150",
        )}
      >
        {/* Header */}
        <Div className="flex items-center gap-2 mb-3 pb-2 border-border/50">
          <Span
            style={{
              backgroundColor: `${idColor}20`,
              color: idColor,
              borderColor: idColor,
            }}
          >
            <Span className="px-2 py-1 rounded text-xs font-mono font-semibold border">
              {/* eslint-disable-next-line i18next/no-literal-string -- Technical ID label */}
              {`ID: ${userId}`}
            </Span>
          </Span>
          <Span className="text-xs text-muted-foreground font-medium">
            {t("app.chat.flatView.postsById", { count: postCount })}
          </Span>
        </Div>

        {/* Post List */}
        <Div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {userPosts.map((post, idx) => {
            const postShortId = getShortId(post.id);
            return (
              <Button
                key={post.id}
                onClick={(): void => {
                  onPostClick?.(postShortId);
                }}
                variant="ghost"
                size="unset"
                className="w-full text-left p-2 rounded hover:bg-accent transition-colors"
              >
                <Div className="text-xs text-muted-foreground mb-1">
                  {/* eslint-disable-next-line i18next/no-literal-string -- Technical post number and separator */}
                  {`Post #${idx + 1} • ${format4chanTimestamp(post.createdAt.getTime(), t)}`}
                </Div>
                <Div className="text-sm text-foreground/90 line-clamp-2">
                  {post.content.substring(0, 100)}
                  {post.content.length > 100 && "..."}
                </Div>
              </Button>
            );
          })}
        </Div>
      </Div>
    </Div>
  );
}
