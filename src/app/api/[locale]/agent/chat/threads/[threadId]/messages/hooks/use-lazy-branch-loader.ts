/**
 * Lazy Branch Loader Hook
 * Fetches all messages in the current chunk (compaction boundary to all leaf tips).
 * Branch switching is purely local — no refetch, no data change, just display change.
 * The cache key is stable: keyed only on threadId + rootFolderId (not leafMessageId).
 *
 * Uses useEndpoint() for the initial chunk fetch so React Query cache + initialData work.
 * Uses typed executeQuery() for "load older history" and "load newer history" pagination (user-triggered).
 *
 * Older/newer state is communicated via hasOlderHistory / hasNewerHistory flags
 * in message metadata, set server-side on the boundary messages.
 */

import { parseError } from "next-vibe/shared/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { executeQuery } from "@/app/api/[locale]/system/unified-interface/react/hooks/query-executor";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { DefaultFolderId } from "../../../../config";
import type { ChatMessage, ChatThread, MessageMetadata } from "../../../../db";
import { useChatStore } from "../../../../hooks/store";
import messagesDefinitions from "../definition";
import type { PathGetResponseOutput } from "../path/definition";
import pathDefinitions from "../path/definition";

interface LazyBranchLoaderReturn {
  isLoadingBranch: boolean;
  isLoadingOlderHistory: boolean;
  loadOlderHistory: (oldestMessageId: string) => void;
  isLoadingNewerHistory: boolean;
  loadNewerHistory: (anchorId: string) => void;
  /** Clear the fetch cache for a thread so the next visit triggers a fresh DB fetch */
  invalidateThread: (threadId: string) => void;
}

/**
 * Hook for lazy loading the current chunk of messages.
 * Pass activeThreadId = null to disable this hook (when feature flag is off).
 * Pass initialPathData to pre-populate the React Query cache from SSR.
 */
