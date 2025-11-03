"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Bot, Loader2, Square, Trash2, Volume2 } from "next-vibe-ui/ui/icons";
import type React from "react";

import { useAIStreamStore } from "@/app/api/[locale]/v1/core/agent/ai-stream/hooks/store";
import textToSpeechDefinition from "@/app/api/[locale]/v1/core/agent/text-to-speech/definition";
import { useTTSAudio } from "@/app/api/[locale]/v1/core/agent/text-to-speech/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useTouchDevice } from "../../../hooks/use-touch-device";
import { CopyButton } from "../copy-button";
import { MessageActionButton } from "../message-action-button";

interface AssistantMessageActionsProps {
  messageId: string;
  content: string;
  ttsAutoplay: boolean;
  locale: CountryLanguage;
  onAnswerAsModel?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  className?: string;
  logger: EndpointLogger;
}

export function AssistantMessageActions({
  messageId,
  content,
  ttsAutoplay,
  locale,
  onAnswerAsModel,
  onDelete,
  className,
  logger,
}: AssistantMessageActionsProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const isTouch = useTouchDevice();

  // Check if this message is currently streaming
  const streamingMessage = useAIStreamStore(
    (state) => state.streamingMessages[messageId],
  );
  const isMessageStreaming = streamingMessage?.isStreaming ?? false;

  const { isLoading, isPlaying, playAudio, stopAudio } = useTTSAudio({
    text: content,
    enabled: ttsAutoplay,
    isStreaming: isMessageStreaming,
    locale,
    logger,
  });

  // Get credit cost from definition
  const ttsCreditCost = textToSpeechDefinition.POST.credits ?? 0;

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
      <CopyButton content={content} locale={locale} logger={logger} />

      {/* TTS Play/Stop Button */}
      <MessageActionButton
        icon={isLoading ? Loader2 : isPlaying ? Square : Volume2}
        onClick={
          isPlaying
            ? stopAudio
            : (): void => {
                void playAudio();
              }
        }
        title={
          isPlaying
            ? t("app.chat.common.assistantMessageActions.stopAudio")
            : `${t("app.chat.common.assistantMessageActions.playAudio")} (+${ttsCreditCost})`
        }
        className={cn(isLoading && "animate-spin")}
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
