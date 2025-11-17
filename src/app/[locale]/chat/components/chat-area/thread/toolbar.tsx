"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { useChatContext } from "@/app/api/[locale]/v1/core/agent/chat/hooks/context";
import { ViewModeToggle } from "./messages/view-mode-toggle";
import { ChatScreenshotButton } from "./screenshot-button";

interface ChatToolbarProps {
  locale: CountryLanguage;
}

/**
 * Toolbar positioned at the top-right of the chat area.
 * Contains view mode toggle and screenshot button.
 * Only visible when there are messages in the thread.
 *
 * z-40: Above input (z-20), below sidebar on mobile (z-50), below top bar (z-50)
 */
export function ChatToolbar({
  locale,
}: ChatToolbarProps): JSX.Element {
  const { viewMode, setViewMode: onViewModeChange, handleScreenshot: onScreenshot } = useChatContext();
  return (
    <Div className="absolute right-4 top-4 z-40 flex gap-1">
      {/* Thread view mode toggle */}
      <ViewModeToggle
        mode={viewMode}
        onChange={onViewModeChange}
        locale={locale}
      />

      {/* Screenshot button */}
      <ChatScreenshotButton locale={locale} onScreenshot={onScreenshot} />
    </Div>
  );
}
