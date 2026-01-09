"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";
import { type JSX, useEffect, useMemo } from "react";
import { useCallback, useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { chatProse } from "@/app/[locale]/chat/lib/design-tokens";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { getModelById } from "@/app/api/[locale]/agent/models/models";
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
import { type ToolDecision, ToolDisplay } from "./tool-display";

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
  const { currentRootFolderId: rootFolderId, user, sendMessage } = useChatContext();

  const { t } = simpleT(locale);
  const { primary, continuations } = group;

  // Get character for assistant messages
  const character =
    primary.role === "assistant" || primary.role === "user" ? primary.character : null;

  // Get display name for assistant
  const displayName = primary.model
    ? getModelById(primary.model).name
    : t("app.chat.messages.assistant");

  const allMessages = useMemo(() => [primary, ...continuations], [primary, continuations]);

  const hasContent = allMessages.some((msg) => (msg.content ?? "").trim().length > 0);

  // Find tools waiting for confirmation
  const toolsWaitingForConfirmation = useMemo(
    () =>
      allMessages
        .filter((msg) => msg.role === "tool" && msg.metadata?.toolCall?.waitingForConfirmation)
        .map((msg) => ({
          messageId: msg.id,
          toolCall: msg.metadata!.toolCall!,
        })),
    [allMessages],
  );

  const hasToolWaitingForConfirmation = toolsWaitingForConfirmation.length > 0;

  // Confirmation state - used for both single and multiple tools
  // All tools require explicit user decision before submitting
  const [batchDecisions, setBatchDecisions] = useState<Map<string, ToolDecision>>(new Map());

  // Track if we've already submitted to prevent double submission
  const hasSubmittedRef = useRef(false);

  // Initialize batch decisions when tools arrive (handles streaming case where tools arrive after component mount)
  useEffect(() => {
    if (toolsWaitingForConfirmation.length > 0 && batchDecisions.size === 0) {
      setBatchDecisions(
        new Map(toolsWaitingForConfirmation.map((tool) => [tool.messageId, { type: "pending" }])),
      );
    }
  }, [toolsWaitingForConfirmation, batchDecisions.size]);

  // Counter stats for the batch confirmation banner
  const pendingCount = [...batchDecisions.values()].filter((d) => d.type === "pending").length;
  const confirmedCount = [...batchDecisions.values()].filter((d) => d.type === "confirmed").length;
  const declinedCount = [...batchDecisions.values()].filter((d) => d.type === "declined").length;

  // Show streaming placeholder when no content yet AND no tools waiting for confirmation
  const isStreaming = !hasContent && !hasToolWaitingForConfirmation;

  // Get all content for actions - process entire message group for both TTS and copying
  // This includes tool calls and strips <think> tags (both closed and unclosed)
  const [allContent, setAllContent] = useState<string>("");
  const [contentMarkdown, setContentMarkdown] = useState<string>("");
  const [contentText, setContentText] = useState<string>("");

  useEffect(() => {
    // Process for TTS (used by speech)
    void processMessageGroupForTTS(allMessages, locale, logger).then(setAllContent);

    // Process for copying - markdown format (includes tool calls with formatting)
    void processMessageGroupForCopy(allMessages, locale, true, logger).then(setContentMarkdown);

    // Process for copying - plain text format (includes tool calls, strips markdown)
    void processMessageGroupForCopy(allMessages, locale, false, logger).then(setContentText);
  }, [allMessages, locale, logger]);

  // Batch confirmation handlers
  const handleBatchConfirm = useCallback(
    (messageId: string, formData: FieldValues) => {
      const argsRecord: Record<string, string | number | boolean | null> = {};
      for (const [key, value] of Object.entries(formData)) {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean" ||
          value === null
        ) {
          argsRecord[key] = value;
        }
      }

      let newDecisions: Map<string, ToolDecision>;
      setBatchDecisions((prev) => {
        newDecisions = new Map(prev);
        newDecisions.set(messageId, {
          type: "confirmed",
          updatedArgs: argsRecord,
        });
        return newDecisions;
      });

      // Check if all decisions are made after this update
      // CRITICAL: Must check that EVERY tool has a decision, not just that existing decisions are non-pending
      const allDecided = toolsWaitingForConfirmation.every((tool) => {
        const decision = newDecisions!.get(tool.messageId);
        return decision && decision.type !== "pending";
      });

      if (allDecided && hasToolWaitingForConfirmation && !hasSubmittedRef.current) {
        hasSubmittedRef.current = true;

        const toolConfirmations = toolsWaitingForConfirmation
          .map((tool) => {
            const decision = newDecisions!.get(tool.messageId);
            if (!decision || decision.type === "pending") {
              return null;
            }

            return {
              messageId: tool.messageId,
              confirmed: decision.type === "confirmed",
              updatedArgs: decision.type === "confirmed" ? decision.updatedArgs : undefined,
            };
          })
          .filter((conf): conf is NonNullable<typeof conf> => conf !== null);

        sendMessage({
          content: "",
          attachments: [],
          threadId: primary.threadId,
          parentId: primary.id,
          toolConfirmations,
        });
      }
    },
    [
      hasToolWaitingForConfirmation,
      toolsWaitingForConfirmation,
      sendMessage,
      primary.threadId,
      primary.id,
    ],
  );

  const handleBatchCancel = useCallback(
    (messageId: string) => {
      let newDecisions: Map<string, ToolDecision>;
      setBatchDecisions((prev) => {
        newDecisions = new Map(prev);
        newDecisions.set(messageId, { type: "declined" });
        return newDecisions;
      });

      // Check if all decisions are made after this update
      // CRITICAL: Must check that EVERY tool has a decision, not just that existing decisions are non-pending
      const allDecided = toolsWaitingForConfirmation.every((tool) => {
        const decision = newDecisions!.get(tool.messageId);
        return decision && decision.type !== "pending";
      });

      if (allDecided && hasToolWaitingForConfirmation && !hasSubmittedRef.current) {
        hasSubmittedRef.current = true;

        const toolConfirmations = toolsWaitingForConfirmation
          .map((tool) => {
            const decision = newDecisions!.get(tool.messageId);
            if (!decision || decision.type === "pending") {
              return null;
            }

            return {
              messageId: tool.messageId,
              confirmed: decision.type === "confirmed",
              updatedArgs: decision.type === "confirmed" ? decision.updatedArgs : undefined,
            };
          })
          .filter((conf): conf is NonNullable<typeof conf> => conf !== null);

        sendMessage({
          content: "",
          attachments: [],
          threadId: primary.threadId,
          parentId: primary.id,
          toolConfirmations,
        });
      }
    },
    [
      hasToolWaitingForConfirmation,
      toolsWaitingForConfirmation,
      sendMessage,
      primary.threadId,
      primary.id,
    ],
  );

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
          {/* Batch confirmation status banner - only show for multiple tools */}
          {toolsWaitingForConfirmation.length > 1 && (
            <Div className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
              <Div className="flex items-center justify-between">
                <Span className="text-sm font-medium text-amber-600 dark:text-amber-500">
                  {t("app.chat.batchToolConfirmation.title")}
                </Span>
                <Div className="flex items-center gap-2 text-xs">
                  <Span className="text-green-600 dark:text-green-500">✓ {confirmedCount}</Span>
                  <Span className="text-destructive">✕ {declinedCount}</Span>
                  <Span className="text-muted-foreground">{pendingCount}</Span>
                </Div>
              </Div>
            </Div>
          )}

          {allMessages.map((message, index) => {
            const hasContentAfter = allMessages
              .slice(index + 1)
              .some((m) => (m.content ?? "").trim().length > 0);

            if (message.role === "tool" && message.metadata?.toolCall) {
              const decision = hasToolWaitingForConfirmation
                ? batchDecisions.get(message.id)
                : undefined;
              return (
                <ToolDisplay
                  key={message.id}
                  toolCall={message.metadata.toolCall}
                  locale={locale}
                  user={user}
                  threadId={message.threadId}
                  messageId={message.id}
                  collapseState={collapseState}
                  // Confirmation handlers - used for both single and multiple tools
                  onConfirm={
                    hasToolWaitingForConfirmation
                      ? (formData) => handleBatchConfirm(message.id, formData)
                      : undefined
                  }
                  onCancel={
                    hasToolWaitingForConfirmation ? () => handleBatchCancel(message.id) : undefined
                  }
                  parentId={primary.id}
                  decision={decision}
                  logger={logger}
                />
              );
            }

            if (message.role === "error") {
              return (
                <Div
                  key={message.id}
                  className="mb-3 last:mb-0 p-3 border border-destructive/60 bg-destructive/10 rounded-md"
                >
                  <Div className="text-destructive font-medium mb-1">
                    {t("app.chat.messages.error")}
                  </Div>
                  <Div className="text-foreground">{message.content ?? ""}</Div>
                </Div>
              );
            }

            if (message.role === "assistant" && (message.content ?? "").trim()) {
              return (
                <Div key={message.id} className="mb-3 last:mb-0">
                  <Markdown
                    content={message.content ?? ""}
                    messageId={message.id}
                    hasContentAfter={hasContentAfter}
                    collapseState={collapseState}
                  />
                  {/* File Attachments */}
                  {message.metadata?.attachments && message.metadata.attachments.length > 0 && (
                    <FileAttachments attachments={message.metadata.attachments} />
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
