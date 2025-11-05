"use client";

/**
 * Chat Context Provider
 * Provides the useChat() hook to all chat components
 * URL is the single source of truth for navigation state
 */

import type { JSX, ReactNode } from "react";
import React, { createContext, useContext } from "react";

import type { DefaultFolderId } from "@/app/[locale]/chat/types";
import {
  useChat,
  type UseChatReturn,
} from "@/app/api/[locale]/v1/core/agent/chat/hooks/hooks";
import type { CreditsGetResponseOutput } from "@/app/api/[locale]/v1/core/credits/definition";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Chat context is the same as UseChatReturn
 * UseChatReturn already includes initialCredits, deductCredits, and refetchCredits
 */
export type ChatContextValue = UseChatReturn;

const ChatContext = createContext<ChatContextValue | null>(null);

/**
 * Chat provider props
 * All navigation state comes from URL props (not from store)
 */
interface ChatProviderProps {
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
}

/**
 * Chat provider component
 * Provides the useChat() hook to all children
 * URL is the single source of truth - no hydration mismatch
 */
export function ChatProvider({
  locale,
  children,
  activeThreadId,
  currentRootFolderId,
  currentSubFolderId,
  initialCredits,
}: ChatProviderProps): JSX.Element {
  // Create logger
  const logger = createEndpointLogger(true, Date.now(), locale);

  // Get chat hook with URL-derived navigation state
  const chat = useChat(
    locale,
    logger,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    initialCredits,
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