export function useLazyBranchLoader(
  locale: CountryLanguage,
  logger: EndpointLogger,
  activeThreadId: string | null,
  threads: Record<string, ChatThread>,
  leafMessageId: string | null,
  addMessage: (message: ChatMessage) => void,
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void,
  setThreadLoadMode: (threadId: string, mode: "full" | "partial") => void,
  user: JwtPayloadType,
  /** SSR-prefetched path data — pre-populates React Query cache, skips initial fetch */
  initialPathData?: PathGetResponseOutput | null,
  /** Current root folder ID from navigation — used as fallback when thread not yet in store */
  currentRootFolderId?: DefaultFolderId,
  /** Update the navigation store's leafMessageId when server resolves to a different leaf */
  setLeafMessageId?: (leafMessageId: string | null) => void,
): LazyBranchLoaderReturn {
  const [isLoadingOlderHistory, setIsLoadingOlderHistory] = useState(false);
  const [isLoadingNewerHistory, setIsLoadingNewerHistory] = useState(false);

  // Separate abort controllers (independent lifecycle)
  const olderHistoryAbortRef = useRef<AbortController | null>(null);
  const newerHistoryAbortRef = useRef<AbortController | null>(null);

  // Keep a render-time ref to current leafMessageId so the sync effect can
  // read the current value without it being a dependency.
  const leafMessageIdRef = useRef<string | null>(null);
  leafMessageIdRef.current = leafMessageId;

  // Determine if this thread is pending create (not yet persisted).
  // Use currentRootFolderId as fallback when thread not yet synced to store.
  const thread = activeThreadId ? (threads[activeThreadId] ?? null) : null;
  const rootFolderId =
    thread?.rootFolderId ?? currentRootFolderId ?? DefaultFolderId.PRIVATE;
  // Subscribe reactively so query re-enables when clearThreadPendingCreate fires.
  const pendingNewThreadIds = useChatStore((s) => s.pendingNewThreadIds);
  const isPendingCreate =
    !!activeThreadId && pendingNewThreadIds.has(activeThreadId);

  // Use useEndpoint so React Query cache + initialData work for the chunk fetch.
  // Enabled only when: data is loaded, thread exists, not pending create.
  // Incognito threads use useClientRoute on the path endpoint to load from localStorage.
  // Cache key is stable: keyed only on threadId + rootFolderId (NOT leafMessageId).
  // Branch switching is purely local — no refetch, no data change.
  const pathOptions = useMemo(
    () => ({
      read: {
        queryOptions: {
          enabled: !!activeThreadId && !isPendingCreate,
          refetchOnWindowFocus: false,
          staleTime: 30_000,
        },
        urlPathParams: { threadId: activeThreadId ?? "" },
        initialState: {
          rootFolderId,
          // NOTE: leafMessageId intentionally NOT included here.
          // The cache key must be stable across branch switches.
          // The server uses the latest message in the thread when no leafMessageId is provided.
        },
        // Seed the React Query cache with SSR data on initial load.
        initialData: initialPathData ?? undefined,
      },
    }),
    [activeThreadId, isPendingCreate, rootFolderId, initialPathData],
  );

  const pathEndpoint = useEndpoint(pathDefinitions, pathOptions, logger, user);
  const pathData = pathEndpoint.read?.data;
  const isLoadingBranch = pathEndpoint.read?.isLoading ?? false;

  /**
   * Abort in-flight requests when switching threads.
   */
  useEffect(() => {
    return (): void => {
      olderHistoryAbortRef.current?.abort();
      newerHistoryAbortRef.current?.abort();
    };
  }, [activeThreadId]);

  /**
   * Sync path data from React Query into Zustand store when it arrives.
   * Since the server now returns ALL messages in the chunk (all branch paths),
   * branch switching is purely local — no refetch needed.
   */
  useEffect(() => {
    if (!pathData || !activeThreadId) {
      return;
    }

    const messages = pathData.messages ?? [];

    for (const message of messages) {
      addMessage({
        ...message,
        createdAt: new Date(message.createdAt),
        updatedAt: new Date(message.updatedAt),
      });
    }

    setThreadLoadMode(activeThreadId, "partial");

    // Correct URL when server resolves to a different leaf (latest_leaf CTE).
    // Only act when resolvedLeafMessageId differs from the current leafMessageId in the URL —
    // this handles the case where the client passes a branch-root sibling ID and the server
    // walks down to the true leaf.
    const currentLeaf = leafMessageIdRef.current;
    const resolvedLeaf = pathData.resolvedLeafMessageId;
    if (resolvedLeaf && resolvedLeaf !== currentLeaf) {
      // Replace URL (not pushState) — this is a correction, not a navigation
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("message", resolvedLeaf);
        window.history.replaceState(null, "", url.toString());
      }
      // Update the navigation store's leafMessageId to the resolved leaf
      setLeafMessageId?.(resolvedLeaf);
    }

    logger.debug("Chat: Synced chunk from query", {
      threadId: activeThreadId,
      messageCount: messages.length,
    });
  }, [
    pathData,
    activeThreadId,
    addMessage,
    setThreadLoadMode,
    logger,
    setLeafMessageId,
  ]);

  /**
   * Load older history (triggered by "Show older messages" button click).
   * oldestMessageId: the ID of the oldest message currently loaded.
   */
  const loadOlderHistory = useCallback(
    (oldestMessageId: string): void => {
      if (!activeThreadId || isLoadingOlderHistory) {
        return;
      }

      // Abort any previous older-history request
      olderHistoryAbortRef.current?.abort();
      const controller = new AbortController();
      olderHistoryAbortRef.current = controller;

      const threadId = activeThreadId;

      setIsLoadingOlderHistory(true);

      const loadOlder = async (): Promise<void> => {
        try {
          const response = await executeQuery({
            endpoint: pathDefinitions.GET,
            logger,
            requestData: {
              rootFolderId: thread?.rootFolderId ?? DefaultFolderId.PRIVATE,
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

            // Clear hasOlderHistory flag on the current oldest message — the older
            // chunk now replaces it (the chunk itself will have the flag if needed).
            const currentOldest =
              useChatStore.getState().messages[oldestMessageId];
            if (currentOldest) {
              updateMessage(oldestMessageId, {
                metadata: {
                  ...(currentOldest.metadata as MessageMetadata | null),
                  hasOlderHistory: false,
                },
              });
            }

            if (data.messages) {
              for (const message of data.messages) {
                addMessage({
                  ...message,
                  createdAt: new Date(message.createdAt),
                  updatedAt: new Date(message.updatedAt),
                });
              }
            }

            // If this older chunk's newest message already has a newer chunk loaded,
            // clear the hasNewerHistory flag so no stale button appears.
            if (data.newerChunkAnchorId) {
              const alreadyLoaded =
                !!useChatStore.getState().messages[data.newerChunkAnchorId];
              if (alreadyLoaded) {
                // The leaf message that had the flag — find it by newerAnchorId
                const msgs = useChatStore.getState().messages;
                for (const msg of Object.values(msgs)) {
                  const meta = msg.metadata as MessageMetadata | null;
                  if (meta?.newerAnchorId === data.newerChunkAnchorId) {
                    updateMessage(msg.id, {
                      metadata: {
                        ...meta,
                        hasNewerHistory: false,
                        newerAnchorId: null,
                      },
                    });
                    break;
                  }
                }
              }
            }

            logger.debug("Chat: Loaded older history", {
              threadId,
              olderMessageCount: data.messages?.length ?? 0,
              hasMoreHistory: data.hasOlderHistory,
            });
          }
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }
          logger.error("Chat: Error loading older history", {
            threadId,
            error: parseError(error).message,
          });
        } finally {
          if (!controller.signal.aborted) {
            setIsLoadingOlderHistory(false);
          }
        }
      };

      void loadOlder();
    },
    [
      activeThreadId,
      isLoadingOlderHistory,
      locale,
      logger,
      addMessage,
      updateMessage,
      user,
      thread?.rootFolderId,
    ],
  );

  /**
   * Load newer history (triggered by "Show newer messages" button click).
   * anchorId: the compacting message ID stored in the leaf's newerAnchorId metadata.
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

      const loadNewer = async (): Promise<void> => {
        try {
          // Load the next chunk by using the compaction anchor as the leafMessageId.
          // The server walks DOWN from there to find its leaf, returning the next chunk.
          const response = await executeQuery({
            endpoint: pathDefinitions.GET,
            logger,
            requestData: {
              rootFolderId: thread?.rootFolderId ?? DefaultFolderId.PRIVATE,
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

            // Clear hasNewerHistory flag on the leaf message that triggered this load.
            // The new chunk's messages will carry their own flags if further chunks exist.
            const msgs = useChatStore.getState().messages;
            for (const msg of Object.values(msgs)) {
              const meta = msg.metadata as MessageMetadata | null;
              if (meta?.newerAnchorId === anchorId) {
                updateMessage(msg.id, {
                  metadata: {
                    ...meta,
                    hasNewerHistory: false,
                    newerAnchorId: null,
                  },
                });
                break;
              }
            }

            if (data.messages) {
              for (const message of data.messages) {
                addMessage({
                  ...message,
                  createdAt: new Date(message.createdAt),
                  updatedAt: new Date(message.updatedAt),
                });
              }
            }

            // Update leafMessageId to the resolved leaf of the newer chunk.
            const resolvedLeaf = data.resolvedLeafMessageId;
            if (resolvedLeaf) {
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("message", resolvedLeaf);
                window.history.replaceState(null, "", url.toString());
              }
              setLeafMessageId?.(resolvedLeaf);
            }

            logger.debug("Chat: Loaded newer history", {
              threadId,
              newerMessageCount: data.messages?.length ?? 0,
              resolvedLeaf,
            });
          }
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }
          logger.error("Chat: Error loading newer history", {
            threadId,
            error: parseError(error).message,
          });
        } finally {
          if (!controller.signal.aborted) {
            setIsLoadingNewerHistory(false);
          }
        }
      };

      void loadNewer();
    },
    [
      activeThreadId,
      isLoadingNewerHistory,
      locale,
      logger,
      addMessage,
      updateMessage,
      user,
      thread?.rootFolderId,
      setLeafMessageId,
    ],
  );

  /**
   * Clear the React Query cache for a thread so the next navigation triggers a fresh DB fetch.
   * Called by useMessagesSubscription when a remote stream completes.
   */
  const invalidateThread = useCallback(
    (tid: string): void => {
      if (tid === activeThreadId) {
        void pathEndpoint.read?.refetch();
      }
    },
    [activeThreadId, pathEndpoint.read],
  );

  return {
    isLoadingBranch,
    isLoadingOlderHistory,
    loadOlderHistory,
    isLoadingNewerHistory,
    loadNewerHistory,
    invalidateThread,
  };
}

