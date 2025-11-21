"use client";

import { type DivRefObject, Div } from "next-vibe-ui/ui/div";
import { KeyboardAvoidingView } from "next-vibe-ui/ui/keyboard-avoiding-view";
import { useSafeAreaInsets } from "next-vibe-ui/hooks/use-safe-area-insets";
import type { JSX } from "react";
import React, { useRef } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { envClient } from "@/config/env-client";

import { useChatContext } from "@/app/api/[locale]/v1/core/agent/chat/hooks/context";
import { useInputHeight } from "@/app/api/[locale]/v1/core/agent/chat/hooks/use-input-height";
import { AIToolsModal } from "@/app/api/[locale]/v1/core/agent/chat/threads/_components/chat-input/ai-tools-modal";
import { ChatMessages } from "@/app/api/[locale]/v1/core/agent/chat/threads/[threadId]/messages/_components/messages";
import { PublicFeed } from "@/app/api/[locale]/v1/core/agent/chat/threads/_components/public-feed/public-feed";
import { ChatBranding } from "@/app/api/[locale]/v1/core/agent/chat/threads/[threadId]/_components/branding";
import { ChatEmptyState } from "@/app/api/[locale]/v1/core/agent/chat/threads/_components/new-thread/empty-state";
import { ChatInputContainer } from "@/app/api/[locale]/v1/core/agent/chat/threads/_components/chat-input/input-container";
import { ChatToolbar } from "@/app/api/[locale]/v1/core/agent/chat/threads/[threadId]/_components/toolbar";

interface ChatAreaProps {
  locale: CountryLanguage;
  logger: EndpointLogger;
  currentUserId?: string;
}

export function ChatArea({
  locale,
  logger,
  currentUserId,
}: ChatAreaProps): JSX.Element {
  const chat = useChatContext();
  const {
    activeThread: thread,
    activeThreadMessages: messages,
    viewMode,
    currentRootFolderId: rootFolderId,
  } = chat;

  const inputContainerRef = useRef<DivRefObject>(null);
  const inputHeight = useInputHeight(inputContainerRef);

  // Get safe area insets for native (top notch, bottom home indicator)
  const insets = useSafeAreaInsets();

  // Determine if we should show input (hide in public root without thread)
  const shouldShowInput = !(
    rootFolderId === "public" &&
    !chat.currentSubFolderId &&
    !thread
  );

  return (
    <KeyboardAvoidingView
      className="h-screen h-max-screen flex-1"
      keyboardVerticalOffset={0}
    >
      <Div
        style={
          envClient.platform.isReactNative
            ? { paddingTop: insets.top + 60 }
            : undefined
        }
      >
        <Div
          className={
            envClient.platform.isReactNative
              ? "flex-1 flex flex-col min-w-0 relative w-full"
              : "w-full h-screen max-h-screen"
          }
        >
          {/* Toolbar - View Mode Toggle & Screenshot Button */}
          {messages.length > 0 && <ChatToolbar locale={locale} />}

          {/* Logo/Branding - Only show in linear view */}
          {viewMode === "linear" && messages.length > 0 && (
            <ChatBranding locale={locale} />
          )}

          {/* Messages Area - Full height, scrollable inside */}
          <Div className="max-w-screen overflow-hidden h-screen h-max-screen">
            {thread ? (
              <ChatMessages
                inputHeight={inputHeight}
                locale={locale}
                logger={logger}
                currentUserId={currentUserId}
              />
            ) : rootFolderId === "public" && !chat.currentSubFolderId ? (
              // Public folder root (no subfolder) - show feed view
              <PublicFeed locale={locale} />
            ) : (
              // Empty state for new threads - show suggestions
              <ChatEmptyState locale={locale} inputHeight={inputHeight} />
            )}
          </Div>

          {/* Input Container */}
          {shouldShowInput && (
            <ChatInputContainer
              locale={locale}
              logger={logger}
              inputContainerRef={inputContainerRef}
            />
          )}

          {/* AI Tools Modal */}
          <AIToolsModal locale={locale} logger={logger} />
        </Div>
      </Div>
    </KeyboardAvoidingView>
  );
}
