"use client";

import { Button } from "next-vibe-ui/ui/button";
import { type DivRefObject, Div } from "next-vibe-ui/ui/div";
import { KeyboardAvoidingView } from "next-vibe-ui/ui/keyboard-avoiding-view";
import { Camera } from "next-vibe-ui/ui/icons/Camera";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { useSafeAreaInsets } from "next-vibe-ui/hooks/use-safe-area-insets";
import type { JSX } from "react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  TextareaRefObject,
  TextareaKeyboardEvent,
} from "@/packages/next-vibe-ui/web/ui/textarea";

import { useAIStreamStore } from "@/app/api/[locale]/v1/core/agent/ai-stream/hooks/store";
import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { Logo } from "../../../_components/logo";
import type { ChatContextValue } from "../../features/chat/context";
import { DOM_IDS, LAYOUT } from "../../lib/config/constants";
import type { ChatMessage, ChatThread, ModelId, ViewMode } from "../../types";
import { AIToolsModal } from "../ai-tools-modal";
import { ChatInputV2 } from "../input/chat-input";
import { ChatMessages } from "../messages/chat-messages";
import { SuggestedPrompts } from "../messages/suggested-prompts";
import { ViewModeToggle } from "../messages/view-mode-toggle";
import { PublicFeed } from "../public-feed";
import { envClient } from "@/config/env-client";
import { type TranslationKey } from "@/i18n/core/static-types";

interface ChatAreaProps {
  locale: CountryLanguage;
  thread: ChatThread | null;
  messages: ChatMessage[];
  selectedModel: ModelId;
  selectedPersona: string;
  ttsAutoplay: boolean;
  input: string;
  isLoading: boolean;
  inputRef: React.RefObject<TextareaRefObject | null>;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: TextareaKeyboardEvent) => void;
  onStop: () => void;
  onDeleteMessage: (messageId: string) => void;
  onSwitchBranch: (messageId: string, branchIndex: number) => void;
  onModelChange: (model: ModelId) => void;
  onPersonaChange: (persona: string) => void;
  onSendMessage: (prompt: string, personaId: string, modelId?: ModelId) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string, content: string) => Promise<void>;
  onVoteMessage?: (messageId: string, vote: 1 | -1 | 0) => void;
  showBranchIndicators: boolean;
  branchIndices?: Record<string, number>;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onScreenshot?: () => Promise<void>;
  rootFolderId: DefaultFolderId;
  logger: EndpointLogger;
  chat: ChatContextValue;
  currentUserId?: string;
}

