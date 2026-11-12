"use client";

import { platform } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { H1, P } from "next-vibe/ui/components/typography";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { JSX } from "react";

import { DOM_IDS, LAYOUT } from "@/_pages/chat/lib/config/constants";

import { getDefaultFolderConfig } from "../../../config";
import { useChatNavigationStore } from "../../../hooks/use-chat-navigation-store";
import { scopedTranslation } from "../../i18n";
import { SpotlightEmptyState } from "./empty-state-spotlight";

interface ChatEmptyStateProps {
  locale: CountryLanguage;
  inputHeight: number;
  /** Currently selected skill id; null while settings load. */
  skillId: string | null;
}

/**
 * Empty state for new threads.
 *
 * Every chat folder shows the mode spotlight: where the chat lives, who
 * answers, which mode and model are on, and what each mode is good and weak
 * at. Background (`cron`) keeps its simple folder card: agents work there on
 * their own, no companion answers.
 */
export function ChatEmptyState({
  locale,
  inputHeight,
  skillId,
}: ChatEmptyStateProps): JSX.Element {
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);
  const bottomPadding = platform.isReactNative
    ? LAYOUT.MESSAGES_BOTTOM_PADDING
    : inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING;

  if (rootFolderId === "cron") {
    return (
      <BackgroundEmptyState locale={locale} bottomPadding={bottomPadding} />
    );
  }

  return (
    <Div
      className="absolute inset-0 overflow-hidden"
      id={DOM_IDS.MESSAGES_CONTAINER}
    >
      <SpotlightEmptyState
        locale={locale}
        skillId={skillId}
        rootFolderId={rootFolderId}
        bottomPadding={bottomPadding}
      />
    </Div>
  );
}

/** Background folder: the original folder card, no starters. */
function BackgroundEmptyState({
  locale,
  bottomPadding,
}: {
  locale: CountryLanguage;
  bottomPadding: number;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const folderConfig = getDefaultFolderConfig("cron");

  return (
    <Div
      className="absolute inset-0 overflow-y-auto"
      id={DOM_IDS.MESSAGES_CONTAINER}
    >
      <Div style={{ paddingBottom: bottomPadding }}>
        <Div className="mx-auto flex max-w-3xl flex-col items-center px-3 pt-20 sm:px-4 md:px-8 lg:px-10">
          <Div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/20 text-green-500">
            <Icon
              icon={folderConfig?.icon || "message-circle"}
              className="h-7 w-7"
            />
          </Div>
          <H1 className="mb-2 text-balance text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("widget.suggestedPrompts.backgroundTitle")}
          </H1>
          <P className="mb-8 max-w-md text-balance text-center text-sm text-muted-foreground sm:text-base">
            {t("widget.suggestedPrompts.backgroundDescription")}
          </P>
        </Div>
      </Div>
    </Div>
  );
}
