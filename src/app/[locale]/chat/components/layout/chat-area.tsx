"use client";

import { Camera, Loader2 } from "lucide-react";
import type { JSX } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { useTranslation } from "@/i18n/core/client";
import { Button } from "@/packages/next-vibe-ui/web/ui";

import { Logo } from "../../../_components/nav/logo";
import type { ModelId } from "../../lib/config/models";
import type {
  ChatMessage,
  ChatThread,
  ViewMode,
} from "../../lib/storage/types";
import { ChatInput } from "../input/chat-input";
import { ChatMessages } from "../messages/chat-messages";
import { ViewModeToggle } from "../messages/view-mode-toggle";

interface ChatAreaProps {
  locale: CountryLanguage;
  thread: ChatThread | null;
  messages: ChatMessage[];
  selectedModel: ModelId;
  selectedTone: string;
  enableSearch: boolean;
  input: string;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onStop: () => void;
  onEditMessage: (messageId: string, newContent: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => void;
  onSwitchBranch: (messageId: string, branchIndex: number) => void;
  onModelChange: (model: ModelId) => void;
  onToneChange: (tone: string) => void;
  onEnableSearchChange: (enabled: boolean) => void;
  onSendMessage: (prompt: string) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string) => Promise<void>;
  showBranchIndicators: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onScreenshot?: () => Promise<void>;
}

export function ChatArea({
  locale,
  thread,
  messages,
  selectedModel,
  selectedTone,
  enableSearch,
  input,
  isLoading,
  inputRef,
  onInputChange,
  onSubmit,
  onKeyDown,
  onStop,
  onEditMessage,
  onDeleteMessage,
  onSwitchBranch,
  onModelChange,
  onToneChange,
  onEnableSearchChange,
  onSendMessage,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  showBranchIndicators,
  viewMode = "linear",
  onViewModeChange,
  onScreenshot,
}: ChatAreaProps): JSX.Element {
  const { t } = useTranslation("chat");
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState(120); // Sane default: ~120px
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

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Handle screenshot with loading state
  const handleScreenshotClick = useCallback(async () => {
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
            <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
          )}
          {onScreenshot && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleScreenshotClick}
              disabled={isCapturingScreenshot}
              className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-10 w-10 sm:h-9 sm:w-9 disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                isCapturingScreenshot
                  ? t("screenshot.capturing")
                  : t("screenshot.capture")
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
      {viewMode === "linear" && (
        <div className="w-full h-0">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10">
            <Logo locale={locale} pathName="/chat" className="mt-[50px]" />
          </div>
        </div>
      )}

      {/* Messages Area - Full height, scrollable inside */}
      <div className="flex-1 overflow-hidden min-h-0">
        {thread && (
          <ChatMessages
            thread={thread}
            messages={messages}
            selectedModel={selectedModel}
            selectedTone={selectedTone}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            onSwitchBranch={onSwitchBranch}
            onModelChange={onModelChange}
            onToneChange={onToneChange}
            onBranchMessage={onBranchMessage}
            onRetryMessage={onRetryMessage}
            onAnswerAsModel={onAnswerAsModel}
            isLoading={isLoading}
            showBranchIndicators={showBranchIndicators}
            onSendMessage={onSendMessage}
            inputHeight={inputHeight}
            viewMode={viewMode}
            locale={locale}
          />
        )}
      </div>

      {/* Input Area - Positioned absolutely at bottom with max-width */}
      {/* z-20: Above messages, below sidebar on mobile (z-50), below top bar (z-50) */}
      {thread && (
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
              selectedTone={selectedTone}
              selectedModel={selectedModel}
              enableSearch={enableSearch}
              onToneChange={onToneChange}
              onModelChange={onModelChange}
              onEnableSearchChange={onEnableSearchChange}
              locale={locale}
            />
          </div>
        </div>
      )}
    </div>
  );
}
