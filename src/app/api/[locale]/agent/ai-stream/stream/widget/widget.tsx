/**
 * AI Stream Widget
 *
 * Full-page chat area layout — toolbar, messages via EndpointsPage, real ChatInputContainer.
 * The ChatInputContainer/ChatInput already reads from useChatInputStore and calls useAIStream
 * directly, so input state is already controlled by the ai-stream layer.
 */

"use client";

import { useSafeAreaInsets } from "next-vibe-ui/hooks/use-safe-area-insets";
import { Div, type DivRefObject } from "next-vibe-ui/ui/div";
import { KeyboardAvoidingView } from "next-vibe-ui/ui/keyboard-avoiding-view";
import type { JSX } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { NEW_MESSAGE_ID } from "@/app/api/[locale]/agent/chat/enum";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatStore } from "@/app/api/[locale]/agent/chat/hooks/store";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import messagesDefinition from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition";
import { ChatEmptyState } from "@/app/api/[locale]/agent/chat/threads/widget/new-thread/empty-state";
import { AIToolsModal } from "@/app/api/[locale]/agent/tools/widget/ai-tools-modal";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetLocale,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { platform } from "@/config/env-client";

import type definition from "../definition";
import type { AiStreamPostResponseOutput } from "../definition";
import { ChatInputContainer } from "./input-container";
import { ChatToolbar } from "./toolbar";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useInputHeight(
  inputContainerRef: React.RefObject<DivRefObject | null>,
): number {
  const [inputHeight, setInputHeight] = useState<number>(120);

  useEffect(() => {
    if (platform.isReactNative) {
      return;
    }
    if (!inputContainerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setInputHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(inputContainerRef.current as Element);

    return (): void => {
      resizeObserver.disconnect();
    };
  }, [inputContainerRef]);

  return inputHeight;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface CustomWidgetProps {
  field: {
    value: AiStreamPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

// ─── Main Widget ─────────────────────────────────────────────────────────────

function AiStreamChatArea(): JSX.Element {
  const { initialMessagesData, initialThreadId } = useChatBootContext();

  const locale = useWidgetLocale();
  const user = useWidgetUser();

  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);
  const pendingNewThreadIds = useChatStore((s) => s.pendingNewThreadIds);

  const isThreadPending =
    !!activeThreadId && pendingNewThreadIds.has(activeThreadId);

  const threadIdToRender =
    activeThreadId && activeThreadId !== NEW_MESSAGE_ID ? activeThreadId : null;

  const messagesInitialData =
    threadIdToRender && threadIdToRender === initialThreadId
      ? initialMessagesData
      : null;

  const inputContainerRef = useRef<DivRefObject>(null);
  const inputHeight = useInputHeight(inputContainerRef);
  const insets = useSafeAreaInsets();

  const messagesEndpointOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { threadId: threadIdToRender ?? "" },
        initialState: { rootFolderId },
        queryOptions: { enabled: !!threadIdToRender && !isThreadPending },
        ...(messagesInitialData ? { initialData: messagesInitialData } : {}),
      },
    }),
    [threadIdToRender, rootFolderId, isThreadPending, messagesInitialData],
  );

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
          {/* Toolbar */}
          {activeThreadId && activeThreadId !== NEW_MESSAGE_ID && (
            <ErrorBoundary locale={locale}>
              <ChatToolbar locale={locale} />
            </ErrorBoundary>
          )}

          {/* Messages area */}
          <ErrorBoundary locale={locale}>
            <Div className="max-w-screen overflow-hidden h-screen h-max-screen">
              {threadIdToRender ? (
                <EndpointsPage
                  key={threadIdToRender}
                  endpoint={{ GET: messagesDefinition.GET }}
                  endpointOptions={messagesEndpointOptions}
                  className="h-full"
                  locale={locale}
                  user={user}
                />
              ) : (
                <ChatEmptyState locale={locale} inputHeight={inputHeight} />
              )}
            </Div>
          </ErrorBoundary>

          {/* Input */}
          <ErrorBoundary locale={locale}>
            <ChatInputContainer inputContainerRef={inputContainerRef} />
          </ErrorBoundary>

          {/* AI Tools Modal */}
          <ErrorBoundary locale={locale}>
            <AIToolsModal locale={locale} user={user} />
          </ErrorBoundary>
        </Div>
      </Div>
    </KeyboardAvoidingView>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AiStreamWidget(_props: CustomWidgetProps): JSX.Element {
  return <AiStreamChatArea />;
}
