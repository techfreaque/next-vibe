"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import React from "react";

import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { ChatThread } from "@/app/api/[locale]/agent/chat/hooks/store";
import { type EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { ThreadItem } from "./thread-item";

interface ThreadListProps {
  threads: ChatThread[];
  compact?: boolean;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function ThreadList({
  threads,
  compact = false,
  locale,
  logger,
}: ThreadListProps): JSX.Element {
  // Get callbacks and state from context
  const chat = useChatContext();
  const {
    activeThreadId,
    handleSelectThread: onSelectThread,
    handleDeleteThread: onDeleteThread,
    updateThread,
  } = chat;

  // Create wrapper callbacks for thread operations
  const onUpdateTitle = React.useCallback(
    (threadId: string, title: string) => {
      void updateThread(threadId, { title });
    },
    [updateThread],
  );

  const onMoveThread = React.useCallback(
    (threadId: string, folderId: string | null) => {
      void updateThread(threadId, { folderId });
    },
    [updateThread],
  );

  const onPinThread = React.useCallback(
    (threadId: string, pinned: boolean) => {
      void updateThread(threadId, { pinned });
    },
    [updateThread],
  );

  const onArchiveThread = React.useCallback(
    (threadId: string, archived: boolean) => {
      void updateThread(threadId, { archived });
    },
    [updateThread],
  );
  return (
    <Div className="flex flex-col gap-0.5">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          isActive={thread.id === activeThreadId}
          onSelect={onSelectThread}
          onDelete={onDeleteThread}
          onUpdateTitle={onUpdateTitle}
          onMoveThread={onMoveThread}
          onPinThread={onPinThread}
          onArchiveThread={onArchiveThread}
          chat={chat}
          compact={compact}
          locale={locale}
          logger={logger}
        />
      ))}
    </Div>
  );
}
