"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { envClient } from "@/config/env-client";

import type { CountryLanguage } from "@/i18n/core/config";

import { DOM_IDS, LAYOUT } from "@/app/[locale]/chat/lib/config/constants";
import { SuggestedPrompts } from "@/app/api/[locale]/v1/core/agent/chat/threads/[threadId]/messages/_components/suggested-prompts";

interface ChatEmptyStateProps {
  locale: CountryLanguage;
  inputHeight: number;
}

/**
 * Empty state display for new threads.
 * Shows suggested prompts to help users get started.
 */
export function ChatEmptyState({
  locale,
  inputHeight,
}: ChatEmptyStateProps): JSX.Element {
  return (
    <Div
      className="h-screen h-max-screen overflow-y-auto scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-400/30 hover:scrollbar-thumb-blue-500/50 scrollbar-thumb-rounded-full"
      id={DOM_IDS.MESSAGES_CONTAINER}
    >
      <Div
        style={
          envClient.platform.isReactNative
            ? { paddingBottom: LAYOUT.MESSAGES_BOTTOM_PADDING }
            : {
                paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
              }
        }
      >
        <Div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pt-15 flex flex-col gap-5">
          <Div
            style={{
              minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh`,
            }}
          >
            <Div className="flex items-center justify-center h-full">
              <SuggestedPrompts locale={locale} />
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
