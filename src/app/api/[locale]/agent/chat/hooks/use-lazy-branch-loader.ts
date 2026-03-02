/**
 * Lazy Branch Loader Hook
 * Fetches only the active branch path instead of all messages.
 * Loads additional branches on-demand when the user switches.
 * Visited branches accumulate in the store — switching back is instant.
 *
 * Uses useEndpoint() for the initial path fetch so React Query cache + initialData work.
 * Uses typed executeQuery() for the "load older history" pagination (user-triggered).
 */

import { parseError } from "next-vibe/shared/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { executeQuery } from "@/app/api/[locale]/system/unified-interface/react/hooks/query-executor";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatMessage, ChatThread } from "../db";
import messagesDefinitions from "../threads/[threadId]/messages/definition";
import type { PathGetResponseOutput } from "../threads/[threadId]/messages/path/definition";
import pathDefinitions from "../threads/[threadId]/messages/path/definition";
import { useChatStore } from "./store";

/**
 * Branch metadata for fork points along the active path
 */
export interface BranchMeta {
  parentId: string;
  siblingCount: number;
  currentIndex: number;
}

interface LazyBranchLoaderReturn {
  branchMeta: BranchMeta[];
  isLoadingBranch: boolean;
  hasOlderHistory: boolean;
  isLoadingOlderHistory: boolean;
  loadOlderHistory: () => void;
  /** Clear the fetch cache for a thread so the next visit triggers a fresh DB fetch */
  invalidateThread: (threadId: string) => void;
}

/**
 * Hook for lazy loading only the active branch path.
 * Pass activeThreadId = null to disable this hook (when feature flag is off).
 * Pass initialPathData to pre-populate the React Query cache from SSR.
 */
export function useLazyBranchLoader(
  locale: CountryLanguage,
  logger: EndpointLogger,
  activeThreadId: string | null,
  threads: Record<string, ChatThread>,
  branchIndices: Record<string, number>,
  addMessage: (message: ChatMessage) => void,
  setThreadLoadMode: (threadId: string, mode: "full" | "partial") => void,
  isDataLoaded: boolean,
  user: JwtPayloadType,
  /** SSR-prefetched path data — pre-populates React Query cache, skips initial fetch */
  initialPathData?: PathGetResponseOutput | null,
): LazyBranchLoaderReturn {
  const [hasOlderHistory, setHasOlderHistory] = useState(false);
  const [isLoadingOlderHistory, setIsLoadingOlderHistory] = useState(false);

  // Track the oldest loaded message ID for cursor-based scroll-back
  const oldestLoadedMessageIdRef = useRef<string | null>(null);

  // Separate abort controller for loadOlderHistory (independent lifecycle)
  const olderHistoryAbortRef = useRef<AbortController | null>(null);
  // Snapshot branchIndices at request time to avoid stale closure
  const branchIndicesRef = useRef(branchIndices);
  branchIndicesRef.current = branchIndices;

  // Determine if this thread is pending create (not yet persisted) or incognito
  const thread = activeThreadId ? (threads[activeThreadId] ?? null) : null;
  const isPendingCreate =
    !!activeThreadId &&
    (useChatStore.getState().isThreadPendingCreate(activeThreadId) ||
      !thread ||
      thread.rootFolderId === "incognito");

  // Use useEndpoint so React Query cache + initialData work for the path fetch.
  // Enabled only when: data is loaded, thread exists, not pending create, not incognito.
  const pathOptions = useMemo(
    () => ({
      read: {
        queryOptions: {
          enabled: isDataLoaded && !!activeThreadId && !isPendingCreate,
          refetchOnWindowFocus: false,
          staleTime: 30_000, // 30s — path changes on branch switch
        },
        urlPathParams: activeThreadId
          ? { threadId: activeThreadId }
          : undefined,
        initialData: initialPathData ?? undefined,
        initialState: { branchIndices },
      },
    }),
    [
      isDataLoaded,
      activeThreadId,
      isPendingCreate,
      initialPathData,
      branchIndices,
    ],
  );

  const pathEndpoint = useEndpoint(pathDefinitions, pathOptions, logger, user);
  const pathData = pathEndpoint.read?.data;
  const isLoadingBranch = pathEndpoint.read?.isLoading ?? false;

  /**
   * Reset per-thread state when switching threads.
   */
  useEffect(() => {
    setHasOlderHistory(false);
    setIsLoadingOlderHistory(false);
    oldestLoadedMessageIdRef.current = null;

    // Abort any in-flight older-history requests from previous thread
    olderHistoryAbortRef.current?.abort();
    olderHistoryAbortRef.current = null;
  }, [activeThreadId]);

  /**
   * Sync path data from React Query into Zustand store when it arrives.
   */
  useEffect(() => {
    if (!pathData || !activeThreadId) {
      return;
    }

    if (pathData.messages) {
      for (const message of pathData.messages) {
        addMessage({
          ...message,
          createdAt: new Date(message.createdAt),
          updatedAt: new Date(message.updatedAt),
        });
      }
    }

    setHasOlderHistory(pathData.hasOlderHistory ?? false);
    oldestLoadedMessageIdRef.current = pathData.oldestLoadedMessageId ?? null;
    setThreadLoadMode(activeThreadId, "partial");

    logger.debug("Chat: Synced branch path from query", {
      threadId: activeThreadId,
      messageCount: pathData.messages?.length ?? 0,
      forkPoints: pathData.branchMeta?.length ?? 0,
      hasOlderHistory: pathData.hasOlderHistory,
    });
  }, [pathData, activeThreadId, addMessage, setThreadLoadMode, logger]);

  /**
   * Load older history (triggered by scroll-up sentinel).
   * Uses its own AbortController, aborted on thread switch.
   * Captures branchIndices via ref to avoid stale closure.
   */
  const loadOlderHistory = useCallback((): void => {
    if (
      !activeThreadId ||
      !hasOlderHistory ||
      isLoadingOlderHistory ||
      !oldestLoadedMessageIdRef.current
    ) {
      return;
    }

    // Abort any previous older-history request
    olderHistoryAbortRef.current?.abort();
    const controller = new AbortController();
    olderHistoryAbortRef.current = controller;

    // Capture values at call time (not at callback creation time)
    const threadId = activeThreadId;
    const indices = branchIndicesRef.current;
    const before = oldestLoadedMessageIdRef.current;

    setIsLoadingOlderHistory(true);

    const loadOlder = async (): Promise<void> => {
      try {
        const response = await executeQuery({
          endpoint: pathDefinitions.GET,
          logger,
          requestData: { branchIndices: indices, before },
          pathParams: { threadId },
          locale,
          user,
        });

        if (controller.signal.aborted) {
          return;
        }

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
          }

          setHasOlderHistory(data.hasOlderHistory ?? false);
          oldestLoadedMessageIdRef.current = data.oldestLoadedMessageId ?? null;

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
  }, [
    activeThreadId,
    hasOlderHistory,
    isLoadingOlderHistory,
    locale,
    logger,
    addMessage,
    user,
  ]);

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

  const branchMeta = pathData?.branchMeta ?? [];

  return {
    branchMeta,
    isLoadingBranch,
    hasOlderHistory,
    isLoadingOlderHistory,
    loadOlderHistory,
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
          requestData: undefined,
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
