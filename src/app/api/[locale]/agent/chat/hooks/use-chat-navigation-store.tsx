/**
 * Chat Navigation Store (Context-wrapped Zustand)
 *
 * Provider-based store so nested renders (e.g. AI-run embedded messages)
 * can supply their own navigation context without leaking into the
 * outer page store.
 *
 * Source of truth flow:
 * 1. Server parses URL → passes initial values to ChatNavigationProvider (once on mount)
 * 2. Page wraps children in <ChatNavigationProvider> with initial values
 * 3. After init, the scoped Zustand store is the single source of truth
 * 4. Components read from store via useChatNavigationStore()
 * 5. Navigation functions update store + push URL (store leads, URL follows)
 * 6. Nested providers (AI run) can override with their own store instance
 */

"use client";

import { success } from "next-vibe/shared/types/response.schema";
import type { JSX, ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import type { StoreApi } from "zustand";
import { createStore, useStore } from "zustand";

import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { DefaultFolderId } from "../config";

/**
 * Navigation state shape
 */
export interface ChatNavigationState {
  /** Active thread ID (null = no thread, "new" = new thread) */
  activeThreadId: string | null;
  /** Current root folder (private, shared, public, incognito, cron) */
  currentRootFolderId: DefaultFolderId;
  /** Current subfolder ID (null = root level) */
  currentSubFolderId: string | null;
  /** Active leaf message ID for branch navigation (?message= param) */
  leafMessageId: string | null;
  /** Whether this store is for an embedded/nested context (e.g. AI run) */
  isEmbedded: boolean;
  /** Whether the active thread is currently streaming */
  isStreaming: boolean;

  // --- Actions ---
  /** Set active thread ID */
  setActiveThreadId: (threadId: string | null) => void;
  /** Set root folder ID */
  setCurrentRootFolderId: (rootFolderId: DefaultFolderId) => void;
  /** Set subfolder ID */
  setCurrentSubFolderId: (subFolderId: string | null) => void;
  /** Set leaf message ID - updates store and pushes ?message= to URL */
  setLeafMessageId: (leafMessageId: string | null) => void;
  /** Batch update all navigation state at once (avoids multiple re-renders) */
  setNavigation: (state: {
    activeThreadId?: string | null;
    currentRootFolderId?: DefaultFolderId;
    currentSubFolderId?: string | null;
  }) => void;
  /** Seed from server-parsed URL state (called once on mount by ChatProvider) */
  initNavigation: (
    activeThreadId: string | null,
    currentRootFolderId: DefaultFolderId,
    currentSubFolderId: string | null,
    leafMessageId: string | null,
  ) => void;
  /** Mark active thread as streaming; also updates threads endpoint cache */
  startStream: (threadId: string, logger: EndpointLogger) => void;
  /** Mark active thread as aborting; also updates threads endpoint cache */
  setAborting: (threadId: string, logger: EndpointLogger) => void;
  /** Mark active thread as not streaming; also updates threads endpoint cache */
  stopStream: (threadId: string, logger: EndpointLogger) => void;
  /** Mark active thread as waiting (stream dead, task in flight); updates threads endpoint cache */
  setWaiting: (threadId: string, logger: EndpointLogger) => void;
}

type ChatNavigationStore = StoreApi<ChatNavigationState>;

/**
 * Patches both the threads cache and folder-contents cache for a given thread's
 * streamingState. Must patch both because the sidebar uses folder-contents while
 * some views use threads.
 * Uses dynamic imports to avoid circular dependency through definition → models → skills/enum → icons.
 */
function patchThreadStreamingState(
  threadId: string,
  state: "idle" | "streaming" | "aborting" | "waiting",
  currentRootFolderId: DefaultFolderId,
  currentSubFolderId: string | null,
  logger: EndpointLogger,
): void {
  void Promise.all([
    import("../threads/definition"),
    import("../folder-contents/[rootFolderId]/definition"),
  ]).then(([threadsDefModule, folderContentsDefModule]) => {
    const threadsDefinition = threadsDefModule.default;
    const folderContentsDefinition = folderContentsDefModule.default;

    // Patch threads endpoint cache (used by some views)
    apiClient.updateEndpointData(
      threadsDefinition.GET,
      logger,
      (old) => {
        if (!old?.success) {
          return old;
        }
        return success({
          ...old.data,
          threads: old.data.threads.map((t) =>
            t.id === threadId ? { ...t, streamingState: state } : t,
          ),
        });
      },
      {
        requestData: {
          rootFolderId: currentRootFolderId,
          subFolderId: currentSubFolderId,
        },
      },
    );

    // Patch folder-contents endpoint cache (used by sidebar)
    apiClient.updateEndpointData(
      folderContentsDefinition.GET,
      logger,
      (old) => {
        if (!old?.success) {
          return old;
        }
        return success({
          ...old.data,
          items: old.data.items.map((item) =>
            item.type === "thread" && item.id === threadId
              ? { ...item, streamingState: state }
              : item,
          ),
        });
      },
      {
        urlPathParams: { rootFolderId: currentRootFolderId },
        requestData: { subFolderId: currentSubFolderId },
      },
    );
    return undefined;
  });
}

/**
 * Factory: creates a new store instance.
 */
function createChatNavigationStore(opts?: {
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  leafMessageId: string | null;
  isEmbedded: boolean;
}): ChatNavigationStore {
  return createStore<ChatNavigationState>((set, get) => ({
    activeThreadId: opts?.activeThreadId ?? null,
    currentRootFolderId: opts?.currentRootFolderId ?? DefaultFolderId.PRIVATE,
    currentSubFolderId: opts?.currentSubFolderId ?? null,
    leafMessageId: opts?.leafMessageId ?? null,
    isEmbedded: opts?.isEmbedded ?? false,
    isStreaming: false,

    setActiveThreadId: (threadId): void => set({ activeThreadId: threadId }),
    setCurrentRootFolderId: (rootFolderId): void =>
      set({ currentRootFolderId: rootFolderId }),
    setCurrentSubFolderId: (subFolderId): void =>
      set({ currentSubFolderId: subFolderId }),
    setLeafMessageId: (leafMessageId): void => {
      set({ leafMessageId });
      // Sync to URL without triggering server re-render
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (leafMessageId) {
          url.searchParams.set("message", leafMessageId);
        } else {
          url.searchParams.delete("message");
        }
        window.history.pushState(null, "", url.toString());
      }
    },
    setNavigation: (state): void => {
      // When navigating to a different thread, clear leafMessageId so the
      // new thread resolves its own latest branch rather than using the
      // stale leaf from the previous thread.
      const current = get();
      const threadChanged =
        state.activeThreadId !== undefined &&
        state.activeThreadId !== current.activeThreadId;
      if (threadChanged && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("message");
        window.history.replaceState(null, "", url.toString());
      }
      set(threadChanged ? { ...state, leafMessageId: null } : state);
    },
    initNavigation: (
      activeThreadId,
      currentRootFolderId,
      currentSubFolderId,
      leafMessageId,
    ): void =>
      set({
        activeThreadId,
        currentRootFolderId,
        currentSubFolderId,
        leafMessageId,
      }),
    startStream: (threadId, logger): void => {
      set({ isStreaming: true });
      const { currentRootFolderId, currentSubFolderId } = get();
      patchThreadStreamingState(
        threadId,
        "streaming",
        currentRootFolderId,
        currentSubFolderId,
        logger,
      );
    },
    setAborting: (threadId, logger): void => {
      set({ isStreaming: false });
      const { currentRootFolderId, currentSubFolderId } = get();
      patchThreadStreamingState(
        threadId,
        "aborting",
        currentRootFolderId,
        currentSubFolderId,
        logger,
      );
    },
    stopStream: (threadId, logger): void => {
      set({ isStreaming: false });
      const { currentRootFolderId, currentSubFolderId } = get();
      patchThreadStreamingState(
        threadId,
        "idle",
        currentRootFolderId,
        currentSubFolderId,
        logger,
      );
    },
    setWaiting: (threadId, logger): void => {
      set({ isStreaming: false });
      const { currentRootFolderId, currentSubFolderId } = get();
      patchThreadStreamingState(
        threadId,
        "waiting",
        currentRootFolderId,
        currentSubFolderId,
        logger,
      );
    },
  }));
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ChatNavigationContext = createContext<ChatNavigationStore | null>(null);

/**
 * Provider that creates a scoped store instance.
 * ChatProvider uses this for the main page store.
 * AI run (or any nested embed) uses this with isEmbedded=true.
 */
export function ChatNavigationProvider({
  children,
  activeThreadId,
  currentRootFolderId = DefaultFolderId.PRIVATE,
  currentSubFolderId,
  leafMessageId,
  isEmbedded = false,
}: {
  children: ReactNode;
  activeThreadId: string | null;
  currentRootFolderId: DefaultFolderId;
  currentSubFolderId: string | null;
  leafMessageId: string | null;
  isEmbedded?: boolean;
}): JSX.Element {
  const storeRef = useRef<ChatNavigationStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createChatNavigationStore({
      activeThreadId,
      currentRootFolderId,
      currentSubFolderId,
      leafMessageId,
      isEmbedded,
    });
  }
  return (
    <ChatNavigationContext.Provider value={storeRef.current}>
      {children}
    </ChatNavigationContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Read from the nearest ChatNavigationProvider.
 * Throws if used outside a provider.
 */
export function useChatNavigationStore<T>(
  selector: (state: ChatNavigationState) => T,
): T {
  const store = useContext(ChatNavigationContext);
  if (!store) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
    throw new Error(
      "useChatNavigationStore must be used within ChatNavigationProvider",
    );
  }
  return useStore(store, selector);
}
