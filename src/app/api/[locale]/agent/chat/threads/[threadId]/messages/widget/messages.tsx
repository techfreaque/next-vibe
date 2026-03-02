"use client";

import { success } from "next-vibe/shared/types/response.schema";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import type { DivRefObject } from "next-vibe-ui/ui/div";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
import { useBranchManagement } from "@/app/api/[locale]/agent/chat/hooks/use-branch-management";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import {
  useFullLoadFallback,
  useLazyBranchLoader,
} from "@/app/api/[locale]/agent/chat/hooks/use-lazy-branch-loader";
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
import { useCollapseState } from "../hooks/use-collapse-state";
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
 * @param path Full message path
 * @param expansions How many compaction segments to expand backwards (0 = from last compaction)
 * @returns Start index into path for rendering
 */
function computeRenderWindowStart(
  path: ChatMessage[],
  expansions: number,
): { startIndex: number; hasTrimmedMessages: boolean } {
  const compactionIndices = findCompactionIndices(path);

  if (compactionIndices.length === 0) {
    // No compaction points — render everything
    return { startIndex: 0, hasTrimmedMessages: false };
  }

  // Target compaction index: last one minus expansions
  // e.g. 3 compaction points, 0 expansions → use index 2 (last), 1 expansion → index 1, etc.
  const targetIdx = compactionIndices.length - 1 - expansions;

  if (targetIdx <= 0) {
    // Expanded past all compaction points — render everything
    return { startIndex: 0, hasTrimmedMessages: false };
  }

  // Safety: clamp to valid range (targetIdx > 0 guaranteed by check above)
  const clampedIdx = Math.min(targetIdx, compactionIndices.length - 1);
  const startIndex = compactionIndices[clampedIdx];
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
  const isDataLoaded = useChatStore((s) => s.isDataLoaded);
  const threadLoadMode = useChatStore((s) => s.threadLoadMode);
  const setThreadLoadMode = useChatStore((s) => s.setThreadLoadMode);
  const addMessage = useChatStore((s) => s.addMessage);
  const chatSetLoading = useChatStore((s) => s.setLoading);
  const chatGetThreadMessages = useChatStore((s) => s.getThreadMessages);
  const chatGetBranchIndices = useChatStore((s) => s.getBranchIndices);
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
        { id: selectedCharacter },
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
      getBranchIndices: chatGetBranchIndices,
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

  // Branch management
  const branchManagement = useBranchManagement({
    activeThreadMessages,
    threadId: activeThreadId || "",
    logger,
  });
  const { branchIndices, handleSwitchBranch } = branchManagement;

  // Lazy branch loader — pass SSR path data so no client fetch on hydration
  const {
    branchMeta,
    isLoadingBranch: rawIsLoadingBranch,
    hasOlderHistory,
    isLoadingOlderHistory,
    loadOlderHistory,
    invalidateThread,
  } = useLazyBranchLoader(
    locale,
    logger,
    activeThreadId,
    threads,
    branchIndices,
    addMessage,
    setThreadLoadMode,
    isDataLoaded,
    user,
    // Only use SSR path data for the thread we had at boot time
    activeThreadId === bootInitialThreadId ? initialPathData : null,
  );

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

  // Always-on WS subscription for all stream events on this thread
  useMessagesSubscription(activeThreadId, logger, {
    onCreditsDeducted: (data) => {
      deductCredits(data.amount, data.feature);
    },
    invalidateThread,
  });

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
  const historyTopSentinelRef = useRef<DivRefObject>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  // Render window: number of compaction segments expanded backwards from the end.
  // 0 = show only from last compaction forward; 1 = include previous segment; etc.
  const [renderWindowExpansions, setRenderWindowExpansions] = useState(0);
  const renderWindowThreadRef = useRef<string | null>(null);
  const lastMessageContentRef = useRef<string>("");
  const wasAtBottomBeforeStreamingRef = useRef<boolean>(true);
  const isStreamingRef = useRef<boolean>(false);
  const scrollAnimationFrameRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const userInteractingRef = useRef<boolean>(false);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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

      const existingMsg = messageMap.get(streamMsg.messageId);
      if (existingMsg) {
        // Update existing message with streaming content and metadata
        messageMap.set(streamMsg.messageId, {
          ...existingMsg,
          content: streamMsg.content,
          metadata: {
            ...existingMsg.metadata,
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
          depth: streamMsg.depth,
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

  // Flat view: sorted messages by timestamp (memoized)
  const flatSortedMessages = useMemo(
    () =>
      mergedMessages.toSorted(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      ),
    [mergedMessages],
  );

  // Threaded view: memoized grouping, primary messages, and root messages
  const threadedMessageGroups = useMemo(
    () => groupMessagesBySequence(mergedMessages),
    [mergedMessages],
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
      mergedMessages.filter((msg) => {
        const group = threadedMessageToGroupMap.get(msg.id);
        return !group || group.primary.id === msg.id;
      }),
    [mergedMessages, threadedMessageToGroupMap],
  );

  const threadedRootMessages = useMemo(
    () => getRootMessages(threadedPrimaryMessages, null),
    [threadedPrimaryMessages],
  );

  // Memoized callback: onStartRetry wrapper for linear view (looks up message by ID)
  const handleLinearStartRetry = useCallback(
    (messageId: string): void => {
      const msg = mergedMessages.find((m) => m.id === messageId);
      if (msg) {
        void startRetry(msg);
      }
    },
    [mergedMessages, startRetry],
  );

  // Track compaction count to auto-reset render window when a new compaction appears during streaming
  const compactionCount = mergedMessages.filter(
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

  // Check if user is at bottom of scroll
  const isAtBottom = useCallback((): boolean => {
    const container = messagesContainerRef.current;
    if (!container) {
      return true;
    }

    const threshold = 50; // pixels from bottom - smaller threshold for more precise detection
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Handle scroll events to detect user scrolling up
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = (): void => {
      const atBottom = isAtBottom();
      const scrolledUp = !atBottom;

      setUserScrolledUp(scrolledUp);

      // If user scrolls back to bottom while streaming, re-enable auto-scroll
      if (!scrolledUp && isStreamingRef.current) {
        wasAtBottomBeforeStreamingRef.current = true;
        userInteractingRef.current = false;
      }
      // If user scrolls up while streaming, disable auto-scroll
      else if (scrolledUp && isStreamingRef.current) {
        wasAtBottomBeforeStreamingRef.current = false;
      }
    };

    // Detect user interaction (wheel, touch, keyboard)
    const handleUserInteraction = (): void => {
      userInteractingRef.current = true;

      // Clear existing timeout
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }

      // Reset interaction flag after 150ms of no interaction
      interactionTimeoutRef.current = setTimeout(() => {
        userInteractingRef.current = false;
      }, 150);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleUserInteraction, {
      passive: true,
    });
    container.addEventListener("touchstart", handleUserInteraction, {
      passive: true,
    });
    container.addEventListener("touchmove", handleUserInteraction, {
      passive: true,
    });
    container.addEventListener("keydown", handleUserInteraction, {
      passive: true,
    });

    return (): void => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleUserInteraction);
      container.removeEventListener("touchstart", handleUserInteraction);
      container.removeEventListener("touchmove", handleUserInteraction);
      container.removeEventListener("keydown", handleUserInteraction);

      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, [isAtBottom]);

  // Track which threads have had their initial scroll-to-bottom performed.
  // Using a Set so switching back to an already-scrolled thread doesn't re-scroll.
  const initialScrollDoneRef = useRef<Set<string>>(new Set());

  // Reset render window when thread changes (but NOT scroll tracking)
  useEffect(() => {
    const currentThreadId = activeThread?.id ?? null;
    if (renderWindowThreadRef.current !== currentThreadId) {
      setRenderWindowExpansions(0);
      renderWindowThreadRef.current = currentThreadId;
    }
  }, [activeThread?.id]);

  // Scroll to bottom on mount, thread change, and when messages first arrive
  useEffect(() => {
    const currentThreadId = activeThread?.id ?? null;

    // Skip if we've already scrolled for this thread
    if (currentThreadId && initialScrollDoneRef.current.has(currentThreadId)) {
      return;
    }

    // Don't auto-scroll for public folder
    if (currentRootFolderId === "public") {
      return;
    }

    // Wait for messages to be available before scrolling
    if (activeThreadMessages.length === 0) {
      return;
    }

    // Mark scroll as done for this thread
    if (currentThreadId) {
      initialScrollDoneRef.current.add(currentThreadId);
    }

    // For long threads, the DOM may not be fully laid out when messages first load.
    // Use instant scroll (no animation) to jump to bottom immediately, then retry
    // after a delay to catch any late-rendering content (images, code blocks, etc.)
    const scrollToEnd = (): void => {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
      });
    };

    // Immediate scroll (catches most cases)
    scrollToEnd();

    // Retry after a frame to catch async-rendered content
    const raf = requestAnimationFrame(() => {
      scrollToEnd();
    });

    // Final retry after a short delay for lazy-loaded content (images, etc.)
    const timeout = setTimeout(() => {
      scrollToEnd();
    }, 300);

    return (): void => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [activeThread?.id, activeThreadMessages, currentRootFolderId]);

  // Smart auto-scroll: only during streaming, only if user was at bottom, respect user scroll
  useEffect(() => {
    // Get the last message
    const allMessages = Object.values(activeThreadMessages);
    const lastMessage = allMessages.at(-1);
    if (!lastMessage) {
      return;
    }

    // Check if content is actually changing (streaming)
    const contentChanged =
      lastMessage.content !== lastMessageContentRef.current;
    const isCurrentlyStreaming = isLoading && contentChanged;

    // Track streaming state changes
    const wasStreaming = isStreamingRef.current;
    isStreamingRef.current = isCurrentlyStreaming;

    // When streaming starts, capture if user is at bottom
    if (isCurrentlyStreaming && !wasStreaming) {
      wasAtBottomBeforeStreamingRef.current = !userScrolledUp;
    }

    if (!isCurrentlyStreaming && wasStreaming) {
      wasAtBottomBeforeStreamingRef.current = true;
    }

    lastMessageContentRef.current = lastMessage.content ?? "";

    // Only auto-scroll if:
    // 1. Currently streaming
    // 2. User was at bottom when streaming started
    // 3. User hasn't scrolled up since
    // 4. User is not actively interacting with scroll
    if (
      isCurrentlyStreaming &&
      wasAtBottomBeforeStreamingRef.current &&
      !userScrolledUp &&
      !userInteractingRef.current
    ) {
      // Cancel any pending scroll animation
      if (scrollAnimationFrameRef.current !== null) {
        cancelAnimationFrame(scrollAnimationFrameRef.current);
      }

      // Throttle scroll updates to smooth out fast and slow streams
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTimeRef.current;
      const minScrollInterval = 200; // Minimum 200ms between scrolls - increased for easier escape

      if (timeSinceLastScroll >= minScrollInterval) {
        // Scroll immediately if enough time has passed
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
          lastScrollTimeRef.current = now;
        }
      } else {
        // Schedule a scroll for later to avoid too frequent updates
        scrollAnimationFrameRef.current = requestAnimationFrame(() => {
          const container = messagesContainerRef.current;
          if (container && !userInteractingRef.current) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
            lastScrollTimeRef.current = Date.now();
          }
          scrollAnimationFrameRef.current = null;
        });
      }
    }

    // Cleanup on unmount
    return (): void => {
      if (scrollAnimationFrameRef.current !== null) {
        cancelAnimationFrame(scrollAnimationFrameRef.current);
      }
    };
  }, [activeThreadMessages, isLoading, userScrolledUp]);

  // Scroll-up sentinel: IntersectionObserver to trigger loading older history
  const prevScrollHeightRef = useRef<number>(0);
  useEffect(() => {
    if (!hasOlderHistory) {
      return;
    }

    const sentinel = historyTopSentinelRef.current;
    const container = messagesContainerRef.current;
    if (!sentinel || !container) {
      return;
    }

    // DivRefObject is backed by HTMLDivElement at runtime (see Div forwardRef).
    // IntersectionObserver requires Element, so we use an intersection type.
    const containerElement = container as DivRefObject & Element;
    const sentinelElement = sentinel as DivRefObject & Element;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasOlderHistory && !isLoadingOlderHistory) {
          // Capture scroll height before loading to preserve position after
          prevScrollHeightRef.current = container.scrollHeight;
          loadOlderHistory();
        }
      },
      {
        root: containerElement,
        rootMargin: "200px 0px 0px 0px", // Trigger 200px before actually reaching top
        threshold: 0,
      },
    );

    observer.observe(sentinelElement);
    return (): void => {
      observer.disconnect();
    };
  }, [hasOlderHistory, isLoadingOlderHistory, loadOlderHistory]);

  // Preserve scroll position after older history is inserted above
  useEffect(() => {
    if (prevScrollHeightRef.current === 0) {
      return;
    }

    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    // After new messages render above, adjust scroll to maintain visual position
    const newScrollHeight = container.scrollHeight;
    const heightDiff = newScrollHeight - prevScrollHeightRef.current;
    if (heightDiff > 0) {
      container.scrollTop += heightDiff;
    }
    prevScrollHeightRef.current = 0;
  });

  return (
    <Div
      ref={messagesContainerRef}
      id={DOM_IDS.MESSAGES_CONTAINER}
      className={cn(
        "h-full overflow-y-auto scroll-smooth",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-400/30 hover:scrollbar-thumb-blue-500/50 scrollbar-thumb-rounded-full",
      )}
    >
      {/* Sticky logo - inside scroll container for proper sticky behavior */}
      {/* Uses h-0 overflow-visible so it doesn't push content down on md+ (same line layout) */}
      {/* Below md: content has pt-20 to position below logo (separate line) */}
      {/* z-[1] so message editors (z-10+) appear above the logo */}
      {showBranding && (
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
            showBranding ? "pt-35 md:pt-15" : "pt-15",
          )}
        >
          {/* Scroll-up sentinel for loading older history */}
          {(hasOlderHistory || isLoadingOlderHistory) && (
            <Div
              ref={historyTopSentinelRef}
              className="flex justify-center py-2"
            >
              {isLoadingOlderHistory ? (
                <Div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  <Span className="text-xs text-muted-foreground">
                    {ts("loadingOlderMessages")}
                  </Span>
                </Div>
              ) : (
                <Span className="text-xs text-muted-foreground">
                  {ts("scrollUpForOlderMessages")}
                </Span>
              )}
            </Div>
          )}
          {mergedMessages.length === 0 && !isLoading && !isLoadingBranch ? (
            <Div style={{ minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh` }}>
              <Div className="flex items-center justify-center h-full">
                {/* Empty state — no messages and not loading */}
              </Div>
            </Div>
          ) : mergedMessages.length === 0 && (isLoading || isLoadingBranch) ? (
            <Div style={{ minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh` }}>
              <Div className="flex items-center justify-center h-full">
                <Div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              </Div>
            </Div>
          ) : viewMode === ViewMode.FLAT ? (
            // Flat view (4chan style) - ALL messages in chronological order
            activeThread ? (
              <FlatMessageView
                thread={activeThread}
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
                onDeleteMessage={messageDeleteActions.handleDeleteMessage}
              />
            ) : null
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
              const { path, branchInfo } = buildMessagePath(
                mergedMessages,
                branchIndices,
              );

              // With partial load, augment branchInfo with server-provided
              // branchMeta for fork points whose siblings aren't loaded yet
              const isPartiallyLoaded =
                activeThreadId && threadLoadMode[activeThreadId] === "partial";

              if (isPartiallyLoaded && branchMeta.length > 0) {
                for (const meta of branchMeta) {
                  // Only add if buildMessagePath didn't already find this fork point
                  // (it wouldn't if siblings aren't in the store yet)
                  if (!branchInfo[meta.parentId]) {
                    // Create placeholder siblings — BranchNavigator only needs id and content
                    const placeholderSiblings = [
                      ...Array<number>(meta.siblingCount).keys(),
                    ].map(
                      (i) =>
                        ({
                          id: `lazy-placeholder-${meta.parentId}-${i}`,
                          content: "",
                        }) as ChatMessage,
                    );
                    branchInfo[meta.parentId] = {
                      siblings: placeholderSiblings,
                      currentIndex: meta.currentIndex,
                    };
                  }
                }
              }

              // Render window trimming: only render from last compaction boundary forward
              // to keep DOM size small in long sessions with multiple compactions.
              // Expands backwards compaction-by-compaction on scroll-up.
              const { startIndex, hasTrimmedMessages } =
                computeRenderWindowStart(path, renderWindowExpansions);

              const visiblePath =
                startIndex > 0 ? path.slice(startIndex) : path;

              return (
                <>
                  {/* Render window sentinel: expand backwards when scrolled to top */}
                  {hasTrimmedMessages && (
                    <Div className="flex justify-center py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        onClick={(): void => {
                          // Capture scroll height before expansion for position preservation
                          const container = messagesContainerRef.current;
                          if (container) {
                            prevScrollHeightRef.current =
                              container.scrollHeight;
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
                  />
                </>
              );
            })()
          )}

          <Div ref={messagesEndRef} />
        </Div>
      </Div>
    </Div>
  );
}
