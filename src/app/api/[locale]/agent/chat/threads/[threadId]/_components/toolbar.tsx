"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { ViewModeToggle } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/_components/view-mode-toggle";

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
export function ChatToolbar({ locale }: ChatToolbarProps): JSX.Element {
  const {
    viewMode,
    setViewMode: onViewModeChange,
    handleScreenshot: _onScreenshot,
  } = useChatContext();
  return (
    <Div className="absolute right-4 top-4 z-40 flex gap-1">
      {/* Thread view mode toggle */}
      <ViewModeToggle
        mode={viewMode}
        onChange={onViewModeChange}
        locale={locale}
      />

      {/* Screenshot button */}
      {/* TODO fix screenshot */}
      {/* <ChatScreenshotButton locale={locale} onScreenshot={onScreenshot} /> */}
    </Div>
  );
}
