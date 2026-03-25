"use client";

import { Audio } from "next-vibe-ui/ui/audio";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Image } from "next-vibe-ui/ui/image";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { Copy } from "next-vibe-ui/ui/icons/Copy";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import {
  type JSX,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FieldValues } from "react-hook-form";

import { chatProse } from "@/app/[locale]/chat/lib/design-tokens";
import type { SendMessageParams } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/send-message";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useSkill } from "@/app/api/[locale]/agent/chat/skills/[id]/hooks";
import {
  calculateCreditCost,
  getModelById,
} from "@/app/api/[locale]/agent/models/models";
import {
  processMessageGroupForCopy,
  processMessageGroupForTTS,
} from "@/app/api/[locale]/agent/text-to-speech/content-processing";
import { type TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CollapseStateStore } from "../hooks/use-collapse-state";
import { scopedTranslation } from "../i18n";
import { AssistantMessageActions } from "./assistant-message-actions";
import { CompactingMessage } from "./compacting-message";
import { useMessageGroupName } from "./embedded-context";
import { ErrorMessageBubble } from "./error-message-bubble";
import { FileAttachments } from "./file-attachments";
import { LoadingIndicator } from "./loading-indicator";
import { MessageAuthorInfo } from "./message-author";
import type { MessageGroup } from "./message-grouping";
import { type ToolDecision, ToolDisplay } from "./tool-display";

