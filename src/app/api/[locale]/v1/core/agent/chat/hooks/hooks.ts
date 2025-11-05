/**
 * Central Chat Hook - Refactored
 * Combines all chat functionality using modular hooks
 * Production ready, 100% typesafe
 */

"use client";

import { useMemo, useRef, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useAIStream } from "../../ai-stream/hooks/use-ai-stream";
import { useAIStreamStore } from "../../ai-stream/hooks/store";
import type { DefaultFolderId } from "../config";
import type { ModelId } from "../model-access/models";
import type { PersonaListResponseOutput } from "../personas/definition";
import { usePersonasList } from "../personas/hooks";
import type { ChatFolder, ChatMessage, ChatThread } from "./store";
import { useChatStore } from "./store";

import { useDataLoader } from "./use-data-loader";
import { useMessageLoader } from "./use-message-loader";
import { useSettings } from "./use-settings";
import { useStreamSync } from "./use-stream-sync";
import { useFolderOperations } from "../folders/hooks/use-operations";
import type { FolderUpdate } from "../folders/hooks/use-operations";
import { useThreadOperations } from "../threads/hooks/use-operations";
import type { ThreadUpdate } from "../threads/hooks/use-operations";
import { useMessageOperations } from "../threads/[threadId]/messages/hooks/use-operations";
import { useNavigation } from "./use-navigation";
import { useCredits } from "../../../credits/hooks";
import { type CreditsGetResponseOutput } from "../../../credits/definition";

/**
 * Return type for useChat hook
 */
export interface UseChatReturn {
  // State
  threads: Record<string, ChatThread>;
  messages: Record<string, ChatMessage>;
  folders: Record<string, ChatFolder>;
  rootFolderPermissions: Record<
    string,
    { canCreateThread: boolean; canCreateFolder: boolean }
  >;
  personas: Record<string, { id: string; name: string; icon: string }>;
  activeThread: ChatThread | null;
  activeThreadMessages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;

  // Current context (passed as props from URL, not from store)
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;

  // Input
  input: string;
  setInput: (input: string) => void;

  // Settings
  selectedPersona: string;
  selectedModel: ModelId;
  temperature: number;
  maxTokens: number;
  ttsAutoplay: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  viewMode: "linear" | "flat" | "threaded";
  enabledToolIds: string[];
  setSelectedPersona: (persona: string) => void;
  setSelectedModel: (model: ModelId) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setTTSAutoplay: (autoplay: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  setViewMode: (mode: "linear" | "flat" | "threaded") => void;
  setEnabledToolIds: (toolIds: string[]) => void;

  // Credits
  initialCredits: CreditsGetResponseOutput;
  deductCredits: (creditCost: number, feature: string) => void;
  refetchCredits: () => void;

  // Message operations
  sendMessage: (
    content: string,
    onThreadCreated?: (
      threadId: string,
      rootFolderId: DefaultFolderId,
      subFolderId: string | null,
    ) => void,
  ) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  branchMessage: (messageId: string, newContent: string) => Promise<void>;
  answerAsAI: (messageId: string, content: string) => Promise<void>;
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
    icon?: string,
  ) => Promise<string>;
  updateFolder: (folderId: string, updates: FolderUpdate) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;

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
  inputRef: React.RefObject<HTMLTextAreaElement | null>;

