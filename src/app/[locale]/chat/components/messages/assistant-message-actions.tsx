"use client";

import { Bot, Trash2 } from "lucide-react";
import { cn } from "next-vibe/shared/utils";

import { useTranslation } from "@/i18n/core/client";

import { useTouchDevice } from "../../hooks/use-touch-device";
import { chatTransitions } from "../../lib/design-tokens";
import { CopyButton } from "./copy-button";
import { MessageActionButton } from "./message-action-button";

interface AssistantMessageActionsProps {
  messageId: string;
  content: string;
  onAnswerAsModel?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  className?: string;
}

export function AssistantMessageActions({
  messageId,
  content,
  onAnswerAsModel,
  onDelete,
  className,
}: AssistantMessageActionsProps) {
  const { t } = useTranslation("chat");
  const isTouch = useTouchDevice();

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        chatTransitions.fast,
        // Touch devices: always visible but slightly transparent
        // Pointer devices: hidden until hover
        isTouch
          ? "opacity-70 active:opacity-100"
          : "opacity-0 group-hover/message:opacity-100 focus-within:opacity-100",
        className,
      )}
    >
      <CopyButton content={content} />

      {onAnswerAsModel && (
        <MessageActionButton
          icon={Bot}
          onClick={() => onAnswerAsModel(messageId)}
          title={t("actions.answerAsAI")}
        />
      )}

      {onDelete && (
        <MessageActionButton
          icon={Trash2}
          onClick={() => onDelete(messageId)}
          title={t("actions.deleteMessage")}
          variant="destructive"
        />
      )}
    </div>
  );
}
