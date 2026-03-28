"use client";

import { Button } from "next-vibe-ui/ui/button";
import type { DivRefObject } from "next-vibe-ui/ui/div";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { Span } from "next-vibe-ui/ui/span";
import { success } from "next-vibe/shared/types/response.schema";
import { cn } from "next-vibe/shared/utils";
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
  useInputHeight,
} from "@/app/[locale]/chat/lib/config/constants";
import {
  buildMessagePath,
  getDirectReplies,
  getRootMessages,
} from "@/app/[locale]/chat/lib/utils/thread-builder";
import { useChatInputStore } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/input-store";
import { useAIStream } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/use-ai-stream";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatBootContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import { ChatSettingsRepositoryClient } from "@/app/api/[locale]/agent/chat/settings/repository-client";
import characterDefinitions from "@/app/api/[locale]/agent/chat/skills/[id]/definition";
import { useCredits } from "@/app/api/[locale]/credits/hooks";
import { parseError } from "next-vibe/shared/utils";

import { executeQuery } from "@/app/api/[locale]/system/unified-interface/react/hooks/query-executor";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { platform } from "@/config/env-client";

import type { MessageMetadata } from "../../../../db";
import { NEW_MESSAGE_ID, ViewMode } from "../../../../enum";
import folderContentsDefinition from "../../../../folder-contents/[rootFolderId]/definition";
import messagesDefinition from "../definition";
import { loadMessageAttachments } from "../hooks/load-message-attachments";
import { patchMessage, upsertMessage } from "../hooks/update-messages";
import { useBranchManagement } from "../hooks/use-branch-management";
import { useCollapseState } from "../hooks/use-collapse-state";
import { useMessageEditorStore } from "../hooks/use-message-editor-store";
import { useMessagesSubscription } from "../hooks/use-messages-subscription";
import { useMessageOperations } from "../hooks/use-operations";
import { scopedTranslation } from "../i18n";
import pathDefinitions from "../path/definition";
import { FlatMessageView } from "./flat-view/view";
import { LinearMessageView } from "./linear-view/view";
import { DebugLinearMessageView } from "./linear-view/view-debug";
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
  /** Whether to show the branding logo (sticky inside scroll container) */
  showBranding: boolean;
}