  // Logger
  logger: EndpointLogger;
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
 * @param deductCredits - Function to optimistically deduct credits
 */
export function useChat(
  locale: CountryLanguage,
  logger: EndpointLogger,
  activeThreadId: string | null,
  currentRootFolderId: DefaultFolderId,
  currentSubFolderId: string | null,
  initialCredits: CreditsGetResponseOutput,
): UseChatReturn {
  // Get stores - subscribe to specific properties
  const threads = useChatStore((state) => state.threads);
  const messages = useChatStore((state) => state.messages);
  const folders = useChatStore((state) => state.folders);
  const rootFolderPermissions = useChatStore(
    (state) => state.rootFolderPermissions,
  );
  const isLoading = useChatStore((state) => state.isLoading);

  // Get store instances
  const chatStore = useChatStore();
  const streamStore = useAIStreamStore();

  // Get translations
  const { t } = simpleT(locale);

  // Get credits hook with deduct/refetch methods
  const creditsHook = useCredits(logger, initialCredits);

  // Get AI stream hook
  const aiStream = useAIStream(locale, logger, t);

  // Fetch personas
  const personasEndpoint = usePersonasList(logger);

  // Local state
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Use modular hooks
  useDataLoader(
    locale,
    logger,
    t,
    chatStore.addThread,
    chatStore.addMessage,
    chatStore.addFolder,
    chatStore.setRootFolderPermissions,
  );

  useMessageLoader(
    locale,
    logger,
    activeThreadId,
    threads,
    chatStore.addMessage,
  );

  const settingsOps = useSettings({ chatStore });

  useStreamSync({
    streamingMessages: streamStore.streamingMessages,
    streamThreads: streamStore.threads,
    chatMessages: messages,
    chatThreads: threads,
    addMessage: chatStore.addMessage,
    updateMessage: chatStore.updateMessage,
    addThread: chatStore.addThread,
    t,
  });

  const threadOps = useThreadOperations({
    locale,
    logger,
    chatStore,
    streamStore,
  });

  const folderOps = useFolderOperations({
    locale,
    logger,
    chatStore,
  });

  const messageOps = useMessageOperations({
    locale,
    logger,
    aiStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    chatStore,
    streamStore,
    settings: settingsOps.settings,
    setInput,
    deductCredits: creditsHook.deductCredits,
  });

  const navigationOps = useNavigation(locale, logger, threads, folders);

  // Compute personas map
  const personas = useMemo(() => {
    const response = personasEndpoint.read?.response as
      | PersonaListResponseOutput
      | undefined;
    const personasList = response?.personas;
    const personasMap: Record<
      string,
      { id: string; name: string; icon: string }
    > = {};

    if (personasList && Array.isArray(personasList)) {
      personasList.forEach((p) => {
        personasMap[p.id] = {
          id: p.id,
          name: p.name,
          icon: p.icon,
        };
      });
    }

    return personasMap;
  }, [personasEndpoint.read?.response]);

  // Get active thread
  const activeThread = activeThreadId ? threads[activeThreadId] || null : null;

  // Compute active thread messages
  const activeThreadMessages = useMemo(() => {
    if (!activeThreadId) {
      return [];
    }
    return Object.values(messages)
      .filter((msg) => msg.threadId === activeThreadId)
      .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }, [activeThreadId, messages]);

  return {
    // State
    threads,
    messages,
    folders,
    rootFolderPermissions,
    personas,
    activeThread,
    activeThreadMessages,
    isLoading,
    isStreaming: streamStore.isStreaming,

    // Current context (from URL props)
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,

    // Input
    input,
    setInput,

    // Settings
    selectedPersona: settingsOps.settings.selectedPersona,
    selectedModel: settingsOps.settings.selectedModel,
    temperature: settingsOps.settings.temperature,
    maxTokens: settingsOps.settings.maxTokens,
    ttsAutoplay: settingsOps.settings.ttsAutoplay,
    sidebarCollapsed: settingsOps.settings.sidebarCollapsed,
    theme: settingsOps.settings.theme,
    viewMode: settingsOps.settings.viewMode,
    enabledToolIds: settingsOps.settings.enabledToolIds,
    setSelectedPersona: settingsOps.setSelectedPersona,
    setSelectedModel: settingsOps.setSelectedModel,
    setTemperature: settingsOps.setTemperature,
    setMaxTokens: settingsOps.setMaxTokens,
    setTTSAutoplay: settingsOps.setTTSAutoplay,
    setSidebarCollapsed: settingsOps.setSidebarCollapsed,
    setTheme: settingsOps.setTheme,
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

    // Navigation operations
    navigateToThread: navigationOps.navigateToThread,
    navigateToFolder: navigationOps.navigateToFolder,
    navigateToNewThread: navigationOps.navigateToNewThread,

    // Refs
    inputRef,

    // Logger
    logger,
  };
}
