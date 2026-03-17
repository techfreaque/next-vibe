"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import type { JSX } from "react";
import React, { useCallback, useMemo } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import {
  chatAnimations,
  chatProse,
  chatShadows,
} from "@/app/[locale]/chat/lib/design-tokens";
import { createMetadataSystemMessage } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/message-metadata";
import { useDebugSystemPrompt } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/hook";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";

import { scopedTranslation } from "../../i18n";
import { DebugSystemPrompt, DebugTrailingContext } from "../debug-component";
import { MessageAuthorInfo } from "../message-author";
import { LinearMessageView } from "./view";
import type { LinearMessageViewProps } from "./view";

export const DebugLinearMessageView = React.memo(
  function DebugLinearMessageView(props: LinearMessageViewProps): JSX.Element {
    const {
      locale,
      rootFolderId,
      subFolderId,
      selectedSkill,
      selectedModel,
      user,
      logger,
      ttsAutoplay,
      editingMessageId,
      retryingMessageId,
    } = props;
    const { t } = scopedTranslation.scopedT(locale);

    const debugParts = useDebugSystemPrompt({
      locale,
      rootFolderId,
      subFolderId,
      skillId: selectedSkill,
      selectedModel: selectedModel ?? undefined,
      user,
      logger,
      callMode: ttsAutoplay,
    });

    const timezone = useMemo(
      () => Intl.DateTimeFormat().resolvedOptions().timeZone,
      [],
    );

    const debugLeading = (
      <ErrorBoundary locale={locale}>
        <DebugSystemPrompt locale={locale} parts={debugParts} />
      </ErrorBoundary>
    );

    const renderDebugBeforeMessage = useCallback(
      (
        message: ChatMessage,
        isEditing: boolean,
        isRetrying: boolean,
      ): JSX.Element | null => (
        <>
          {(message.role === ChatMessageRole.USER ||
            message.role === ChatMessageRole.ASSISTANT) && (
            <Div className={cn(chatAnimations.slideIn, "mb-2")}>
              <Div
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-mono",
                  "bg-blue-500/10 border border-blue-500/20",
                  "text-blue-300",
                  chatShadows.sm,
                )}
              >
                {createMetadataSystemMessage(message, rootFolderId, timezone)}
              </Div>
            </Div>
          )}
          {(isEditing || isRetrying) && (
            <ErrorBoundary locale={locale}>
              <DebugTrailingContext parts={debugParts} locale={locale} />
            </ErrorBoundary>
          )}
          {message.role === ChatMessageRole.SYSTEM && (
            <Div className="flex items-start gap-3">
              <Div className="flex-1 max-w-full">
                <Div className="mb-2">
                  <MessageAuthorInfo
                    authorName={t("widget.debugView.systemMessageHint")}
                    authorId={null}
                    currentUserId={undefined}
                    isAI={true}
                    model={message.model}
                    timestamp={message.createdAt}
                    edited={false}
                    character={null}
                    locale={locale}
                    rootFolderId={rootFolderId}
                    compact
                  />
                </Div>
                <Div
                  className={cn(
                    chatProse.all,
                    "pl-2 py-2.5 sm:py-3",
                    "border border-blue-500/30 bg-blue-500/5 rounded-md",
                  )}
                >
                  <Markdown content={message.content ?? ""} />
                </Div>
                <Div className="mt-1 text-xs text-muted-foreground pl-2">
                  {t("widget.debugView.systemMessageHint")}
                </Div>
              </Div>
            </Div>
          )}
        </>
      ),
      [debugParts, locale, rootFolderId, timezone, t],
    );

    const debugTrailing =
      !editingMessageId && !retryingMessageId ? (
        <ErrorBoundary locale={locale}>
          <DebugTrailingContext parts={debugParts} locale={locale} />
        </ErrorBoundary>
      ) : undefined;

    return (
      <LinearMessageView
        {...props}
        debugLeading={debugLeading}
        renderDebugBeforeMessage={renderDebugBeforeMessage}
        debugTrailing={debugTrailing}
      />
    );
  },
);
