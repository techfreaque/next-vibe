/**
 * AI Stream Widget
 *
 * Full-page chat area layout - toolbar, messages via EndpointsPage, real ChatInputContainer.
 * The ChatInputContainer/ChatInput already reads from useChatInputStore and calls useAIStream
 * directly, so input state is already controlled by the ai-stream layer.
 */

"use client";

import { usePathname, useRouter } from "next-vibe-ui/hooks/use-navigation";
import { useResizeObserver } from "next-vibe-ui/hooks/use-resize-observer";
import { useSafeAreaInsets } from "next-vibe-ui/hooks/use-safe-area-insets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe-ui/ui/alert-dialog";
import { Div, type DivRefObject } from "next-vibe-ui/ui/div";
import { ErrorBoundary } from "next-vibe-ui/ui/error-boundary";
import { KeyboardAvoidingView } from "next-vibe-ui/ui/keyboard-avoiding-view";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { InputHeightProvider } from "@/app/[locale]/chat/lib/config/constants";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { NEW_MESSAGE_ID } from "@/app/api/[locale]/agent/chat/enum";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import publicFeedDefinition from "@/app/api/[locale]/agent/chat/public-feed/definition";
import messagesDefinition from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition";
import { useDeleteDialogStore } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/hooks/use-delete-dialog-store";
import { scopedTranslation } from "@/app/api/[locale]/agent/chat/threads/widget/i18n";
import { ChatEmptyState } from "@/app/api/[locale]/agent/chat/threads/widget/new-thread/empty-state";
import { CortexModal } from "@/app/api/[locale]/agent/cortex/widget/cortex-modal";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { AIToolsModal } from "@/app/api/[locale]/agent/tools/widget/ai-tools-modal";
import type { UseEndpointOptions } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { platform } from "@/config/env-client";
import { useTranslation } from "@/i18n/core/client";

import type definition from "../definition";
import type { AiStreamPostResponseOutput } from "../definition";
import { SidebarWrapper } from "./chat-ui/sidebar/sidebar-wrapper";
import { TopBar } from "./chat-ui/top-area/top-bar";
import { WelcomeTour } from "./chat-ui/welcome-tour/welcome-tour";
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
  const { initialMessagesData, initialPathData, initialThreadId } =
    useChatBootContext();

  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);

  const threadIdToRender =
    activeThreadId && activeThreadId !== NEW_MESSAGE_ID ? activeThreadId : null;

  // Prefer initialMessagesData (full messages list); fall back to initialPathData messages.
  // For optimistically created threads, read the pre-seeded cache so useQuery receives
  // initialData and doesn't fire a network fetch (which would 404 since the thread
  // doesn't exist in the DB yet).
  const messagesInitialData = useMemo(() => {
    if (!threadIdToRender) {
      return null;
    }
    // Boot thread: use SSR data
    if (threadIdToRender === initialThreadId) {
      if (initialMessagesData) {
        return initialMessagesData;
      }
      if (initialPathData?.messages?.length) {
        return {
          streamingState: "idle" as const,
          backgroundTasks: [],
          messages: initialPathData.messages,
        };
      }
      // Fall through to cache lookup below — optimistic threads trigger a route
      // change (TanStack loader) which updates initialThreadId to match the new
      // UUID, but there's no SSR data since the thread doesn't exist in the DB yet.
      // The pre-seeded React Query cache has the optimistic messages.
    }
    // Navigated-to thread or optimistic thread without SSR data:
    // check if cache was pre-seeded (optimistic creation)
    const cached = apiClient.getEndpointData(messagesDefinition.GET, logger, {
      urlPathParams: { threadId: threadIdToRender },
      requestData: { rootFolderId },
    });
    if (cached?.success) {
      return cached.data;
    }
    return null;
  }, [
    threadIdToRender,
    initialThreadId,
    initialMessagesData,
    initialPathData,
    logger,
    rootFolderId,
  ]);

  const inputContainerRef = useRef<DivRefObject>(null);
  const inputHeight = useInputHeight(inputContainerRef);
  const insets = useSafeAreaInsets();

  // Single endpoint instance - used both for pre-seeding (initialData) and as the
  // widget form owner passed into EndpointsPage via endpointInstance.
  const messagesReadOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { threadId: threadIdToRender ?? "" },
        initialState: { rootFolderId },
        queryOptions: { enabled: !!threadIdToRender, staleTime: Infinity },
        ...(messagesInitialData ? { initialData: messagesInitialData } : {}),
      },
      create: {
        urlPathParams: { threadId: threadIdToRender ?? "" },
      },
      subscribeToEvents: !!threadIdToRender,
    }),
    [threadIdToRender, rootFolderId, messagesInitialData],
  );
  const messagesEndpointInstance = useEndpoint(
    messagesDefinition,
    messagesReadOptions,
    logger,
    user,
  );
  interface MessagesGetEndpoint {
    GET: typeof messagesDefinition.GET;
  }
  // endpointOptions for EndpointsPage type constraint - only read needed since we pass GET only
  const messagesEndpointOptions = useMemo(
    (): UseEndpointOptions<MessagesGetEndpoint> => ({
      read: {
        urlPathParams: { threadId: threadIdToRender ?? "" },
        initialState: { rootFolderId },
        queryOptions: { enabled: !!threadIdToRender, staleTime: Infinity },
        ...(messagesInitialData ? { initialData: messagesInitialData } : {}),
      },
    }),
    [threadIdToRender, rootFolderId, messagesInitialData],
  );

  return (
    <KeyboardAvoidingView className="h-dvh flex-1" keyboardVerticalOffset={0}>
      <Div
        style={
          platform.isReactNative ? { paddingTop: insets.top + 60 } : undefined
        }
      >
        <InputHeightProvider height={inputHeight}>
          <Div
            className={
              platform.isReactNative
                ? "flex-1 flex flex-col min-w-0 relative w-full"
                : "w-full h-dvh"
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
              <Div className="max-w-screen overflow-hidden h-dvh">
                {threadIdToRender ? (
                  <EndpointsPage<MessagesGetEndpoint>
                    key={threadIdToRender}
                    endpoint={{ GET: messagesDefinition.GET }}
                    endpointOptions={messagesEndpointOptions}
                    endpointInstance={messagesEndpointInstance}
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

            {/* Cortex Modal */}
            <ErrorBoundary locale={locale}>
              <CortexModal locale={locale} user={user} />
            </ErrorBoundary>
          </Div>
        </InputHeightProvider>
      </Div>
    </KeyboardAvoidingView>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AiStreamWidget(_props: CustomWidgetProps): JSX.Element {
  return <AiStreamChatArea />;
}
