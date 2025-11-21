/**
 * Preview popup component for >>references in flat message view
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/hooks/store";
import { getIdColor } from "@/app/[locale]/chat/lib/utils/formatting";

interface MessagePreviewProps {
  message: ChatMessage;
  shortId: string;
  position: { x: number; y: number };
  locale: CountryLanguage;
  rootFolderId?: DefaultFolderId;
}

/**
 * Preview popup that appears when hovering over message references (>>123)
 */
export function MessagePreview({
  message,
  shortId,
  position,
  locale,
  rootFolderId = DefaultFolderId.PRIVATE,
}: MessagePreviewProps): JSX.Element {
  const { t } = simpleT(locale);
  const idColor = getIdColor(shortId);
  const isUser = message.role === "user";

  return (
    <Div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%) translateY(-8px)",
      }}
    >
      <Div
        className={cn(
          "fixed z-50 pointer-events-none",
          "max-w-md p-3 rounded-lg",
          "bg-background/95 backdrop-blur-sm",
          "border border-border shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-150",
        )}
      >
        {/* Preview Header */}
        <Div className="flex items-center gap-2 mb-2 text-xs">
          <Span
            className={cn(
              "font-semibold",
              isUser ? "text-foreground" : "text-primary",
            )}
          >
            {isUser
              ? rootFolderId === "private" ||
                rootFolderId === "shared" ||
                rootFolderId === "public"
                ? t("app.chat.flatView.youLabel")
                : t("app.chat.flatView.anonymous")
              : message.authorName || t("app.chat.flatView.assistantFallback")}
          </Span>
          <Span
            style={{
              backgroundColor: `${idColor}20`,
              color: idColor,
              borderColor: idColor,
            }}
          >
            <Span className="px-1.5 py-0.5 rounded text-xs font-mono border">
              {shortId}
            </Span>
          </Span>
        </Div>

        {/* Preview Content */}
        <Div className="text-sm text-foreground/90 line-clamp-4">
          {message.content}
        </Div>
      </Div>
    </Div>
  );
}
