/**
 * User ID Hover Card - Shows post count and list for a specific user in flat message view
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import type { DivRefObject } from "next-vibe-ui/ui/div";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useCallback, useLayoutEffect, useState } from "react";

import {
  format4chanTimestamp,
  getIdColor,
  getShortId,
} from "@/app/[locale]/chat/lib/utils/formatting";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../../i18n";
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
  const { t } = scopedTranslation.scopedT(locale);
  const userPosts = getPostsByUserId(messages, userId);
  const postCount = userPosts.length;
  const idColor = getIdColor(userId);

  const [el, setEl] = useState<DivRefObject | null>(null);
  const refCallback = useCallback((node: DivRefObject | null) => {
    setEl(node);
  }, []);
  const [clampedLeft, setClampedLeft] = useState<number>(position.x);

  useLayoutEffect(() => {
    if (!el) {
      return;
    }
    const { width } = el.getBoundingClientRect();
    const vw = window.innerWidth;
    // Align left edge to anchor, then clamp so it stays within viewport
    const left = Math.max(8, Math.min(position.x - width / 2, vw - width - 8));
    setClampedLeft(left);
  }, [el, position.x, position.y]);

  return (
    <Div
      ref={refCallback}
      style={{
        position: "fixed",
        zIndex: 50,
        left: `${clampedLeft}px`,
        top: `${position.y + 10}px`,
      }}
    >
      <Div
        className={cn(
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
            {t("widget.flatView.postsById", { count: postCount })}
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
                <Div
                  className="text-xs text-muted-foreground mb-1"
                  suppressHydrationWarning
                >
                  {/* eslint-disable-next-line i18next/no-literal-string -- Technical post number and separator */}
                  {`Post #${idx + 1} • ${format4chanTimestamp(post.createdAt.getTime(), t)}`}
                </Div>
                <Div className="text-sm text-foreground/90 line-clamp-2">
                  {(post.content ?? "").slice(0, 100)}
                  {(post.content ?? "").length > 100 && "..."}
                </Div>
              </Button>
            );
          })}
        </Div>
      </Div>
    </Div>
  );
}
