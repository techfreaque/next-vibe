"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Bot, Square, Trash2, Volume2, X } from "next-vibe-ui/ui/icons";
import type React from "react";

import { useAIStreamStore } from "@/app/api/[locale]/agent/ai-stream/hooks/store";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import {
  prepareTextForTTS,
  stripThinkTags,
} from "@/app/api/[locale]/agent/text-to-speech/content-processing";
import { useTTSAudio } from "@/app/api/[locale]/agent/text-to-speech/hooks";
import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { CopyButton } from "./copy-button";
import { MessageActionButton } from "./message-action-button";

interface AssistantMessageActionsProps {
  messageId: string;
  content: string;
  contentMarkdown?: string;
  contentText?: string;
  locale: CountryLanguage;
  onAnswerAsModel?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  className?: string;
  logger: EndpointLogger;
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
}: AssistantMessageActionsProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const isTouch = useTouchDevice();

  // Get ttsAutoplay, ttsVoice, deductCredits, and character info from context
  const { ttsAutoplay, ttsVoice, deductCredits, selectedCharacter, characters } = useChatContext();

  // Get voice from current character (if available), fallback to chat settings
  const currentCharacter = characters[selectedCharacter];
  const characterVoice = currentCharacter?.voice ?? ttsVoice;

  // Check if this message is currently streaming
  const streamingMessage = useAIStreamStore((state) => state.streamingMessages[messageId]);
  const isMessageStreaming = streamingMessage?.isStreaming ?? false;

  // Prepare content for TTS (strip think tags, markdown, convert line breaks)
  const ttsText = prepareTextForTTS(stripThinkTags(content));

  const { isLoading, isPlaying, playAudio, stopAudio, cancelLoading, currentChunk, totalChunks } =
    useTTSAudio({
      text: ttsText,
      enabled: ttsAutoplay,
      isStreaming: isMessageStreaming,
      voice: characterVoice,
      locale,
      logger,
      deductCredits,
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
          : "opacity-0 group-hover/message:opacity-100 focus-within:opacity-100",
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
              ? `${t("app.chat.common.assistantMessageActions.cancelLoading")} (${currentChunk}/${totalChunks})`
              : t("app.chat.common.assistantMessageActions.cancelLoading")
            : isPlaying
              ? totalChunks > 1
                ? `${t("app.chat.common.assistantMessageActions.stopAudio")} (${currentChunk}/${totalChunks})`
                : t("app.chat.common.assistantMessageActions.stopAudio")
              : t("app.chat.common.assistantMessageActions.playAudio", {
                  cost: ttsCreditCost.toFixed(2),
                })
        }
        className={cn(
          isLoading && "text-orange-400 hover:text-orange-300",
          isPlaying && "text-blue-400 hover:text-blue-300",
        )}
      />

      {onAnswerAsModel && (
        <MessageActionButton
          icon={Bot}
          onClick={() => onAnswerAsModel(messageId)}
          title={t("app.chat.common.assistantMessageActions.answerAsAI")}
        />
      )}

      {onDelete && (
        <MessageActionButton
          icon={Trash2}
          onClick={() => onDelete(messageId)}
          title={t("app.chat.common.assistantMessageActions.deleteMessage")}
          variant="destructive"
        />
      )}
    </Div>
  );
}