export function ChatArea({
  locale,
  thread,
  messages,
  selectedModel,
  selectedPersona,
  ttsAutoplay,
  input,
  isLoading,
  inputRef,
  onInputChange,
  onSubmit,
  onKeyDown,
  onStop,
  onDeleteMessage,
  onSwitchBranch,
  onModelChange,
  onPersonaChange,
  onSendMessage,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onVoteMessage,
  showBranchIndicators,
  branchIndices = {},
  chat,
  viewMode = "linear",
  onViewModeChange,
  onScreenshot,
  rootFolderId = "private",
  logger,
  currentUserId,
}: ChatAreaProps): JSX.Element {
  const { t } = simpleT(locale);
  const inputContainerRef = useRef<DivRefObject>(null);
  const [inputHeight, setInputHeight] = useState<number>(
    LAYOUT.DEFAULT_INPUT_HEIGHT,
  );
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);

  // Get safe area insets for native (top notch, bottom home indicator)
  const insets = useSafeAreaInsets();

  // Get error state from AI stream store
  const streamError = useAIStreamStore((state) => state.error);
  const _clearError = useAIStreamStore((state) => state.clearError);

  // Translate error message if it's a translation key
  const _translatedError = streamError && t(streamError as TranslationKey);

  // Handle suggested prompt selection - insert into input and change persona/model
  const handleSuggestedPromptSelect = useCallback(
    (prompt: string, personaId: string, modelId?: ModelId): void => {
      // Insert prompt into input
      onInputChange(prompt);

      // Change persona
      onPersonaChange(personaId);

      // Change model if persona has preferred model
      if (modelId) {
        onModelChange(modelId);
      }

      // Focus input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [onInputChange, onPersonaChange, onModelChange, inputRef],
  );
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);

  // Measure input height dynamically
  useEffect(() => {
    if (envClient.platform.isReactNative) {
      // TODO: Handle dynamic input height on native
      return;
    }
    if (!inputContainerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setInputHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(inputContainerRef.current);

    return (): void => {
      resizeObserver.disconnect();
    };
  }, []);

  // Handle screenshot with loading state
  const handleScreenshotClick = useCallback(async (): Promise<void> => {
    if (!onScreenshot || isCapturingScreenshot) {
      return;
    }

    setIsCapturingScreenshot(true);
    try {
      await onScreenshot();
    } finally {
      setIsCapturingScreenshot(false);
    }
  }, [onScreenshot, isCapturingScreenshot]);

  // Compute canPost permission reactively
  // This determines if the user can send messages in the current context
  const canPost = useMemo(() => {
    // If there's a thread, use thread's canPost permission
    if (thread) {
      return thread.canPost ?? true;
    }
    // If no thread, check if user can create threads in current folder
    // Case 1: We're in a subfolder - use server-computed canCreateThread permission
    if (chat.currentSubFolderId) {
      const currentFolder = chat.folders[chat.currentSubFolderId];
      // If folder not loaded yet, optimistically enable input (will be corrected once loaded)
      return currentFolder?.canCreateThread ?? true;
    }
    // Case 2: We're in a root folder (no subfolder)
    // Use server-computed root folder permissions passed as props
    return chat.rootFolderPermissions.canCreateThread;
  }, [
    thread,
    chat.currentSubFolderId,
    chat.folders,
    chat.rootFolderPermissions,
  ]);

  // Compute noPermissionReason reactively
  // This provides a user-friendly message explaining why they can't post
  const noPermissionReason = useMemo(() => {
    if (thread && thread.canPost === false) {
      return t("app.chat.input.noPostPermission");
    }
    if (!thread && chat.currentSubFolderId) {
      const currentFolder = chat.folders[chat.currentSubFolderId];
      // Only show message if folder is loaded and permission is explicitly false
      if (currentFolder && currentFolder.canCreateThread === false) {
        return t("app.chat.input.noCreateThreadPermission");
      }
    }
    // Check root folder permissions (server-computed, passed as props)
    if (
      !thread &&
      !chat.currentSubFolderId &&
      chat.rootFolderPermissions.canCreateThread === false
    ) {
      return t("app.chat.input.noCreateThreadPermissionInRootFolder");
    }
    return undefined;
  }, [
    thread,
    chat.currentSubFolderId,
    chat.folders,
    chat.rootFolderPermissions,
    t,
  ]);

  return (
    <KeyboardAvoidingView
      className="h-screen h-max-screen "
      style={{ flex: 1 }}
      keyboardVerticalOffset={0}
    >
      <Div
        className={
          envClient.platform.isReactNative
            ? "flex-1 flex flex-col min-w-0 relative w-full"
            : "w-full h-screen max-h-screen"
        }
        style={
          envClient.platform.isReactNative
            ? { paddingTop: insets.top + 60 }
            : undefined
        }
      >
        {/* View Mode Toggle & Screenshot - Positioned absolutely at top right (matching TopBar style) */}
        {/* z-40: Above input (z-20), below sidebar on mobile (z-50), below top bar (z-50) */}
        {/* Show when there are messages in thread */}
        {messages.length > 0 && (onViewModeChange || onScreenshot) && (
          <Div
            className="absolute right-4 z-40 flex gap-1"
            style={{
              top: envClient.platform.isReactNative ? insets.top + 16 : 16,
            }}
          >
            {/* Thread view mode toggle (only when there are messages) */}
            {onViewModeChange && (
              <ViewModeToggle
                mode={viewMode}
                onChange={onViewModeChange}
                locale={locale}
              />
            )}

            {/* Screenshot button */}
            {onScreenshot && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleScreenshotClick}
                disabled={isCapturingScreenshot}
                className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  isCapturingScreenshot
                    ? t("app.chat.screenshot.capturing")
                    : t("app.chat.screenshot.capture")
                }
              >
                {isCapturingScreenshot ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </Button>
            )}
          </Div>
        )}

        {/* Logo - Only show in linear view (ChatGPT style) */}
        {viewMode === "linear" && messages.length > 0 && (
          <Div className="w-full h-0">
            <Div className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10 pt-15">
              <Div className="flex bg-background/20 backdrop-blur rounded-lg p-2 shadow-sm border border-border/20 w-fit z-10">
                <Logo locale={locale} disabled size="h-10" />
              </Div>
            </Div>
          </Div>
        )}
        {/* Messages Area - Full height, scrollable inside */}
        <Div className="max-w-screen overflow-hidden h-screen h-max-screen">
          {thread ? (
            <ChatMessages
              thread={thread}
              messages={messages}
              selectedModel={selectedModel}
              selectedPersona={selectedPersona}
              ttsAutoplay={ttsAutoplay}
              onDeleteMessage={onDeleteMessage}
              onSwitchBranch={onSwitchBranch}
              onModelChange={onModelChange}
              onPersonaChange={onPersonaChange}
              onBranchMessage={onBranchMessage}
              onRetryMessage={onRetryMessage}
              onAnswerAsModel={onAnswerAsModel}
              onVoteMessage={onVoteMessage}
              isLoading={isLoading}
              chat={chat}
              showBranchIndicators={showBranchIndicators}
              branchIndices={branchIndices}
              onSendMessage={onSendMessage}
              inputHeight={inputHeight}
              viewMode={viewMode}
              rootFolderId={rootFolderId}
              locale={locale}
              logger={logger}
              currentUserId={currentUserId}
            />
          ) : rootFolderId === "public" && !chat.currentSubFolderId ? (
            // Public folder root (no subfolder) - show feed view
            <PublicFeed chat={chat} locale={locale} />
          ) : (
            // Empty state for new threads - show suggestions (including public subfolders)
            <Div
              className="h-screen h-max-screen overflow-y-auto scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-400/30 hover:scrollbar-thumb-blue-500/50 scrollbar-thumb-rounded-full"
              id={DOM_IDS.MESSAGES_CONTAINER}
            >
              <Div
                className="max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pt-15 flex flex-col gap-5"
                style={
                  envClient.platform.isReactNative
                    ? { paddingBottom: LAYOUT.MESSAGES_BOTTOM_PADDING }
                    : {
                        paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
                      }
                }
              >
                <Div
                  className="flex items-center justify-center"
                  style={{ minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh` }}
                >
                  <SuggestedPrompts
                    onSelectPrompt={handleSuggestedPromptSelect}
                    locale={locale}
                    rootFolderId={rootFolderId}
                  />
                </Div>
              </Div>
            </Div>
          )}
        </Div>

        {!(
          rootFolderId === "public" &&
          !chat.currentSubFolderId &&
          !thread
        ) && (
          <Div
            ref={inputContainerRef}
            className={
              envClient.platform.isReactNative
                ? "w-full z-20"
                : "absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            }
            // style={{ marginTop: `-${inputHeight}px` }}
          >
            <Div
              className={
                envClient.platform.isReactNative
                  ? "max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10"
                  : "max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pointer-events-auto"
              }
              style={
                envClient.platform.isReactNative
                  ? { paddingBottom: insets.bottom || 16 }
                  : undefined
              }
            >
              <ChatInputV2
                inputRef={inputRef}
                value={input}
                onChange={onInputChange}
                onSubmit={onSubmit}
                onKeyDown={onKeyDown}
                isLoading={isLoading}
                onStop={onStop}
                selectedPersona={selectedPersona}
                selectedModel={selectedModel}
                enabledToolIds={chat.enabledToolIds}
                onPersonaChange={onPersonaChange}
                onModelChange={onModelChange}
                onToolsChange={chat.setEnabledToolIds}
                onOpenToolsModal={() => setIsToolsModalOpen(true)}
                locale={locale}
                logger={logger}
                deductCredits={chat.deductCredits}
                canPost={canPost}
                noPermissionReason={noPermissionReason}
              />
            </Div>
          </Div>
        )}

        {/* AI Tools Modal */}
        <AIToolsModal
          open={isToolsModalOpen}
          onOpenChange={setIsToolsModalOpen}
          enabledToolIds={chat.enabledToolIds}
          onToolsChange={chat.setEnabledToolIds}
          locale={locale}
          logger={logger}
        />
      </Div>
    </KeyboardAvoidingView>
  );
}
