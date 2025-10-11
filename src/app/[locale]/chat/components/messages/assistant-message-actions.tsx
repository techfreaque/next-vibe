"use client";

import { Bot, Trash2 } from "lucide-react";
import { CopyButton } from "./copy-button";
import { MessageActionButton } from "./message-action-button";
import { cn } from "next-vibe/shared/utils";
import { chatTransitions } from "../../lib/design-tokens";

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
  return (
    <div
      className={cn(
        "flex items-center gap-1",
        "opacity-0 group-hover/message:opacity-100",
        chatTransitions.fast,
        className
      )}
    >
      <CopyButton content={content} />

      {onAnswerAsModel && (
        <MessageActionButton
          icon={Bot}
          onClick={() => onAnswerAsModel(messageId)}
          title="Answer as AI model"
        />
      )}

      {onDelete && (
        <MessageActionButton
          icon={Trash2}
          onClick={() => onDelete(messageId)}
          title="Delete message"
          variant="destructive"
        />
      )}
    </div>
  );
}

