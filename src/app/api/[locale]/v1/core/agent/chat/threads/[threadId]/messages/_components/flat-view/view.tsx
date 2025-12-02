/**
 * Flat Message View (4chan-style)
 * Displays messages in a chronological, flat layout with >>references
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import React, { useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatMessage, ChatThread } from "@/app/api/[locale]/v1/core/agent/chat/db";
import { useChatContext } from "@/app/api/[locale]/v1/core/agent/chat/hooks/context";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { groupMessagesBySequence } from "../message-grouping";
import { useCollapseState } from "../hooks/use-collapse-state";
import { useMessageActions } from "../hooks/use-message-actions";
import { MessagePreview } from "./preview";
import { UserIdHoverCard } from "./user-id-hover-card";
import { FlatMessage } from "./flat-message";
import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";

interface FlatMessageViewProps {
  thread: ChatThread;
  messages: ChatMessage[];
  locale: CountryLanguage;
  logger: EndpointLogger;
  onMessageClick?: (messageId: string) => void;
  onInsertQuote?: () => void; // Only inserts '>' character
  currentUserId?: string;
}

export const FlatMessageView = React.memo(function FlatMessageView({
  messages,
  locale,
  logger,
  onInsertQuote: _onInsertQuote,
  currentUserId,
}: FlatMessageViewProps): JSX.Element {
  // Get rootFolderId from context
  const { currentRootFolderId: rootFolderId } = useChatContext();

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

  // Use message actions hook for edit/retry/answer states
  const messageActions = useMessageActions(logger);

  // Collapse state management for thinking/tool sections
  const collapseState = useCollapseState();

  // Detect touch device for proper action visibility
  const isTouch = useTouchDevice();

  // Access chat context for message grouping and rendering

  // Group messages by sequence for proper display
  const messageGroups = groupMessagesBySequence(messages);

  // Create a map of message IDs to their groups for quick lookup
  const messageToGroupMap = new Map<string, (typeof messageGroups)[0]>();
  for (const group of messageGroups) {
    messageToGroupMap.set(group.primary.id, group);
    for (const continuation of group.continuations) {
      messageToGroupMap.set(continuation.id, group);
    }
  }

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
          onPostClick={(postId): void => {
            const element = document.getElementById(`${postId}`);
            element?.scrollIntoView({ behavior: "smooth", block: "center" });
            setHoveredUserId(null);
          }}
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
              messageActions={messageActions}
              isTouch={isTouch}
              hoveredRef={hoveredRef}
              onSetHoveredRef={(ref, pos) => {
                setHoveredRef(ref);
                setPreviewPosition(pos);
              }}
              onSetHoveredUserId={(userId, pos) => {
                setHoveredUserId(userId);
                setUserIdPosition(pos);
              }}
              onInsertQuote={_onInsertQuote}
              collapseState={collapseState}
              currentUserId={currentUserId}
            />
          </ErrorBoundary>
        );
      })}
    </Div>
  );
});
