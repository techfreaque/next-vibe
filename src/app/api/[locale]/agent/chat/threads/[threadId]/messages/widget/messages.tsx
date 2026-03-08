"use client";

import { success } from "next-vibe/shared/types/response.schema";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import type { DivRefObject } from "next-vibe-ui/ui/div";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { Logo } from "@/app/[locale]/_components/logo";
import {
  DOM_IDS,
  LAYOUT,
  QUOTE_CHARACTER,
} from "@/app/[locale]/chat/lib/config/constants";
import {
  buildMessagePath,
  getDirectReplies,
  getRootMessages,
} from "@/app/[locale]/chat/lib/utils/thread-builder";
import { useChatInputStore } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/input-store";
import { useAIStream } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/use-ai-stream";
import characterDefinitions from "@/app/api/[locale]/agent/chat/characters/[id]/definition";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatStore } from "@/app/api/[locale]/agent/chat/hooks/store";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import { ChatSettingsRepositoryClient } from "@/app/api/[locale]/agent/chat/settings/repository-client";
import { useCredits } from "@/app/api/[locale]/credits/hooks";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { platform } from "@/config/env-client";

import { NEW_MESSAGE_ID, ViewMode } from "../../../../enum";
import { loadMessageAttachments } from "../hooks/load-message-attachments";
import { useStreamingMessagesStore } from "../hooks/streaming-messages-store";
import { useBranchManagement } from "../hooks/use-branch-management";
import { useCollapseState } from "../hooks/use-collapse-state";
import {
  useFullLoadFallback,
  useLazyBranchLoader,
} from "../hooks/use-lazy-branch-loader";
import { useMessageDeleteActions } from "../hooks/use-message-delete-actions";
import { useMessageEditorStore } from "../hooks/use-message-editor-store";
import { useMessagesSubscription } from "../hooks/use-messages-subscription";
import { useMessageOperations } from "../hooks/use-operations";
import { scopedTranslation } from "../i18n";
import { FlatMessageView } from "./flat-view/view";
import { LinearMessageView } from "./linear-view/view";
import { groupMessagesBySequence } from "./message-grouping";
import { ThreadedMessage } from "./threaded-view/view";

/**
 * Find compaction point indices in a message path.
 * Returns indices where messages have isCompacting = true, sorted ascending.
 */
function findCompactionIndices(path: ChatMessage[]): number[] {
  const indices: number[] = [];
  for (let i = 0; i < path.length; i++) {
    if (path[i].metadata?.isCompacting) {
      indices.push(i);
    }
  }
  return indices;
}

/**
 * Compute the render window start index based on compaction boundaries.
 * Default: keep the last 2 compaction boundaries visible.
 * Each "expansion" step reveals one more older compaction segment.
 *
 * e.g. 4 compaction points [0, 10, 40, 70], expansions=0 → startIndex=10 (shows last 2: idx 1..3)
 *      expansions=1 → startIndex=0 (shows all)
 */
function computeRenderWindowStart(
  path: ChatMessage[],
  expansions: number,
): { startIndex: number; hasTrimmedMessages: boolean } {
  const compactionIndices = findCompactionIndices(path);

  // Keep 2 compactions visible by default. Each expansion adds one more.
  const VISIBLE_COMPACTIONS = 2;

  if (compactionIndices.length <= VISIBLE_COMPACTIONS) {
    // Not enough compactions to trim anything
    return { startIndex: 0, hasTrimmedMessages: false };
  }

  // How many compactions to hide: total - visible - extra expansions
  const toHide = compactionIndices.length - VISIBLE_COMPACTIONS - expansions;

  if (toHide <= 0) {
    // Expanded to show everything
    return { startIndex: 0, hasTrimmedMessages: false };
  }

  // Start from the compaction at position toHide (0-indexed)
  const startIndex = compactionIndices[toHide];
  return { startIndex, hasTrimmedMessages: startIndex > 0 };
}

interface ChatMessagesProps {
  inputHeight?: number;
  /** Whether to show the branding logo (sticky inside scroll container) */
  showBranding: boolean;
}

