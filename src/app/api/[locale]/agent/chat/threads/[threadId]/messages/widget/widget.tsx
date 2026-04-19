/**
 * Custom Widget for Messages List
 *
 * Context-aware: when inside a ChatBootProvider, renders the full interactive
 * ChatMessages component (streaming, branch nav, edit, etc.).
 * When standalone (e.g. ai-stream/run embeds), renders read-only LinearMessageView.
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import React, { useContext, useMemo } from "react";

import { buildMessagePath } from "@/app/[locale]/chat/lib/utils/thread-builder";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetSelector,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "../definition";
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
 * Read-only messages - renders LinearMessageView with all callbacks null.
 * Used by ai-stream/run embeds where no ChatBootProvider exists.
 */
function ReadOnlyMessages(): React.JSX.Element {
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();

  // Subscribe only to the messages array — re-renders when messages change,
  // NOT when streamingState or backgroundTasks change.
  const rawMessages = useWidgetSelector<typeof definition.GET>()(
    (d) => d?.messages || [],
  );

  const messages: ChatMessage[] = useMemo(() => {
    if (rawMessages.length === 0) {
      return [];
    }
    return rawMessages.map((msg) => {
      const createdAt =
        msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt);
      const updatedAt =
        msg.updatedAt instanceof Date ? msg.updatedAt : new Date(msg.updatedAt);
      return { ...msg, authorName: null, createdAt, updatedAt };
    });
  }, [rawMessages]);

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
    <Div className="flex flex-col gap-5">
      <LinearMessageView
        messages={path}
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
  );
}
