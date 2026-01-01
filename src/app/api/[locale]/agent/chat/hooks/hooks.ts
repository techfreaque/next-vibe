/**
 * Central Chat Hook - Refactored
 * Combines all chat functionality using modular hooks
 * Production ready, 100% typesafe
 */

"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TextareaKeyboardEvent } from "@/packages/next-vibe-ui/web/ui/textarea";
import { type TextareaRefObject } from "@/packages/next-vibe-ui/web/ui/textarea";

import { type CreditsGetResponseOutput } from "../../../credits/definition";
import { useCredits } from "../../../credits/hooks";
import { useAIStreamStore } from "../../ai-stream/hooks/store";
import { useAIStream } from "../../ai-stream/hooks/use-ai-stream";
import type { CharacterListResponseOutput } from "../characters/definition";
import { useCharactersList } from "../characters/hooks";
import type { DefaultFolderId } from "../config";
import type { ChatFolder, ChatMessage, ChatThread } from "../db";
import { NEW_MESSAGE_ID } from "../enum";
import type { FolderUpdate } from "../folders/hooks/use-operations";
import { useFolderOperations } from "../folders/hooks/use-operations";
import type { IconValue } from "../model-access/icons";
import type { ModelId } from "../model-access/models";
import { useMessageOperations } from "../threads/[threadId]/messages/hooks/use-operations";
import type { ThreadUpdate } from "../threads/hooks/use-operations";
import { useThreadOperations } from "../threads/hooks/use-operations";
import { type ChatSettings, useChatStore } from "./store";
import { useBranchManagement } from "./use-branch-management";
import type { UseCollapseStateReturn } from "./use-collapse-state";
import { useCollapseState } from "./use-collapse-state";
import { useDataLoader } from "./use-data-loader";
import { useFolderHandlers } from "./use-folder-handlers";
import {
  getDraftKey,
  loadDraft,
  loadDraftAttachments,
  saveDraft as saveDraftToStorage,
  saveDraftAttachments,
} from "./use-input-autosave";
import { useInputHandlers } from "./use-input-handlers";
import { useMessageActions } from "./use-message-actions";
import { useMessageActions as useMessageEditorActions } from "./use-message-editor-actions";
import { useMessageLoader } from "./use-message-loader";
import { useNavigation } from "./use-navigation";
import { useSettings } from "./use-settings";
import { useSidebarCollapsed } from "./use-sidebar-collapsed";
import { useStreamSync } from "./use-stream-sync";
import { useThreadNavigation } from "./use-thread-navigation";
import { useUIState } from "./use-ui-state";
/**
 * Return type for useChat hook
 */
export interface UseChatReturn {
  // State
  threads: Record<string, ChatThread>;
  messages: Record<string, ChatMessage>;
  folders: Record<string, ChatFolder>;
  rootFolderPermissions: RootFolderPermissions; // Server-computed permissions for current root folder
  characters: Record<
    string,
    {
      id: string;
      name: string;
      icon: string;
      systemPrompt: string;
      voice?: typeof TtsVoiceValue;
    }
  >;
  activeThread: ChatThread | null;
  activeThreadMessages: ChatMessage[];
  isLoading: boolean;
  isDataLoaded: boolean;
  isStreaming: boolean;

  // Current context (passed as props from URL, not from store)
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;

  // Input
  input: string;
  setInput: (input: string) => void;
  attachments: File[];
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;

  // Settings
  selectedCharacter: string;
  selectedModel: ModelId;
  temperature: number;
  maxTokens: number;
  ttsAutoplay: boolean;
  ttsVoice: typeof TtsVoiceValue;
  sidebarCollapsed: boolean;
  viewMode: ChatSettings["viewMode"];
  enabledToolIds: string[];
  setSelectedCharacter: (character: string) => void;
  setSelectedModel: (model: ModelId) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setTTSAutoplay: (autoplay: boolean) => void;
  setTTSVoice: (voice: typeof TtsVoiceValue) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setViewMode: (mode: ChatSettings["viewMode"]) => void;
  setEnabledToolIds: (toolIds: string[]) => void;

