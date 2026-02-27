"use client";

/**
 * Lightweight mock ChatProvider for landing page chat demo.
 * Provides a complete ChatContextValue with no-op functions so the real
 * chat components (UserMessageBubble, GroupedAssistantMessage, ToolCallRenderer)
 * can render without the full chat infrastructure.
 */

import { createRef, type JSX, type ReactNode } from "react";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { ViewMode } from "@/app/api/[locale]/agent/chat/enum";
import {
  ChatContext,
  type ChatContextValue,
} from "@/app/api/[locale]/agent/chat/hooks/context";
import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { TtsVoice } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

const noopVoid = (): void => {
  /* demo no-op */
};
const noopAsyncVoid = async (): Promise<void> => {
  /* demo no-op */
};
const noopAsyncString = async (): Promise<string> => "";

const MOCK_USER: ChatContextValue["user"] = {
  isPublic: false,
  id: "00000000-0000-0000-0000-000000000000",
  leadId: "00000000-0000-0000-0000-000000000000",
  roles: [UserPermissionRole.ADMIN],
};

const MOCK_ENV: AgentEnvAvailability = {
  openRouter: false,
  voice: false,
  braveSearch: false,
  kagiSearch: false,
  anySearch: false,
  uncensoredAI: false,
  freedomGPT: false,
  gabAI: false,
  veniceAI: false,
  scrappey: false,
};

const MOCK_CREDITS = {
  total: 0,
  expiring: 0,
  permanent: 0,
  earned: 0,
  free: 0,
  expiresAt: null,
};

/**
 * Complete mock context — every field typed, no assertions.
 * Functions are no-ops since the demo is non-interactive.
 */
const mockContextValue: ChatContextValue = {
  // State
  threads: {},
  messages: {},
  folders: {},
  rootFolderPermissions: { canCreateThread: false, canCreateFolder: false },
  activeThread: null,
  activeThreadMessages: [],
  isLoading: false,
  isDataLoaded: true,
  isStreaming: false,

  // Current context
  activeThreadId: null,
  currentRootFolderId: DefaultFolderId.PUBLIC,
  currentSubFolderId: null,

  // Input
  input: "",
  setInput: noopVoid,
  attachments: [],
  setAttachments: noopVoid,

  // Settings
  selectedCharacter: "",
  selectedModel: ModelId.CLAUDE_HAIKU_4_5,
  activeFavoriteId: null,
  ttsAutoplay: false,
  ttsVoice: TtsVoice.FEMALE,
  sidebarCollapsed: false,
  viewMode: ViewMode.LINEAR,
  enabledTools: null,
  setActiveFavorite: noopVoid,
  setTTSAutoplay: noopVoid,
  setSidebarCollapsed: noopVoid,
  setViewMode: noopVoid,
  setEnabledTools: noopVoid,

  // Credits
  initialCredits: MOCK_CREDITS,
  deductCredits: noopVoid,
  refetchCredits: noopVoid,

  // Message operations
  sendMessage: noopAsyncVoid,
  retryMessage: noopAsyncVoid,
  branchMessage: noopAsyncVoid,
  answerAsAI: noopAsyncVoid,
  deleteMessage: noopAsyncVoid,
  voteMessage: noopAsyncVoid,
  stopGeneration: noopVoid,

  // Thread operations
  deleteThread: noopAsyncVoid,
  updateThread: noopAsyncVoid,

  // Folder operations
  createFolder: noopAsyncString,
  updateFolder: noopAsyncVoid,
  deleteFolder: noopAsyncVoid,

  // Folder handlers
  handleReorderFolder: noopVoid,
  handleMoveFolderToParent: noopVoid,
  handleCreateThreadInFolder: noopVoid,

  // Collapse state
  collapseState: {
    isCollapsed: () => true,
    toggleCollapse: noopVoid,
    hasUserOverride: () => false,
    clearOverride: noopVoid,
    clearMessageOverrides: noopVoid,
  },

  // Navigation
  navigateToThread: noopVoid,
  navigateToFolder: noopVoid,
  navigateToNewThread: noopVoid,

  // Refs
  inputRef: createRef(),

  // Logger
  logger: createEndpointLogger(false, Date.now(), "en-US"),

  // Branch management
  branchIndices: {},
  handleSwitchBranch: noopVoid,

  // Message actions
  deleteDialogOpen: false,
  messageToDelete: null,
  handleDeleteMessage: noopVoid,
  handleConfirmDelete: noopVoid,
  handleCancelDelete: noopVoid,
  countMessageChildren: () => 0,

  // Editor actions
  editingMessageId: null,
  retryingMessageId: null,
  answeringMessageId: null,
  answerContent: "",
  editorAttachments: [],
  isLoadingRetryAttachments: false,
  startEdit: noopVoid,
  startRetry: noopAsyncVoid,
  startAnswer: noopVoid,
  cancelEditorAction: noopVoid,
  setAnswerContent: noopVoid,
  setEditorAttachments: noopVoid,
  handleBranchEdit: noopAsyncVoid,

  // Thread navigation
  handleSelectThread: noopVoid,
  handleCreateThread: noopVoid,
  handleDeleteThread: noopAsyncVoid,

  // Input handlers
  submitMessage: noopAsyncVoid,
  submitWithContent: noopAsyncVoid,
  submitWithAudio: noopAsyncVoid,
  handleSubmit: noopAsyncVoid,
  handleKeyDown: noopVoid,
  handleScreenshot: noopAsyncVoid,

  // Search
  searchThreads: () => [],

  // User
  user: MOCK_USER,

  // Env
  envAvailability: MOCK_ENV,
  defaultToolCount: 0,
  totalToolCount: 0,
};

export function MockChatProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <ChatContext.Provider value={mockContextValue}>
      {children}
    </ChatContext.Provider>
  );
}
