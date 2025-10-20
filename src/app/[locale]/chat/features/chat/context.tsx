"use client";

/**
 * Chat Context Provider
 * Provides the useChat() hook to all chat components
 */

import type { JSX, ReactNode } from "react";
import React, { createContext, useContext } from "react";

import {
  useChat,
  type UseChatReturn,
} from "@/app/api/[locale]/v1/core/agent/chat/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Chat context
 */
const ChatContext = createContext<UseChatReturn | null>(null);

/**
 * Chat provider props
 */
interface ChatProviderProps {
  locale: CountryLanguage;
  children: ReactNode;
}

/**
 * Chat provider component
 * Provides the useChat() hook to all children
 */
export function ChatProvider({
  locale,
  children,
}: ChatProviderProps): JSX.Element {
  // Create logger
  const logger = createEndpointLogger(true, Date.now(), locale);

  // Get chat hook
  const chat = useChat(locale, logger);

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

/**
 * Hook to use chat context
 * Returns null if used outside ChatProvider (safe pattern)
 */
export function useChatContext(): UseChatReturn {
  const context = useContext(ChatContext);

  if (!context) {
    // Return a safe default instead of throwing
    // This allows components to gracefully handle missing context
    return {} as UseChatReturn;
  }

  return context;
}