export function ChatMessages({
  inputHeight = LAYOUT.DEFAULT_INPUT_HEIGHT,
  showBranding,
}: ChatMessagesProps): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const currentUserId = user?.id;
  const { t: ts } = scopedTranslation.scopedT(locale);

  // Boot context for stable server-origin values
  const {
    initialCredits,
    initialPathData,
    initialThreadId: bootInitialThreadId,
    initialSettingsData,
    initialCharacterData,
  } = useChatBootContext();

  // Navigation state from Zustand store
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const currentRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const currentSubFolderId = useChatNavigationStore(
    (s) => s.currentSubFolderId,
  );

  // Chat store state
  const threads = useChatStore((s) => s.threads);
  const allMessages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const threadLoadMode = useChatStore((s) => s.threadLoadMode);
  const setThreadLoadMode = useChatStore((s) => s.setThreadLoadMode);
  const addMessage = useChatStore((s) => s.addMessage);
  const chatSetLoading = useChatStore((s) => s.setLoading);
  const chatGetThreadMessages = useChatStore((s) => s.getThreadMessages);
  const chatDeleteMessage = useChatStore((s) => s.deleteMessage);
  const chatUpdateMessage = useChatStore((s) => s.updateMessage);

  // Derived state
  const activeThread = activeThreadId
    ? (threads[activeThreadId] ?? null)
    : null;
  const activeThreadMessages = useMemo(() => {
    if (!activeThreadId || activeThreadId === NEW_MESSAGE_ID) {
      return [];
    }
    const stored = Object.values(allMessages)
      .filter((msg) => msg.threadId === activeThreadId)
      .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    // Fall back to SSR path data on first render (before useEffect populates Zustand).
    // Only use for the boot thread — navigated-to threads must fetch fresh.
    if (
      stored.length === 0 &&
      activeThreadId === bootInitialThreadId &&
      initialPathData?.messages &&
      initialPathData.messages.length > 0
    ) {
      return initialPathData.messages.map((msg) => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
        updatedAt: new Date(msg.updatedAt),
      }));
    }
    return stored;
  }, [activeThreadId, allMessages, bootInitialThreadId, initialPathData]);

  // Settings — pass SSR initialData so no client fetch on hydration
  const { settings } = useChatSettings(user, logger, initialSettingsData);
  const defaults = ChatSettingsRepositoryClient.getDefaults();
  const effectiveSettings = settings ?? defaults;
  const viewMode = effectiveSettings.viewMode;
  const selectedCharacter = effectiveSettings.selectedCharacter;
  const selectedModel = effectiveSettings.selectedModel;

  // Pre-seed character React Query cache from SSR data so useCharacter() callers
  // (grouped-assistant-message, threaded-view, flat-message) find it cached on mount.
  // Only seed once (ref guard) to avoid overwriting user-triggered updates.
  const characterSeedDoneRef = useRef(false);
  useEffect(() => {
    if (
      !characterSeedDoneRef.current &&
      initialCharacterData &&
      selectedCharacter
    ) {
      characterSeedDoneRef.current = true;
      apiClient.updateEndpointData(
        characterDefinitions.GET,
        logger,
        (old) => old ?? success(initialCharacterData),
        { urlPathParams: { id: selectedCharacter } },
      );
    }
  }, [initialCharacterData, selectedCharacter, logger]);

  // Credits
  const creditsHook = useCredits(user, logger, initialCredits);
  const noopDeduct = useCallback((): void => {
    // No-op when credits hook is not available
  }, []);
  const deductCredits = creditsHook?.deductCredits ?? noopDeduct;

  // AI Stream
  const aiStream = useAIStream();

  // Input store
  const setInput = useChatInputStore((s) => s.setInput);
  const setAttachments = useChatInputStore((s) => s.setAttachments);
  const chatInput = useChatInputStore((s) => s.input);
  const chatInputRef = useChatInputStore((s) => s.inputRef);

  // Message operations
  const messageOps = useMessageOperations({
    aiStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    chatStore: {
      messages: allMessages,
      threads,
      setLoading: chatSetLoading,
      getThreadMessages: chatGetThreadMessages,
      deleteMessage: chatDeleteMessage,
      updateMessage: chatUpdateMessage,
    },
    settings: {
      selectedModel: effectiveSettings.selectedModel,
      selectedCharacter: effectiveSettings.selectedCharacter,
      allowedTools: effectiveSettings.allowedTools,
      pinnedTools: effectiveSettings.pinnedTools,
      ttsAutoplay: effectiveSettings.ttsAutoplay,
      ttsVoice: effectiveSettings.ttsVoice,
    },
    setInput,
    setAttachments,
  });

  const {
    deleteMessage,
    retryMessage,
    branchMessage,
    answerAsAI,
    sendMessage,
    voteMessage,
  } = messageOps;

  // leafMessageId lives in the navigation store — seeded from server URL, updated by branch switches
  const leafMessageId = useChatNavigationStore((s) => s.leafMessageId);
  const setLeafMessageId = useChatNavigationStore((s) => s.setLeafMessageId);

  // Lazy branch loader — fetches all messages in the branch window (path + siblings).
  // Sentinel messages (BOUNDARY_OLDER / BOUNDARY_NEWER) are injected server-side and stored
  // in the Zustand messages store — no client-side hasOlderHistory / hasNewerMessages state.
  const {
    isLoadingBranch: rawIsLoadingBranch,
    isLoadingOlderHistory,
    loadOlderHistory,
    isLoadingNewerHistory,
    loadNewerHistory,
    invalidateThread,
  } = useLazyBranchLoader(
    locale,
    logger,
    activeThreadId,
    threads,
    leafMessageId,
    addMessage,
    chatUpdateMessage,
    setThreadLoadMode,
    user,
    // Only use SSR path data for the thread we had at boot time
    activeThreadId === bootInitialThreadId ? initialPathData : null,
    currentRootFolderId,
    setLeafMessageId,
  );

  // Branch management — derives branchIndices from leafMessageId + loaded messages
  const { branchIndices, handleSwitchBranch } = useBranchManagement({
    activeThreadMessages,
    leafMessageId,
    threadId: activeThreadId || "",
    logger,
  });

  // Full load fallback for non-linear views
  const needsFullLoad =
    effectiveSettings.viewMode !== ViewMode.LINEAR &&
    effectiveSettings.viewMode !== ViewMode.DEBUG;
  const { isUpgrading: isUpgradingToFullLoad } = useFullLoadFallback(
    locale,
    logger,
    activeThreadId,
    threadLoadMode,
    addMessage,
    setThreadLoadMode,
    needsFullLoad,
    user,
  );

  const isLoadingBranch = rawIsLoadingBranch || isUpgradingToFullLoad;

  // Message delete actions — register callback in delete dialog store
  const messageDeleteActions = useMessageDeleteActions({
    messagesRecord: allMessages,
    deleteMessage: messageOps.deleteMessage,
  });

  // Streaming state from navigation store
  const startStream = useChatNavigationStore((s) => s.startStream);
  const stopStream = useChatNavigationStore((s) => s.stopStream);

  // Always-on WS subscription for all stream events on this thread
  useMessagesSubscription(
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    logger,
    {
      onCreditsDeducted: (data) => {
        deductCredits(data.amount, data.feature);
      },
      invalidateThread,
      onStreamStarted: activeThreadId
        ? (): void => startStream(activeThreadId, logger)
        : undefined,
      onStreamFinished: activeThreadId
        ? (): void => stopStream(activeThreadId, logger)
        : undefined,
      ttsAutoplay: effectiveSettings.ttsAutoplay,
    },
  );

  // Editor state from Zustand store (decoupled from context)
  const editingMessageId = useMessageEditorStore((s) => s.editingMessageId);
  const retryingMessageId = useMessageEditorStore((s) => s.retryingMessageId);
  const answeringMessageId = useMessageEditorStore((s) => s.answeringMessageId);
  const answerContent = useMessageEditorStore((s) => s.answerContent);
  const editorAttachments = useMessageEditorStore((s) => s.editorAttachments);
  const isLoadingRetryAttachments = useMessageEditorStore(
    (s) => s.isLoadingRetryAttachments,
  );
  const startEdit = useMessageEditorStore((s) => s.startEdit);
  const startAnswer = useMessageEditorStore((s) => s.startAnswer);
  const cancelEditorAction = useMessageEditorStore((s) => s.cancelAction);
  const setAnswerContent = useMessageEditorStore((s) => s.setAnswerContent);
  const setLoadingRetryAttachments = useMessageEditorStore(
    (s) => s.setLoadingRetryAttachments,
  );
  const setEditorAttachments = useMessageEditorStore(
    (s) => s.setEditorAttachments,
  );
  const setRetrying = useMessageEditorStore((s) => s.setRetrying);

  // Async startRetry — loads attachments then sets retrying state
  const startRetry = useCallback(
    async (message: ChatMessage) => {
      cancelEditorAction();
      setLoadingRetryAttachments(true);
      const attachments = await loadMessageAttachments(message, logger);
      setEditorAttachments(attachments);
      setRetrying(message.id);
    },
    [
      cancelEditorAction,
      setLoadingRetryAttachments,
      setEditorAttachments,
      setRetrying,
      logger,
    ],
  );
  // Memoized callback: scroll to message when reference is clicked (flat view)
  const handleFlatMessageClick = useCallback((messageId: string): void => {
    const element = document.querySelector(
      `#${CSS.escape(`${DOM_IDS.MESSAGE_PREFIX}${messageId}`)}`,
    );
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  // Memoized callback: insert quote character (flat view)
  const handleInsertQuote = useCallback(() => {
    setInput(chatInput + QUOTE_CHARACTER);
    chatInputRef.current?.focus();
  }, [setInput, chatInput, chatInputRef]);

  const collapseState = useCollapseState();
  const messagesContainerRef = useRef<DivRefObject>(null);
  const messagesEndRef = useRef<DivRefObject>(null);
  // Render window: number of compaction segments expanded backwards from the end.
  // 0 = show only from last compaction forward; 1 = include previous segment; etc.
  const [renderWindowExpansions, setRenderWindowExpansions] = useState(0);
  const renderWindowThreadRef = useRef<string | null>(null);
  // Sticky-bottom: true = we are pinned to the bottom and should stay there.
  // Flipped to false the moment the user scrolls up; flipped back when they
  // scroll back down to within BOTTOM_THRESHOLD px of the bottom.
  const stickyBottomRef = useRef<boolean>(true);
  // Whether user is actively touching (suppresses our instant-scroll during gesture)
  const touchActiveRef = useRef<boolean>(false);

  // Get streaming messages from the messages store
  const streamingMessages = useStreamingMessagesStore(
    (s) => s.streamingMessages,
  );

  // Merge streaming messages with persisted messages for instant UI updates
  const mergedMessages = useMemo(() => {
    const messageMap = new Map<string, ChatMessage>();

    // Add all persisted messages first
    for (const msg of activeThreadMessages) {
      messageMap.set(msg.id, msg);
    }

    // Override with streaming messages (they have the latest content)
    // IMPORTANT: Only merge streaming messages that belong to the current thread
    for (const streamMsg of Object.values(streamingMessages)) {
      // Skip streaming messages from other threads
      if (activeThreadId && streamMsg.threadId !== activeThreadId) {
        continue;
      }

      // Token fields from streaming store (available after TOKENS_UPDATED event)
      const streamingTokenMetadata = {
        ...(streamMsg.promptTokens !== undefined
          ? { promptTokens: streamMsg.promptTokens }
          : {}),
        ...(streamMsg.completionTokens !== undefined
          ? { completionTokens: streamMsg.completionTokens }
          : {}),
        ...(streamMsg.totalTokens !== undefined
          ? { totalTokens: streamMsg.totalTokens }
          : {}),
        ...(streamMsg.cachedInputTokens !== undefined
          ? { cachedInputTokens: streamMsg.cachedInputTokens }
          : {}),
        ...(streamMsg.cacheWriteTokens !== undefined
          ? { cacheWriteTokens: streamMsg.cacheWriteTokens }
          : {}),
        ...(streamMsg.timeToFirstToken !== undefined
          ? { timeToFirstToken: streamMsg.timeToFirstToken }
          : {}),
        ...(streamMsg.creditCost !== undefined
          ? { creditCost: streamMsg.creditCost }
          : {}),
        ...(streamMsg.finishReason !== undefined
          ? { finishReason: streamMsg.finishReason ?? undefined }
          : {}),
      };

      const existingMsg = messageMap.get(streamMsg.messageId);
      if (existingMsg) {
        // Update existing message with streaming content and metadata
        messageMap.set(streamMsg.messageId, {
          ...existingMsg,
          content: streamMsg.content,
          metadata: {
            ...existingMsg.metadata,
            ...streamingTokenMetadata,
            ...(streamMsg.toolCall ? { toolCall: streamMsg.toolCall } : {}),
            ...(streamMsg.isCompacting !== undefined
              ? { isCompacting: streamMsg.isCompacting }
              : {}),
            ...(streamMsg.compactedMessageCount !== undefined
              ? { compactedMessageCount: streamMsg.compactedMessageCount }
              : {}),
            ...(streamMsg.isStreaming !== undefined
              ? { isStreaming: streamMsg.isStreaming }
              : {}),
          },
        });
      } else {
        // Add new streaming message with all required fields
        messageMap.set(streamMsg.messageId, {
          id: streamMsg.messageId,
          threadId: streamMsg.threadId,
          role: streamMsg.role,
          content: streamMsg.content,
          parentId: streamMsg.parentId,
          model: streamMsg.model ?? null,
          character: streamMsg.character ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
          sequenceId: streamMsg.sequenceId ?? null,
          // Required fields with defaults
          authorId: null,
          authorName: null,
          isAI: streamMsg.role === "assistant",
          errorType: null,
          errorMessage: null,
          errorCode: null,
          metadata: {
            ...streamingTokenMetadata,
            ...(streamMsg.toolCall ? { toolCall: streamMsg.toolCall } : {}),
            ...(streamMsg.isCompacting !== undefined
              ? { isCompacting: streamMsg.isCompacting }
              : {}),
            ...(streamMsg.compactedMessageCount !== undefined
              ? { compactedMessageCount: streamMsg.compactedMessageCount }
              : {}),
            ...(streamMsg.isStreaming !== undefined
              ? { isStreaming: streamMsg.isStreaming }
              : {}),
          },
          upvotes: 0,
          downvotes: 0,
          searchVector: null,
        });
      }
    }

    return [...messageMap.values()];
  }, [activeThreadMessages, streamingMessages, activeThreadId]);

  // All merged messages are real messages — no sentinel filtering needed.
  const realMessages = mergedMessages;

  // Flat view: sorted messages by timestamp (memoized)
  const flatSortedMessages = useMemo(
    () =>
      realMessages.toSorted(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      ),
    [realMessages],
  );

  // Threaded view: memoized grouping, primary messages, and root messages
  const threadedMessageGroups = useMemo(
    () => groupMessagesBySequence(realMessages),
    [realMessages],
  );

  const threadedMessageToGroupMap = useMemo(() => {
    const map = new Map<string, (typeof threadedMessageGroups)[0]>();
    for (const group of threadedMessageGroups) {
      map.set(group.primary.id, group);
      for (const continuation of group.continuations) {
        map.set(continuation.id, group);
      }
    }
    return map;
  }, [threadedMessageGroups]);

  const threadedPrimaryMessages = useMemo(
    () =>
      realMessages.filter((msg) => {
        const group = threadedMessageToGroupMap.get(msg.id);
        return !group || group.primary.id === msg.id;
      }),
    [realMessages, threadedMessageToGroupMap],
  );

  const threadedRootMessages = useMemo(
    () => getRootMessages(threadedPrimaryMessages, null),
    [threadedPrimaryMessages],
  );

  // Memoized callback: onStartRetry wrapper for linear view (looks up message by ID)
  const handleLinearStartRetry = useCallback(
    (messageId: string): void => {
      const msg = realMessages.find((m) => m.id === messageId);
      if (msg) {
        void startRetry(msg);
      }
    },
    [realMessages, startRetry],
  );

  // Track compaction count to auto-reset render window when a new compaction appears during streaming
  const compactionCount = realMessages.filter(
    (msg) => msg.metadata?.isCompacting === true,
  ).length;
  const prevCompactionCountRef = useRef(compactionCount);
  useEffect(() => {
    if (compactionCount > prevCompactionCountRef.current) {
      // New compaction just appeared — reset render window to show from latest compaction
      setRenderWindowExpansions(0);
    }
    prevCompactionCountRef.current = compactionCount;
  }, [compactionCount]);

  // Sticky-bottom scroll listener.
  // On scroll: update stickyBottomRef + userScrolledUp state.
  // Touch start/end: bracket the gesture so we never fight an in-progress swipe.
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    const BOTTOM_THRESHOLD = 80; // px — snap back to sticky when this close to bottom

    const handleScroll = (): void => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distFromBottom = scrollHeight - scrollTop - clientHeight;
      const atBottom = distFromBottom < BOTTOM_THRESHOLD;

      stickyBottomRef.current = atBottom;
    };

    const handleTouchStart = (): void => {
      touchActiveRef.current = true;
    };
    const handleTouchEnd = (): void => {
      touchActiveRef.current = false;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, {
      passive: true,
    });

    return (): void => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  // Track which threads have had their initial scroll-to-bottom performed.
  const initialScrollDoneRef = useRef<Set<string>>(new Set());

  // Reset render window + sticky state when thread changes
  useEffect(() => {
    const currentThreadId = activeThread?.id ?? null;
    if (renderWindowThreadRef.current !== currentThreadId) {
      setRenderWindowExpansions(0);
      renderWindowThreadRef.current = currentThreadId;
      // New thread: start sticky
      stickyBottomRef.current = true;
    }
  }, [activeThread?.id]);

  const hasAnyMessages = activeThreadMessages.length > 0;

  // Sticky-bottom: after every render, if we're pinned and not mid-touch, snap to bottom.
  // useLayoutEffect fires synchronously after DOM commit so scrollHeight is up to date.
  // This is the single source of truth for auto-scroll — no separate streaming detection.
  useLayoutEffect(() => {
    // Initial scroll-to-bottom once per thread (not just during streaming)
    const currentThreadId = activeThread?.id ?? null;
    if (
      currentThreadId &&
      !initialScrollDoneRef.current.has(currentThreadId) &&
      hasAnyMessages &&
      currentRootFolderId !== "public"
    ) {
      initialScrollDoneRef.current.add(currentThreadId);
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
      return;
    }

    // Ongoing sticky: snap to bottom instantly so streaming content feels responsive.
    if (!stickyBottomRef.current || touchActiveRef.current) {
      return;
    }
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });

  // After older history inserts above (via button click): restore scroll position so the view doesn't jump.
  // Captures both scrollTop and scrollHeight at click time; restores after messages render.
  const prevScrollRef = useRef<{
    scrollTop: number;
    scrollHeight: number;
  } | null>(null);
  useLayoutEffect(() => {
    if (!prevScrollRef.current) {
      return;
    }
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }
    const { scrollTop: prevScrollTop, scrollHeight: prevScrollHeight } =
      prevScrollRef.current;
    const heightDiff = container.scrollHeight - prevScrollHeight;
    if (heightDiff > 0) {
      // New content inserted above — shift scrollTop by the height increase
      container.scrollTop = prevScrollTop + heightDiff;
      prevScrollRef.current = null;
    }
    // If heightDiff <= 0, content not yet rendered — keep ref so next render can adjust.
  });

  return (
    <Div
      ref={messagesContainerRef}
      id={DOM_IDS.MESSAGES_CONTAINER}
      className={cn(
        "h-full overflow-y-auto",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-400/30 hover:scrollbar-thumb-blue-500/50 scrollbar-thumb-rounded-full",
      )}
    >
      {/* Sticky logo - inside scroll container for proper sticky behavior */}
      {/* Uses h-0 overflow-visible so it doesn't push content down on md+ (same line layout) */}
      {/* Below md: content has pt-20 to position below logo (separate line) */}
      {/* z-[1] so message editors (z-10+) appear above the logo */}
      {showBranding && viewMode === ViewMode.LINEAR && (
        <Div className="sticky top-0 z-1 h-0 overflow-visible pointer-events-none">
          <Div className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10 pt-15">
            <Div className="pointer-events-auto flex bg-background/20 backdrop-blur rounded-lg p-2 shadow-sm border border-border/20 w-fit">
              <Logo locale={locale} disabled size="h-10" />
            </Div>
          </Div>
        </Div>
      )}

      {/* Inner container with consistent padding and dynamic bottom padding */}
      {/* On native: no bottom padding needed since input is in normal flow */}
      <Div
        id={DOM_IDS.MESSAGES_CONTENT}
        style={
          platform.isReactNative
            ? { paddingBottom: LAYOUT.MESSAGES_BOTTOM_PADDING }
            : {
                paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
              }
        }
      >
        {/*
          Responsive top padding:
          - With branding (LINEAR view):
            - Below md: pt-35 (logo on separate line above)
            - md+: pt-15 (first message next to logo)
          - Without branding (FLAT/THREADED/DEBUG views):
            - pt-15 to clear the top toolbar
        */}
        <Div
          className={cn(
            "max-w-3xl mx-auto px-4 sm:px-8 md:px-10 flex flex-col gap-5",
            showBranding && viewMode === ViewMode.LINEAR
              ? "pt-35 md:pt-15"
              : "pt-15",
          )}
        >
          {/* Loading spinner for older history — shown while request is in-flight */}
          {isLoadingOlderHistory && (
            <Div className="flex justify-center py-2">
              <Div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                <Span className="text-xs text-muted-foreground">
                  {ts("loadingOlderMessages")}
                </Span>
              </Div>
            </Div>
          )}
          {realMessages.length === 0 && !isLoading && !isLoadingBranch ? (
            <Div style={{ minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh` }}>
              <Div className="flex items-center justify-center h-full">
                {/* Empty state — no messages and not loading */}
              </Div>
            </Div>
          ) : realMessages.length === 0 && (isLoading || isLoadingBranch) ? (
            <Div style={{ minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh` }}>
              <Div className="flex items-center justify-center h-full">
                <Div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              </Div>
            </Div>
          ) : viewMode === ViewMode.FLAT ? (
            // Flat view (4chan style) - ALL messages in chronological order
            <FlatMessageView
              messages={flatSortedMessages}
              locale={locale}
              logger={logger}
              onMessageClick={handleFlatMessageClick}
              onInsertQuote={handleInsertQuote}
              currentUserId={currentUserId}
              user={user}
              onBranchMessage={branchMessage}
              onRetryMessage={retryMessage}
              onAnswerAsModel={answerAsAI}
              onReplyMessage={async (parentMessageId, content, attachments) => {
                await sendMessage({
                  content,
                  parentId: parentMessageId,
                  attachments,
                });
              }}
              onDeleteMessage={messageDeleteActions.handleDeleteMessage}
              onVoteMessage={voteMessage}
            />
          ) : viewMode === ViewMode.THREADED ? (
            // Threaded view (Reddit style) - Show ALL messages, not just current path
            threadedRootMessages.map((rootMessage) => (
              <ErrorBoundary key={rootMessage.id} locale={locale}>
                <ThreadedMessage
                  message={rootMessage}
                  messageGroup={threadedMessageToGroupMap.get(rootMessage.id)}
                  replies={getDirectReplies(
                    threadedPrimaryMessages,
                    rootMessage.id,
                  )}
                  allMessages={threadedPrimaryMessages}
                  messageToGroupMap={threadedMessageToGroupMap}
                  depth={0}
                  locale={locale}
                  logger={logger}
                  collapseState={collapseState}
                  currentUserId={currentUserId}
                  onBranchMessage={branchMessage}
                  onRetryMessage={retryMessage}
                  onAnswerAsModel={answerAsAI}
                  onReplyMessage={async (
                    parentMessageId,
                    content,
                    attachments,
                  ) => {
                    await sendMessage({
                      content,
                      parentId: parentMessageId,
                      attachments,
                    });
                  }}
                  onVoteMessage={voteMessage}
                  onDeleteMessage={messageDeleteActions.handleDeleteMessage}
                  user={user}
                  ttsAutoplay={effectiveSettings.ttsAutoplay}
                  deductCredits={deductCredits}
                  ttsVoice={effectiveSettings.ttsVoice}
                />
              </ErrorBoundary>
            ))
          ) : (
            // Linear view (ChatGPT style) - Build path through message tree
            ((): JSX.Element => {
              const { path: realPath, branchInfo } = buildMessagePath(
                realMessages,
                branchIndices,
                leafMessageId,
              );

              // Render window trimming: only render from last compaction boundary forward
              // to keep DOM size small in long sessions with multiple compactions.
              // Expands backwards compaction-by-compaction on scroll-up.
              const { startIndex, hasTrimmedMessages } =
                computeRenderWindowStart(realPath, renderWindowExpansions);

              const visiblePath =
                startIndex > 0 ? realPath.slice(startIndex) : realPath;

              // The oldest loaded message ID for the "load older" request.
              // When there are trimmed messages, the oldest LOADED message is realPath[0].
              // When nothing is trimmed, it's realPath[0] as well.
              const oldestLoadedId = realPath[0]?.id ?? null;

              return (
                <>
                  {/* Load older history button — shown when oldest message has hasOlderHistory flag */}
                  {realPath[0]?.metadata?.hasOlderHistory === true &&
                    !isLoadingOlderHistory &&
                    oldestLoadedId && (
                      <Div className="flex justify-center py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          onClick={(): void => {
                            // Anchor the current leaf before loading older history.
                            if (!leafMessageId) {
                              const currentLeaf = realPath.at(-1);
                              if (currentLeaf) {
                                setLeafMessageId(currentLeaf.id);
                              }
                            }
                            const container = messagesContainerRef.current;
                            if (container) {
                              prevScrollRef.current = {
                                scrollTop: container.scrollTop,
                                scrollHeight: container.scrollHeight,
                              };
                            }
                            loadOlderHistory(oldestLoadedId);
                          }}
                        >
                          {ts("showOlderMessages")}
                        </Button>
                      </Div>
                    )}

                  {/* Render window expand button: expand already-loaded messages backwards */}
                  {hasTrimmedMessages && (
                    <Div className="flex justify-center py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        onClick={(): void => {
                          const container = messagesContainerRef.current;
                          if (container) {
                            prevScrollRef.current = {
                              scrollTop: container.scrollTop,
                              scrollHeight: container.scrollHeight,
                            };
                          }
                          setRenderWindowExpansions((prev) => prev + 1);
                        }}
                      >
                        {ts("showOlderMessages")}
                      </Button>
                    </Div>
                  )}

                  <LinearMessageView
                    messages={visiblePath}
                    branchInfo={branchInfo}
                    locale={locale}
                    logger={logger}
                    currentUserId={currentUserId ?? null}
                    user={user}
                    viewMode={viewMode}
                    collapseState={collapseState}
                    rootFolderId={currentRootFolderId}
                    subFolderId={currentSubFolderId}
                    onDeleteMessage={deleteMessage}
                    onRetryMessage={retryMessage}
                    onSwitchBranch={handleSwitchBranch}
                    onBranchMessage={branchMessage}
                    onStartEdit={startEdit}
                    onStartRetry={handleLinearStartRetry}
                    onStartAnswer={startAnswer}
                    answerAsAI={answerAsAI}
                    onCancelAction={cancelEditorAction}
                    editingMessageId={editingMessageId}
                    retryingMessageId={retryingMessageId}
                    answeringMessageId={answeringMessageId}
                    answerContent={answerContent}
                    onSetAnswerContent={setAnswerContent}
                    editorAttachments={editorAttachments}
                    isLoadingRetryAttachments={isLoadingRetryAttachments}
                    selectedCharacter={selectedCharacter}
                    selectedModel={selectedModel}
                    sendMessage={sendMessage}
                    deductCredits={deductCredits}
                    onLoadNewerHistory={loadNewerHistory}
                    isLoadingNewerHistory={isLoadingNewerHistory}
                    onVoteMessage={voteMessage}
                  />
                </>
              );
            })()
          )}

          {/* Loading spinner for newer history — shown while request is in-flight */}
          {isLoadingNewerHistory && (
            <Div className="flex justify-center py-2">
              <Div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                <Span className="text-xs text-muted-foreground">
                  {ts("loadingNewerMessages")}
                </Span>
              </Div>
            </Div>
          )}

          <Div ref={messagesEndRef} />
        </Div>
      </Div>
    </Div>
  );
}
