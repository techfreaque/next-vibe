"use client";

import { Bot, Loader2, Square, Trash2, Volume2 } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type React from "react";

import { useTTSAudio } from "@/app/api/[locale]/v1/core/agent/text-to-speech/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
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

  const { isLoading, isPlaying, playAudio, stopAudio } = useTTSAudio({
    text: content,
    enabled: ttsAutoplay,
    locale,
    logger,
  });

  return (
    <div
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
            : t("app.chat.common.assistantMessageActions.playAudio")
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
    </div>
  );
}
