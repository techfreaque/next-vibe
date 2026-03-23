"use client";

/**
 * Chat Boot Context
 * Lightweight context for server-origin props that don't change after mount.
 * Replaces the old ChatProvider/ChatContext which aggregated everything.
 *
 * This context provides: user, logger, initialCredits, envAvailability, rootFolderPermissions.
 * All other chat state lives in scoped Zustand stores and hooks.
 */

import type { JSX, ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";

import type { AgentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import type { CreditsGetResponseOutput } from "@/app/api/[locale]/credits/definition";

import type { DefaultFolderId } from "../config";
import type { FolderContentsResponseOutput } from "../folder-contents/[rootFolderId]/definition";
import type { FolderListResponseOutput } from "../folders/[rootFolderId]/definition";
import type { PublicFeedGetResponseOutput } from "../public-feed/definition";
import type { ChatSettingsGetResponseOutput } from "../settings/definition";
import type { SkillGetResponseOutput } from "../skills/[id]/definition";
import type { MessageListResponseOutput } from "../threads/[threadId]/messages/definition";
import type { PathGetResponseOutput } from "../threads/[threadId]/messages/path/definition";
import type { ThreadListResponseOutput } from "../threads/definition";

/**
 * Root folder permissions type
 */
export interface RootFolderPermissions {
  canCreateThread: boolean;
  canCreateFolder: boolean;
}

/**
 * Server-origin boot values - stable after mount
 */
export interface ChatBootValue {
  initialCredits: CreditsGetResponseOutput;
  envAvailability: AgentEnvAvailability;
  rootFolderPermissions: RootFolderPermissions;
  /** Initial folders data fetched server-side - used as initialData for the sidebar */
  initialFoldersData: FolderListResponseOutput | null;
  /** Initial threads data fetched server-side - used as initialData for the threads list */
  initialThreadsData: ThreadListResponseOutput | null;
  /** Root folder ID at page load - initialData only applies to this folder */
  initialRootFolderId: DefaultFolderId;
  /** Initial messages data fetched server-side - used as initialData for the active thread */
  initialMessagesData: MessageListResponseOutput | null;
  /** Initial path data fetched server-side - used as initialData for the branch path */
  initialPathData: PathGetResponseOutput | null;
  /** Initial settings fetched server-side - used as initialData for chat settings */
  initialSettingsData: ChatSettingsGetResponseOutput | null;
  /** Initial character fetched server-side - used as initialData for the selected character */
  initialSkillData: SkillGetResponseOutput | null;
  /** Thread ID at page load - initialMessagesData only applies to this thread */
  initialThreadId: string | null;
  /** Initial public feed data fetched server-side - used when rootFolderId=public and no thread selected */
  initialPublicFeedData: PublicFeedGetResponseOutput | null;
  /** Initial folder contents data fetched server-side - used as initialData for the sidebar folder list */
  initialFolderContentsData: FolderContentsResponseOutput | null;
  /** Initial subfolder contents when URL lands inside a subfolder on SSR - seeds the expanded folder's child EndpointsPage */
  initialSubFolderContentsData: FolderContentsResponseOutput | null;
  /** The subfolder ID that initialSubFolderContentsData belongs to */
  initialSubFolderId: string | null;
}

/**
 * Exported for mock/demo providers (e.g. landing page chat preview).
 * Production code should use ChatBootProvider instead.
 */
export const ChatBootContext = createContext<ChatBootValue | null>(null);

/**
 * Chat boot provider props
 */
interface ChatBootProviderProps {
  children: ReactNode;
  /** Active thread ID from URL (null if none) */
  activeThreadId: string | null;
  /** Current root folder ID from URL */
  currentRootFolderId: DefaultFolderId;
  /** Current subfolder ID from URL (null if none) */
  currentSubFolderId: string | null;
  initialCredits: CreditsGetResponseOutput;
  rootFolderPermissions: RootFolderPermissions;
  envAvailability: AgentEnvAvailability;
  /** Initial data fetched server-side to avoid client-side refetch on mount */
  initialFoldersData: FolderListResponseOutput | null;
  initialThreadsData: ThreadListResponseOutput | null;
  initialMessagesData: MessageListResponseOutput | null;
  initialPathData: PathGetResponseOutput | null;
  initialSettingsData: ChatSettingsGetResponseOutput | null;
  initialSkillData: SkillGetResponseOutput | null;
  initialPublicFeedData: PublicFeedGetResponseOutput | null;
  initialFolderContentsData: FolderContentsResponseOutput | null;
  initialSubFolderContentsData?: FolderContentsResponseOutput | null;
  initialSubFolderId?: string | null;
}

/**
 * Chat boot provider - provides stable server-origin values.
 * All dynamic chat state lives in scoped Zustand stores.
 */
export function ChatBootProvider({
  children,
  activeThreadId,
  currentRootFolderId,
  initialCredits,
  rootFolderPermissions,
  envAvailability,
  initialFoldersData = null,
  initialThreadsData = null,
  initialMessagesData = null,
  initialPathData = null,
  initialSettingsData = null,
  initialSkillData = null,
  initialPublicFeedData = null,
  initialFolderContentsData = null,
  initialSubFolderContentsData = null,
  initialSubFolderId = null,
}: ChatBootProviderProps): JSX.Element {
  const value = useMemo(
    (): ChatBootValue => ({
      initialCredits,
      envAvailability,
      rootFolderPermissions,
      initialFoldersData,
      initialThreadsData,
      initialRootFolderId: currentRootFolderId,
      initialMessagesData,
      initialPathData,
      initialSettingsData,
      initialSkillData,
      initialThreadId: activeThreadId,
      initialPublicFeedData,
      initialFolderContentsData,
      initialSubFolderContentsData,
      initialSubFolderId,
    }),
    [
      initialCredits,
      envAvailability,
      rootFolderPermissions,
      initialFoldersData,
      initialThreadsData,
      currentRootFolderId,
      initialMessagesData,
      initialPathData,
      initialSettingsData,
      initialSkillData,
      activeThreadId,
      initialPublicFeedData,
      initialFolderContentsData,
      initialSubFolderContentsData,
      initialSubFolderId,
    ],
  );

  return (
    <ChatBootContext.Provider value={value}>
      {children}
    </ChatBootContext.Provider>
  );
}

/**
 * Hook to access chat boot context.
 * Throws if used outside ChatBootProvider.
 */
export function useChatBootContext(): ChatBootValue {
  const context = useContext(ChatBootContext);
  if (!context) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error("useChatBootContext must be used within ChatBootProvider.");
  }
  return context;
}
