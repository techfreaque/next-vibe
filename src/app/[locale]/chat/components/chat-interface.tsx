"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";
import React, { useCallback, useEffect, useState } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useTranslation } from "@/i18n/core/client";

import { useChatContext } from "../features/chat/context";
import { useTheme } from "../hooks/use-theme";
import { DEFAULT_FOLDER_IDS } from "../lib/config/constants";
import type { ModelId } from "../lib/config/models";
import { isSubmitKeyPress, isValidInput } from "../lib/utils/keyboard";
import {
  buildNewThreadUrl,
  buildThreadUrl,
  getRootFolderId,
  isNewThread,
} from "../lib/utils/navigation";
import {
  generateScreenshotFilename,
  getScreenshotErrorKey,
} from "../lib/utils/screenshot";
import { fillInputWithPrompt } from "../lib/utils/send-prompt";
import { ChatArea } from "./layout/chat-area";
import { SidebarWrapper } from "./layout/sidebar-wrapper";
import { TopBar } from "./layout/top-bar";
import { SearchModal } from "./search-modal";

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
  const {
    state,
    activeThread,
    messages,
    isLoading,
    input,
    setInput,
    setCurrentFolderId,
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
    voteMessage,
    stopGeneration,
    deleteThread,
    setActiveThread,
    moveThread,
    updateThread,
    createNewFolder,
    updateFolder,
    deleteFolder,
    toggleFolderExpanded,
    reorderFolder,
    moveFolderToParent,
    uiPreferences,
    toggleSidebar,
    setViewMode,
    searchThreads,
    inputRef,
  } = useChatContext();

  const { locale, currentCountry, t } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const router = useRouter();

  // Parse URL path to determine folder and thread
  // URL structure: /threads/[rootId] OR /threads/[rootId]/[lastSubfolderId] OR /threads/[rootId]/[lastSubfolderId]/[threadId]
  const { initialFolderId, initialThreadId } = React.useMemo(() => {
    // If urlPath is provided, parse it
    if (urlPath && urlPath.length > 0) {
      const lastSegment = urlPath[urlPath.length - 1];

      // Check if last segment is "new" (new thread)
      if (lastSegment === "new") {
        // URL is /rootId/new or /rootId/subfolderId/new
        const folderId =
          urlPath.length >= 2 ? urlPath[urlPath.length - 2] : urlPath[0];
        return { initialFolderId: folderId, initialThreadId: "new" };
      }

      // Check if last segment is a thread by looking it up in state
      const isThread = Boolean(state.threads[lastSegment]);

      if (isThread) {
        // Last segment is a thread
        // URL is /rootId/threadId or /rootId/subfolderId/threadId
        const threadId = lastSegment;
        const thread = state.threads[threadId];
        // Use thread's actual folder, or fall back to URL path
        const folderId =
          thread?.folderId ||
          (urlPath.length >= 2 ? urlPath[urlPath.length - 2] : urlPath[0]);
        return { initialFolderId: folderId, initialThreadId: threadId };
      } else {
        // Last segment is a folder
        // URL is /rootId or /rootId/subfolderId
        const folderId = lastSegment;
        return { initialFolderId: folderId, initialThreadId: undefined };
      }
    }

    // Fallback to deprecated props
    return {
      initialFolderId: deprecatedFolderId,
      initialThreadId: deprecatedThreadId,
    };
  }, [urlPath, state.threads, deprecatedFolderId, deprecatedThreadId]);

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
      const url = buildThreadUrl(locale, threadId, state);
      router.push(url);

      // Also update the active thread in state
      setActiveThread(threadId);
    },
    [state, locale, router, setActiveThread],
  );

  // Handle new thread creation with navigation
  const handleCreateThread = useCallback(
    (folderId?: string | null): void => {
      // Navigate to /threads/[folderId]/new
      // Don't create thread yet - will be created on first message
      const url = buildNewThreadUrl(locale, folderId, state);
      router.push(url);
    },
    [state, locale, router],
  );

  // Handle initial folder from URL params
  // Note: Thread handling is done in the earlier useEffect (lines 80-87)
  // We don't auto-create threads anymore - user must send first message
  useEffect(() => {
    if (initialFolderId && !initialThreadId) {
      // If we have a folder ID but no thread ID, this is a "new" route
      // Don't create thread - just clear active thread
      setActiveThread(null);
    }
  }, [initialFolderId, initialThreadId, setActiveThread]);

  // Compute current folder ID directly from URL and active thread
  // Priority: initialFolderId from URL > activeThread's folderId
  // This ensures it's ALWAYS correct, even on first render
  const computedFolderId = React.useMemo(() => {
    if (initialFolderId) {
      return initialFolderId;
    } else if (activeThread?.folderId) {
      return activeThread.folderId;
    } else {
      return null;
    }
  }, [initialFolderId, activeThread?.folderId]);

  // Set current folder ID for draft storage
  // Keep this in sync with computed value
  useEffect(() => {
    setCurrentFolderId(computedFolderId);
  }, [computedFolderId, setCurrentFolderId]);

  // Calculate root folder ID for the current context
  const rootFolderId = React.useMemo(() => {
    const folderId = initialFolderId || activeThread?.folderId;
    return getRootFolderId(state, folderId);
  }, [state, initialFolderId, activeThread?.folderId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      logger.debug("Chat", "handleSubmit called", {
        hasInput: Boolean(input),
        isValidInput: isValidInput(input),
        isLoading,
        computedFolderId,
      });

      if (isValidInput(input) && !isLoading) {
        logger.debug("Chat", "handleSubmit calling sendMessage");
        // Pass the computed folder ID explicitly to ensure it's correct
        const threadId = await sendMessage(input, computedFolderId);

        logger.debug("Chat", "handleSubmit sendMessage returned", { threadId });

        // If we're on a "new" URL and a thread was created, navigate to the actual thread URL
        if (threadId && initialThreadId === "new" && computedFolderId) {
          // Build URL directly from the folder ID we know is correct
          // Don't rely on state.threads[threadId] which might not be updated yet due to React batching
          const rootId = getRootFolderId(state, computedFolderId);
          const url =
            computedFolderId === rootId
              ? `/${locale}/threads/${rootId}/${threadId}`
              : `/${locale}/threads/${rootId}/${computedFolderId}/${threadId}`;
          logger.debug("Chat", "handleSubmit navigating to", { url });
          router.push(url);
        }
      } else {
        logger.debug("Chat", "handleSubmit blocked");
      }
    },
    [
      input,
      isLoading,
      sendMessage,
      initialThreadId,
      locale,
      state,
      router,
      computedFolderId,
      logger,
    ],
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
      fillInputWithPrompt(prompt, setInput, inputRef);
    },
    [setInput, inputRef, setSelectedModel],
  );

  const handleScreenshot = useCallback(async () => {
    try {
      const { captureAndDownloadScreenshot } = await import(
        "../lib/utils/screenshot"
      );

      const filename = generateScreenshotFilename(activeThread?.title);
      await captureAndDownloadScreenshot(filename);
    } catch (error) {
      logger.error("app.chat.screenshot.error", error);

      // Get appropriate error message using utility function
      const errorKey =
        error instanceof Error
          ? getScreenshotErrorKey(error)
          : "app.chat.screenshot.tryAgain";

      alert(t(errorKey));
    }
  }, [activeThread, t, logger]);

  // Get general folder for new threads
  const generalFolder = Object.values(state.folders).find(
    (f) => f.id === DEFAULT_FOLDER_IDS.PRIVATE,
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
          onNewChat={() => handleCreateThread(generalFolder?.id)}
          locale={locale}
          onNavigateToThreads={() => router.push(`/${locale}/threads/private`)}
          messages={messages}
        />

        {/* Sidebar */}
        <SidebarWrapper
          state={state}
          activeThreadId={state.activeThreadId}
          activeFolderId={initialFolderId}
          collapsed={uiPreferences.sidebarCollapsed}
          locale={locale}
          logger={logger}
          onToggle={toggleSidebar}
          onCreateThread={handleCreateThread}
          onSelectThread={handleSelectThread}
          onDeleteThread={deleteThread}
          onMoveThread={moveThread}
          onCreateFolder={createNewFolder}
          onUpdateFolder={updateFolder}
          onDeleteFolder={deleteFolder}
          onToggleFolderExpanded={toggleFolderExpanded}
          onReorderFolder={reorderFolder}
          onMoveFolderToParent={moveFolderToParent}
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
          onSwitchBranch={switchMessageBranch}
          onBranchMessage={branchMessage}
          onRetryMessage={retryMessage}
          onAnswerAsModel={answerAsModel}
          onVoteMessage={voteMessage}
          onModelChange={setSelectedModel}
          onToneChange={setSelectedTone}
          onEnableSearchChange={setEnableSearch}
          onSendMessage={handleFillInputWithPrompt}
          showBranchIndicators={uiPreferences.showBranchIndicators}
          viewMode={uiPreferences.viewMode}
          onViewModeChange={setViewMode}
          onScreenshot={handleScreenshot}
          rootFolderId={rootFolderId}
          logger={logger}
        />
      </div>

      {/* Search Modal */}
      <SearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        onCreateThread={() => handleCreateThread(generalFolder?.id)}
        onSelectThread={handleSelectThread}
        searchThreads={searchThreads}
        locale={locale}
      />
    </>
  );
}
