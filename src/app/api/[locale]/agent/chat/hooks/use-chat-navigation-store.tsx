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

import { DefaultFolderId, isDefaultFolderId } from "../config";
import threadsDefinition from "../threads/definition";

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
  ) => void;
  /** Mark active thread as streaming; also updates threads endpoint cache */
  startStream: (threadId: string, logger: EndpointLogger) => void;
  /** Mark active thread as not streaming; also updates threads endpoint cache */
  stopStream: (threadId: string, logger: EndpointLogger) => void;
}

type ChatNavigationStore = StoreApi<ChatNavigationState>;

/**
 * Factory: creates a new store instance.
 */
function createChatNavigationStore(opts?: {
  activeThreadId?: string | null;
  currentRootFolderId?: DefaultFolderId;
  currentSubFolderId?: string | null;
  isEmbedded?: boolean;
}): ChatNavigationStore {
  return createStore<ChatNavigationState>((set, get) => ({
    activeThreadId: opts?.activeThreadId ?? null,
    currentRootFolderId: opts?.currentRootFolderId ?? DefaultFolderId.PRIVATE,
    currentSubFolderId: opts?.currentSubFolderId ?? null,
    isEmbedded: opts?.isEmbedded ?? false,
    isStreaming: false,

    setActiveThreadId: (threadId): void => set({ activeThreadId: threadId }),
    setCurrentRootFolderId: (rootFolderId): void =>
      set({ currentRootFolderId: rootFolderId }),
    setCurrentSubFolderId: (subFolderId): void =>
      set({ currentSubFolderId: subFolderId }),
    setNavigation: (state): void => set(state),
    initNavigation: (
      activeThreadId,
      currentRootFolderId,
      currentSubFolderId,
    ): void => set({ activeThreadId, currentRootFolderId, currentSubFolderId }),
    startStream: (threadId, logger): void => {
      set({ isStreaming: true });
      const { currentRootFolderId, currentSubFolderId } = get();
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
              t.id === threadId ? { ...t, isStreaming: true } : t,
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
    },
    stopStream: (threadId, logger): void => {
      set({ isStreaming: false });
      const { currentRootFolderId, currentSubFolderId } = get();
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
              t.id === threadId ? { ...t, isStreaming: false } : t,
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
  currentSubFolderId = null,
  isEmbedded = false,
}: {
  children: ReactNode;
  activeThreadId?: string | null;
  currentRootFolderId?: DefaultFolderId;
  currentSubFolderId?: string | null;
  isEmbedded?: boolean;
}): JSX.Element {
  const storeRef = useRef<ChatNavigationStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createChatNavigationStore({
      activeThreadId,
      currentRootFolderId,
      currentSubFolderId,
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

// ─── URL parsing (unchanged) ─────────────────────────────────────────────────

/**
 * Parse pathname into navigation state.
 * Used to sync store from URL changes (client-side navigation).
 *
 * URL patterns:
 * - /[locale]/threads/[rootId]                         → root folder view
 * - /[locale]/threads/[rootId]/new                     → new thread
 * - /[locale]/threads/[rootId]/[uuid]                  → thread OR folder (ambiguous)
 * - /[locale]/threads/[rootId]/[folderId]/[threadId]   → thread in folder
 * - /[locale]/threads/[rootId]/[folderId]/new          → new thread in folder
 */
export function parsePathnameToNavState(pathname: string): {
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  threadId: string | null;
} {
  const parts = pathname.split("/").filter(Boolean);
  const threadsIdx = parts.indexOf("threads");
  if (threadsIdx === -1) {
    return {
      rootFolderId: DefaultFolderId.PRIVATE,
      subFolderId: null,
      threadId: null,
    };
  }

  const rootId = parts[threadsIdx + 1] as DefaultFolderId | undefined;
  const seg3 = parts[threadsIdx + 2];
  const seg4 = parts[threadsIdx + 3];

  const rootFolderId =
    rootId && isDefaultFolderId(rootId) ? rootId : DefaultFolderId.PRIVATE;

  let subFolderId: string | null = null;
  let threadId: string | null = null;

  if (seg4) {
    // 4-segment: /threads/<root>/<folderId>/<threadId|new>
    subFolderId = seg3 ?? null;
    threadId = seg4;
  } else if (seg3) {
    // 3-segment: /threads/<root>/<something>
    // Ambiguous — could be folderId or threadId.
    // Treat as threadId here; the server page.tsx disambiguates via DB lookup
    // and the store gets the correct values from initNavigation().
    // For client-side nav, this is always a threadId or "new".
    threadId = seg3;
  }

  return { rootFolderId, subFolderId, threadId };
}
