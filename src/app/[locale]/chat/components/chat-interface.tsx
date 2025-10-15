"use client";

import type { JSX } from "react";
import React, { useCallback, useEffect, useState } from "react";

import { useTranslation } from "@/i18n/core/client";

import { useChatContext } from "../features/chat/context";
import { useTheme } from "../hooks/use-theme";
import { sendSuggestedPrompt } from "../lib/utils/send-prompt";
import { ChatArea } from "./layout/chat-area";
import { SidebarWrapper } from "./layout/sidebar-wrapper";
import { TopBar } from "./layout/top-bar";
import { SearchModal } from "./search-modal";

export function ChatInterface(): JSX.Element {
  const {
    state,
    activeThread,
    messages,
    isLoading,
    input,
    setInput,
    selectedTone,
    selectedModel,
    enableSearch,
    ttsAutoplay,
    setSelectedTone,
    setSelectedModel,
    setEnableSearch,
    setTTSAutoplay,
    sendMessage,
    editMessage,
    deleteMessage,
    switchMessageBranch,
    branchMessage,
    retryMessage,
    answerAsModel,
    stopGeneration,
    createNewThread,
    deleteThread,
    setActiveThread,
    moveThread,
    updateThread,
    createNewFolder,
    updateFolder,
    deleteFolder,
    toggleFolderExpanded,
    uiPreferences,
    toggleSidebar,
    setViewMode,
    searchThreads,
    inputRef,
  } = useChatContext();

  const { locale, currentCountry, t } = useTranslation("chat");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();

  // Auto-create a thread if there's none
  useEffect(() => {
    if (!activeThread) {
      createNewThread();
    }
  }, [activeThread, createNewThread]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        await sendMessage(input);
      }
    },
    [input, isLoading, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const handleSendSuggestedPrompt = useCallback(
    (prompt: string) => {
      sendSuggestedPrompt(prompt, setInput, inputRef);
    },
    [setInput, inputRef],
  );

  const handleScreenshot = useCallback(async () => {
    try {
      const { captureAndDownloadScreenshot } = await import(
        "../lib/utils/screenshot"
      );

      // Generate filename based on thread title
      const filename = activeThread?.title
        ? `chat-${activeThread.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`
        : "chat-conversation";

      await captureAndDownloadScreenshot(filename);
    } catch (error) {
      console.error("[Screenshot]", error);

      // Show user-friendly error with specific translation keys
      const errorMessage = (() => {
        if (!(error instanceof Error)) {
          return t("screenshot.tryAgain");
        }

        // Check for specific error messages and use appropriate translation keys
        if (error.message.includes("Could not find chat messages area")) {
          return t("screenshot.noMessages");
        }

        if (error.message.includes("Storage quota exceeded")) {
          return t("screenshot.quotaExceeded");
        }

        if (error.message.includes("Failed to convert canvas to blob")) {
          return t("screenshot.canvasError");
        }

        // Default: use generic error message
        return t("screenshot.tryAgain");
      })();

      alert(errorMessage);
    }
  }, [activeThread, t]);

  // Get general folder for new threads
  const generalFolder = Object.values(state.folders).find(
    (f) => f.id === "folder-general",
  );

  return (
    <>
      <div className="flex h-[100dvh] overflow-hidden bg-background">
        {/* Top Bar - Menu, Search, Settings */}
        <TopBar
          theme={theme}
          currentCountry={currentCountry}
          onToggleSidebar={toggleSidebar}
          onToggleTheme={toggleTheme}
          onToggleTTSAutoplay={() => setTTSAutoplay(!ttsAutoplay)}
          ttsAutoplay={ttsAutoplay}
          onOpenSearch={() => setSearchModalOpen(true)}
          sidebarCollapsed={uiPreferences.sidebarCollapsed}
          onNewChat={() => createNewThread(generalFolder?.id)}
        />

        {/* Sidebar */}
        <SidebarWrapper
          state={state}
          activeThreadId={state.activeThreadId}
          collapsed={uiPreferences.sidebarCollapsed}
          onToggle={toggleSidebar}
          onCreateThread={createNewThread}
          onSelectThread={setActiveThread}
          onDeleteThread={deleteThread}
          onMoveThread={moveThread}
          onCreateFolder={createNewFolder}
          onUpdateFolder={updateFolder}
          onDeleteFolder={deleteFolder}
          onToggleFolderExpanded={toggleFolderExpanded}
          onUpdateThreadTitle={(threadId, title) => {
            updateThread(threadId, { title, updatedAt: Date.now() });
          }}
          searchThreads={searchThreads}
        />

        {/* Main Chat Area */}
        <ChatArea
          locale={locale}
          thread={activeThread}
          messages={messages}
          selectedModel={selectedModel}
          selectedTone={selectedTone}
          enableSearch={enableSearch}
          input={input}
          isLoading={isLoading}
          inputRef={inputRef}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          onStop={stopGeneration}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
          onSwitchBranch={switchMessageBranch}
          onBranchMessage={branchMessage}
          onRetryMessage={retryMessage}
          onAnswerAsModel={answerAsModel}
          onModelChange={setSelectedModel}
          onToneChange={setSelectedTone}
          onEnableSearchChange={setEnableSearch}
          onSendMessage={handleSendSuggestedPrompt}
          showBranchIndicators={uiPreferences.showBranchIndicators}
          viewMode={uiPreferences.viewMode}
          onViewModeChange={setViewMode}
          onScreenshot={handleScreenshot}
        />
      </div>

      {/* Search Modal */}
      <SearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        onCreateThread={() => createNewThread(generalFolder?.id)}
        onSelectThread={setActiveThread}
        searchThreads={searchThreads}
      />
    </>
  );
}
