/**
 * AI Stream Lifecycle Store
 *
 * Minimal client-side state for the cancel UX.
 * The framework's cache (streamingState on messagesDefinition.GET) is
 * the single source of truth for whether a thread is streaming.
 *
 * This store only tracks **aborting** - the optimistic window between
 * "user clicked cancel" and "server confirmed via stream-finished WS event".
 * No framework equivalent exists for this transient client-side state.
 */

import { create } from "zustand";

/**
 * AI Stream Lifecycle State - aborting + active incognito streams
 */
interface AIStreamState {
  /** Thread IDs where cancel request was sent but stream-finished hasn't arrived */
  abortingThreads: Set<string>;

  /**
   * Thread IDs where the POST was fired but the first WS event hasn't arrived.
   * Drives the stop button visibility so it appears instantly on send.
   */
  pendingThreads: Set<string>;

  /**
   * Incognito thread IDs with a stream currently running on the server.
   * Incognito threads exist ONLY in localStorage — the WS events are the
   * single carrier of the streamed content. The IncognitoStreamKeeper keeps a
   * headless subscription alive for these ids so navigating to a different
   * thread/folder mid-stream doesn't lose the response.
   */
  incognitoStreams: Set<string>;

  isAborting: (threadId: string) => boolean;
  setAborting: (threadId: string, value: boolean) => void;
  /** Clear aborting state for a thread (called by stream-finished event) */
  clearThread: (threadId: string) => void;
  isPending: (threadId: string) => boolean;
  setPending: (threadId: string, value: boolean) => void;
  addIncognitoStream: (threadId: string) => void;
  removeIncognitoStream: (threadId: string) => void;
  reset: () => void;
}

/**
 * AI Stream Lifecycle Store
 */
export const useAIStreamStore = create<AIStreamState>((set, get) => ({
  abortingThreads: new Set<string>(),
  pendingThreads: new Set<string>(),
  incognitoStreams: new Set<string>(),

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
      const aborting = new Set(state.abortingThreads);
      aborting.delete(threadId);
      const pending = new Set(state.pendingThreads);
      pending.delete(threadId);
      return { abortingThreads: aborting, pendingThreads: pending };
    }),

  isPending: (threadId: string): boolean => get().pendingThreads.has(threadId),

  setPending: (threadId: string, value: boolean): void =>
    set((state) => {
      const next = new Set(state.pendingThreads);
      if (value) {
        next.add(threadId);
      } else {
        next.delete(threadId);
      }
      return { pendingThreads: next };
    }),

  addIncognitoStream: (threadId: string): void =>
    set((state) => {
      if (state.incognitoStreams.has(threadId)) {
        return state;
      }
      const next = new Set(state.incognitoStreams);
      next.add(threadId);
      return { incognitoStreams: next };
    }),

  removeIncognitoStream: (threadId: string): void =>
    set((state) => {
      if (!state.incognitoStreams.has(threadId)) {
        return state;
      }
      const next = new Set(state.incognitoStreams);
      next.delete(threadId);
      return { incognitoStreams: next };
    }),

  reset: (): void =>
    set({
      abortingThreads: new Set<string>(),
      pendingThreads: new Set<string>(),
      incognitoStreams: new Set<string>(),
    }),
}));
