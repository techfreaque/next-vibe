"use client";

import { useRouter } from "next/navigation";
import type { JSX } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import { DEFAULT_FOLDER_IDS } from "@/app/api/[locale]/v1/core/agent/chat/config";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { authClientRepository } from "@/app/api/[locale]/v1/core/user/auth/repository-client";
import { useTranslation } from "@/i18n/core/client";

import { useChatContext } from "../features/chat/context";
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
  // If no folder specified, default to private
  if (!folderId) {
    return `/${locale}/threads/private/new`;
  }

  // Check if folderId is a root folder ID
  const isRootFolder =
    folderId === "private" ||
    folderId === "shared" ||
    folderId === "public" ||
    folderId === "incognito";

  if (isRootFolder) {
    // Root folder: /threads/rootId/new
    return `/${locale}/threads/${folderId}/new`;
  }

  // Subfolder: use the folderId directly (subfolders are accessed via their UUID)
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
    selectedPersona,
    selectedModel,
    setSelectedPersona,
    setSelectedModel,
    sendMessage,
    branchMessage,
    deleteMessage,
    retryMessage,
    answerAsAI,
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
    // UI settings (persisted)
    ttsAutoplay,
    sidebarCollapsed,
    theme,
    viewMode,
    enableSearch,
    setTTSAutoplay,
    setSidebarCollapsed,
    setTheme,
    setViewMode,
    setEnableSearch,
  } = chat;

  // Branch indices for linear view - tracks which branch is selected at each level
  // Key: parent message ID, Value: index of selected child
  const [branchIndices, setBranchIndices] = useState<Record<string, number>>(
    {},
  );

  // Track the last message count to detect new messages
  const lastMessageCountRef = useRef<number>(0);

  // Handler for switching branches in linear view
  const handleSwitchBranch = useCallback(
    (parentMessageId: string, branchIndex: number): void => {
      setBranchIndices((prev) => ({
        ...prev,
        [parentMessageId]: branchIndex,
      }));
    },
    [],
  );

  // Auto-switch to newly created branches
  useEffect(() => {
    const currentMessageCount = activeThreadMessages.length;

    // Only process if we have new messages
    if (currentMessageCount <= lastMessageCountRef.current) {
      lastMessageCountRef.current = currentMessageCount;
      return;
    }

    lastMessageCountRef.current = currentMessageCount;

    // Find the most recently created user message
    const sortedMessages = [...activeThreadMessages].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const latestUserMessage = sortedMessages.find((msg) => msg.role === "user");

    if (!latestUserMessage?.parentId) {
      return;
    }

    // Find all siblings (messages with the same parent)
    const siblings = activeThreadMessages
      .filter((msg) => msg.parentId === latestUserMessage.parentId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (siblings.length <= 1) {
      return; // No branches to switch to
    }

    // Find the index of the latest message among its siblings
    const latestIndex = siblings.findIndex(
      (msg) => msg.id === latestUserMessage.id,
    );

    if (latestIndex >= 0 && latestUserMessage.parentId) {
      // Auto-switch to the newly created branch
      setBranchIndices((prev) => ({
        ...prev,
        [latestUserMessage.parentId!]: latestIndex,
      }));
    }
  }, [activeThreadMessages]);

  const { locale, currentCountry } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = checking
  const router = useRouter();

  // Check if user is authenticated using auth status cookie (client-side only)
  useEffect(() => {
    const authStatusResponse = authClientRepository.hasAuthStatus(logger);
    setIsAuthenticated(
      authStatusResponse.success && authStatusResponse.data === true,
    );
  }, [logger]);

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

        // Check if last segment is a thread by checking UUID format
        // UUIDs are 36 characters with dashes: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            lastSegment,
          );

        if (isUUID) {
          // Last segment is a thread (UUID format)
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
          // IMPORTANT: Check if urlPath[1] is a root folder ID - if so, it's NOT a subfolder
          const secondSegment = urlPath.length >= 2 ? urlPath[1] : null;
          const isSecondSegmentRootFolder =
            secondSegment === "private" ||
            secondSegment === "shared" ||
            secondSegment === "public" ||
            secondSegment === "incognito";

          const subFolderId =
            secondSegment && !isSecondSegmentRootFolder ? secondSegment : null;

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
    }, [urlPath, deprecatedFolderId, deprecatedThreadId]);

  // Redirect public users to incognito mode if they try to access non-incognito folders
  useEffect(() => {
    // Wait for authentication check to complete
    if (isAuthenticated === null) {
      return;
    }

    // If user is not authenticated and tries to access non-incognito folder, redirect to incognito
    if (
      !isAuthenticated &&
      initialRootFolderId !== DEFAULT_FOLDER_IDS.INCOGNITO
    ) {
      logger.info(
        "Non-authenticated user attempted to access non-incognito folder, redirecting to incognito",
        {
          attemptedFolder: initialRootFolderId,
        },
      );
      const url = `/${locale}/threads/${DEFAULT_FOLDER_IDS.INCOGNITO}/new`;
      router.push(url);
    }
  }, [isAuthenticated, initialRootFolderId, locale, router, logger]);

  // Handle "new" thread case - don't set active thread, let user start fresh
  useEffect(() => {
    if (initialThreadId && !isNewThread(initialThreadId)) {
      setActiveThread(initialThreadId);
    } else if (isNewThread(initialThreadId)) {
      // Clear active thread for new chat
      setActiveThread(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialThreadId]);

  // Update active thread when new thread is created (without navigation)
  const prevThreadCountRef = React.useRef(Object.keys(threads).length);
  const initialLoadCompleteRef = React.useRef(false);
  useEffect(() => {
    const currentThreadCount = Object.keys(threads).length;
    const prevThreadCount = prevThreadCountRef.current;

    // Mark initial load as complete after first render with threads
    if (!initialLoadCompleteRef.current && currentThreadCount > 0) {
      initialLoadCompleteRef.current = true;
      prevThreadCountRef.current = currentThreadCount;
      return;
    }

    // Only auto-select if:
    // 1. Thread count increased (new thread created)
    // 2. We're on "new" page
    // 3. Initial load is complete (not just loading existing threads from server)
    if (
      currentThreadCount > prevThreadCount &&
      initialThreadId &&
      isNewThread(initialThreadId) &&
      initialLoadCompleteRef.current
    ) {
      // Find the newest thread (highest createdAt)
      const newestThread = Object.values(threads).reduce(
        (newest, thread) =>
          !newest || thread.createdAt > newest.createdAt ? thread : newest,
        null as ChatThread | null,
      );

      if (newestThread) {
        logger.debug("Chat", "New thread created, setting active thread", {
          threadId: newestThread.id,
        });
        // Only set active thread, don't navigate away from current page
        setActiveThread(newestThread.id);
      }
    }

    prevThreadCountRef.current = currentThreadCount;
  }, [threads, initialThreadId, setActiveThread, logger]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialRootFolderId,
    initialSubFolderId,
    activeThread?.rootFolderId,
    activeThread?.folderId,
    // setCurrentFolder is stable, don't include to prevent infinite loops
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
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          onToggleTTSAutoplay={() => setTTSAutoplay(!ttsAutoplay)}
          ttsAutoplay={ttsAutoplay}
          onOpenSearch={() => setSearchModalOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
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
          collapsed={sidebarCollapsed}
          locale={locale}
          logger={logger}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
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
          selectedPersona={selectedPersona}
          enableSearch={enableSearch}
          ttsAutoplay={ttsAutoplay}
          input={input}
          isLoading={isLoading}
          inputRef={inputRef}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          onStop={stopGeneration}
          onBranchMessage={branchMessage}
          onDeleteMessage={deleteMessage}
          onSwitchBranch={handleSwitchBranch}
          onRetryMessage={retryMessage}
          onAnswerAsModel={async (
            messageId: string,
            content: string,
          ): Promise<void> => {
            // Answer as AI: Generate an AI response to this message
            // Use the content provided by the user (or empty string to let AI generate)
            await answerAsAI(messageId, content);
          }}
          onVoteMessage={currentRootFolderId === "incognito" ? undefined : voteMessage}
          onModelChange={setSelectedModel}
          onPersonaChange={setSelectedPersona}
          onEnableSearchChange={setEnableSearch}
          onSendMessage={handleFillInputWithPrompt}
          showBranchIndicators={true}
          branchIndices={branchIndices}
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
