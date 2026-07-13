/**
 * Custom Widget for Messages List
 *
 * Context-aware: when inside a ChatBootProvider, renders the full interactive
 * ChatMessages component (streaming, branch nav, edit, etc.).
 * When standalone (e.g. ai-stream/run embeds), renders read-only LinearMessageView.
 */

"use client";

import { Div } from "next-vibe/ui/ui/div";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetSelector,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LAYOUT,
  useInputHeight,
} from "@/app/[locale]/chat/lib/config/constants";
import { buildMessagePath } from "@/app/[locale]/chat/lib/utils/thread-builder";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { useProviderAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { platform } from "@/config/env-client";

import type definition from "../definition";
import messagesDefinition from "../definition";
import { LinearMessageView } from "./linear-view/view";
import { ChatMessages } from "./messages";

/**
 * Messages Widget Container
 *
 * When rendered inside a ChatBootProvider (full chat page): delegates to ChatMessages
 * which provides streaming, branch navigation, scroll management, all view modes,
 * and full interactive callbacks.
 *
 * When rendered standalone (ai-stream/run embeds): renders a read-only LinearMessageView.
 */
export const MessagesWidget = React.memo(
  function MessagesWidget(): React.JSX.Element {
    const bootContext = useContext(ChatBootContext);
    const isEmbedded = useChatNavigationStore((s) => s.isEmbedded);

    // Interactive mode: inside a ChatBootProvider and not an embedded read-only view
    if (bootContext && !isEmbedded) {
      return <InteractiveMessages />;
    }

    // Read-only mode: standalone embed or no ChatBootProvider
    return <ReadOnlyMessages />;
  },
);

/**
 * Interactive messages - renders the full ChatMessages component.
 * Reads settings and messages from scoped stores directly.
 */
function InteractiveMessages(): React.JSX.Element {
  return <ChatMessages showBranding />;
}

/**
 * CLI polling hook — fetches messages directly inside the React tree via
 * executeQuery + useState. React Query's setQueryData from outside the render
 * cycle doesn't trigger Ink's reconciler; this hook guarantees re-renders.
 */
function useCliMessages(widgetMessages: ChatMessage[]): ChatMessage[] {
  const isCli = typeof window === "undefined" && !platform.isReactNative;
  const [cliMessages, setCliMessages] = useState<ChatMessage[] | null>(null);
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const availability = useProviderAvailability();
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);

  const poll = useCallback(async () => {
    if (!activeThreadId) {
      return;
    }
    const { executeQuery } =
      await import("next-vibe/platforms/react/hooks/query-executor");
    const response = await executeQuery<typeof messagesDefinition.GET>({
      endpoint: messagesDefinition.GET,
      logger,
      requestData: {
        rootFolderId,
      } as (typeof messagesDefinition.GET)["types"]["RequestOutput"],
      pathParams: {
        threadId: activeThreadId,
      } as (typeof messagesDefinition.GET)["types"]["UrlVariablesOutput"],
      locale,
      user,
      availability,
    });
    if (response?.success) {
      setCliMessages(
        response.data.messages.map((msg) => ({
          ...msg,
          createdAt:
            msg.createdAt instanceof Date
              ? msg.createdAt
              : new Date(msg.createdAt),
          updatedAt:
            msg.updatedAt instanceof Date
              ? msg.updatedAt
              : new Date(msg.updatedAt),
        })),
      );
    }
  }, [activeThreadId, rootFolderId, logger, locale, user, availability]);

  useEffect(() => {
    if (!isCli || !activeThreadId) {
      return;
    }
    // Initial fetch
    void poll();
    const interval = setInterval(() => {
      void poll();
    }, 1000);
    return (): void => {
      clearInterval(interval);
    };
  }, [isCli, activeThreadId, poll]);

  if (!isCli) {
    return widgetMessages;
  }
  return cliMessages ?? widgetMessages;
}

/**
 * Read-only messages - renders LinearMessageView with all callbacks null.
 * Used by ai-stream/run embeds where no ChatBootProvider exists.
 */
function ReadOnlyMessages(): React.JSX.Element {
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const inputHeight = useInputHeight();
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);

  // Subscribe only to the messages array - re-renders when messages change,
  // NOT when streamingState or backgroundTasks change.
  const rawMessages = useWidgetSelector<typeof definition.GET>()(
    (d) => d?.messages || [],
  );

  // CLI: poll directly inside React tree since setQueryData from outside
  // doesn't trigger Ink's reconciler
  const effectiveMessages = useCliMessages(rawMessages);

  const messages: ChatMessage[] = useMemo(() => {
    if (effectiveMessages.length === 0) {
      return [];
    }
    return effectiveMessages.map((msg) => {
      const createdAt =
        msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt);
      const updatedAt =
        msg.updatedAt instanceof Date ? msg.updatedAt : new Date(msg.updatedAt);
      return { ...msg, authorName: null, createdAt, updatedAt };
    });
  }, [effectiveMessages]);

  const emptyBranchIndices = useMemo(() => ({}), []);
  const { path, branchInfo } = useMemo(
    () => buildMessagePath(messages, emptyBranchIndices),
    [messages, emptyBranchIndices],
  );

  const emptyAttachments = useMemo<File[]>(() => [], []);

  if (path.length === 0) {
    return <Div />;
  }

  return (
    <Div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      <Div className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10 flex flex-col gap-5 pt-15 w-full">
        <Div
          style={{
            paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
          }}
        >
          <LinearMessageView
            messages={path}
            threadId={activeThreadId ?? null}
            branchInfo={branchInfo}
            locale={locale}
            logger={logger}
            currentUserId={null}
            user={user}
            collapseState={null}
            rootFolderId={DefaultFolderId.PRIVATE}
            subFolderId={null}
            onRetryMessage={null}
            onSwitchBranch={null}
            onBranchMessage={null}
            onStartEdit={null}
            onStartRetry={null}
            onStartAnswer={null}
            answerAsAI={null}
            onCancelAction={null}
            onCancelQueued={null}
            editingMessageId={null}
            retryingMessageId={null}
            answeringMessageId={null}
            answerContent=""
            onSetAnswerContent={null}
            editorAttachments={emptyAttachments}
            isLoadingRetryAttachments={false}
            selectedSkill={null}
            selectedModel={null}
            sendMessage={null}
            onLoadNewerHistory={null}
            isLoadingNewerHistory={false}
            onVoteMessage={null}
            ttsAutoplay={false}
            voiceId={undefined}
          />
        </Div>
      </Div>
    </Div>
  );
}
