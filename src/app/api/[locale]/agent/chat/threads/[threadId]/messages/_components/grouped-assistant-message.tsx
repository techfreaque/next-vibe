"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";
import { type JSX, memo, useEffect, useMemo } from "react";
import { useCallback, useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { chatProse } from "@/app/[locale]/chat/lib/design-tokens";
import { useCharacter } from "@/app/api/[locale]/agent/chat/characters/[id]/hooks";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import {
  calculateCreditCost,
  getModelById,
} from "@/app/api/[locale]/agent/models/models";
import {
  processMessageGroupForCopy,
  processMessageGroupForTTS,
} from "@/app/api/[locale]/agent/text-to-speech/content-processing";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { AssistantMessageActions } from "./assistant-message-actions";
import { CompactingMessage } from "./compacting-message";
import { ErrorMessageBubble } from "./error-message-bubble";
import { FileAttachments } from "./file-attachments";
import { LoadingIndicator } from "./loading-indicator";
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

// ============================================================================
// Sub-components for better performance during streaming
// ============================================================================

/**
 * Batch Confirmation Banner - memoized to prevent re-renders
 */
interface BatchConfirmationBannerProps {
  batchDecisions: Map<string, ToolDecision>;
  locale: CountryLanguage;
}

const BatchConfirmationBanner = memo(function BatchConfirmationBanner({
  batchDecisions,
  locale,
}: BatchConfirmationBannerProps): JSX.Element {
  const { t } = simpleT(locale);

  // Calculate counts from decisions
  const pendingCount = [...batchDecisions.values()].filter(
    (d) => d.type === "pending",
  ).length;
  const confirmedCount = [...batchDecisions.values()].filter(
    (d) => d.type === "confirmed",
  ).length;
  const declinedCount = [...batchDecisions.values()].filter(
    (d) => d.type === "declined",
  ).length;

  return (
    <Div className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
      <Div className="flex items-center justify-between">
        <Span className="text-sm font-medium text-amber-600 dark:text-amber-500">
          {t("app.chat.batchToolConfirmation.title")}
        </Span>
        <Div className="flex items-center gap-2 text-xs">
          <Span className="text-green-600 dark:text-green-500">
            ✓ {confirmedCount}
          </Span>
          <Span className="text-destructive">✕ {declinedCount}</Span>
          <Span className="text-muted-foreground">{pendingCount}</Span>
        </Div>
      </Div>
    </Div>
  );
});

/**
 * Tool Message - memoized to prevent re-renders when other messages change
 */
interface ToolMessageProps {
  message: ChatMessage;
  locale: CountryLanguage;
  user: JwtPayloadType;
  primaryId: string;
  decision: ToolDecision | undefined;
  onConfirm?: (formData: FieldValues) => void;
  onCancel?: () => void;
  collapseState?: GroupedAssistantMessageProps["collapseState"];
  logger: EndpointLogger;
}

const ToolMessage = memo(
  function ToolMessage({
    message,
    locale,
    user,
    primaryId,
    decision,
    onConfirm,
    onCancel,
    collapseState,
    logger,
  }: ToolMessageProps): JSX.Element | null {
    if (!message.metadata?.toolCall) {
      return null;
    }

    return (
      <ToolDisplay
        toolCall={message.metadata.toolCall}
        locale={locale}
        user={user}
        threadId={message.threadId}
        messageId={message.id}
        collapseState={collapseState}
        onConfirm={onConfirm}
        onCancel={onCancel}
        parentId={primaryId}
        decision={decision}
        logger={logger}
      />
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for better performance
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.metadata?.toolCall ===
        nextProps.message.metadata?.toolCall &&
      prevProps.decision === nextProps.decision &&
      prevProps.onConfirm === nextProps.onConfirm &&
      prevProps.onCancel === nextProps.onCancel &&
      prevProps.collapseState === nextProps.collapseState
    );
  },
);

/**
 * Assistant Content Message - memoized to prevent re-renders
 */
interface AssistantContentMessageProps {
  message: ChatMessage;
  hasContentAfter: boolean;
  collapseState?: GroupedAssistantMessageProps["collapseState"];
  locale: CountryLanguage;
}

const AssistantContentMessage = memo(
  function AssistantContentMessage({
    message,
    hasContentAfter,
    collapseState,
  }: AssistantContentMessageProps): JSX.Element | null {
    const content = message.content ?? "";
    if (!content.trim()) {
      return null;
    }

    return (
      <Div className="mb-3 last:mb-0">
        <Markdown
          content={content}
          messageId={message.id}
          hasContentAfter={hasContentAfter}
          collapseState={collapseState}
        />
        {/* File Attachments */}
        {message.metadata?.attachments &&
          message.metadata.attachments.length > 0 && (
            <FileAttachments attachments={message.metadata.attachments} />
          )}
      </Div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for better performance
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.message.metadata?.attachments ===
        nextProps.message.metadata?.attachments &&
      prevProps.message.metadata?.isCompacting ===
        nextProps.message.metadata?.isCompacting &&
      prevProps.message.metadata?.compactedMessageCount ===
        nextProps.message.metadata?.compactedMessageCount &&
      prevProps.hasContentAfter === nextProps.hasContentAfter &&
      prevProps.locale === nextProps.locale &&
      prevProps.collapseState === nextProps.collapseState
    );
  },
);

/**
 * Messages List with Tool Confirmation - handles all tool confirmation logic
 */
interface MessagesListProps {
  allMessages: ChatMessage[];
  primaryId: string;
  primaryThreadId: string;
  sequenceId: string | null;
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
  collapseState?: GroupedAssistantMessageProps["collapseState"];
  sendMessage: ReturnType<typeof useChatContext>["sendMessage"];
}

const MessagesList = memo(function MessagesList({
  allMessages,
  primaryId,
  primaryThreadId,
  sequenceId,
  locale,
  user,
  logger,
  collapseState,
  sendMessage,
}: MessagesListProps): JSX.Element {
  // Find tools waiting for confirmation
  const toolsWaitingForConfirmation = useMemo(
    () =>
      allMessages
        .filter(
          (msg) =>
            msg.role === "tool" &&
            msg.metadata?.toolCall?.waitingForConfirmation,
        )
        .map((msg) => ({
          messageId: msg.id,
          toolCall: msg.metadata!.toolCall!,
        })),
    [allMessages],
  );

  const hasToolWaitingForConfirmation = toolsWaitingForConfirmation.length > 0;

  // Confirmation state - used for both single and multiple tools
  const [batchDecisions, setBatchDecisions] = useState<
    Map<string, ToolDecision>
  >(new Map());

  // Track if we've already submitted to prevent double submission
  const hasSubmittedRef = useRef(false);

  // Initialize batch decisions when tools arrive
  useEffect(() => {
    if (toolsWaitingForConfirmation.length > 0 && batchDecisions.size === 0) {
      setBatchDecisions(
        new Map(
          toolsWaitingForConfirmation.map((tool) => [
            tool.messageId,
            { type: "pending" },
          ]),
        ),
      );
    }
  }, [toolsWaitingForConfirmation, batchDecisions.size]);

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

      const allDecided = toolsWaitingForConfirmation.every((tool) => {
        const decision = newDecisions!.get(tool.messageId);
        return decision && decision.type !== "pending";
      });

      if (
        allDecided &&
        hasToolWaitingForConfirmation &&
        !hasSubmittedRef.current
      ) {
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
              updatedArgs:
                decision.type === "confirmed"
                  ? decision.updatedArgs
                  : undefined,
            };
          })
          .filter((conf): conf is NonNullable<typeof conf> => conf !== null);

        sendMessage({
          content: "",
          attachments: [],
          threadId: primaryThreadId,
          parentId: primaryId,
          toolConfirmations,
        });
      }
    },
    [
      hasToolWaitingForConfirmation,
      toolsWaitingForConfirmation,
      sendMessage,
      primaryThreadId,
      primaryId,
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

      const allDecided = toolsWaitingForConfirmation.every((tool) => {
        const decision = newDecisions!.get(tool.messageId);
        return decision && decision.type !== "pending";
      });

      if (
        allDecided &&
        hasToolWaitingForConfirmation &&
        !hasSubmittedRef.current
      ) {
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
              updatedArgs:
                decision.type === "confirmed"
                  ? decision.updatedArgs
                  : undefined,
            };
          })
          .filter((conf): conf is NonNullable<typeof conf> => conf !== null);

        sendMessage({
          content: "",
          attachments: [],
          threadId: primaryThreadId,
          parentId: primaryId,
          toolConfirmations,
        });
      }
    },
    [
      hasToolWaitingForConfirmation,
      toolsWaitingForConfirmation,
      sendMessage,
      primaryThreadId,
      primaryId,
    ],
  );

  // Create stable callback references for tool handlers
  const createConfirmHandler = useCallback(
    (messageId: string): ((formData: FieldValues) => void) => {
      return (formData: FieldValues): void => {
        handleBatchConfirm(messageId, formData);
      };
    },
    [handleBatchConfirm],
  );

  const createCancelHandler = useCallback(
    (messageId: string): (() => void) => {
      return (): void => {
        handleBatchCancel(messageId);
      };
    },
    [handleBatchCancel],
  );

  return (
    <>
      {/* Batch confirmation status banner - only show for multiple tools */}
      {toolsWaitingForConfirmation.length > 1 && (
        <BatchConfirmationBanner
          batchDecisions={batchDecisions}
          locale={locale}
        />
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
            <ToolMessage
              key={message.id}
              message={message}
              locale={locale}
              user={user}
              primaryId={primaryId}
              decision={decision}
              onConfirm={
                hasToolWaitingForConfirmation
                  ? createConfirmHandler(message.id)
                  : undefined
              }
              onCancel={
                hasToolWaitingForConfirmation
                  ? createCancelHandler(message.id)
                  : undefined
              }
              collapseState={collapseState}
              logger={logger}
            />
          );
        }

        if (message.role === "error") {
          return <ErrorMessageBubble key={message.id} message={message} />;
        }

        if (message.role === "assistant") {
          // Check if this is a compacting message
          if (message.metadata?.isCompacting) {
            const isFailed = message.metadata.compactingFailed === true;
            // Derive streaming state from content presence — never rely on metadata.isStreaming
            // which is not persisted to DB (would show stuck loading on refresh).
            const isStreaming = !isFailed && !message.content;
            return (
              <CompactingMessage
                key={message.id}
                content={message.content ?? ""}
                isStreaming={isStreaming}
                isFailed={isFailed}
                compactedMessageCount={message.metadata.compactedMessageCount}
                locale={locale}
              />
            );
          }
          return (
            <AssistantContentMessage
              key={message.id}
              message={message}
              hasContentAfter={hasContentAfter}
              collapseState={collapseState}
              locale={locale}
            />
          );
        }

        return null;
      })}

      {/* Show streaming placeholder when no content yet — skip for compacting groups
          since the compacting card already renders its own spinner */}
      {!allMessages.some((m) => m.metadata?.isCompacting) && (
        <LoadingIndicator sequenceId={sequenceId} />
      )}
    </>
  );
});

