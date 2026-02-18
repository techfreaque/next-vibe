"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { ChatFolder, ChatThread } from "@/app/api/[locale]/agent/chat/db";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { ThreadItem } from "./thread-item";

interface ThreadListProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  compact?: boolean;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  folders?: Record<string, ChatFolder>;
  onSelect: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  onUpdateTitle: (threadId: string, title: string) => void;
  onMoveThread?: (threadId: string, folderId: string | null) => void;
  onPinThread?: (threadId: string, pinned: boolean) => void;
  onArchiveThread?: (threadId: string, archived: boolean) => void;
}

export function ThreadList({
  threads,
  activeThreadId,
  compact = false,
  locale,
  logger,
  user,
  folders,
  onSelect,
  onDelete,
  onUpdateTitle,
  onMoveThread,
  onPinThread,
  onArchiveThread,
}: ThreadListProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-0.5">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          isActive={thread.id === activeThreadId}
          onSelect={onSelect}
          onDelete={onDelete}
          onUpdateTitle={onUpdateTitle}
          onMoveThread={onMoveThread}
          onPinThread={onPinThread}
          onArchiveThread={onArchiveThread}
          folders={folders}
          compact={compact}
          locale={locale}
          logger={logger}
          user={user}
        />
      ))}
    </Div>
  );
}
