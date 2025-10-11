"use client";

import type { JSX } from "react";
import React, { useRef, useState, useEffect } from "react";

import type { ChatThread, ChatMessage, ViewMode } from "../../lib/storage/types";
import type { ModelId } from "../../lib/config/models";
import { ChatMessages } from "../messages/chat-messages";
import { ChatInput } from "../input/chat-input";
import { Logo } from "../../../_components/nav/logo";
import { ViewModeToggle } from "../messages/view-mode-toggle";

interface ChatAreaProps {
  locale: string;
  thread: ChatThread | null;
  messages: ChatMessage[];
  selectedModel: ModelId;
  selectedTone: string;
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
  onSendMessage: (prompt: string) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string) => Promise<void>;
  showBranchIndicators: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export function ChatArea({
  locale,
  thread,
  messages,
  selectedModel,
  selectedTone,
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
  onSendMessage,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  showBranchIndicators,
  viewMode = "linear",
  onViewModeChange,
}: ChatAreaProps): JSX.Element {
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState(120); // Sane default: ~120px

  // Measure input height dynamically
  useEffect(() => {
    if (!inputContainerRef.current) return;

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

  return (
    <div className="flex-1 flex flex-col min-w-0 relative w-full">
      {/* View Mode Toggle - Positioned absolutely at top right (matching TopBar style) */}
      {onViewModeChange && (
        <div className="absolute top-4 right-4 z-50">
          <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
        </div>
      )}

      {/* Logo - Only show in linear view (ChatGPT style) */}
      {viewMode === "linear" && (
        <div className="w-full h-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10">
            <Logo locale={locale} pathName="/chat" className="mt-[50px]" />
          </div>
        </div>
      )}

      {/* Messages Area - Full height, scrollable inside */}
      <div className="flex-1 overflow-hidden">
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
      {thread && (
        <div
          ref={inputContainerRef}
          className="absolute bottom-0 left-0 right-0 z-50"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10">
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
              onToneChange={onToneChange}
              onModelChange={onModelChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

