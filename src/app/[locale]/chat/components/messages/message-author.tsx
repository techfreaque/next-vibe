"use client";

import type { MessageAuthor } from "../../lib/storage/types";
import { Bot, User } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { formatRelativeTime } from "../../lib/utils/formatting";

interface MessageAuthorProps {
  author?: MessageAuthor;
  timestamp: number;
  edited?: boolean;
  compact?: boolean;
  className?: string;
  /** Persona/tone used for this message */
  tone?: string;
}

export function MessageAuthorInfo({
  author,
  timestamp,
  edited = false,
  compact = false,
  className,
  tone,
}: MessageAuthorProps) {

  const getAuthorColor = (author?: MessageAuthor): string => {
    if (!author) return "text-foreground";
    if (author.color) return author.color;
    if (author.isAI) return "text-blue-500";
    return "text-foreground";
  };

  const getAuthorName = (author?: MessageAuthor): string => {
    if (!author) return "You";
    return author.name;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Avatar */}
      <div
        className={cn(
          "rounded-full flex items-center justify-center flex-shrink-0",
          compact ? "h-6 w-6" : "h-8 w-8",
          author?.isAI 
            ? "bg-gradient-to-br from-blue-500 to-purple-600" 
            : "bg-gradient-to-br from-gray-400 to-gray-600"
        )}
      >
        {author?.avatar ? (
          <img 
            src={author.avatar} 
            alt={author.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : author?.isAI ? (
          <Bot className={cn("text-white", compact ? "h-3 w-3" : "h-4 w-4")} />
        ) : (
          <User className={cn("text-white", compact ? "h-3 w-3" : "h-4 w-4")} />
        )}
      </div>

      {/* Author info */}
      <div className="flex items-baseline gap-2 min-w-0">
        <span
          className={cn(
            "font-medium truncate",
            compact ? "text-xs" : "text-sm",
            getAuthorColor(author)
          )}
        >
          {getAuthorName(author)}
        </span>

        {author?.isAI && author.modelId && (
          <span className="text-xs text-muted-foreground truncate">
            ({author.modelId}
            {tone && ` • ${tone}`})
          </span>
        )}

        {!author?.isAI && tone && (
          <span className="text-xs text-muted-foreground truncate">
            ({tone})
          </span>
        )}

        <span className="text-xs text-muted-foreground flex-shrink-0">
          {formatRelativeTime(timestamp)}
        </span>

        {edited && (
          <span className="text-xs text-muted-foreground italic flex-shrink-0">
            (edited)
          </span>
        )}
      </div>
    </div>
  );
}

