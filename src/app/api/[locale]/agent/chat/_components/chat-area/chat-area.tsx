"use client";

import { useSafeAreaInsets } from "next-vibe-ui/hooks/use-safe-area-insets";
import { Div, type DivRefObject } from "next-vibe-ui/ui/div";
import { KeyboardAvoidingView } from "next-vibe-ui/ui/keyboard-avoiding-view";
import type { JSX } from "react";
import React, { useRef } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { NEW_MESSAGE_ID, ViewMode } from "@/app/api/[locale]/agent/chat/enum";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useInputHeight } from "@/app/api/[locale]/agent/chat/hooks/use-input-height";
import { AIToolsModal } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/ai-tools-modal";
import { ChatInputContainer } from "@/app/api/[locale]/agent/chat/threads/_components/chat-input/input-container";
import { ChatEmptyState } from "@/app/api/[locale]/agent/chat/threads/_components/new-thread/empty-state";
import { PublicFeed } from "@/app/api/[locale]/agent/chat/threads/_components/public-feed/public-feed";
import { ChatToolbar } from "@/app/api/[locale]/agent/chat/threads/[threadId]/_components/toolbar";
import { ChatMessages } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/_components/messages";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

interface ChatAreaProps {
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
}

export function ChatArea({ locale, logger, user }: ChatAreaProps): JSX.Element {
  const chat = useChatContext();
  const {
    activeThread: thread,
    activeThreadMessages: messages,
    viewMode,
    currentRootFolderId: rootFolderId,
    activeThreadId,
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

  const isLoadingThread = !!activeThreadId && activeThreadId !== NEW_MESSAGE_ID;

  return (
    <KeyboardAvoidingView
      className="h-screen h-max-screen flex-1"
      keyboardVerticalOffset={0}
    >
      <Div
        style={
          platform.isReactNative ? { paddingTop: insets.top + 60 } : undefined
        }
      >
        <Div
          className={
            platform.isReactNative
              ? "flex-1 flex flex-col min-w-0 relative w-full"
              : "w-full h-screen max-h-screen"
          }
        >
          {/* Toolbar - View Mode Toggle & Screenshot Button */}
          {messages.length > 0 && (
            <ErrorBoundary locale={locale}>
              <ChatToolbar locale={locale} />
            </ErrorBoundary>
          )}

          {/* Messages Area - Full height, scrollable inside */}
          <ErrorBoundary locale={locale}>
            <Div className="max-w-screen overflow-hidden h-screen h-max-screen">
              {thread ? (
                <ChatMessages
                  inputHeight={inputHeight}
                  locale={locale}
                  logger={logger}
                  currentUserId={user?.id}
                  user={user}
                  showBranding={
                    viewMode === ViewMode.LINEAR && messages.length > 0
                  }
                />
              ) : rootFolderId === "public" && !chat.currentSubFolderId ? (
                // Public folder root (no subfolder) - show feed view
                <PublicFeed locale={locale} />
              ) : isLoadingThread ? (
                <Div className="flex-1 flex flex-col gap-5">
                  <Div className="h-10" />
                </Div>
              ) : (
                <ChatEmptyState locale={locale} inputHeight={inputHeight} />
              )}
            </Div>
          </ErrorBoundary>

          {/* Input Container */}
          {shouldShowInput && (
            <ErrorBoundary locale={locale}>
              <ChatInputContainer
                locale={locale}
                logger={logger}
                user={user}
                inputContainerRef={inputContainerRef}
              />
            </ErrorBoundary>
          )}

          {/* AI Tools Modal */}
          <ErrorBoundary locale={locale}>
            <AIToolsModal locale={locale} logger={logger} />
          </ErrorBoundary>
        </Div>
      </Div>
    </KeyboardAvoidingView>
  );
}
