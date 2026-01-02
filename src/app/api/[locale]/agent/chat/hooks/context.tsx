"use client";

/**
 * Chat Context Provider
 * Provides the useChat() hook to all chat components
 * URL is the single source of truth for navigation state
 */

import type { JSX, ReactNode } from "react";
import React, { createContext, useContext, useMemo } from "react";

import {
  useChat,
  type UseChatReturn,
} from "@/app/api/[locale]/agent/chat/hooks/hooks";
import type { CreditsGetResponseOutput } from "@/app/api/[locale]/credits/definition";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { DefaultFolderId } from "../config";

/**
 * Chat context is the same as UseChatReturn
 * UseChatReturn already includes initialCredits, deductCredits, and refetchCredits
 */
export type ChatContextValue = UseChatReturn;

const ChatContext = createContext<ChatContextValue | null>(null);

/**
 * Root folder permissions type
 */
export interface RootFolderPermissions {
  canCreateThread: boolean;
  canCreateFolder: boolean;
}

/**
 * Chat provider props
 * All navigation state comes from URL props (not from store)
 */
interface ChatProviderProps {
  /** JWT payload from server (undefined for unauthenticated/public users) */
  user: JwtPayloadType;
  locale: CountryLanguage;
  children: ReactNode;
  /** Active thread ID from URL (null if none) */
  activeThreadId: string | null;
  /** Current root folder ID from URL */
  currentRootFolderId: DefaultFolderId;
  /** Current subfolder ID from URL (null if none) */
  currentSubFolderId: string | null;
  /** Initial credits from server (must be provided from server) */
  initialCredits: CreditsGetResponseOutput;
  /** Root folder permissions computed server-side */
  rootFolderPermissions: RootFolderPermissions;
}

/**
 * Chat provider component
 * Provides the useChat() hook to all children
 * URL is the single source of truth - no hydration mismatch
 */
export function ChatProvider({
  user,
  locale,
  children,
  activeThreadId,
  currentRootFolderId,
  currentSubFolderId,
  initialCredits,
  rootFolderPermissions,
}: ChatProviderProps): JSX.Element {
  // Create logger once - memoize to prevent infinite re-renders
  // The timestamp is only used for logging context, not for identity
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  // Get chat hook with URL-derived navigation state
  const chat = useChat(
    user,
    locale,
    logger,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    initialCredits,
    rootFolderPermissions,
  );

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

/**
 * Hook to use chat context
 * Throws error if used outside ChatProvider
 */
export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error(
      "useChatContext must be used within ChatProvider. Make sure your component is wrapped in <ChatProvider>.",
    );
  }
  return context;
}