  // Credits
  initialCredits: CreditsGetResponseOutput;
  deductCredits: (creditCost: number, feature: string) => void;
  refetchCredits: () => void;

  // Message operations
  sendMessage: (
    params: {
      content: string;
      attachments: File[];
      threadId?: string;
      parentId?: string;
      toolConfirmation?: {
        messageId: string;
        confirmed: boolean;
        updatedArgs?: Record<string, string | number | boolean | null>;
      };
      /** Audio input for voice-to-voice mode - bypasses text content */
      audioInput?: { file: File };
    },
    onThreadCreated?: (
      threadId: string,
      rootFolderId: DefaultFolderId,
      subFolderId: string | null,
    ) => void,
  ) => Promise<void>;
  retryMessage: (
    messageId: string,
    attachments: File[] | undefined,
  ) => Promise<void>;
  branchMessage: (
    messageId: string,
    newContent: string,
    audioInput: { file: File } | undefined,
    attachments: File[] | undefined,
  ) => Promise<void>;
  answerAsAI: (
    messageId: string,
    content: string,
    attachments: File[] | undefined,
  ) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  voteMessage: (messageId: string, vote: 1 | -1 | 0) => Promise<void>;
  stopGeneration: () => void;

  // Thread operations
  deleteThread: (threadId: string) => Promise<void>;
  updateThread: (threadId: string, updates: ThreadUpdate) => Promise<void>;

  // Folder operations
  createFolder: (
    name: string,
    rootFolderId: DefaultFolderId,
    parentId: string | null,
    icon?: IconValue,
  ) => Promise<string>;
  updateFolder: (folderId: string, updates: FolderUpdate) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;

  // Folder handlers (UI operations)
  handleReorderFolder: (folderId: string, direction: "up" | "down") => void;
  handleMoveFolderToParent: (
    folderId: string,
    newParentId: string | null,
  ) => void;
  handleCreateThreadInFolder: (folderId: string) => void;

  // Collapse state (UI state for thinking/tool sections)
  collapseState: UseCollapseStateReturn;

