/**
 * Linear Message View Component
 * Renders messages in a linear ChatGPT-style view with branch navigation
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Code, Copy, FileText } from "next-vibe-ui/ui/icons";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React, { useCallback, useMemo } from "react";
import { useState } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { Logo } from "@/app/[locale]/_components/logo";
import {
  chatAnimations,
  chatProse,
  chatShadows,
  chatTransitions,
} from "@/app/[locale]/chat/lib/design-tokens";
import { createMetadataSystemMessage } from "@/app/api/[locale]/agent/ai-stream/message-metadata-generator";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole, ViewMode } from "@/app/api/[locale]/agent/chat/enum";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useSystemPrompt } from "@/app/api/[locale]/agent/chat/hooks/use-system-prompt";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { BranchNavigator } from "../branch-navigator";
import { ErrorMessageBubble } from "../error-message-bubble";
import { GroupedAssistantMessage } from "../grouped-assistant-message";
import { MessageAuthorInfo } from "../message-author";
import { MessageEditor } from "../message-editor";
import { groupMessagesBySequence } from "../message-grouping";
import { ModelCharacterSelectorModal } from "../model-character-selector-modal";
import { UserMessageBubble } from "../user-message-bubble";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

interface LinearMessageViewProps {
  messages: ChatMessage[];
  branchInfo: Record<string, { siblings: ChatMessage[]; currentIndex: number }>;
  locale: CountryLanguage;
  logger: EndpointLogger;
  currentUserId?: string;
  user: JwtPayloadType;
}

export const LinearMessageView = React.memo(function LinearMessageView({
  messages,
  branchInfo,
  locale,
  logger,
  currentUserId,
  user,
}: LinearMessageViewProps): JSX.Element {
  const { t } = simpleT(locale);
  const [copiedSystemPrompt, setCopiedSystemPrompt] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(true);

  // Get callbacks and editor actions from context
  const {
    currentRootFolderId: rootFolderId,
    currentSubFolderId: subFolderId,
    handleDeleteMessage: onDeleteMessage,
    retryMessage: onRetryMessage,
    answerAsAI: onAnswerAsModel,
    handleModelChange: onModelChange,
    setSelectedCharacter: onCharacterChange,
    handleSwitchBranch: onSwitchBranch,
    branchMessage,
    // Editor actions
    editingMessageId,
    retryingMessageId,
    answeringMessageId,
    answerContent,
    startEdit: onStartEdit,
    startRetry: onStartRetry,
    startAnswer: onStartAnswer,
    cancelEditorAction: onCancelAction,
    setAnswerContent: onSetAnswerContent,
    // Collapse state
    collapseState,
    // View mode to check if we should show system messages
    viewMode,
    // Characters and selected character
    characters,
    selectedCharacter,
  } = useChatContext();

  // Get the current character's system prompt (memoized to ensure stable reference)
  const characterPrompt = useMemo(() => {
    const prompt = selectedCharacter
      ? characters[selectedCharacter]?.systemPrompt || ""
      : "";

    return prompt;
  }, [selectedCharacter, characters]);

  // Generate system prompt on client side (same as server)
  const systemPrompt = useSystemPrompt({
    locale,
    rootFolderId,
    subFolderId,
    characterPrompt: characterPrompt,
  });

  // Debug: Log final system prompt
  if (typeof window !== "undefined" && viewMode === ViewMode.DEBUG) {
    logger.debug("Generated system prompt", {
      systemPromptLength: systemPrompt.length,
      systemPromptPreview: systemPrompt.slice(0, 500),
      includesYourRole: systemPrompt.includes("## Your Role"),
      includesFormattingInstructions: systemPrompt.includes(
        "# Formatting Instructions",
      ),
    });
  }

  const handleCopySystemPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(systemPrompt);
      setCopiedSystemPrompt(true);
      setTimeout(() => setCopiedSystemPrompt(false), 2000);
    } catch (error) {
      logger.error("Failed to copy system prompt", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [systemPrompt, logger]);

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

  // Check for root-level branches (multiple root messages)
  const rootBranches = branchInfo["__root__"];
  const hasRootBranches = rootBranches && rootBranches.siblings.length > 1;

  return (
    <>
      {/* Show root-level branch navigator if there are multiple root messages */}
      {hasRootBranches && (
        <Div className="md:flex md:justify-end">
          <Div className="mb-3 md:w-[75%]">
            <BranchNavigator
              currentBranchIndex={rootBranches.currentIndex}
              totalBranches={rootBranches.siblings.length}
              branches={rootBranches.siblings.map((sibling) => ({
                id: sibling.id,
                preview:
                  sibling.content.slice(0, 50) +
                  (sibling.content.length > 50 ? "..." : ""),
              }))}
              onSwitchBranch={(index) =>
                // eslint-disable-next-line i18next/no-literal-string
                onSwitchBranch("__root__", index)
              }
              locale={locale}
            />
          </Div>
        </Div>
      )}

      {/* Show System Prompt in Debug Mode */}
      {viewMode === ViewMode.DEBUG && (
        <Div className={cn(chatAnimations.slideIn, "mb-4")}>
          <Div
            className={cn(
              "rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3",
              "bg-purple-500/10 border border-purple-500/20",
              chatShadows.sm,
              chatTransitions.default,
            )}
          >
            {/* Card Header with Logo */}
            <Div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-500/20">
              <Div className="flex items-center gap-2">
                <Div className="text-sm font-semibold text-purple-400">
                  {t("app.chat.debugView.systemPromptTitle")}
                </Div>
                <Button
                  onClick={handleCopySystemPrompt}
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 hover:bg-purple-500/20"
                >
                  <Copy className="h-4 w-4" />
                  {copiedSystemPrompt && (
                    <Span className="ml-1 text-xs text-purple-400">
                      {t("app.chat.debugView.copied")}
                    </Span>
                  )}
                </Button>
                <Button
                  onClick={() => setShowMarkdown(!showMarkdown)}
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 hover:bg-purple-500/20"
                  title={
                    showMarkdown ? "Show as plain text" : "Show as markdown"
                  }
                >
                  {showMarkdown ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <Code className="h-4 w-4" />
                  )}
                </Button>
              </Div>

              {/* Logo on the right */}
              <Div className="flex items-center">
                <Logo locale={locale} disabled size="h-8" />
              </Div>
            </Div>

            {/* System Prompt Content */}
            {showMarkdown ? (
              <Div className={cn(chatProse.all, "text-sm")}>
                <Markdown content={systemPrompt} />
              </Div>
            ) : (
              <Div className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground/80 font-mono">
                {systemPrompt}
              </Div>
            )}
          </Div>
        </Div>
      )}

      {messages.map((message, index) => {
        const isEditing = editingMessageId === message.id;
        const isRetrying = retryingMessageId === message.id;
        const isAnswering = answeringMessageId === message.id;

        // Check if this message has branches (multiple children)
        const branches = branchInfo[message.id];
        const hasBranches = branches && branches.siblings.length > 1;

        // Get the next message in the path (the child we're following)
        const nextMessage =
          index < messages.length - 1 ? messages[index + 1] : null;

        // Check if this is a continuation message (part of a sequence but not the primary)
        const group = messageToGroupMap.get(message.id);
        const isContinuation = group && group.primary.id !== message.id;

        // Skip rendering continuation messages - they'll be rendered with their primary
        if (isContinuation) {
          return null;
        }

        return (
          <React.Fragment key={message.id}>
            {/* Show Message Metadata in Debug Mode */}
            {viewMode === ViewMode.DEBUG &&
              (message.role === ChatMessageRole.USER ||
                message.role === ChatMessageRole.ASSISTANT) && (
                <Div className={cn(chatAnimations.slideIn, "mb-2")}>
                  <Div
                    className={cn(
                      "rounded-lg px-3 py-2 text-xs font-mono",
                      "bg-blue-500/10 border border-blue-500/20",
                      "text-blue-300",
                      chatShadows.sm,
                    )}
                  >
                    {createMetadataSystemMessage(message, rootFolderId)}
                  </Div>
                </Div>
              )}

            <ErrorBoundary locale={locale}>
              <Div className={cn(chatAnimations.slideIn, "group")}>
                {isEditing ? (
                  <Div className="flex justify-end">
                    <MessageEditor
                      message={message}
                      onBranch={branchMessage}
                      onCancel={onCancelAction}
                      onModelChange={onModelChange}
                      onCharacterChange={onCharacterChange}
                      locale={locale}
                      logger={logger}
                      user={user}
                    />
                  </Div>
                ) : isRetrying ? (
                  <Div className="flex justify-end">
                    <ModelCharacterSelectorModal
                      titleKey="app.chat.linearMessageView.retryModal.title"
                      descriptionKey="app.chat.linearMessageView.retryModal.description"
                      onModelChange={
                        onModelChange ||
                        ((): void => {
                          /* no-op */
                        })
                      }
                      onCharacterChange={
                        onCharacterChange ||
                        ((): void => {
                          /* no-op */
                        })
                      }
                      onConfirm={(): void => {
                        if (onRetryMessage) {
                          void onRetryMessage(message.id);
                        }
                        onCancelAction();
                      }}
                      onCancel={onCancelAction}
                      confirmLabelKey="app.chat.linearMessageView.retryModal.confirmLabel"
                      locale={locale}
                      logger={logger}
                      user={user}
                    />
                  </Div>
                ) : (
                  <>
                    {message.role === "user" && (
                      // First message: on md+ has left margin to align next to sticky logo (same line)
                      // Below md: no margin (logo is above on separate line)
                      <Div className={index === 0 ? "md:ml-18" : undefined}>
                        <UserMessageBubble
                          message={message}
                          locale={locale}
                          logger={logger}
                          onBranch={onStartEdit}
                          onRetry={onStartRetry}
                          onDelete={onDeleteMessage}
                          showAuthor={rootFolderId === "public"}
                          rootFolderId={rootFolderId}
                          currentUserId={currentUserId}
                        />
                      </Div>
                    )}
                    {(message.role === "assistant" ||
                      message.role === "tool") &&
                      group && (
                        <GroupedAssistantMessage
                          group={group}
                          locale={locale}
                          onAnswerAsModel={onStartAnswer}
                          onDelete={onDeleteMessage}
                          showAuthor={true}
                          logger={logger}
                          collapseState={collapseState}
                        />
                      )}
                    {message.role === "error" && (
                      <ErrorMessageBubble message={message} />
                    )}
                    {/* Debug mode: Show system messages inline */}
                    {viewMode === ViewMode.DEBUG &&
                      message.role === ChatMessageRole.SYSTEM && (
                        <Div className="flex items-start gap-3">
                          <Div className="flex-1 max-w-full">
                            <Div className="mb-2">
                              <MessageAuthorInfo
                                authorName={t(
                                  "app.chat.debugView.systemMessage",
                                )}
                                authorId={null}
                                currentUserId={undefined}
                                isAI={true}
                                model={message.model}
                                timestamp={message.createdAt}
                                edited={message.edited}
                                character={null}
                                locale={locale}
                                rootFolderId={rootFolderId}
                                compact
                              />
                            </Div>

                            <Div
                              className={cn(
                                chatProse.all,
                                "pl-2 py-2.5 sm:py-3",
                                "border border-blue-500/30 bg-blue-500/5 rounded-md",
                              )}
                            >
                              <Markdown content={message.content} />
                            </Div>

                            <Div className="mt-1 text-xs text-muted-foreground pl-2">
                              {t("app.chat.debugView.systemMessageHint")}
                            </Div>
                          </Div>
                        </Div>
                      )}
                  </>
                )}
              </Div>
            </ErrorBoundary>

            {/* Show Answer-as-AI dialog below the message */}
            {isAnswering && (
              <Div className="my-3">
                <ModelCharacterSelectorModal
                  titleKey="app.chat.linearMessageView.answerModal.title"
                  descriptionKey="app.chat.linearMessageView.answerModal.description"
                  onModelChange={
                    onModelChange ||
                    ((): void => {
                      /* no-op */
                    })
                  }
                  onCharacterChange={
                    onCharacterChange ||
                    ((): void => {
                      /* no-op */
                    })
                  }
                  showInput={true}
                  inputValue={answerContent}
                  onInputChange={onSetAnswerContent}
                  inputPlaceholderKey="app.chat.linearMessageView.answerModal.inputPlaceholder"
                  onConfirm={async (): Promise<void> => {
                    if (onAnswerAsModel) {
                      await onAnswerAsModel(
                        message.id,
                        answerContent,
                        undefined,
                      );
                    }
                    onCancelAction();
                  }}
                  onCancel={onCancelAction}
                  confirmLabelKey="app.chat.linearMessageView.answerModal.confirmLabel"
                  locale={locale}
                  logger={logger}
                  user={user}
                />
              </Div>
            )}

            {/* Show branch navigator if this message has multiple children */}
            {hasBranches && nextMessage && (
              <Div className="my-3">
                <BranchNavigator
                  currentBranchIndex={branches.currentIndex}
                  totalBranches={branches.siblings.length}
                  branches={branches.siblings.map((sibling) => ({
                    id: sibling.id,
                    preview:
                      sibling.content.slice(0, 50) +
                      (sibling.content.length > 50 ? "..." : ""),
                  }))}
                  onSwitchBranch={(index) => onSwitchBranch(message.id, index)}
                  locale={locale}
                />
              </Div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
});