/**
 * Message Actions - memoized to prevent re-renders
 * Handles content processing internally to avoid re-renders in parent
 */
interface MessageActionsWrapperProps {
  primaryId: string;
  allMessages: ChatMessage[];
  locale: CountryLanguage;
  onAnswerAsModel?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  logger: EndpointLogger;
  model: ChatMessage["model"];
  promptTokens: number | null;
  completionTokens: number | null;
}

const MessageActionsWrapper = memo(function MessageActionsWrapper({
  primaryId,
  allMessages,
  locale,
  onAnswerAsModel,
  onDelete,
  logger,
  model,
  promptTokens,
  completionTokens,
}: MessageActionsWrapperProps): JSX.Element {
  // Process content for actions - only runs in this component
  const [allContent, setAllContent] = useState<string>("");
  const [contentMarkdown, setContentMarkdown] = useState<string>("");
  const [contentText, setContentText] = useState<string>("");

  useEffect(() => {
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

  // Calculate credit cost - only runs in this component
  const creditCost = useMemo(() => {
    if (!model || !promptTokens || !completionTokens) {
      return null;
    }

    try {
      return calculateCreditCost(
        getModelById(model),
        promptTokens,
        completionTokens,
      );
    } catch (error) {
      logger.error(
        "Error calculating credit cost",
        error instanceof Error ? error : new Error(String(error)),
      );
      return null;
    }
  }, [model, promptTokens, completionTokens, logger]);

  return (
    <AssistantMessageActions
      messageId={primaryId}
      content={allContent}
      contentMarkdown={contentMarkdown}
      contentText={contentText}
      locale={locale}
      onAnswerAsModel={onAnswerAsModel}
      onDelete={onDelete}
      logger={logger}
      promptTokens={promptTokens}
      completionTokens={completionTokens}
      creditCost={creditCost}
    />
  );
});

/**
 * Message Author Header - memoized and handles all author display logic internally
 */
interface MessageAuthorHeaderProps {
  primary: ChatMessage;
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

const MessageAuthorHeader = memo(function MessageAuthorHeader({
  primary,
  locale,
  rootFolderId,
  user,
  logger,
}: MessageAuthorHeaderProps): JSX.Element {
  const { t } = simpleT(locale);

  // Get character for assistant messages
  const character =
    primary.role === "assistant" || primary.role === "user"
      ? primary.character
      : null;

  // Fetch character name from character ID
  const characterHook = useCharacter(character || undefined, user, logger);
  const characterName = characterHook.read?.data?.name ?? null;

  // Get display name for assistant
  const displayName = primary.model
    ? getModelById(primary.model).name
    : t("app.chat.messages.assistant");

  return (
    <Div className="mb-2">
      <MessageAuthorInfo
        authorName={displayName}
        authorId={primary.authorId}
        currentUserId={undefined}
        isAI={primary.isAI}
        model={primary.model}
        timestamp={primary.createdAt}
        edited={primary.edited}
        character={character}
        characterName={characterName}
        locale={locale}
        rootFolderId={rootFolderId}
        compact
      />
    </Div>
  );
});

/**
 * Grouped Assistant Message Component
 * Displays a sequence of AI messages as a single grouped message
 * Shows one header/avatar for the entire sequence
 */
export const GroupedAssistantMessage = memo(function GroupedAssistantMessage({
  group,
  locale,
  onAnswerAsModel,
  onDelete,
  showAuthor = false,
  logger,
  collapseState,
}: GroupedAssistantMessageProps): JSX.Element {
  const {
    currentRootFolderId: rootFolderId,
    user,
    sendMessage,
  } = useChatContext();

  const { primary, continuations } = group;

  const allMessages = useMemo(
    () => [primary, ...continuations],
    [primary, continuations],
  );

  // Calculate group totals by summing all messages in the sequence
  const groupTotals = useMemo(() => {
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;

    for (const msg of allMessages) {
      if (msg.metadata?.promptTokens) {
        totalPromptTokens += msg.metadata.promptTokens;
      }
      if (msg.metadata?.completionTokens) {
        totalCompletionTokens += msg.metadata.completionTokens;
      }
    }

    return {
      promptTokens: totalPromptTokens > 0 ? totalPromptTokens : null,
      completionTokens:
        totalCompletionTokens > 0 ? totalCompletionTokens : null,
    };
  }, [allMessages]);

  return (
    <Div className="flex items-start gap-3">
      <Div className="flex-1 group/message max-w-full">
        {/* Author info - shown once for the entire sequence */}
        {showAuthor && (
          <MessageAuthorHeader
            primary={primary}
            locale={locale}
            rootFolderId={rootFolderId}
            user={user}
            logger={logger}
          />
        )}

        <Div className={cn(chatProse.all, "pl-2 py-2.5 sm:py-3")}>
          <MessagesList
            allMessages={allMessages}
            primaryId={primary.id}
            primaryThreadId={primary.threadId}
            sequenceId={primary.sequenceId}
            locale={locale}
            user={user}
            logger={logger}
            collapseState={collapseState}
            sendMessage={sendMessage}
          />
        </Div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        <Div className="h-10 sm:h-8 flex items-center">
          <MessageActionsWrapper
            primaryId={primary.id}
            allMessages={allMessages}
            locale={locale}
            onAnswerAsModel={onAnswerAsModel}
            onDelete={onDelete}
            logger={logger}
            model={primary.model}
            promptTokens={groupTotals.promptTokens}
            completionTokens={groupTotals.completionTokens}
          />
        </Div>
      </Div>
    </Div>
  );
});