  // Navigation operations (use router.push instead of store state)
  navigateToThread: (threadId: string) => void;
  navigateToFolder: (
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void;
  navigateToNewThread: (
    rootFolderId: DefaultFolderId,
    subFolderId: string | null,
  ) => void;

  // Refs
  inputRef: RefObject<TextareaRefObject | null>;

  // Logger
  logger: EndpointLogger;

  // Branch management
  branchIndices: Record<string, number>;
  handleSwitchBranch: (parentMessageId: string, branchIndex: number) => void;

  // Message actions
  deleteDialogOpen: boolean;
  messageToDelete: string | null;
  handleDeleteMessage: (messageId: string) => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
  countMessageChildren: (messageId: string) => number;

  // Message editor actions (edit/retry/answer states and handlers)
  editingMessageId: string | null;
  retryingMessageId: string | null;
  answeringMessageId: string | null;
  answerContent: string;
  editorAttachments: File[];
  startEdit: (messageId: string) => void;
  startRetry: (messageId: string) => void;
  startAnswer: (messageId: string) => void;
  cancelEditorAction: () => void;
  setAnswerContent: (content: string) => void;
  setEditorAttachments: (
    attachments: File[] | ((prev: File[]) => File[]),
  ) => void;
  handleBranchEdit: (
    messageId: string,
    content: string,
    onBranch?: (id: string, content: string) => Promise<void>,
  ) => Promise<void>;

  // Thread navigation
  handleSelectThread: (threadId: string) => void;
  handleCreateThread: (folderId?: string | null) => void;
  handleDeleteThread: (threadId: string) => Promise<void>;

  // Input handlers
  submitMessage: () => Promise<void>;
  /** Submit with explicit content - bypasses async state issues for voice input */
  submitWithContent: (content: string) => Promise<void>;
  /** Submit with audio file - for voice-to-voice mode (server transcribes) */
  submitWithAudio: (audioFile: File) => Promise<void>;
  handleSubmit: () => Promise<void>;
  handleKeyDown: (e: TextareaKeyboardEvent) => void;
  handleModelChange: (modelId: ModelId) => void;
  handleFillInputWithPrompt: (
    prompt: string,
    characterId: string,
    modelId?: ModelId,
  ) => void;
  handleScreenshot: () => Promise<void>;

  // UI State
  isToolsModalOpen: boolean;
  openToolsModal: () => void;
  closeToolsModal: () => void;
  setToolsModalOpen: (open: boolean) => void;

  // Search
  searchThreads: (query: string) => Array<{ id: string; title: string }>;
}

/**
 * Root folder permissions type
 */
export interface RootFolderPermissions {
  canCreateThread: boolean;
  canCreateFolder: boolean;
}

/**
 * Central hook that provides all chat functionality
 * Uses modular hooks for better maintainability
 *
 * @param locale - Current locale
 * @param logger - Logger instance
 * @param activeThreadId - Active thread ID from URL (null if none)
 * @param currentRootFolderId - Current root folder ID from URL
 * @param currentSubFolderId - Current subfolder ID from URL (null if none)
 * @param initialCredits - Initial credits from server
 * @param rootFolderPermissions - Root folder permissions computed server-side
 */
export function useChat(
  user: JwtPayloadType | undefined,
  locale: CountryLanguage,
  logger: EndpointLogger,
  activeThreadId: string | null,
  currentRootFolderId: DefaultFolderId,
  currentSubFolderId: string | null,
  initialCredits: CreditsGetResponseOutput,
  rootFolderPermissions: RootFolderPermissions,
): UseChatReturn {
  // Get stores - subscribe to specific properties
  const threads = useChatStore((state) => state.threads);
  const messages = useChatStore((state) => state.messages);
  const folders = useChatStore((state) => state.folders);
  const isLoading = useChatStore((state) => state.isLoading);
  const isDataLoaded = useChatStore((state) => state.isDataLoaded);
  const settings = useChatStore((state) => state.settings);

  // Get stable store methods (these are stable references from Zustand)
  const addThread = useChatStore((state) => state.addThread);
  const updateThread = useChatStore((state) => state.updateThread);
  const deleteThread = useChatStore((state) => state.deleteThread);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const getThreadMessages = useChatStore((state) => state.getThreadMessages);
  const getBranchIndices = useChatStore((state) => state.getBranchIndices);
  const addFolder = useChatStore((state) => state.addFolder);
  const updateFolder = useChatStore((state) => state.updateFolder);
  const deleteFolder = useChatStore((state) => state.deleteFolder);
  const setLoading = useChatStore((state) => state.setLoading);
  const setDataLoaded = useChatStore((state) => state.setDataLoaded);
  const updateSettings = useChatStore((state) => state.updateSettings);
  const hydrateSettings = useChatStore((state) => state.hydrateSettings);

  // Get stream store methods
  const streamingMessages = useAIStreamStore(
    (state) => state.streamingMessages,
  );
  const streamThreads = useAIStreamStore((state) => state.threads);
  const isStreaming = useAIStreamStore((state) => state.isStreaming);
  const streamError = useAIStreamStore((state) => state.error);
  const streamReset = useAIStreamStore((state) => state.reset);
  const streamAddThread = useAIStreamStore((state) => state.addThread);
  const streamAddMessage = useAIStreamStore((state) => state.addMessage);

  // Get translations
  const { t } = simpleT(locale);

  // Get credits hook with deduct/refetch methods
  // initialCredits is required in useChat, so creditsHook is guaranteed to be non-null
  const creditsHook = useCredits(logger, initialCredits)!;

  // Get AI stream hook
  const aiStream = useAIStream(locale, logger, t);

  // Fetch characters
  const charactersEndpoint = useCharactersList(logger);

  // Local state
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const inputRef = useRef<TextareaRefObject>(null);

  // Generate draft key for current context
  const draftKey = getDraftKey(
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
  );

  // Load draft when navigation context changes
  // Only reload when draftKey changes (navigation), not when logger changes
  useEffect(() => {
    const loadDraftForContext = async (): Promise<void> => {
      const draft = await loadDraft(draftKey, logger);
      const draftAttachments = await loadDraftAttachments(draftKey, logger);

      // Only update if draft is different from current input to prevent loops
      setInput((currentInput) => {
        if (currentInput !== draft) {
          logger.debug("Chat: Loading draft", {
            draftKey,
            draftLength: draft.length,
            currentInputLength: currentInput.length,
          });
          return draft;
        }
        return currentInput;
      });

      // Load attachments - only update if we have draft attachments
      if (draftAttachments.length > 0) {
        setAttachments(draftAttachments);
        logger.debug("Chat: Loading draft attachments", {
          draftKey,
          attachmentCount: draftAttachments.length,
        });
      }
    };
    void loadDraftForContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  // Wrapper function to save input and draft together
  const setInputAndSaveDraft = useCallback(
    (newInput: string) => {
      setInput(newInput);
      void saveDraftToStorage(draftKey, newInput, logger);
    },
    [draftKey, logger],
  );

  // Wrapper function to save attachments and draft attachments together
  const setAttachmentsAndSaveDraft = useCallback(
    (newAttachments: File[] | ((prev: File[]) => File[])) => {
      setAttachments((prev) => {
        const updated =
          typeof newAttachments === "function"
            ? newAttachments(prev)
            : newAttachments;
        void saveDraftAttachments(draftKey, updated, logger);
        return updated;
      });
    },
    [draftKey, logger],
  );

  // Use modular hooks
  useDataLoader(
    user,
    locale,
    logger,
    addThread,
    addMessage,
    addFolder,
    setDataLoaded,
  );

  useMessageLoader(
    locale,
    logger,
    activeThreadId,
    threads,
    addMessage,
    isDataLoaded,
  );

  // Compute characters map
  const characters = useMemo(() => {
    const response = charactersEndpoint.read?.response as
      | CharacterListResponseOutput
      | undefined;
    const charactersList = response?.characters;
    const charactersMap: Record<
      string,
      {
        id: string;
        name: string;
        icon: string;
        systemPrompt: string;
        voice?: typeof TtsVoiceValue;
      }
    > = {};

    if (charactersList && Array.isArray(charactersList)) {
      charactersList.forEach((p) => {
        charactersMap[p.id] = {
          id: p.id,
          name: p.name,
          icon: p.icon,
          systemPrompt: p.systemPrompt,
          voice: p.voice,
        };
      });
    }

    return charactersMap;
  }, [charactersEndpoint.read?.response]);

  const settingsOps = useSettings({
    chatStore: {
      settings,
      updateSettings,
      hydrateSettings,
    },
    characters,
  });

  useStreamSync({
    streamingMessages,
    streamThreads,
    chatMessages: messages,
    chatThreads: threads,
    addMessage,
    updateMessage,
    addThread,
    t,
  });

  const threadOps = useThreadOperations({
    locale,
    logger,
    chatStore: {
      threads,
      deleteThread,
      updateThread,
    },
    streamStore: {
      threads: streamThreads,
      reset: streamReset,
      addThread: streamAddThread,
    },
  });

  const folderOps = useFolderOperations({
    locale,
    logger,
    chatStore: {
      folders,
      addFolder,
      updateFolder,
      deleteFolder,
    },
  });

  const messageOps = useMessageOperations({
    locale,
    logger,
    aiStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    chatStore: {
      messages,
      threads,
      setLoading,
      getThreadMessages,
      getBranchIndices,
      deleteMessage,
      updateMessage,
    },
    streamStore: {
      streamingMessages,
      error: streamError,
      reset: streamReset,
      addMessage: streamAddMessage,
    },
    settings: settingsOps.settings,
    setInput: setInputAndSaveDraft,
    setAttachments: setAttachmentsAndSaveDraft,
    deductCredits: creditsHook.deductCredits,
  });

  const navigationOps = useNavigation(locale, logger, threads);

  // Compute active thread messages
  const activeThreadMessages = useMemo(() => {
    if (!activeThreadId || activeThreadId === NEW_MESSAGE_ID) {
      return [];
    }

    const filtered = Object.values(messages).filter(
      (msg) => msg.threadId === activeThreadId,
    );

    return filtered.toSorted(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }, [activeThreadId, messages]);

  // Branch management
  const branchManagement = useBranchManagement({
    activeThreadMessages,
    threadId: activeThreadId || "", // Pass thread ID for persistence
    logger,
  });

  // Message actions (delete)
  const messageActions = useMessageActions({
    messagesRecord: messages,
    deleteMessage: messageOps.deleteMessage,
  });

  // Message editor actions (edit/retry/answer)
  const editorActions = useMessageEditorActions(logger);

  // Collapse state for thinking/tool sections
  const collapseState = useCollapseState();

  // Thread navigation
  const threadNavigation = useThreadNavigation({
    locale,
    currentRootFolderId,
    currentSubFolderId,
    folders,
    navigateToThread: navigationOps.navigateToThread,
    navigateToNewThread: navigationOps.navigateToNewThread,
    deleteThread: (threadId: string) =>
      threadOps.deleteThread(threadId, activeThreadId),
    logger,
  });

  // Input handlers
  const inputHandlers = useInputHandlers({
    input,
    attachments,
    isLoading,
    enabledToolIds: settingsOps.settings.enabledToolIds,
    sendMessage: messageOps.sendMessage,
    setInput: setInputAndSaveDraft,
    setSelectedModel: settingsOps.setSelectedModel,
    setSelectedCharacter: settingsOps.setSelectedCharacter,
    setEnabledToolIds: settingsOps.setEnabledToolIds,
    inputRef,
    locale,
    logger,
    draftKey,
  });

  // UI State
  const uiState = useUIState();

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsed();

  // Folder handlers
  const folderHandlers = useFolderHandlers(
    {
      folders,
      updateFolder: folderOps.updateFolder,
      logger,
    },
    threadNavigation.handleCreateThread,
  );

  // Get active thread
  const activeThread = activeThreadId ? threads[activeThreadId] || null : null;

  // Search threads function
  const searchThreads = useCallback(
    (query: string): Array<{ id: string; title: string }> => {
      if (!query.trim()) {
        return [];
      }

      const lowerQuery = query.toLowerCase();
      const results: Array<{ id: string; title: string }> = [];

      Object.values(threads).forEach((thread) => {
        if (thread.title?.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: thread.id,
            title: thread.title || "",
          });
        }
      });

      return results;
    },
    [threads],
  );

  return {
    // State
    threads,
    messages,
    folders,
    rootFolderPermissions, // Server-computed permissions passed as prop
    characters: characters,
    activeThread,
    activeThreadMessages,
    isLoading,
    isDataLoaded,
    isStreaming,

    // Current context (from URL props)
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,

    // Input
    input,
    setInput: setInputAndSaveDraft,
    attachments,
    setAttachments: setAttachmentsAndSaveDraft,

    // Settings
    selectedCharacter: settingsOps.settings.selectedCharacter,
    selectedModel: settingsOps.settings.selectedModel,
    temperature: settingsOps.settings.temperature,
    maxTokens: settingsOps.settings.maxTokens,
    ttsAutoplay: settingsOps.settings.ttsAutoplay,
    ttsVoice: settingsOps.settings.ttsVoice,
    sidebarCollapsed,
    viewMode: settingsOps.settings.viewMode,
    enabledToolIds: settingsOps.settings.enabledToolIds,
    setSelectedCharacter: settingsOps.setSelectedCharacter,
    setSelectedModel: settingsOps.setSelectedModel,
    setTemperature: settingsOps.setTemperature,
    setMaxTokens: settingsOps.setMaxTokens,
    setTTSAutoplay: settingsOps.setTTSAutoplay,
    setTTSVoice: settingsOps.setTTSVoice,
    setSidebarCollapsed,
    setViewMode: settingsOps.setViewMode,
    setEnabledToolIds: settingsOps.setEnabledToolIds,

    // Message operations
    sendMessage: messageOps.sendMessage,
    retryMessage: messageOps.retryMessage,
    branchMessage: messageOps.branchMessage,
    answerAsAI: messageOps.answerAsAI,
    deleteMessage: messageOps.deleteMessage,
    voteMessage: messageOps.voteMessage,
    stopGeneration: messageOps.stopGeneration,

    // Credits
    initialCredits: initialCredits,
    deductCredits: creditsHook.deductCredits,
    refetchCredits: creditsHook.refetchCredits,

    // Thread operations
    deleteThread: (threadId: string) =>
      threadOps.deleteThread(threadId, activeThreadId),
    updateThread: threadOps.updateThread,

    // Folder operations
    createFolder: folderOps.createFolder,
    updateFolder: folderOps.updateFolder,
    deleteFolder: folderOps.deleteFolder,

    // Folder handlers (UI operations)
    handleReorderFolder: folderHandlers.handleReorderFolder,
    handleMoveFolderToParent: folderHandlers.handleMoveFolderToParent,
    handleCreateThreadInFolder: folderHandlers.handleCreateThreadInFolder,

    // Collapse state
    collapseState,

    // Navigation operations
    navigateToThread: navigationOps.navigateToThread,
    navigateToFolder: navigationOps.navigateToFolder,
    navigateToNewThread: navigationOps.navigateToNewThread,

    // Refs
    inputRef,

    // Logger
    logger,

    // Branch management
    branchIndices: branchManagement.branchIndices,
    handleSwitchBranch: branchManagement.handleSwitchBranch,

    // Message actions
    deleteDialogOpen: messageActions.deleteDialogOpen,
    messageToDelete: messageActions.messageToDelete,
    handleDeleteMessage: messageActions.handleDeleteMessage,
    handleConfirmDelete: messageActions.handleConfirmDelete,
    handleCancelDelete: messageActions.handleCancelDelete,
    countMessageChildren: messageActions.countMessageChildren,

    // Message editor actions
    editingMessageId: editorActions.editingMessageId,
    retryingMessageId: editorActions.retryingMessageId,
    answeringMessageId: editorActions.answeringMessageId,
    answerContent: editorActions.answerContent,
    editorAttachments: editorActions.editorAttachments,
    startEdit: editorActions.startEdit,
    startRetry: editorActions.startRetry,
    startAnswer: editorActions.startAnswer,
    cancelEditorAction: editorActions.cancelAction,
    setAnswerContent: editorActions.setAnswerContent,
    setEditorAttachments: editorActions.setEditorAttachments,
    handleBranchEdit: editorActions.handleBranchEdit,

    // Thread navigation
    handleSelectThread: threadNavigation.handleSelectThread,
    handleCreateThread: threadNavigation.handleCreateThread,
    handleDeleteThread: threadNavigation.handleDeleteThread,

    // Input handlers
    submitMessage: inputHandlers.submitMessage,
    submitWithContent: inputHandlers.submitWithContent,
    submitWithAudio: inputHandlers.submitWithAudio,
    handleSubmit: inputHandlers.handleSubmit,
    handleKeyDown: inputHandlers.handleKeyDown,
    handleModelChange: inputHandlers.handleModelChange,
    handleFillInputWithPrompt: inputHandlers.handleFillInputWithPrompt,
    handleScreenshot: inputHandlers.handleScreenshot,

    // UI State
    isToolsModalOpen: uiState.isToolsModalOpen,
    openToolsModal: uiState.openToolsModal,
    closeToolsModal: uiState.closeToolsModal,
    setToolsModalOpen: uiState.setToolsModalOpen,

    // Search
    searchThreads,
  };
}