/**
 * Trigger a full message load for a thread (used when switching to flat/threaded view)
 * This upgrades a partially loaded thread to fully loaded.
 */
export function useFullLoadFallback(
  locale: CountryLanguage,
  logger: EndpointLogger,
  activeThreadId: string | null,
  threadLoadMode: Record<string, "full" | "partial">,
  addMessage: (message: ChatMessage) => void,
  setThreadLoadMode: (threadId: string, mode: "full" | "partial") => void,
  needsFullLoad: boolean,
  user: JwtPayloadType,
): { isUpgrading: boolean } {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const upgradedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (
      !activeThreadId ||
      !needsFullLoad ||
      threadLoadMode[activeThreadId] === "full" ||
      upgradedRef.current.has(activeThreadId) ||
      useChatStore.getState().isThreadPendingCreate(activeThreadId)
    ) {
      return;
    }

    upgradedRef.current.add(activeThreadId);
    setIsUpgrading(true);

    const loadAll = async (): Promise<void> => {
      try {
        const response = await executeQuery({
          endpoint: messagesDefinitions.GET,
          logger,
          requestData: {
            rootFolderId:
              useChatStore.getState().threads[activeThreadId]?.rootFolderId ??
              DefaultFolderId.PRIVATE,
          },
          pathParams: { threadId: activeThreadId },
          locale,
          user,
        });

        if (response.success) {
          const data = response.data;

          if (data.messages) {
            for (const message of data.messages) {
              addMessage({
                ...message,
                createdAt: new Date(message.createdAt),
                updatedAt: new Date(message.updatedAt),
              });
            }
            setThreadLoadMode(activeThreadId, "full");
          }
        }
      } catch (error) {
        logger.error("Chat: Error upgrading to full load", {
          threadId: activeThreadId,
          error: parseError(error).message,
        });
        // Allow retry
        upgradedRef.current.delete(activeThreadId);
      } finally {
        setIsUpgrading(false);
      }
    };

    void loadAll();
  }, [
    activeThreadId,
    needsFullLoad,
    threadLoadMode,
    locale,
    logger,
    addMessage,
    setThreadLoadMode,
    user,
  ]);

  return { isUpgrading };
}
