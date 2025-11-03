/* eslint-disable react-compiler/react-compiler */
"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { AlertDialog } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogAction } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogCancel } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogContent } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogDescription } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogFooter } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogHeader } from "next-vibe-ui//ui/alert-dialog";
import { AlertDialogTitle } from "next-vibe-ui//ui/alert-dialog";
import { Div } from "next-vibe-ui//ui/div";
import type { JSX } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  DEFAULT_FOLDER_IDS,
  isDefaultFolderId,
} from "@/app/api/[locale]/v1/core/agent/chat/config";
import { getModelById } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { authClientRepository } from "@/app/api/[locale]/v1/core/user/auth/repository-client";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { useTranslation } from "@/i18n/core/client";

import { useChatContext } from "../features/chat/context";
import { parseChatUrl } from "../lib/url-parser";
import type { ChatFolder, ChatThread, ModelId } from "../shared/types";
import { ChatArea } from "./layout/chat-area";
import { SidebarWrapper } from "./layout/sidebar-wrapper";
import { TopBar } from "./layout/top-bar";

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
  folders: Record<string, ChatFolder>,
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

  // Subfolder: need to include rootFolderId in URL
  // URL structure: /threads/rootId/subFolderId/new
  const folder = folders[folderId];
  if (folder) {
    return `/${locale}/threads/${folder.rootFolderId}/${folderId}/new`;
  }

  // Fallback if folder not found (shouldn't happen)
  return `/${locale}/threads/private/new`;
};

interface ChatInterfaceProps {
  /** @deprecated Use urlPath instead */
  initialFolderId?: string;
  /** @deprecated Use urlPath instead */
  initialThreadId?: string;
  /** URL path segments from /threads/[...path] route */
  urlPath?: string[];
  user: JwtPayloadType | undefined;
}

