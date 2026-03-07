"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { Square } from "next-vibe-ui/ui/icons/Square";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Volume2 } from "next-vibe-ui/ui/icons/Volume2";
import { X } from "next-vibe-ui/ui/icons/X";
import type React from "react";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useTTSAudio } from "@/app/api/[locale]/agent/text-to-speech/hooks";
import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";
import { CopyButton } from "./copy-button";
import { useMessageGroupName } from "./embedded-context";
import { MessageActionButton } from "./message-action-button";

interface UserMessageActionsProps {
  message: ChatMessage;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  deductCredits: ((creditCost: number, feature: string) => void) | null;
  onBranch?: (messageId: string) => void;
  onRetry?: (message: ChatMessage) => Promise<void>;
  onDelete?: (messageId: string) => void;
  className?: string;
}

export function UserMessageActions({
  message,
  locale,
  logger,
  user,
  deductCredits,
  onBranch,
  onRetry,
  onDelete,
  className,
}: UserMessageActionsProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const isTouch = useTouchDevice();
  const { groupHover } = useMessageGroupName();

  const ttsText = message.content ?? "";
  const ttsCreditCost = ttsText.length * FEATURE_COSTS.TTS;

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
    enabled: false,
    isStreaming: false,
    locale,
    user,
    logger,
    messageId: message.id,
    deductCredits:
      deductCredits ??
      ((): void => {
        /* no-op */
      }),
  });

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
        content={message.content ?? undefined}
        locale={locale}
        logger={logger}
      />

      {/* TTS Play/Stop/Cancel Button */}
      {ttsText && (
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
                ? `${t("widget.common.userMessageActions.cancelLoading")} (${currentChunk}/${totalChunks})`
                : t("widget.common.userMessageActions.cancelLoading")
              : isPlaying
                ? totalChunks > 1
                  ? `${t("widget.common.userMessageActions.stopAudio")} (${currentChunk}/${totalChunks})`
                  : t("widget.common.userMessageActions.stopAudio")
                : t("widget.common.userMessageActions.playAudio", {
                    cost: ttsCreditCost.toFixed(2),
                  })
          }
          className={cn(
            isLoading && "text-orange-400 hover:text-orange-300",
            isPlaying && "text-blue-400 hover:text-blue-300",
          )}
        />
      )}

      {onBranch && (
        <MessageActionButton
          icon={GitBranch}
          onClick={() => onBranch(message.id)}
          title={t("widget.common.userMessageActions.branch")}
        />
      )}

      {onRetry && (
        <MessageActionButton
          icon={RotateCcw}
          onClick={(): void => {
            void onRetry(message);
          }}
          title={t("widget.common.userMessageActions.retry")}
        />
      )}

      {onDelete && (
        <MessageActionButton
          icon={Trash2}
          onClick={() => onDelete(message.id)}
          title={t("widget.common.userMessageActions.deleteMessage")}
          variant="destructive"
        />
      )}
    </Div>
  );
}
