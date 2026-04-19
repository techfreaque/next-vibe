/**
 * AI Stream Lifecycle Store
 *
 * Minimal client-side state for the cancel UX.
 * The framework's cache (streamingState on messagesDefinition.GET) is
 * the single source of truth for whether a thread is streaming.
 *
 * This store only tracks **aborting** — the optimistic window between
 * "user clicked cancel" and "server confirmed via stream-finished WS event".
 * No framework equivalent exists for this transient client-side state.
 */

import { create } from "zustand";

/**
 * AI Stream Lifecycle State — aborting only
 */
interface AIStreamState {
  /** Thread IDs where cancel request was sent but stream-finished hasn't arrived */
  abortingThreads: Set<string>;

  isAborting: (threadId: string) => boolean;
  setAborting: (threadId: string, value: boolean) => void;
  /** Clear aborting state for a thread (called by stream-finished event) */
  clearThread: (threadId: string) => void;
  reset: () => void;
}

/**
 * AI Stream Lifecycle Store
 */
export const useAIStreamStore = create<AIStreamState>((set, get) => ({
  abortingThreads: new Set<string>(),

  isAborting: (threadId: string): boolean =>
    get().abortingThreads.has(threadId),

  setAborting: (threadId: string, value: boolean): void =>
    set((state) => {
      const next = new Set(state.abortingThreads);
      if (value) {
        next.add(threadId);
      } else {
        next.delete(threadId);
      }
      return { abortingThreads: next };
    }),

  clearThread: (threadId: string): void =>
    set((state) => {
      const next = new Set(state.abortingThreads);
      next.delete(threadId);
      return { abortingThreads: next };
    }),

  reset: (): void =>
    set({
      abortingThreads: new Set<string>(),
    }),
}));
