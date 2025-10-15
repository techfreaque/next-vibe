"use client";

import { GitBranch, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "next-vibe/shared/utils";

import { useTranslation } from "@/i18n/core/client";

import { useTouchDevice } from "../../hooks/use-touch-device";
import { chatTransitions } from "../../lib/design-tokens";
import { CopyButton } from "./copy-button";
import { MessageActionButton } from "./message-action-button";

interface UserMessageActionsProps {
  messageId: string;
  content: string;
  onBranch?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  className?: string;
}

export function UserMessageActions({
  messageId,
  content,
  onBranch,
  onRetry,
  onDelete,
  className,
}: UserMessageActionsProps) {
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

      {onBranch && (
        <MessageActionButton
          icon={GitBranch}
          onClick={() => onBranch(messageId)}
          title={t("actions.branch")}
        />
      )}

      {onRetry && (
        <MessageActionButton
          icon={RotateCcw}
          onClick={() => onRetry(messageId)}
          title={t("actions.retry")}
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
