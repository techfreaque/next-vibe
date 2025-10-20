"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";
import React, { useCallback, useEffect, useState } from "react";

import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useTranslation } from "@/i18n/core/client";

import { useChatContext } from "../features/chat/context";
import { useTheme } from "../hooks/use-theme";
import type { ChatThread, ModelId } from "../types";
import { ChatArea } from "./layout/chat-area";
import { SidebarWrapper } from "./layout/sidebar-wrapper";
import { TopBar } from "./layout/top-bar";
import { SearchModal } from "./search-modal";

// Utility functions
const isNewThread = (threadId: string | undefined): boolean =>
  threadId === "new";
const isValidInput = (input: string): boolean => input.trim().length > 0;
const isSubmitKeyPress = (e: React.KeyboardEvent): boolean =>
  e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;

const buildThreadUrl = (
  locale: string,
  threadId: string,
  threads: Record<string, ChatThread>,
): string => {
  const thread = threads[threadId];
  if (!thread) {
    return `/${locale}/threads/${threadId}`;
  }

  const rootId = thread.rootFolderId;
  const subId = thread.folderId;

  if (subId) {
    return `/${locale}/threads/${rootId}/${subId}/${threadId}`;
  }
  return `/${locale}/threads/${rootId}/${threadId}`;
};

const buildNewThreadUrl = (
  locale: string,
  folderId: string | null | undefined,
): string => {
  if (!folderId) {
    return `/${locale}/threads/private/new`;
  }
  return `/${locale}/threads/${folderId}/new`;
};

interface ChatInterfaceProps {
  /** @deprecated Use urlPath instead */
  initialFolderId?: string;
  /** @deprecated Use urlPath instead */
  initialThreadId?: string;
  /** URL path segments from /threads/[...path] route */
  urlPath?: string[];
}

