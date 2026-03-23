/**
 * Flat Message View (4chan-style)
 * Displays messages in a chronological, flat layout with >>references
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import React, { useCallback, useMemo, useState } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";

import { useCollapseState } from "../../hooks/use-collapse-state";
import { groupMessagesBySequence } from "../message-grouping";
import { FlatMessage } from "./flat-message";
import { MessagePreview } from "./preview";
import { UserIdHoverCard } from "./user-id-hover-card";

interface FlatMessageViewProps {
  messages: ChatMessage[];
  locale: CountryLanguage;
  logger: EndpointLogger;
  onMessageClick?: (messageId: string) => void;
  onInsertQuote?: () => void; // Only inserts '>' character
  currentUserId?: string;
  user: JwtPayloadType;
  /** Message operations - passed from parent */
  onBranchMessage?: (
    messageId: string,
    content: string,
    audioInput: { file: File } | undefined,
    attachments: File[] | undefined,
  ) => Promise<void>;
  onRetryMessage?: (
    messageId: string,
    attachments: File[] | undefined,
  ) => Promise<void>;
  onAnswerAsModel?: (
    messageId: string,
    content: string,
    attachments: File[] | undefined,
  ) => Promise<void>;
  onReplyMessage?: (
    parentMessageId: string,
    content: string,
    attachments: File[],
  ) => Promise<void>;
  onVoteMessage?: (messageId: string, vote: 1 | -1 | 0) => Promise<void>;
}

export const FlatMessageView = React.memo(function FlatMessageView({
  messages,
  locale,
  logger,
  onInsertQuote: _onInsertQuote,
  currentUserId,
  user,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onReplyMessage,
  onVoteMessage,
}: FlatMessageViewProps): JSX.Element {
  // Get rootFolderId from navigation store (no context dependency)
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);

  const [hoveredRef, setHoveredRef] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [userIdPosition, setUserIdPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Collapse state management for thinking/tool sections
  const collapseState = useCollapseState();

  // Detect touch device for proper action visibility
  const isTouch = useTouchDevice();

  // Group messages by sequence for proper display (memoized)
  const messageGroups = useMemo(
    () => groupMessagesBySequence(messages),
    [messages],
  );

  // Create a map of message IDs to their groups for quick lookup (memoized)
  const messageToGroupMap = useMemo(() => {
    const map = new Map<string, (typeof messageGroups)[0]>();
    for (const group of messageGroups) {
      map.set(group.primary.id, group);
      for (const continuation of group.continuations) {
        map.set(continuation.id, group);
      }
    }
    return map;
  }, [messageGroups]);

  // Stable callbacks for hover state
  const handleSetHoveredRef = useCallback(
    (ref: string | null, pos: { x: number; y: number } | null) => {
      setHoveredRef(ref);
      setPreviewPosition(pos);
    },
    [],
  );

  const handleSetHoveredUserId = useCallback(
    (userId: string | null, pos: { x: number; y: number } | null) => {
      setHoveredUserId(userId);
      setUserIdPosition(pos);
    },
    [],
  );

  const handlePostClick = useCallback((postId: string): void => {
    const element = document.getElementById(`${postId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    setHoveredUserId(null);
  }, []);

  // Find message by post number for preview
  const previewMessage = hoveredRef
    ? messages.find((m) => m.id.split("-")[0] === hoveredRef)
    : null;

  return (
    <Div className="flex flex-col gap-4">
      {/* Preview Popup */}
      {previewMessage && hoveredRef && previewPosition && (
        <MessagePreview
          message={previewMessage}
          shortId={hoveredRef}
          position={previewPosition}
          locale={locale}
          rootFolderId={rootFolderId}
        />
      )}

      {/* User ID Hover Card */}
      {hoveredUserId && userIdPosition && (
        <UserIdHoverCard
          userId={hoveredUserId}
          messages={messages}
          position={userIdPosition}
          locale={locale}
          onPostClick={handlePostClick}
        />
      )}

      {messages.map((message, index) => {
        // Check if this is a continuation message (part of a sequence but not the primary)
        const group = messageToGroupMap.get(message.id);
        const isContinuation = group && group.primary.id !== message.id;

        // Skip rendering continuation messages - they'll be rendered with their primary
        if (isContinuation) {
          return null;
        }

        return (
          <ErrorBoundary key={message.id} locale={locale}>
            <FlatMessage
              message={message}
              index={index}
              postNum={message.id.split("-")[0]}
              messages={messages}
              messageGroup={group}
              locale={locale}
              logger={logger}
              isTouch={isTouch}
              hoveredRef={hoveredRef}
              onSetHoveredRef={handleSetHoveredRef}
              onSetHoveredUserId={handleSetHoveredUserId}
              onInsertQuote={_onInsertQuote}
              collapseState={collapseState}
              currentUserId={currentUserId}
              user={user}
              onBranchMessage={onBranchMessage}
              onRetryMessage={onRetryMessage}
              onAnswerAsModel={onAnswerAsModel}
              onReplyMessage={onReplyMessage}
              onVoteMessage={onVoteMessage}
            />
          </ErrorBoundary>
        );
      })}
    </Div>
  );
});
