"use client";

import type { JSX } from "react";
import React, { useState, useEffect, useCallback } from "react";

import { useChatContext } from "../features/chat/context";
import { SearchModal } from "./search-modal";
import { useTranslation } from "@/i18n/core/client";
import { useTheme } from "../hooks/use-theme";
import { sendSuggestedPrompt } from "../lib/utils/send-prompt";
import { TopBar } from "./layout/top-bar";
import { SidebarWrapper } from "./layout/sidebar-wrapper";
import { ChatArea } from "./layout/chat-area";


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
    setSelectedTone,
    setSelectedModel,
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

  const { locale, currentCountry } = useTranslation();
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
    [input, isLoading, sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleSendSuggestedPrompt = useCallback(
    (prompt: string) => {
      sendSuggestedPrompt(prompt, setInput, inputRef);
    },
    [setInput, inputRef]
  );

  // Get general folder for new threads
  const generalFolder = Object.values(state.folders).find(f => f.id === "folder-general");

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Top Bar - Menu, Search, Settings */}
        <TopBar
          theme={theme}
          currentCountry={currentCountry}
          onToggleSidebar={toggleSidebar}
          onToggleTheme={toggleTheme}
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
          onSendMessage={handleSendSuggestedPrompt}
          showBranchIndicators={uiPreferences.showBranchIndicators}
          viewMode={uiPreferences.viewMode}
          onViewModeChange={setViewMode}
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