interface GroupedAssistantMessageProps {
  group: MessageGroup;
  locale: CountryLanguage;
  onAnswerAsModel: ((messageId: string) => void) | null;
  showAuthor: boolean;
  logger: EndpointLogger;
  /** Hide action buttons (copy, TTS, delete). Used for read-only demos. */
  readOnly: boolean;
  /** Override the platform used for tool definition loading */
  platformOverride: Platform | null;
  /** Collapse state management callbacks */
  collapseState: CollapseStateStore | null;
  /** Root folder ID for author display */
  rootFolderId: DefaultFolderId;
  /** User for rendering */
  user: JwtPayloadType;
  /** Send message callback for tool confirmations (null in read-only mode) */
  sendMessage: ((params: SendMessageParams) => void) | null;
  /** Credit deduction callback (null in read-only mode) */
  deductCredits: ((creditCost: number, feature: string) => void) | null;
  /** TTS autoplay setting */
  ttsAutoplay: boolean;
  /** TTS voice preference */
  ttsVoice: typeof TtsVoiceValue | undefined;
  /** Extra class on root element */
  className?: string;
  /** Vote callback - null when voting is not available */
  onVote: ((messageId: string, vote: 1 | -1 | 0) => Promise<void>) | null;
  userVote: "up" | "down" | null;
  voteScore: number;
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
  const { t } = scopedTranslation.scopedT(locale);

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
          {t("widget.batchToolConfirmation.title")}
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
  decision: ToolDecision | null;
  onConfirm: ((formData: FieldValues) => void) | null;
  onCancel: (() => void) | null;
  collapseState: CollapseStateStore | null;
  logger: EndpointLogger;
  platformOverride: Platform | null;
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
    platformOverride,
  }: ToolMessageProps): JSX.Element | null {
    if (!message.metadata?.toolCall) {
      return null;
    }

    return (
      <ToolDisplay
        toolCall={message.metadata.toolCall}
        locale={locale}
        user={user}
        platformOverride={platformOverride ?? undefined}
        threadId={message.threadId}
        messageId={message.id}
        collapseState={collapseState ?? undefined}
        onConfirm={onConfirm ?? undefined}
        onCancel={onCancel ?? undefined}
        parentId={primaryId}
        decision={decision ?? undefined}
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
  collapseState: CollapseStateStore | null;
  locale: CountryLanguage;
}

/**
 * Copy/Download action buttons for generated media (image or audio).
 */
function MediaActions({
  url,
  type,
  locale,
}: {
  url: string;
  type: "image" | "audio" | "video";
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((): void => {
    if (type === "image") {
      // Copy image bytes to clipboard
      void fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const mimeType = blob.type || "image/png";
          const item = new ClipboardItem({ [mimeType]: blob });
          return navigator.clipboard.write([item]);
        })
        .then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return undefined;
          },
          () => {
            // Fallback to URL copy if ClipboardItem not supported
            void navigator.clipboard.writeText(url).then(
              () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                return undefined;
              },
              () => undefined,
            );
          },
        );
    } else {
      // For audio/video just copy the URL
      void navigator.clipboard.writeText(url).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return undefined;
        },
        () => undefined,
      );
    }
  }, [url, type]);

  const handleDownload = useCallback((): void => {
    const ext = type === "image" ? "jpg" : type === "audio" ? "mp3" : "mp4";
    const filename = `generated-${type}-${Date.now()}.${ext}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [url, type]);

  const copyLabel = copied
    ? t("widget.common.generatedMediaActions.copied")
    : t("widget.common.generatedMediaActions.copy");

  return (
    <Div className="flex items-center gap-1 mt-1.5">
      <Button
        variant="ghost"
        size="unset"
        onClick={handleCopy}
        title={copyLabel}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copyLabel}
      </Button>
      <Button
        variant="ghost"
        size="unset"
        onClick={handleDownload}
        title={t("widget.common.generatedMediaActions.download")}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground"
      >
        <Download className="h-3.5 w-3.5" />
        {t("widget.common.generatedMediaActions.download")}
      </Button>
    </Div>
  );
}

const AssistantContentMessage = memo(
  function AssistantContentMessage({
    message,
    hasContentAfter,
    collapseState,
    locale,
  }: AssistantContentMessageProps): JSX.Element | null {
    const content = message.content ?? "";
    const generatedMedia = message.metadata?.generatedMedia;

    if (!content.trim() && !generatedMedia) {
      return null;
    }

    return (
      <Div className="mb-3 last:mb-0">
        {content.trim() ? (
          <Markdown
            content={content}
            messageId={message.id}
            hasContentAfter={hasContentAfter}
            collapseState={collapseState ?? undefined}
          />
        ) : null}
        {/* Generated Media (image / audio) */}
        {generatedMedia ? (
          generatedMedia.type === "image" && generatedMedia.url ? (
            <Div className="mt-2 max-w-lg">
              <Image
                src={generatedMedia.url}
                alt={generatedMedia.prompt ?? "Generated image"}
                unoptimized
                width={1024}
                height={1024}
                className="rounded-lg w-full h-auto"
              />
              <MediaActions
                url={generatedMedia.url}
                type="image"
                locale={locale}
              />
            </Div>
          ) : generatedMedia.type === "audio" && generatedMedia.url ? (
            <Div className="mt-2 w-full">
              <Audio src={generatedMedia.url} controls className="w-full" />
              <MediaActions
                url={generatedMedia.url}
                type="audio"
                locale={locale}
              />
            </Div>
          ) : null
        ) : null}
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
      prevProps.message.metadata?.generatedMedia ===
        nextProps.message.metadata?.generatedMedia &&
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
  /** True when at least one message in the group has metadata.isStreaming = true */
  isGroupStreaming: boolean;
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
  collapseState: CollapseStateStore | null;
  sendMessage: ((params: SendMessageParams) => void) | null;
  platformOverride: Platform | null;
  rootFolderId: DefaultFolderId;
}

const MessagesList = memo(function MessagesList({
  allMessages,
  primaryId,
  primaryThreadId,
  isGroupStreaming,
  locale,
  user,
  logger,
  collapseState,
  sendMessage,
  platformOverride,
  rootFolderId,
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
          parentId: msg.parentId,
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

  // Initialize/update batch decisions when tools arrive.
  // Re-runs whenever the tool list changes so that tools arriving after the
  // first one (sequential streaming) are also added to the batch map.
  useEffect(() => {
    if (toolsWaitingForConfirmation.length === 0) {
      return;
    }
    const hasNewTools = toolsWaitingForConfirmation.some(
      (tool) => !batchDecisions.has(tool.messageId),
    );
    if (hasNewTools) {
      setBatchDecisions((prev) => {
        const next = new Map(prev);
        for (const tool of toolsWaitingForConfirmation) {
          if (!next.has(tool.messageId)) {
            next.set(tool.messageId, { type: "pending" });
          }
        }
        return next;
      });
    }
  }, [toolsWaitingForConfirmation, batchDecisions]);

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

        // Pass the tool message's parentId as the confirm stream's parent.
        // All approve tools in a batch share the same parentId (children of the
        // same assistant placeholder). Using this ensures the confirm stream
        // always continues from the correct branch - even if a wakeUp revival
        // has added new messages to the thread since the approve was issued.
        // If parentId is null (incognito / root), send-message falls back to leafMessageId.
        const confirmParentId =
          toolsWaitingForConfirmation[0]?.parentId ?? null;
        sendMessage?.({
          content: "",
          attachments: [],
          threadId: primaryThreadId,
          parentId: confirmParentId ?? undefined,
          toolConfirmations,
        });
      }
    },
    [
      hasToolWaitingForConfirmation,
      toolsWaitingForConfirmation,
      sendMessage,
      primaryThreadId,
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

        // Same as handleBatchConfirm: use the tool message's parentId.
        const cancelParentId = toolsWaitingForConfirmation[0]?.parentId ?? null;
        sendMessage?.({
          content: "",
          attachments: [],
          threadId: primaryThreadId,
          parentId: cancelParentId ?? undefined,
          toolConfirmations,
        });
      }
    },
    [
      hasToolWaitingForConfirmation,
      toolsWaitingForConfirmation,
      sendMessage,
      primaryThreadId,
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

  // Index of the first tool waiting for confirmation (for banner placement)
  const firstPendingToolIndex = useMemo(() => {
    return allMessages.findIndex(
      (msg) =>
        msg.role === "tool" && msg.metadata?.toolCall?.waitingForConfirmation,
    );
  }, [allMessages]);

  return (
    <>
      {allMessages.map((message, index) => {
        const hasContentAfter = allMessages
          .slice(index + 1)
          .some((m) => (m.content ?? "").trim().length > 0);

        if (message.role === "tool" && message.metadata?.toolCall) {
          const decision = hasToolWaitingForConfirmation
            ? (batchDecisions.get(message.id) ?? null)
            : null;
          return (
            <Div key={message.id}>
              {/* Batch confirmation status banner - rendered just above the first pending tool */}
              {toolsWaitingForConfirmation.length > 1 &&
                index === firstPendingToolIndex && (
                  <BatchConfirmationBanner
                    batchDecisions={batchDecisions}
                    locale={locale}
                  />
                )}
              <ToolMessage
                message={message}
                locale={locale}
                user={user}
                primaryId={primaryId}
                decision={decision}
                onConfirm={
                  hasToolWaitingForConfirmation
                    ? createConfirmHandler(message.id)
                    : null
                }
                onCancel={
                  hasToolWaitingForConfirmation
                    ? createCancelHandler(message.id)
                    : null
                }
                collapseState={collapseState}
                logger={logger}
                platformOverride={platformOverride}
              />
            </Div>
          );
        }

        if (message.role === "error") {
          return (
            <ErrorMessageBubble
              key={message.id}
              message={message}
              rootFolderId={rootFolderId}
            />
          );
        }

        if (message.role === "assistant") {
          // Check if this is a compacting message
          if (message.metadata?.isCompacting) {
            const isFailed = message.metadata.compactingFailed === true;
            // Use metadata.isStreaming during live session (set by COMPACTING_DELTA/DONE handlers).
            // Fall back to !content for page refresh where metadata.isStreaming is not persisted.
            const isStreaming =
              !isFailed &&
              (message.metadata.isStreaming === true ||
                (message.metadata.isStreaming === undefined &&
                  !message.content));
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

      {/* Show streaming placeholder when no content yet - skip for compacting groups
          since the compacting card already renders its own spinner */}
      {!allMessages.some((m) => m.metadata?.isCompacting) && (
        <LoadingIndicator isStreaming={isGroupStreaming} />
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
  primaryThreadId: string;
  allMessages: ChatMessage[];
  locale: CountryLanguage;
  onAnswerAsModel: ((messageId: string) => void) | null;
  rootFolderId: DefaultFolderId;
  logger: EndpointLogger;
  model: ChatMessage["model"];
  promptTokens: number | null;
  completionTokens: number | null;
  cachedInputTokens: number | null;
  cacheWriteTokens: number | null;
  timeToFirstToken: number | null;
  /** Server-computed credit cost (preferred over client recalculation) */
  serverCreditCost: number | null;
  readOnly: boolean;
  user: JwtPayloadType;
  ttsAutoplay: boolean;
  ttsVoice: typeof TtsVoiceValue | undefined;
  deductCredits: ((creditCost: number, feature: string) => void) | null;
  onVote: ((messageId: string, vote: 1 | -1 | 0) => Promise<void>) | null;
  userVote: "up" | "down" | null;
  voteScore: number;
}

const MessageActionsWrapper = memo(function MessageActionsWrapper({
  primaryId,
  primaryThreadId,
  allMessages,
  locale,
  onAnswerAsModel,
  rootFolderId,
  logger,
  model,
  promptTokens,
  completionTokens,
  cachedInputTokens,
  cacheWriteTokens,
  timeToFirstToken,
  serverCreditCost,
  readOnly,
  user,
  ttsAutoplay,
  ttsVoice,
  deductCredits,
  onVote,
  userVote,
  voteScore,
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

  // Use server-computed credit cost when available (correctly accounts for cache pricing).
  // Fall back to client-side calculation for older persisted messages that pre-date this feature.
  const creditCost = useMemo(() => {
    if (serverCreditCost !== null) {
      return serverCreditCost;
    }
    if (!model || !promptTokens || !completionTokens) {
      return null;
    }
    try {
      return calculateCreditCost(
        getModelById(model),
        promptTokens,
        completionTokens,
        cachedInputTokens ?? 0,
        cacheWriteTokens ?? 0,
      );
    } catch (error) {
      logger.error(
        "Error calculating credit cost",
        error instanceof Error ? error : new Error(String(error)),
      );
      return null;
    }
  }, [
    serverCreditCost,
    model,
    promptTokens,
    completionTokens,
    cachedInputTokens,
    cacheWriteTokens,
    logger,
  ]);

  return (
    <AssistantMessageActions
      messageId={primaryId}
      threadId={primaryThreadId}
      rootFolderId={rootFolderId}
      content={allContent}
      contentMarkdown={contentMarkdown}
      contentText={contentText}
      locale={locale}
      onAnswerAsModel={onAnswerAsModel}
      className={null}
      logger={logger}
      promptTokens={promptTokens}
      completionTokens={completionTokens}
      cachedInputTokens={cachedInputTokens}
      cacheWriteTokens={cacheWriteTokens}
      timeToFirstToken={timeToFirstToken}
      creditCost={creditCost}
      readOnly={readOnly}
      user={user}
      ttsAutoplay={ttsAutoplay}
      ttsVoice={ttsVoice}
      deductCredits={deductCredits}
      onVote={onVote}
      userVote={userVote}
      voteScore={voteScore}
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
  const { t } = scopedTranslation.scopedT(locale);

  // Get character for assistant messages
  const character =
    primary.role === "assistant" || primary.role === "user"
      ? primary.skill
      : null;

  // Fetch character name from character ID - seed from SSR boot data to avoid hydration mismatch
  const { initialSkillData } = useChatBootContext();
  const skillInitialData =
    character && initialSkillData ? initialSkillData : null;
  const characterHook = useSkill(
    character || undefined,
    user,
    logger,
    skillInitialData,
  );
  const characterName = characterHook.read?.data?.name ?? null;

  // Get display name for assistant
  const displayName = primary.model
    ? getModelById(primary.model).name
    : t("widget.messages.assistant");

  return (
    <Div className="mb-2">
      <MessageAuthorInfo
        authorName={displayName}
        authorId={primary.authorId}
        currentUserId={undefined}
        isAI={primary.isAI}
        model={primary.model}
        timestamp={primary.createdAt}
        edited={false}
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
  showAuthor,
  logger,
  readOnly,
  collapseState,
  platformOverride,
  rootFolderId,
  user,
  sendMessage,
  deductCredits,
  ttsAutoplay,
  ttsVoice,
  className: extraClassName,
  onVote,
  userVote,
  voteScore,
}: GroupedAssistantMessageProps): JSX.Element {
  const { primary, continuations } = group;
  const { group: hoverGroup } = useMessageGroupName();

  const allMessages = useMemo(
    () => [primary, ...continuations],
    [primary, continuations],
  );

  // True when any message in the group is still streaming (metadata.isStreaming).
  // Derived from the messages props - no separate store subscription needed.
  const isGroupStreaming = allMessages.some((m) => m.metadata?.isStreaming);

  // Calculate group totals by summing all messages in the sequence
  const groupTotals = useMemo(() => {
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalCachedInputTokens = 0;
    let totalCacheWriteTokens = 0;
    let totalCreditCost = 0;
    let timeToFirstToken: number | null = null;
    let hasAnyTokens = false;
    let hasAnyCreditCost = false;

    for (const msg of allMessages) {
      if (msg.metadata?.promptTokens) {
        totalPromptTokens += msg.metadata.promptTokens;
        hasAnyTokens = true;
      }
      if (msg.metadata?.completionTokens) {
        totalCompletionTokens += msg.metadata.completionTokens;
        hasAnyTokens = true;
      }
      // Only take cachedInputTokens from messages that also have promptTokens.
      // In multi-step tool loops, finish-step messages have promptTokens=null but
      // the final step's cachedInputTokens already covers the full cached context —
      // summing across steps would inflate the cached count beyond the prompt count.
      if (msg.metadata?.cachedInputTokens && msg.metadata.promptTokens) {
        totalCachedInputTokens += msg.metadata.cachedInputTokens;
      }
      // cacheWriteTokens: sum across all steps - each step can write new tokens to cache
      if (msg.metadata?.cacheWriteTokens) {
        totalCacheWriteTokens += msg.metadata.cacheWriteTokens;
      }
      if (msg.metadata?.creditCost !== undefined) {
        totalCreditCost += msg.metadata.creditCost;
        hasAnyCreditCost = true;
      }
      // TTFT is only meaningful for the first message in the sequence
      if (timeToFirstToken === null && msg.metadata?.timeToFirstToken) {
        timeToFirstToken = msg.metadata.timeToFirstToken;
      }
    }

    return {
      promptTokens: hasAnyTokens ? totalPromptTokens : null,
      completionTokens: hasAnyTokens ? totalCompletionTokens : null,
      cachedInputTokens:
        totalCachedInputTokens > 0 ? totalCachedInputTokens : null,
      cacheWriteTokens:
        totalCacheWriteTokens > 0 ? totalCacheWriteTokens : null,
      // Server-computed credit cost (preferred - accounts for cache pricing correctly)
      creditCost: hasAnyCreditCost ? totalCreditCost : null,
      timeToFirstToken,
    };
  }, [allMessages]);

  return (
    <Div className={cn("flex items-start gap-3", extraClassName)}>
      <Div className={cn("flex-1 max-w-full", hoverGroup)}>
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
            isGroupStreaming={isGroupStreaming}
            locale={locale}
            user={user}
            logger={logger}
            collapseState={collapseState}
            sendMessage={sendMessage}
            platformOverride={platformOverride}
            rootFolderId={rootFolderId}
          />
        </Div>

        {/* Actions - Fixed height container to maintain consistent spacing */}
        <Div className="h-10 sm:h-8 flex items-center">
          <MessageActionsWrapper
            primaryId={primary.id}
            primaryThreadId={primary.threadId}
            allMessages={allMessages}
            locale={locale}
            onAnswerAsModel={onAnswerAsModel}
            rootFolderId={rootFolderId}
            logger={logger}
            model={primary.model}
            promptTokens={groupTotals.promptTokens}
            completionTokens={groupTotals.completionTokens}
            cachedInputTokens={groupTotals.cachedInputTokens}
            cacheWriteTokens={groupTotals.cacheWriteTokens}
            timeToFirstToken={groupTotals.timeToFirstToken}
            serverCreditCost={groupTotals.creditCost}
            readOnly={readOnly}
            user={user}
            ttsAutoplay={ttsAutoplay}
            ttsVoice={ttsVoice}
            deductCredits={deductCredits}
            onVote={onVote}
            userVote={userVote}
            voteScore={voteScore}
          />
        </Div>
      </Div>
    </Div>
  );
});
