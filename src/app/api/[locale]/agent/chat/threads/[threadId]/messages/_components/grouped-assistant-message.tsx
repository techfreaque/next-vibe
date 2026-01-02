"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import React, { type JSX } from "react";

import { chatProse } from "@/app/[locale]/chat/lib/design-tokens";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { getModelById } from "@/app/api/[locale]/agent/chat/model-access/models";
import {
  processMessageGroupForCopy,
  processMessageGroupForTTS,
} from "@/app/api/[locale]/agent/text-to-speech/content-processing";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { FileAttachments } from "../../../_components/message-display/file-attachments";
import { AssistantMessageActions } from "./assistant-message-actions";
import { MessageAuthorInfo } from "./message-author";
import type { MessageGroup } from "./message-grouping";
import { ToolDisplay } from "./tool-display";

interface GroupedAssistantMessageProps {
  group: MessageGroup;
  locale: CountryLanguage;
  onAnswerAsModel?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  showAuthor?: boolean;
  logger: EndpointLogger;
  /** Collapse state management callbacks */
  collapseState?: {
    isCollapsed: (
      key: {
        messageId: string;
        sectionType: "thinking" | "tool";
        sectionIndex: number;
      },
      autoCollapsed: boolean,
    ) => boolean;
    toggleCollapse: (
      key: {
        messageId: string;
        sectionType: "thinking" | "tool";
        sectionIndex: number;
      },
      currentState: boolean,
    ) => void;
  };
}

/**
 * Grouped Assistant Message Component
 * Displays a sequence of AI messages as a single grouped message
 * Shows one header/avatar for the entire sequence
 */
export function GroupedAssistantMessage({
  group,
  locale,
  onAnswerAsModel,
  onDelete,
  showAuthor = false,
  logger,
  collapseState,
}: GroupedAssistantMessageProps): JSX.Element {
  // Get rootFolderId from context
  const { currentRootFolderId: rootFolderId, user } = useChatContext();

  const { t } = simpleT(locale);
  const { primary, continuations } = group;

  // Get character for assistant messages
  const character =
    primary.role === "assistant" || primary.role === "user"
      ? primary.character
      : null;

  // Get display name for assistant
  const displayName = primary.model
    ? getModelById(primary.model).name
    : t("app.chat.messages.assistant");

  // Each message is already a separate entity (reasoning, text, tool, error)
  const allMessages = React.useMemo(
    () => [primary, ...continuations],
    [primary, continuations],
  );

  // Check if there's any content
  const hasContent = allMessages.some((msg) => msg.content.trim().length > 0);

  // Check if any tool calls are waiting for confirmation
  const hasToolWaitingForConfirmation = allMessages.some(
    (msg) =>
      msg.role === "tool" && msg.metadata?.toolCall?.waitingForConfirmation,
  );

  // Show streaming placeholder when no content yet AND no tools waiting for confirmation
  const isStreaming = !hasContent && !hasToolWaitingForConfirmation;

  // Get all content for actions - process entire message group for both TTS and copying
  // This includes tool calls and strips <think> tags (both closed and unclosed)
  const [allContent, setAllContent] = React.useState<string>("");
  const [contentMarkdown, setContentMarkdown] = React.useState<string>("");
  const [contentText, setContentText] = React.useState<string>("");

  React.useEffect(() => {
    // Process for TTS (used by speech)
    void processMessageGroupForTTS(allMessages, locale, logger).then(
      setAllContent,
    );

    // Process for copying - markdown format (includes tool calls with formatting)
    void processMessageGroupForCopy(allMessages, locale, true, logger).then(
      setContentMarkdown,
    );

    // Process for copying - plain text format (includes tool calls, strips markdown)
    void processMessageGroupForCopy(allMessages, locale, false, logger).then(
      setContentText,
    );
  }, [allMessages, locale, logger]);

  return (
    <Div className="flex items-start gap-3">
      <Div className="flex-1 group/message max-w-full">
        {/* Author info - shown once for the entire sequence */}
        {showAuthor && (
          <Div className="mb-2">
            <MessageAuthorInfo
              authorName={displayName}
              authorId={primary.authorId}
              currentUserId={undefined} // AI messages don't need current user check
              isAI={primary.isAI}
              model={primary.model}
              timestamp={primary.createdAt}
              edited={primary.edited}
              character={character}
              locale={locale}
              rootFolderId={rootFolderId}
              compact
            />
          </Div>
        )}

        <Div className={cn(chatProse.all, "pl-2 py-2.5 sm:py-3")}>
          {allMessages.map((message, index) => {
            // Check if there's content after this message
            const hasContentAfter = allMessages
              .slice(index + 1)
              .some((m) => m.content.trim().length > 0);

            // TOOL message
            if (message.role === "tool" && message.metadata?.toolCall) {
              return (
                <ToolDisplay
                  key={message.id}
                  toolCall={message.metadata.toolCall}
                  locale={locale}
                  user={user}
                  threadId={message.threadId}
                  messageId={message.id}
                  collapseState={collapseState}
                />
              );
            }

            // ERROR message
            if (message.role === "error") {
              return (
                <Div
                  key={message.id}
                  className="mb-3 last:mb-0 p-3 border border-destructive/60 bg-destructive/10 rounded-md"
                >
                  <Div className="text-destructive font-medium mb-1">
                    {t("app.chat.messages.error")}
                  </Div>
                  <Div className="text-foreground">{message.content}</Div>
                </Div>
              );
            }

            // ASSISTANT message (with inline <think> tags for reasoning)
            if (message.role === "assistant" && message.content.trim()) {
              // NEW ARCHITECTURE: Markdown component handles <think> tags
              return (
                <Div key={message.id} className="mb-3 last:mb-0">
                  <Markdown
                    content={message.content}
                    messageId={message.id}
                    hasContentAfter={hasContentAfter}
                    collapseState={collapseState}
                  />
                  {/* File Attachments */}
                  {message.metadata?.attachments &&
                    message.metadata.attachments.length > 0 && (
                      <FileAttachments
                        attachments={message.metadata.attachments}
                      />
                    )}
                </Div>
              );
            }

            // Skip empty messages
            return null;
          })}

          {/* Show streaming placeholder when no content yet */}
          {isStreaming && (
            <Div className="flex items-center gap-2 text-muted-foreground">
              <Div className="animate-pulse h-2 w-2 bg-primary rounded-full" />
              <Div className="animate-pulse h-2 w-2 bg-primary rounded-full animation-delay-150" />
              <Div className="animate-pulse h-2 w-2 bg-primary rounded-full animation-delay-300" />
            </Div>
          )}
        </Div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        {/* Actions apply to the primary message */}
        <Div className="h-10 sm:h-8 flex items-center">
          <AssistantMessageActions
            messageId={primary.id}
            content={allContent}
            contentMarkdown={contentMarkdown}
            contentText={contentText}
            locale={locale}
            onAnswerAsModel={onAnswerAsModel}
            onDelete={onDelete}
            logger={logger}
          />
        </Div>
      </Div>
    </Div>
  );
}