export function ChatMessages({ showBranding }: ChatMessagesProps): JSX.Element {
  const inputHeight = useInputHeight();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const locale = useWidgetLocale();
  const currentUserId = user?.id;
  const { t: ts } = scopedTranslation.scopedT(locale);

  // Boot context for stable server-origin values
  const {
    initialCredits,
    initialThreadId: bootInitialThreadId,
    initialSettingsData,
    initialSkillData,
  } = useChatBootContext();

  // Navigation state from Zustand store
  const activeThreadId = useChatNavigationStore((s) => s.activeThreadId);
  const currentRootFolderId = useChatNavigationStore(
    (s) => s.currentRootFolderId,
  );
  const currentSubFolderId = useChatNavigationStore(
    (s) => s.currentSubFolderId,
  );

  // Read messages reactively from the React Query / apiClient cache via useEndpoint.
  // staleTime: Infinity - data is managed via updateEndpointData/upsertMessage; never auto-refetch.
  const messagesEndpointOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { threadId: activeThreadId ?? "" },
        initialState: { rootFolderId: currentRootFolderId },
        queryOptions: {
          enabled: !!activeThreadId && activeThreadId !== NEW_MESSAGE_ID,
          staleTime: Infinity,
        },
      },
      create: {
        urlPathParams: { threadId: activeThreadId ?? "" },
      },
    }),
    [activeThreadId, currentRootFolderId],
  );
  const messagesEndpoint = useEndpoint(
    messagesDefinition,
    messagesEndpointOptions,
    logger,
    user,
  );

  const isLoading = messagesEndpoint.read?.isLoading ?? false;

  const activeThreadMessages: ChatMessage[] = useMemo(() => {
    if (!activeThreadId || activeThreadId === NEW_MESSAGE_ID) {
      return [];
    }
    const data = messagesEndpoint.read?.data;
    return (data?.messages ?? []).map((msg) => ({
      ...msg,
      createdAt:
        msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt),
      updatedAt:
        msg.updatedAt instanceof Date ? msg.updatedAt : new Date(msg.updatedAt),
    }));
  }, [messagesEndpoint.read?.data, activeThreadId]);

  // Settings - pass SSR initialData so no client fetch on hydration
  const { settings } = useChatSettings(user, logger, initialSettingsData);
  const defaults = ChatSettingsRepositoryClient.getDefaults();
  const effectiveSettings = settings ?? defaults;
  const viewMode = effectiveSettings.viewMode;
  const selectedSkill = effectiveSettings.selectedSkill;
  const selectedModel = effectiveSettings.selectedModel;

  // Pre-seed character React Query cache from SSR data so useSkill() callers
  // (grouped-assistant-message, threaded-view, flat-message) find it cached on mount.
  // Only seed once (ref guard) to avoid overwriting user-triggered updates.
  const characterSeedDoneRef = useRef(false);
  useEffect(() => {
    if (!characterSeedDoneRef.current && initialSkillData && selectedSkill) {
      characterSeedDoneRef.current = true;
      apiClient.updateEndpointData(
        characterDefinitions.GET,
        logger,
        (old) => old ?? success(initialSkillData),
        { urlPathParams: { id: selectedSkill } },
      );
    }
  }, [initialSkillData, selectedSkill, logger]);

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
  const chatInput = useChatInputStore((s) => s.input);
  const chatInputRef = useChatInputStore((s) => s.inputRef);

  // leafMessageId - read from nav store (single source of truth, syncs URL)
  // Written by setLeafMessageId which updates both the form field and the nav store.
  const navLeafMessageId = useChatNavigationStore((s) => s.leafMessageId);
  const navSetLeafMessageId = useChatNavigationStore((s) => s.setLeafMessageId);
  const messagesForm = useWidgetForm();
  const leafMessageId = navLeafMessageId;
  const setLeafMessageId = useCallback(
    (id: string | null) => {
      messagesForm?.setValue("leafMessageId", id ?? null);
      navSetLeafMessageId(id);
    },
    [messagesForm, navSetLeafMessageId],
  );

  // Message operations
  const messageOps = useMessageOperations({
    startStream: aiStream.startStream,
    cancelStream: aiStream.cancelStream,
    activeThreadId,
    currentRootFolderId,
    currentSubFolderId,
    leafMessageId,
    settings: {
      selectedModel: effectiveSettings.selectedModel,
      selectedSkill: effectiveSettings.selectedSkill,
      availableTools: effectiveSettings.availableTools,
      pinnedTools: effectiveSettings.pinnedTools,
      ttsAutoplay: effectiveSettings.ttsAutoplay,
      ttsVoice: effectiveSettings.ttsVoice,
    },
  });

  const { retryMessage, branchMessage, answerAsAI, sendMessage, voteMessage } =
    messageOps;

  // Loading states for branch/history operations
  const [isLoadingBranch, setIsLoadingBranch] = useState(false);
  const [isLoadingOlderHistory, setIsLoadingOlderHistory] = useState(false);
  const [isLoadingNewerHistory, setIsLoadingNewerHistory] = useState(false);

  // Abort controllers for in-flight requests (independent lifecycle per thread)
  const olderHistoryAbortRef = useRef<AbortController | null>(null);
  const newerHistoryAbortRef = useRef<AbortController | null>(null);
  const branchLoadAbortRef = useRef<AbortController | null>(null);

  // Keep a ref to current leafMessageId for async callbacks
  const leafMessageIdRef = useRef<string | null>(null);
  leafMessageIdRef.current = leafMessageId;

  /**
   * Branch chunk load - fires when activeThreadId changes.
   * Boot thread: skipped - messages are pre-seeded via initialData on EndpointsPage.
   * Navigated threads: fetch via pathDefinitions.GET, upsert into messages cache.
   */
  useEffect(() => {
    if (
      !activeThreadId ||
      activeThreadId === NEW_MESSAGE_ID ||
      activeThreadId === bootInitialThreadId ||
      messagesEndpoint.read?.data !== undefined
    ) {
      return;
    }

    branchLoadAbortRef.current?.abort();
    const controller = new AbortController();
    branchLoadAbortRef.current = controller;

    setIsLoadingBranch(true);

    const load = async (): Promise<void> => {
      try {
        const response = await executeQuery({
          endpoint: pathDefinitions.GET,
          logger,
          requestData: { rootFolderId: currentRootFolderId },
          pathParams: { threadId: activeThreadId },
          locale,
          user,
        });

        if (controller.signal.aborted) {
          return;
        }

        if (response.success) {
          const data = response.data;
          for (const message of data.messages ?? []) {
            upsertMessage(activeThreadId, currentRootFolderId, logger, {
              ...message,
              createdAt: new Date(message.createdAt),
              updatedAt: new Date(message.updatedAt),
            });
          }
          const resolvedLeaf = data.resolvedLeafMessageId;
          const currentLeaf = leafMessageIdRef.current;
          if (resolvedLeaf && resolvedLeaf !== currentLeaf) {
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.set("message", resolvedLeaf);
              window.history.replaceState(null, "", url.toString());
            }
            setLeafMessageId(resolvedLeaf);
          }
        } else if (!response.success && response.errorType?.errorCode === 404) {
          // Thread not yet persisted (new thread just created) - skip silently.
          // Messages will arrive via WS events as they are created.
          logger.debug("Chat: Branch load skipped - thread not found yet", {
            threadId: activeThreadId,
          });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          logger.error("Chat: Error loading branch chunk", {
            threadId: activeThreadId,
            error: parseError(error).message,
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingBranch(false);
        }
      }
    };

    void load();

    return (): void => {
      controller.abort();
    };
  }, [
    activeThreadId,
    bootInitialThreadId,
    currentRootFolderId,
    locale,
    logger,
    user,
    setLeafMessageId,
    messagesEndpoint.read?.data,
  ]);

  // Abort in-flight history requests when thread changes
  useEffect(() => {
    return (): void => {
      olderHistoryAbortRef.current?.abort();
      newerHistoryAbortRef.current?.abort();
    };
  }, [activeThreadId]);

  /**
   * Load older history (triggered by "Show older messages" button).
   */
  const loadOlderHistory = useCallback(
    (oldestMessageId: string): void => {
      if (!activeThreadId || isLoadingOlderHistory) {
        return;
      }
      olderHistoryAbortRef.current?.abort();
      const controller = new AbortController();
      olderHistoryAbortRef.current = controller;
      const threadId = activeThreadId;
      setIsLoadingOlderHistory(true);

      const load = async (): Promise<void> => {
        try {
          const response = await executeQuery({
            endpoint: pathDefinitions.GET,
            logger,
            requestData: {
              rootFolderId: currentRootFolderId,
              before: oldestMessageId,
            },
            pathParams: { threadId },
            locale,
            user,
          });

          if (controller.signal.aborted) {
            return;
          }

          if (response.success) {
            const data = response.data;

            // Clear hasOlderHistory flag on the current oldest message
            const cachedData = apiClient.getEndpointData(
              messagesDefinition.GET,
              logger,
              {
                urlPathParams: { threadId: activeThreadId },
                requestData: { rootFolderId: currentRootFolderId },
              },
            );
            const currentOldest = cachedData?.success
              ? (cachedData.data.messages.find(
                  (m) => m.id === oldestMessageId,
                ) ?? null)
              : null;
            if (currentOldest) {
              patchMessage(
                threadId,
                currentRootFolderId,
                logger,
                oldestMessageId,
                {
                  metadata: {
                    ...(currentOldest.metadata as MessageMetadata | null),
                    hasOlderHistory: false,
                  },
                },
              );
            }

            for (const message of data.messages ?? []) {
              upsertMessage(threadId, currentRootFolderId, logger, {
                ...message,
                createdAt: new Date(message.createdAt),
                updatedAt: new Date(message.updatedAt),
              });
            }

            // Clear stale hasNewerHistory flag if newer chunk already loaded
            if (data.newerChunkAnchorId) {
              const cachedAfter = apiClient.getEndpointData(
                messagesDefinition.GET,
                logger,
                {
                  urlPathParams: { threadId: activeThreadId },
                  requestData: { rootFolderId: currentRootFolderId },
                },
              );
              const msgs = cachedAfter?.success
                ? cachedAfter.data.messages
                : [];
              const alreadyLoaded = msgs.some(
                (m) => m.id === data.newerChunkAnchorId,
              );
              if (alreadyLoaded) {
                for (const msg of msgs) {
                  const meta = msg.metadata as MessageMetadata | null;
                  if (meta?.newerAnchorId === data.newerChunkAnchorId) {
                    patchMessage(
                      threadId,
                      currentRootFolderId,
                      logger,
                      msg.id,
                      {
                        metadata: {
                          ...meta,
                          hasNewerHistory: false,
                          newerAnchorId: null,
                        },
                      },
                    );
                    break;
                  }
                }
              }
            }
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            logger.error("Chat: Error loading older history", {
              threadId,
              error: parseError(error).message,
            });
          }
        } finally {
          if (!controller.signal.aborted) {
            setIsLoadingOlderHistory(false);
          }
        }
      };

      void load();
    },
    [
      activeThreadId,
      isLoadingOlderHistory,
      currentRootFolderId,
      locale,
      logger,
      user,
    ],
  );

  /**
   * Load newer history (triggered by "Show newer messages" button).
   */
  const loadNewerHistory = useCallback(
    (anchorId: string): void => {
      if (!activeThreadId || isLoadingNewerHistory) {
        return;
      }
      newerHistoryAbortRef.current?.abort();
      const controller = new AbortController();
      newerHistoryAbortRef.current = controller;
      const threadId = activeThreadId;
      setIsLoadingNewerHistory(true);

      const load = async (): Promise<void> => {
        try {
          const response = await executeQuery({
            endpoint: pathDefinitions.GET,
            logger,
            requestData: {
              rootFolderId: currentRootFolderId,
              leafMessageId: anchorId,
            },
            pathParams: { threadId },
            locale,
            user,
          });

          if (controller.signal.aborted) {
            return;
          }

          if (response.success) {
            const data = response.data;

            // Clear hasNewerHistory flag on the message that triggered this load
            const cachedData = apiClient.getEndpointData(
              messagesDefinition.GET,
              logger,
              {
                urlPathParams: { threadId: activeThreadId },
                requestData: { rootFolderId: currentRootFolderId },
              },
            );
            const msgs = cachedData?.success ? cachedData.data.messages : [];
            for (const msg of msgs) {
              const meta = msg.metadata as MessageMetadata | null;
              if (meta?.newerAnchorId === anchorId) {
                patchMessage(threadId, currentRootFolderId, logger, msg.id, {
                  metadata: {
                    ...meta,
                    hasNewerHistory: false,
                    newerAnchorId: null,
                  },
                });
                break;
              }
            }

            for (const message of data.messages ?? []) {
              upsertMessage(threadId, currentRootFolderId, logger, {
                ...message,
                createdAt: new Date(message.createdAt),
                updatedAt: new Date(message.updatedAt),
              });
            }

            const resolvedLeaf = data.resolvedLeafMessageId;
            if (resolvedLeaf) {
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("message", resolvedLeaf);
                window.history.replaceState(null, "", url.toString());
              }
              setLeafMessageId(resolvedLeaf);
            }
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            logger.error("Chat: Error loading newer history", {
              threadId,
              error: parseError(error).message,
            });
          }
        } finally {
          if (!controller.signal.aborted) {
            setIsLoadingNewerHistory(false);
          }
        }
      };

      void load();
    },
    [
      activeThreadId,
      isLoadingNewerHistory,
      currentRootFolderId,
      locale,
      logger,
      user,
      setLeafMessageId,
    ],
  );

  /**
   * Invalidate thread - refetch messages from server.
   * Called by useMessagesSubscription when a remote stream completes.
   */
  const invalidateThread = useCallback(
    (tid: string): void => {
      if (tid === activeThreadId && activeThreadId !== NEW_MESSAGE_ID) {
        void messagesEndpoint.read?.refetch();
      }
    },
    [activeThreadId, messagesEndpoint.read],
  );

  // Branch management - derives branchIndices from leafMessageId + loaded messages
  const { branchIndices, handleSwitchBranch } = useBranchManagement({
    activeThreadMessages,
    leafMessageId,
    setLeafMessageId,
    threadId: activeThreadId || "",
    logger,
  });

  // Streaming state from navigation store
  const startStream = useChatNavigationStore((s) => s.startStream);
  const stopStream = useChatNavigationStore((s) => s.stopStream);
  const setWaiting = useChatNavigationStore((s) => s.setWaiting);

  // Read initial streamingState from the folder-contents cache for page load recovery.
  // If the thread is in "waiting" state (task in flight, stream dead), restore stop button.
  const initialStreamingState = useMemo(() => {
    if (!activeThreadId) {
      return undefined;
    }
    const cached = apiClient.getEndpointData(
      folderContentsDefinition.GET,
      logger,
      {
        urlPathParams: { rootFolderId: currentRootFolderId },
        requestData: { subFolderId: currentSubFolderId ?? null },
      },
    );
    if (!cached?.success) {
      return undefined;
    }
    const item = cached.data.items.find(
      (i) => i.type === "thread" && i.id === activeThreadId,
    );
    return item?.streamingState ?? undefined;
  }, [activeThreadId, currentRootFolderId, currentSubFolderId, logger]);

  // Always-on WS subscription for all stream events on this thread
  useMessagesSubscription(
    activeThreadId !== NEW_MESSAGE_ID ? activeThreadId : null,
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
      onStreamingStateWaiting: activeThreadId
        ? (): void => setWaiting(activeThreadId, logger)
        : undefined,
      initialStreamingState,
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

  // Async startRetry - loads attachments then sets retrying state
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
  // Whether a smooth scroll-to-bottom animation is in progress (suppresses sticky snap)
  const smoothScrollingRef = useRef<boolean>(false);
  // Whether to show the scroll-to-bottom button (user has scrolled up)
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback((): void => {
    const container = messagesContainerRef.current;
    if (container) {
      smoothScrollingRef.current = true;
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, []);

  // All messages from cache are real messages - no merge or sentinel filtering needed.
  const realMessages = activeThreadMessages;

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
      // New compaction just appeared - reset render window to show from latest compaction
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

    const BOTTOM_THRESHOLD = 80; // px - snap back to sticky when this close to bottom
    const BUTTON_THRESHOLD = 800; // px - show scroll button when this far from bottom

    const handleScroll = (): void => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distFromBottom = scrollHeight - scrollTop - clientHeight;
      const atBottom = distFromBottom < BOTTOM_THRESHOLD;

      if (atBottom) {
        // Arrived at bottom - clear smooth scroll flag and re-engage sticky
        smoothScrollingRef.current = false;
      }
      stickyBottomRef.current = atBottom;
      setShowScrollButton(distFromBottom > BUTTON_THRESHOLD);
    };

    const handleTouchStart = (): void => {
      touchActiveRef.current = true;
    };
    const handleTouchEnd = (): void => {
      touchActiveRef.current = false;
    };

    // Run once on mount to set initial button visibility
    handleScroll();

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

  // Re-evaluate button visibility whenever messages change (content height may have changed)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollButton(distFromBottom > 800);
  }, [activeThreadMessages]);

  // Track which threads have had their initial scroll-to-bottom performed.
  const initialScrollDoneRef = useRef<Set<string>>(new Set());

  // Reset render window + sticky state when thread changes
  useEffect(() => {
    const currentThreadId = activeThreadId ?? null;
    if (renderWindowThreadRef.current !== currentThreadId) {
      setRenderWindowExpansions(0);
      renderWindowThreadRef.current = currentThreadId;
      // New thread: start sticky, clear any in-progress scroll
      stickyBottomRef.current = true;
      smoothScrollingRef.current = false;
      lastSnapScrollHeightRef.current = 0;
      setShowScrollButton(false);
    }
  }, [activeThreadId]);

  const hasAnyMessages = activeThreadMessages.length > 0;

  // Track the last scrollHeight we snapped to - only snap when content grows.
  const lastSnapScrollHeightRef = useRef<number>(0);

  // Sticky-bottom: after every render, if we're pinned and new content arrived, snap to bottom.
  // useLayoutEffect fires synchronously after DOM commit so scrollHeight is up to date.
  // Only snaps when scrollHeight increases (new content) - not on every render - so manual
  // scrolling near the bottom doesn't trigger a snap.
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    // Initial scroll-to-bottom once per thread (not just during streaming)
    const currentThreadId = activeThreadId ?? null;
    if (
      currentThreadId &&
      !initialScrollDoneRef.current.has(currentThreadId) &&
      hasAnyMessages &&
      currentRootFolderId !== "public"
    ) {
      initialScrollDoneRef.current.add(currentThreadId);
      container.scrollTop = container.scrollHeight;
      lastSnapScrollHeightRef.current = container.scrollHeight;
      return;
    }

    // Ongoing sticky: snap only when scrollHeight has grown (new content streamed in).
    // Skip if smooth scroll in progress or touch active.
    if (
      !stickyBottomRef.current ||
      touchActiveRef.current ||
      smoothScrollingRef.current
    ) {
      return;
    }
    if (container.scrollHeight <= lastSnapScrollHeightRef.current) {
      return;
    }
    container.scrollTop = container.scrollHeight;
    lastSnapScrollHeightRef.current = container.scrollHeight;
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
      // New content inserted above - shift scrollTop by the height increase
      container.scrollTop = prevScrollTop + heightDiff;
      prevScrollRef.current = null;
    }
    // If heightDiff <= 0, content not yet rendered - keep ref so next render can adjust.
  });

  return (
    <Div className="relative h-full">
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
            {/* Loading spinner for older history - shown while request is in-flight */}
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
                  {/* Empty state - no messages and not loading */}
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
                    {/* Load older history button - shown when oldest message has hasOlderHistory flag */}
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

                    <ErrorBoundary locale={locale}>
                      {viewMode === ViewMode.DEBUG ? (
                        <DebugLinearMessageView
                          messages={visiblePath}
                          branchInfo={branchInfo}
                          locale={locale}
                          logger={logger}
                          currentUserId={currentUserId ?? null}
                          user={user}
                          collapseState={collapseState}
                          rootFolderId={currentRootFolderId}
                          subFolderId={currentSubFolderId}
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
                          selectedSkill={selectedSkill}
                          selectedModel={selectedModel}
                          sendMessage={sendMessage}
                          deductCredits={deductCredits}
                          onLoadNewerHistory={loadNewerHistory}
                          isLoadingNewerHistory={isLoadingNewerHistory}
                          onVoteMessage={voteMessage}
                          ttsAutoplay={effectiveSettings.ttsAutoplay}
                          ttsVoice={effectiveSettings.ttsVoice}
                        />
                      ) : (
                        <LinearMessageView
                          messages={visiblePath}
                          branchInfo={branchInfo}
                          locale={locale}
                          logger={logger}
                          currentUserId={currentUserId ?? null}
                          user={user}
                          collapseState={collapseState}
                          rootFolderId={currentRootFolderId}
                          subFolderId={currentSubFolderId}
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
                          selectedSkill={selectedSkill}
                          selectedModel={selectedModel}
                          sendMessage={sendMessage}
                          deductCredits={deductCredits}
                          onLoadNewerHistory={loadNewerHistory}
                          isLoadingNewerHistory={isLoadingNewerHistory}
                          onVoteMessage={voteMessage}
                          ttsAutoplay={effectiveSettings.ttsAutoplay}
                          ttsVoice={effectiveSettings.ttsVoice}
                        />
                      )}
                    </ErrorBoundary>
                  </>
                );
              })()
            )}

            {/* Loading spinner for newer history - shown while request is in-flight */}
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

      {/* Scroll-to-bottom button: absolute overlay, outside the scroll container */}
      {showScrollButton && !platform.isReactNative && (
        <Div
          style={{
            position: "absolute" as const,
            left: 0,
            right: 0,
            bottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING + 12}px`,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto rounded-full shadow-lg border border-border/50 bg-background/90 backdrop-blur h-10 w-10 [&_svg]:size-6"
            onClick={scrollToBottom}
          >
            <ChevronDown />
          </Button>
        </Div>
      )}
    </Div>
  );
}
