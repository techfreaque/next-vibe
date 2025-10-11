"use client";

import { GitBranch, RotateCcw, Trash2 } from "lucide-react";
import { CopyButton } from "./copy-button";
import { MessageActionButton } from "./message-action-button";
import { cn } from "next-vibe/shared/utils";
import { chatTransitions } from "../../lib/design-tokens";

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

      {onBranch && (
        <MessageActionButton
          icon={GitBranch}
          onClick={() => onBranch(messageId)}
          title="Branch conversation from here"
        />
      )}

      {onRetry && (
        <MessageActionButton
          icon={RotateCcw}
          onClick={() => onRetry(messageId)}
          title="Retry with different model/persona"
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

