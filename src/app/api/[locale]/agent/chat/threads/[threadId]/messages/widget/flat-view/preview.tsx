/**
 * Preview popup component for >>references in flat message view
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import type { DivRefObject } from "next-vibe-ui/ui/div";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useLayoutEffect, useState } from "react";

import { getIdColor } from "@/app/[locale]/chat/lib/utils/formatting";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../../i18n";

const MARGIN = 8; // px gap from viewport edges

interface MessagePreviewProps {
  message: ChatMessage;
  shortId: string;
  position: { x: number; y: number };
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
}

/**
 * Preview popup that appears when hovering over message references (>>123).
 * Clamped to stay within the viewport horizontally and flips below the anchor
 * if there's not enough space above.
 */
export function MessagePreview({
  message,
  shortId,
  position,
  locale,
  rootFolderId,
}: MessagePreviewProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const idColor = getIdColor(shortId);
  const isUser = message.role === "user";

  const [el, setEl] = useState<DivRefObject | null>(null);
  const refCallback = useCallback((node: DivRefObject | null) => {
    setEl(node);
  }, []);
  const [clampedLeft, setClampedLeft] = useState<number>(position.x);
  const [flipBelow, setFlipBelow] = useState(false);

  useLayoutEffect(() => {
    if (!el) {
      return;
    }

    const { width, height } = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Center-align horizontally, then clamp to viewport
    let left = position.x - width / 2;
    left = Math.max(MARGIN, Math.min(left, vw - width - MARGIN));
    setClampedLeft(left);

    // Flip below if not enough space above
    const spaceAbove = position.y - height - MARGIN;
    setFlipBelow(spaceAbove < 0 && position.y + height + MARGIN < vh);
  }, [el, position.x, position.y]);

  const top = flipBelow ? position.y + MARGIN : position.y - MARGIN;
  const transform = flipBelow ? "translateY(0)" : "translateY(-100%)";

  return (
    <Div
      ref={refCallback}
      style={{
        position: "fixed",
        zIndex: 50,
        left: `${clampedLeft}px`,
        top: `${top}px`,
        transform,
        pointerEvents: "none",
      }}
    >
      <Div
        className={cn(
          "w-80 p-3 rounded-lg",
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
              ? rootFolderId === "public" || rootFolderId === "shared"
                ? (message.authorName ?? t("widget.flatView.anonymous"))
                : t("widget.flatView.youLabel")
              : t("widget.flatView.assistantFallback")}
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