export function ChatInterface({
  initialFolderId: deprecatedFolderId,
  initialThreadId: deprecatedThreadId,
  urlPath,
  user,
}: ChatInterfaceProps): JSX.Element {
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
    enabledToolIds,
    setTTSAutoplay,
    setSidebarCollapsed,
    setTheme,
    setViewMode,
    setEnabledToolIds,
  } = chat;

  // Branch indices for linear view - tracks which branch is selected at each level
  // Key: parent message ID, Value: index of selected child
  const [branchIndices, setBranchIndices] = useState<Record<string, number>>(
    {},
  );

  // Track the last message count to detect new messages
  const lastMessageCountRef = useRef<number>(0);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

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

  // Count children of a message (recursively)
  const countMessageChildren = useCallback(
    (messageId: string): number => {
      const children = Object.values(messagesRecord).filter(
        (msg) => msg.parentId === messageId,
      );
      if (children.length === 0) {
        return 0;
      }
      // Count direct children + all descendants
      return children.reduce(
        (total, child) => total + 1 + countMessageChildren(child.id),
        0,
      );
    },
    [messagesRecord],
  );

  // Wrapper for delete message that ALWAYS shows confirmation dialog
  const handleDeleteMessage = useCallback((messageId: string): void => {
    // Always show confirmation dialog for better UX
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  }, []);

  // Confirm delete message with children
  const handleConfirmDelete = useCallback((): void => {
    if (messageToDelete) {
      void deleteMessage(messageToDelete);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  }, [messageToDelete, deleteMessage]);

  // Cancel delete
  const handleCancelDelete = useCallback((): void => {
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
  }, []);

  // Auto-switch to newly created branches
  useEffect(() => {
    const currentMessageCount = activeThreadMessages.length;

    // Only process if we have new messages
    if (currentMessageCount <= lastMessageCountRef.current) {
      lastMessageCountRef.current = currentMessageCount;
      return;
    }

    lastMessageCountRef.current = currentMessageCount;

    // Find the most recently created message (any role)
    const sortedMessages = [...activeThreadMessages].toSorted(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const latestMessage = sortedMessages[0];

    if (!latestMessage?.parentId) {
      return;
    }

    // Find all siblings (messages with the same parent)
    const siblings = activeThreadMessages
      .filter((msg) => msg.parentId === latestMessage.parentId)
      .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (siblings.length <= 1) {
      return; // No branches to switch to
    }

    // Find the index of the latest message among its siblings
    const latestIndex = siblings.findIndex(
      (msg) => msg.id === latestMessage.id,
    );

    if (latestIndex >= 0 && latestMessage.parentId) {
      // Auto-switch to the newly created branch
      setBranchIndices((prev) => ({
        ...prev,
        [latestMessage.parentId!]: latestIndex,
      }));
    }
  }, [activeThreadMessages]);

  const { t, locale, currentCountry } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);
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
  // CRITICAL: This must be the single source of truth for all IDs
  // All other state (activeThreadId, currentRootFolderId, currentSubFolderId) must derive from this
  const { initialRootFolderId, initialSubFolderId, initialThreadId } =
    React.useMemo(() => {
      // If urlPath is provided, parse it
      if (urlPath && urlPath.length > 0) {
        const parsed = parseChatUrl(urlPath);
        logger.debug("Chat: Parsed URL path", {
          urlPath,
          parsed,
        });
        return parsed;
      }

      // Fallback to deprecated props - parse them properly
      if (deprecatedFolderId) {
        const isRoot = isDefaultFolderId(deprecatedFolderId);

        return {
          initialRootFolderId: isRoot
            ? deprecatedFolderId
            : DEFAULT_FOLDER_IDS.PRIVATE,
          initialSubFolderId: isRoot ? null : deprecatedFolderId,
          initialThreadId: deprecatedThreadId,
        };
      }

      return {
        initialRootFolderId: DEFAULT_FOLDER_IDS.PRIVATE,
        initialSubFolderId: null,
        initialThreadId: deprecatedThreadId,
      };
    }, [urlPath, deprecatedFolderId, deprecatedThreadId, logger]);

  // Redirect public users to incognito if they try to access PRIVATE or SHARED folders
  // PUBLIC users can access PUBLIC and INCOGNITO folders
  useEffect(() => {
    // Wait for authentication check to complete
    if (isAuthenticated === null) {
      return;
    }

    // If user is not authenticated and tries to access PRIVATE or SHARED folder, redirect to incognito
    if (
      !isAuthenticated &&
      initialRootFolderId !== DEFAULT_FOLDER_IDS.INCOGNITO &&
      initialRootFolderId !== DEFAULT_FOLDER_IDS.PUBLIC
    ) {
      logger.info(
        "Non-authenticated user attempted to access restricted folder, redirecting to incognito",
        {
          attemptedFolder: initialRootFolderId,
        },
      );
      const url = `/${locale}/threads/${DEFAULT_FOLDER_IDS.INCOGNITO}/new`;
      router.push(url);
    }
  }, [isAuthenticated, initialRootFolderId, locale, router, logger]);

  // Track last synced values to prevent infinite loops
  // Initialize to undefined so first mount always triggers sync
  const lastSyncedThreadIdRef = useRef<string | null | undefined>(undefined);
  const lastSyncedRootFolderIdRef = useRef<string | undefined>(undefined);
  const lastSyncedSubFolderIdRef = useRef<string | null | undefined>(undefined);

  // CRITICAL: Sync activeThreadId with URL - URL is the ONLY source of truth
  // This ensures that when URL changes (via navigation), the active thread updates
  useEffect(() => {
    const urlThreadId =
      initialThreadId && !isNewThread(initialThreadId) ? initialThreadId : null;

    // Compare against the actual initialThreadId (including "new"), not the computed urlThreadId
    // This ensures we detect navigation to "new" page
    if (lastSyncedThreadIdRef.current !== initialThreadId) {
      logger.debug("Chat: Syncing activeThreadId with URL", {
        urlThreadId,
        previousSyncedValue: lastSyncedThreadIdRef.current,
        initialThreadId,
        isNew: initialThreadId ? isNewThread(initialThreadId) : false,
      });
      lastSyncedThreadIdRef.current = initialThreadId;
      setActiveThread(urlThreadId);
    }
  }, [initialThreadId, setActiveThread, logger]);

  // DISABLED: This effect was causing issues with new thread navigation
  // The onThreadCreated callback in sendMessage already handles setting the active thread
  // and navigating to the new thread, so this effect is redundant and causes conflicts
  // Update active thread when new thread is created (without navigation)
  // const prevThreadCountRef = React.useRef(Object.keys(threads).length);
  // const initialLoadCompleteRef = React.useRef(false);
  // useEffect(() => {
  //   const currentThreadCount = Object.keys(threads).length;
  //   const prevThreadCount = prevThreadCountRef.current;

  //   // Mark initial load as complete after first render with threads
  //   if (!initialLoadCompleteRef.current && currentThreadCount > 0) {
  //     initialLoadCompleteRef.current = true;
  //     prevThreadCountRef.current = currentThreadCount;
  //     return;
  //   }

  //   // Only auto-select if:
  //   // 1. Thread count increased (new thread created)
  //   // 2. We're on "new" page
  //   // 3. Initial load is complete (not just loading existing threads from server)
  //   if (
  //     currentThreadCount > prevThreadCount &&
  //     initialThreadId &&
  //     isNewThread(initialThreadId) &&
  //     initialLoadCompleteRef.current
  //   ) {
  //     // Find the newest thread (highest createdAt)
  //     const newestThread = Object.values(threads).reduce<ChatThread | null>(
  //       (newest, thread) =>
  //         !newest || thread.createdAt > newest.createdAt ? thread : newest,
  //       null,
  //     );

  //     if (newestThread) {
  //       logger.debug("Chat", "New thread created, setting active thread", {
  //         threadId: newestThread.id,
  //       });
  //       // Only set active thread, don't navigate away from current page
  //       setActiveThread(newestThread.id);
  //     }
  //   }

  //   prevThreadCountRef.current = currentThreadCount;
  // }, [threads, initialThreadId, setActiveThread, logger]);

  // Handle thread selection with navigation
  const handleSelectThread = useCallback(
    (threadId: string): void => {
      // Build URL with full nested folder path
      const url = buildThreadUrl(locale, threadId, threads);
      router.push(url);

      // CRITICAL: Do NOT manually set active thread here
      // Let the URL sync effect handle it to maintain URL as source of truth
      // The effect will detect the URL change and update the store
    },
    [threads, locale, router],
  );

  // Handle new thread creation with navigation
  const handleCreateThread = useCallback(
    (folderId?: string | null): void => {
      // Navigate to /threads/[folderId]/new
      // Don't create thread yet - will be created on first message
      const url = buildNewThreadUrl(locale, folderId, chat.folders);

      // CRITICAL: Update store IMMEDIATELY before navigation
      // This ensures that if user sends message quickly, it uses correct context

      // Clear active thread so new thread is created instead of branching
      setActiveThread(null);

      // Update folder context based on the folderId
      if (!folderId) {
        // No folder specified, default to private
        setCurrentFolder(DEFAULT_FOLDER_IDS.PRIVATE, null);
      } else if (isDefaultFolderId(folderId)) {
        // Root folder
        setCurrentFolder(folderId, null);
      } else {
        // Subfolder - need to get root folder ID
        const folder = chat.folders[folderId];
        if (folder) {
          setCurrentFolder(folder.rootFolderId, folderId);
        } else {
          // Fallback if folder not found
          setCurrentFolder(DEFAULT_FOLDER_IDS.PRIVATE, null);
        }
      }

      router.push(url);
    },
    [locale, router, chat.folders, setActiveThread, setCurrentFolder],
  );

  // CRITICAL: Sync currentFolder with URL - URL is the source of truth
  // This ensures that when URL changes (via navigation), the folder context updates
  useEffect(() => {
    // Only update if URL changed (not if store changed)
    if (
      lastSyncedRootFolderIdRef.current !== initialRootFolderId ||
      lastSyncedSubFolderIdRef.current !== initialSubFolderId
    ) {
      logger.debug("Chat: Syncing folder context with URL", {
        urlRootFolderId: initialRootFolderId,
        urlSubFolderId: initialSubFolderId,
        previousUrlRootFolderId: lastSyncedRootFolderIdRef.current,
        previousUrlSubFolderId: lastSyncedSubFolderIdRef.current,
      });
      lastSyncedRootFolderIdRef.current = initialRootFolderId;
      lastSyncedSubFolderIdRef.current = initialSubFolderId;
      setCurrentFolder(initialRootFolderId, initialSubFolderId);
    }
  }, [initialRootFolderId, initialSubFolderId, setCurrentFolder, logger]);

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
        await sendMessage(input, (threadId, rootFolderId, subFolderId) => {
          // Navigate to the newly created thread
          logger.debug("Chat", "Navigating to newly created thread", {
            threadId,
            rootFolderId,
            subFolderId,
          });
          // Build URL with proper subfolder path if present
          const url = subFolderId
            ? `/${locale}/threads/${rootFolderId}/${subFolderId}/${threadId}`
            : `/${locale}/threads/${rootFolderId}/${threadId}`;
          router.push(url);
        });
        logger.debug("Chat", "handleSubmit sendMessage completed");
      } else {
        logger.debug("Chat", "handleSubmit blocked");
      }
    },
    [input, isLoading, sendMessage, logger, locale, router],
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

  // Handler for model changes - auto-disable search tool if model doesn't support tools
  const handleModelChange = useCallback(
    (modelId: ModelId) => {
      const model = getModelById(modelId);

      // Auto-remove search tool if the new model doesn't support tools
      const SEARCH_TOOL_ID = "get_v1_core_agent_brave-search";
      if (!model.supportsTools && enabledToolIds.includes(SEARCH_TOOL_ID)) {
        setEnabledToolIds(enabledToolIds.filter((id) => id !== SEARCH_TOOL_ID));
        logger.info("Auto-disabled search tool - model doesn't support tools", {
          modelId,
          modelName: model.name,
        });
      }

      setSelectedModel(modelId);
    },
    [setSelectedModel, enabledToolIds, setEnabledToolIds, logger],
  );

  const handleFillInputWithPrompt = useCallback(
    (prompt: string, personaId: string, modelId?: ModelId) => {
      // Switch to the persona's preferred model if provided
      if (modelId) {
        handleModelChange(modelId);
      }

      // Fill the input with the prompt (does NOT submit)
      setInput(prompt);
      inputRef.current?.focus();
    },
    [setInput, inputRef, handleModelChange],
  );

  const handleScreenshot = useCallback(() => {
    // Screenshot functionality to be implemented
    logger.info("Screenshot requested");
    return Promise.resolve();
  }, [logger]);

  const handleDeleteThread = useCallback(
    async (threadId: string): Promise<void> => {
      logger.debug("Chat: Handling thread deletion", { threadId });

      // Delete the thread
      await deleteThread(threadId);

      // Navigate to the root folder page
      const url = `/${locale}/threads/${currentRootFolderId}`;
      logger.debug("Chat: Navigating after thread deletion", { url });
      router.push(url);
    },
    [deleteThread, logger, locale, currentRootFolderId, router],
  );

  return (
    <>
      <Div className="flex h-dvh overflow-hidden bg-background">
        {/* Top Bar - Menu, Search, Settings */}
        <TopBar
          theme={theme}
          currentCountry={currentCountry}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToggleTheme={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          onToggleTTSAutoplay={() => setTTSAutoplay(!ttsAutoplay)}
          ttsAutoplay={ttsAutoplay}
          onOpenSearch={() => {
            // Search modal implementation pending Phase 2
          }}
          sidebarCollapsed={sidebarCollapsed}
          onNewChat={() => handleCreateThread(null)}
          locale={locale}
          onNavigateToThreads={() => router.push(`/${locale}/threads/private`)}
          messages={messagesRecord}
        />

        {/* Sidebar */}
        <SidebarWrapper
          user={user}
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
          onDeleteThread={handleDeleteThread}
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
          ttsAutoplay={ttsAutoplay}
          input={input}
          isLoading={isLoading}
          inputRef={inputRef}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          onStop={stopGeneration}
          onBranchMessage={branchMessage}
          onDeleteMessage={handleDeleteMessage}
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
          onVoteMessage={
            currentRootFolderId === "incognito" ? undefined : voteMessage
          }
          onModelChange={handleModelChange}
          onPersonaChange={setSelectedPersona}
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
      </Div>

      {/* Search Modal */}
      {/* <SearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        onCreateThread={() => handleCreateThread(null)}
        onSelectThread={handleSelectThread}
        threads={threads}
        locale={locale}
      /> */}

      {/* Delete Message Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("app.admin.common.actions.delete")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("app.chat.confirmations.deleteMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              {t("app.admin.common.actions.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("app.admin.common.actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
