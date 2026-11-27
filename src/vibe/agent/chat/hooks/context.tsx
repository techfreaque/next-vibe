"use client";

/**
 * Chat Boot Context
 * Lightweight context for server-origin props that don't change after mount.
 * Replaces the old ChatProvider/ChatContext which aggregated everything.
 *
 * This context provides: user, logger, initialCredits, rootFolderPermissions.
 * All other chat state lives in scoped Zustand stores and hooks.
 */

import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { JSX, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo } from "react";

import type { CreditsGetResponseOutput } from "@/credits/definition";

import type { SkillGetResponseOutput } from "../../skills/[id]/definition";
import type { FolderContentsResponseOutput } from "../folder-contents/[rootFolderId]/definition";
import type { FolderListResponseOutput } from "../folders/[rootFolderId]/definition";
import type { PublicFeedGetResponseOutput } from "../public-feed/definition";
import type { ChatSettingsGetResponseOutput } from "../settings/definition";
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
  /** undefined = server-side balance load failed; the client fetches it. */
  initialCredits: CreditsGetResponseOutput | undefined;
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
  initialCredits: CreditsGetResponseOutput | undefined;
  rootFolderPermissions: RootFolderPermissions;
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

const NULL_BOOT_VALUE: ChatBootValue = {
  initialCredits: {
    total: 0,
    expiring: 0,
    permanent: 0,
    earned: 0,
    free: 0,
    expiresAt: null,
    capacity: 0,
  },
  rootFolderPermissions: { canCreateThread: false, canCreateFolder: false },
  initialFoldersData: null,
  initialThreadsData: null,
  initialRootFolderId: DefaultFolderId.PRIVATE,
  initialMessagesData: null,
  initialPathData: null,
  initialSettingsData: null,
  initialSkillData: null,
  initialThreadId: null,
  initialPublicFeedData: null,
  initialFolderContentsData: null,
  initialSubFolderContentsData: null,
  initialSubFolderId: null,
};

/**
 * Hook to access chat boot context.
 * Returns null-safe defaults when used outside ChatBootProvider.
 */
export function useChatBootContext(): ChatBootValue {
  return useContext(ChatBootContext) ?? NULL_BOOT_VALUE;
}

/**
 * Boot payloads are a snapshot of the server state at page load. They may seed
 * a cache key only ONCE per page: the chat page is a long-lived SPA (pushState
 * navigation keeps the same boot props), and React Query garbage-collects an
 * unmounted list after a few minutes. A later remount (sidebar reopened on
 * mobile, root folder switched back, search cleared) handed the page-load
 * snapshot in again as fresh initialData, so threads deleted since then came
 * back in the sidebar and a delete on them returned 404 (prod 2026-11-27,
 * the same thread deleted twice 11 minutes apart).
 *
 * Effects never run on the server, so SSR renders always seed.
 */
const seededBootPayloads = new WeakSet<WeakKey>();

/**
 * Returns `data` while it has never seeded a mounted consumer, undefined after.
 * The payload is marked used once the consuming component commits, so the
 * StrictMode double render and the hydration render both still get it.
 */
export function useBootSeed<TPayload extends WeakKey>(
  data: TPayload | null | undefined,
): TPayload | undefined {
  const seed = pickBootSeed(data);
  useEffect(() => {
    markBootSeedUsed(seed);
  }, [seed]);
  return seed;
}

/** The payload while it has not seeded a committed consumer yet. */
export function pickBootSeed<TPayload extends WeakKey>(
  data: TPayload | null | undefined,
): TPayload | undefined {
  return data && !seededBootPayloads.has(data) ? data : undefined;
}

/** Marks a payload as used: later mounts fetch instead of reusing it. */
export function markBootSeedUsed(data: WeakKey | undefined): void {
  if (data) {
    seededBootPayloads.add(data);
  }
}
