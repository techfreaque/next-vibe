"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { Square } from "next-vibe-ui/ui/icons/Square";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Volume2 } from "next-vibe-ui/ui/icons/Volume2";
import { X } from "next-vibe-ui/ui/icons/X";
import { Span } from "next-vibe-ui/ui/span";
import type React from "react";

import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import {
  prepareTextForTTS,
  stripThinkTags,
} from "@/app/api/[locale]/agent/text-to-speech/content-processing";
import { useTTSAudio } from "@/app/api/[locale]/agent/text-to-speech/hooks";
import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";

import { useStreamingMessagesStore } from "../hooks/streaming-messages-store";
import { scopedTranslation } from "../i18n";
import { CopyButton } from "./copy-button";
import { useMessageGroupName } from "./embedded-context";
import { MessageActionButton } from "./message-action-button";

interface AssistantMessageActionsProps {
  messageId: string;
  content: string;
  contentMarkdown: string;
  contentText: string;
  locale: CountryLanguage;
  onAnswerAsModel: ((messageId: string) => void) | null;
  onDelete: ((messageId: string) => void) | null;
  className: string | null;
  logger: EndpointLogger;
  promptTokens: number | null;
  completionTokens: number | null;
  creditCost: number | null;
  /** Hide TTS and interactive buttons. Used for read-only demos. */
  readOnly: boolean;
  /** User for TTS */
  user: JwtPayloadType;
  /** Credit deduction callback (null in read-only mode) */
  deductCredits: ((creditCost: number, feature: string) => void) | null;
}

export function AssistantMessageActions({
  messageId,
  content,
  contentMarkdown,
  contentText,
  locale,
  onAnswerAsModel,
  onDelete,
  className,
  logger,
  promptTokens,
  completionTokens,
  creditCost,
  readOnly,
  user,
  deductCredits,
}: AssistantMessageActionsProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const isTouch = useTouchDevice();
  const { groupHover } = useMessageGroupName();

  // Get settings directly
  const { initialSettingsData } = useChatBootContext();
  const { settings } = useChatSettings(user, logger, initialSettingsData);
  const ttsAutoplay = settings?.ttsAutoplay ?? false;
  const ttsVoice = settings?.ttsVoice;

  // Check if this message is currently streaming
  const streamingMessage = useStreamingMessagesStore(
    (state) => state.streamingMessages[messageId],
  );
  const isMessageStreaming = streamingMessage?.isStreaming ?? false;

  // Prepare content for TTS (strip think tags, markdown, convert line breaks)
  const ttsText = prepareTextForTTS(stripThinkTags(content));

  const {
    isLoading,
    isPlaying,
    playAudio,
    stopAudio,
    cancelLoading,
    currentChunk,
    totalChunks,
  } = useTTSAudio({
    text: ttsText,
    enabled: ttsAutoplay,
    isStreaming: isMessageStreaming,
    voice: ttsVoice,
    locale,
    user,
    logger,
    messageId,
    deductCredits:
      deductCredits ??
      ((): void => {
        /* no-op in read-only mode */
      }),
  });

  // Calculate TTS credit cost based on text length
  const ttsCreditCost = ttsText.length * FEATURE_COSTS.TTS;

  return (
    <Div
      className={cn(
        "flex items-center gap-1",
        "transition-opacity duration-150",
        // Touch devices: always visible but slightly transparent
        // Pointer devices: hidden until hover
        isTouch
          ? "opacity-70 active:opacity-100"
          : `opacity-0 ${groupHover} focus-within:opacity-100`,
        className,
      )}
    >
      <CopyButton
        content={content}
        contentMarkdown={contentMarkdown}
        contentText={contentText}
        locale={locale}
        logger={logger}
      />

      {/* TTS Play/Stop/Cancel Button */}
      <MessageActionButton
        icon={isLoading ? X : isPlaying ? Square : Volume2}
        onClick={
          isLoading
            ? cancelLoading
            : isPlaying
              ? stopAudio
              : (): void => {
                  void playAudio();
                }
        }
        title={
          isLoading
            ? totalChunks > 1
              ? `${t("widget.common.assistantMessageActions.cancelLoading")} (${currentChunk}/${totalChunks})`
              : t("widget.common.assistantMessageActions.cancelLoading")
            : isPlaying
              ? totalChunks > 1
                ? `${t("widget.common.assistantMessageActions.stopAudio")} (${currentChunk}/${totalChunks})`
                : t("widget.common.assistantMessageActions.stopAudio")
              : t("widget.common.assistantMessageActions.playAudio", {
                  cost: ttsCreditCost.toFixed(2),
                })
        }
        className={cn(
          isLoading && "text-orange-400 hover:text-orange-300",
          isPlaying && "text-blue-400 hover:text-blue-300",
        )}
        disabled={readOnly}
      />

      {onAnswerAsModel && (
        <MessageActionButton
          icon={Bot}
          onClick={() => onAnswerAsModel(messageId)}
          title={t("widget.common.assistantMessageActions.answerAsAI")}
          disabled={readOnly}
        />
      )}

      {onDelete && (
        <MessageActionButton
          icon={Trash2}
          onClick={() => onDelete(messageId)}
          title={t("widget.common.assistantMessageActions.deleteMessage")}
          variant="destructive"
          disabled={readOnly}
        />
      )}

      {/* Show actual cost/tokens if available - right-aligned */}
      {((creditCost !== null && creditCost !== undefined) ||
        (promptTokens !== null && promptTokens !== undefined) ||
        (completionTokens !== null && completionTokens !== undefined)) && (
        <Div className="text-xs text-muted-foreground ml-auto flex items-center gap-1.5">
          {creditCost !== null && creditCost !== undefined && (
            <Span
              title={t("widget.common.assistantMessageActions.actualCostUsed")}
            >
              {creditCost.toFixed(2)}{" "}
              {t("widget.common.assistantMessageActions.credits")}
            </Span>
          )}
          {(promptTokens !== null || completionTokens !== null) && (
            <Span
              title={t("widget.common.assistantMessageActions.tokensUsed")}
              className="text-muted-foreground/70"
            >
              •{" "}
              {((promptTokens ?? 0) + (completionTokens ?? 0)).toLocaleString()}{" "}
              {t("widget.common.assistantMessageActions.tokens")}
            </Span>
          )}
        </Div>
      )}
    </Div>
  );
}
