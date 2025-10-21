"use client";

import { Camera, Loader2 } from "lucide-react";
import type { JSX } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { Button } from "@/packages/next-vibe-ui/web/ui";

import { Logo } from "../../../_components/nav/logo";
import { DOM_IDS, LAYOUT } from "../../lib/config/constants";
import type { ChatMessage, ChatThread, ModelId, ViewMode } from "../../types";
import { ChatInput } from "../input/chat-input";
import { ChatMessages } from "../messages/chat-messages";
import { SuggestedPrompts } from "../messages/suggested-prompts";
import { ViewModeToggle } from "../messages/view-mode-toggle";

interface ChatAreaProps {
  locale: CountryLanguage;
  thread: ChatThread | null;
  messages: ChatMessage[];
  selectedModel: ModelId;
  selectedPersona: string;
  enableSearch: boolean;
  ttsAutoplay: boolean;
  input: string;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onStop: () => void;
  onDeleteMessage: (messageId: string) => void;
  onSwitchBranch: (messageId: string, branchIndex: number) => void;
  onModelChange: (model: ModelId) => void;
  onPersonaChange: (persona: string) => void;
  onEnableSearchChange: (enabled: boolean) => void;
  onSendMessage: (prompt: string, personaId: string, modelId?: ModelId) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string) => Promise<void>;
  onVoteMessage?: (messageId: string, vote: 1 | -1 | 0) => void;
  showBranchIndicators: boolean;
  branchIndices?: Record<string, number>;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onScreenshot?: () => Promise<void>;
  rootFolderId?: string;
  logger: EndpointLogger;
  chat: UseChatReturn;
}

export function ChatArea({
  locale,
  thread,
  messages,
  selectedModel,
  selectedPersona,
  enableSearch,
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
  onEnableSearchChange,
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
  rootFolderId = "general",
  logger,
}: ChatAreaProps): JSX.Element {
  const { t } = simpleT(locale);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState<number>(
    LAYOUT.DEFAULT_INPUT_HEIGHT,
  );

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

  return (
    <div className="flex-1 flex flex-col min-w-0 relative w-full h-full">
      {/* View Mode Toggle & Screenshot - Positioned absolutely at top right (matching TopBar style) */}
      {/* z-40: Above input (z-20), below sidebar on mobile (z-50), below top bar (z-50) */}
      {/* Only show when there are messages in the thread */}
      {messages.length > 0 && (onViewModeChange || onScreenshot) && (
        <div className="absolute top-4 right-4 z-40 flex gap-1">
          {onViewModeChange && (
            <ViewModeToggle
              mode={viewMode}
              onChange={onViewModeChange}
              locale={locale}
            />
          )}
          {onScreenshot && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleScreenshotClick}
              disabled={isCapturingScreenshot}
              className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-9 w-9 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      )}

      {/* Logo - Only show in linear view (ChatGPT style) */}
      {viewMode === "linear" && messages.length > 0 && (
        <div className="w-full h-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10 pt-15 space-y-5">
            <div className="max-w-[30%] h-[50px] flex bg-background/80 backdrop-blur-xl rounded-lg p-2 shadow-sm border border-border/20">
              <Logo
                locale={locale}
                pathName=""
                className="w-full h-auto"
                linkClassName="my-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Messages Area - Full height, scrollable inside */}
      <div className="flex-1 overflow-hidden min-h-0">
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
          />
        ) : (
          // Empty state for new threads - show suggestions
          <div
            className="h-full overflow-y-auto scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-400/30 hover:scrollbar-thumb-blue-500/50 scrollbar-thumb-rounded-full"
            id={DOM_IDS.MESSAGES_CONTAINER}
          >
            <div
              className="max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pt-15 space-y-5"
              style={{
                paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{ minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh` }}
              >
                <SuggestedPrompts
                  onSelectPrompt={handleSuggestedPromptSelect}
                  locale={locale}
                  rootFolderId={rootFolderId}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Positioned absolutely at bottom with max-width */}
      {/* z-20: Above messages, below sidebar on mobile (z-50), below top bar (z-50) */}
      {/* Always show input, even for new threads */}
      <div
        ref={inputContainerRef}
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
      >
        <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pointer-events-auto">
          <ChatInput
            ref={inputRef}
            value={input}
            onChange={onInputChange}
            onSubmit={onSubmit}
            onKeyDown={onKeyDown}
            isLoading={isLoading}
            onStop={onStop}
            selectedPersona={selectedPersona}
            selectedModel={selectedModel}
            enableSearch={enableSearch}
            onPersonaChange={onPersonaChange}
            onModelChange={onModelChange}
            onEnableSearchChange={onEnableSearchChange}
            locale={locale}
            logger={logger}
          />
        </div>
      </div>
    </div>
  );
}