export function ChatInterface({
  initialFolderId: deprecatedFolderId,
  initialThreadId: deprecatedThreadId,
  urlPath,
}: ChatInterfaceProps = {}): JSX.Element {
  const chat = useChatContext();

  // Destructure what we need from the chat context
  const {
    threads,
    messages: messagesRecord,
    activeThread,
    activeThreadMessages,
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
    retryMessage,
    voteMessage,
    stopGeneration,
    deleteThread,
    setActiveThread,
    updateThread,
    updateFolder,
    deleteFolder,
    setCurrentFolder,
    currentRootFolderId,
    currentSubFolderId,
    inputRef,
  } = chat;

  const { locale, currentCountry } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const router = useRouter();

  // UI state (not part of chat API)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"linear" | "flat" | "threaded">(
    "linear",
  );
  const [enableSearch, setEnableSearch] = useState(false);
  const [ttsAutoplay, setTTSAutoplay] = useState(false);

  // Parse URL path to determine root folder, sub folder, and thread
  // URL structure: /threads/[rootId] OR /threads/[rootId]/[subFolderId] OR /threads/[rootId]/[subFolderId]/[threadId]
  const { initialRootFolderId, initialSubFolderId, initialThreadId } =
    React.useMemo(() => {
      // If urlPath is provided, parse it
      if (urlPath && urlPath.length > 0) {
        const rootId = urlPath[0] as DefaultFolderId; // First segment is always root folder
        const lastSegment = urlPath[urlPath.length - 1];

        // Check if last segment is "new" (new thread)
        if (lastSegment === "new") {
          // URL is /rootId/new or /rootId/subfolderId/new
          const subFolderId = urlPath.length >= 3 ? urlPath[1] : null;
          return {
            initialRootFolderId: rootId,
            initialSubFolderId: subFolderId,
            initialThreadId: "new",
          };
        }

        // Check if last segment is a thread by looking it up in threads
        const isThread = Boolean(threads[lastSegment]);

        if (isThread) {
          // Last segment is a thread
          // URL is /rootId/threadId or /rootId/subfolderId/threadId
          const threadId = lastSegment;
          const subFolderId = urlPath.length >= 3 ? urlPath[1] : null;
          return {
            initialRootFolderId: rootId,
            initialSubFolderId: subFolderId,
            initialThreadId: threadId,
          };
        } else {
          // Last segment is a sub folder (or just root if length is 1)
          // URL is /rootId or /rootId/subfolderId
          const subFolderId = urlPath.length >= 2 ? urlPath[1] : null;
          return {
            initialRootFolderId: rootId,
            initialSubFolderId: subFolderId,
            initialThreadId: undefined,
          };
        }
      }

      // Fallback to deprecated props - parse them properly
      if (deprecatedFolderId) {
        const isRoot =
          deprecatedFolderId === "private" ||
          deprecatedFolderId === "shared" ||
          deprecatedFolderId === "public" ||
          deprecatedFolderId === "incognito";

        return {
          initialRootFolderId: isRoot
            ? (deprecatedFolderId as DefaultFolderId)
            : "private",
          initialSubFolderId: isRoot ? null : deprecatedFolderId,
          initialThreadId: deprecatedThreadId,
        };
      }

      return {
        initialRootFolderId: "private" as DefaultFolderId,
        initialSubFolderId: null,
        initialThreadId: deprecatedThreadId,
      };
    }, [urlPath, threads, deprecatedFolderId, deprecatedThreadId]);

  // Handle "new" thread case - don't set active thread, let user start fresh
  useEffect(() => {
    if (initialThreadId && !isNewThread(initialThreadId)) {
      setActiveThread(initialThreadId);
    } else if (isNewThread(initialThreadId)) {
      // Clear active thread for new chat
      setActiveThread(null);
    }
  }, [initialThreadId, setActiveThread]);

  // Handle thread selection with navigation
  const handleSelectThread = useCallback(
    (threadId: string): void => {
      // Build URL with full nested folder path
      const url = buildThreadUrl(locale, threadId, threads);
      router.push(url);

      // Also update the active thread in state
      setActiveThread(threadId);
    },
    [threads, locale, router, setActiveThread],
  );

  // Handle new thread creation with navigation
  const handleCreateThread = useCallback(
    (folderId?: string | null): void => {
      // Navigate to /threads/[folderId]/new
      // Don't create thread yet - will be created on first message
      const url = buildNewThreadUrl(locale, folderId);
      router.push(url);
    },
    [locale, router],
  );

  // Set current folder for draft storage based on URL or active thread
  useEffect(() => {
    // Priority: URL params > active thread's folder
    const rootId =
      initialRootFolderId || activeThread?.rootFolderId || "private";
    const subId = initialSubFolderId || activeThread?.folderId || null;

    setCurrentFolder(rootId, subId);
  }, [
    initialRootFolderId,
    initialSubFolderId,
    activeThread?.rootFolderId,
    activeThread?.folderId,
    setCurrentFolder,
  ]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      logger.debug("Chat", "handleSubmit called", {
        hasInput: Boolean(input),
        isValidInput: isValidInput(input),
        isLoading,
      });

      if (isValidInput(input) && !isLoading) {
        logger.debug("Chat", "handleSubmit calling sendMessage");
        await sendMessage(input);
        logger.debug("Chat", "handleSubmit sendMessage completed");
      } else {
        logger.debug("Chat", "handleSubmit blocked");
      }
    },
    [input, isLoading, sendMessage, logger],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isSubmitKeyPress(e)) {
        e.preventDefault();
        void handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const handleFillInputWithPrompt = useCallback(
    (prompt: string, personaId: string, modelId?: ModelId) => {
      // Switch to the persona's preferred model if provided
      if (modelId) {
        setSelectedModel(modelId);
      }

      // Fill the input with the prompt (does NOT submit)
      setInput(prompt);
      inputRef.current?.focus();
    },
    [setInput, inputRef, setSelectedModel],
  );

  const handleScreenshot = useCallback(() => {
    // Screenshot functionality to be implemented
    logger.info("Screenshot requested");
    return Promise.resolve();
  }, [logger]);

  return (
    <>
      <div className="flex h-[100dvh] overflow-hidden bg-background">
        {/* Top Bar - Menu, Search, Settings */}
        <TopBar
          theme={theme}
          currentCountry={currentCountry}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleTheme={toggleTheme}
          onToggleTTSAutoplay={() => setTTSAutoplay(!ttsAutoplay)}
          ttsAutoplay={ttsAutoplay}
          onOpenSearch={() => setSearchModalOpen(true)}
          sidebarCollapsed={!sidebarOpen}
          onNewChat={() => handleCreateThread(null)}
          locale={locale}
          onNavigateToThreads={() => router.push(`/${locale}/threads/private`)}
          messages={messagesRecord}
        />

        {/* Sidebar */}
        <SidebarWrapper
          threads={threads}
          folders={chat.folders}
          activeThreadId={activeThread?.id || null}
          activeRootFolderId={initialRootFolderId}
          activeSubFolderId={initialSubFolderId}
          collapsed={!sidebarOpen}
          locale={locale}
          logger={logger}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onCreateThread={handleCreateThread}
          onSelectThread={handleSelectThread}
          onDeleteThread={deleteThread}
          onUpdateFolder={updateFolder}
          onDeleteFolder={deleteFolder}
          onUpdateThreadTitle={(threadId, title) => {
            void updateThread(threadId, { title });
          }}
          currentRootFolderId={currentRootFolderId}
          currentSubFolderId={currentSubFolderId}
          chat={chat}
        />

        {/* Main Chat Area */}
        <ChatArea
          locale={locale}
          thread={activeThread}
          messages={activeThreadMessages}
          selectedModel={selectedModel}
          selectedTone={selectedTone}
          enableSearch={enableSearch}
          ttsAutoplay={ttsAutoplay}
          input={input}
          isLoading={isLoading}
          inputRef={inputRef}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          onStop={stopGeneration}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
          onSwitchBranch={() => {}}
          onRetryMessage={retryMessage}
          onVoteMessage={voteMessage}
          onModelChange={setSelectedModel}
          onToneChange={setSelectedTone}
          onEnableSearchChange={setEnableSearch}
          onSendMessage={handleFillInputWithPrompt}
          showBranchIndicators={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onScreenshot={handleScreenshot}
          rootFolderId={initialRootFolderId}
          logger={logger}
          chat={chat}
        />
      </div>

      {/* Search Modal */}
      <SearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        onCreateThread={() => handleCreateThread(null)}
        onSelectThread={handleSelectThread}
        threads={threads}
        locale={locale}
      />
    </>
  );
}
