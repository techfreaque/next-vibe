/**
 * AI Stream Lifecycle Store
 *
 * Tracks which threads are streaming, local vs remote, and drain state.
 * Pure lifecycle - NO message content, NO message state.
 *
 * Message content (deltas, tokens, isStreaming flag) lives in the
 * apiClient React Query cache via updateMessages.
 */

import { create } from "zustand";

import type { DefaultFolderId } from "../../../chat/config";

/**
 * Thread that was created during a stream (optimistic, before server confirms).
 */
export interface StreamingThread {
  threadId: string;
  title: string;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  createdAt: Date;
}

/**
 * Per-thread active stream state
 */
export interface ActiveStream {
  streamId: string;
}

/**
 * AI Stream Lifecycle State
 */
interface AIStreamState {
  // Lifecycle state - keyed by threadId
  activeStreams: Record<string, ActiveStream>;
  /** Thread IDs where the local client initiated the stream */
  localStreamThreadIds: Set<string>;
  /** Thread IDs where cancel was requested but STREAM_FINISHED hasn't arrived yet */
  drainingThreads: Set<string>;
  /** Thread IDs where cancel request was sent (aborting state - shows spinner on stop button) */
  abortingThreads: Set<string>;

  // Derived helpers
  isStreaming: boolean;
  isStreamingThread: (threadId: string) => boolean;
  isLocalStream: (threadId: string) => boolean;
  isDraining: (threadId: string) => boolean;
  isAborting: (threadId: string) => boolean;

  // Stream lifecycle actions
  startStream: (threadId: string, streamId: string) => void;
  stopStream: (threadId?: string) => void;
  setDraining: (threadId: string, value: boolean) => void;
  setAborting: (threadId: string, value: boolean) => void;

  // Reset
  reset: () => void;
}

/**
 * AI Stream Lifecycle Store
 */
export const useAIStreamStore = create<AIStreamState>((set, get) => ({
  activeStreams: {},
  localStreamThreadIds: new Set<string>(),
  drainingThreads: new Set<string>(),
  abortingThreads: new Set<string>(),
  isStreaming: false,

  isStreamingThread: (threadId: string): boolean =>
    !!get().activeStreams[threadId],

  isLocalStream: (threadId: string): boolean =>
    get().localStreamThreadIds.has(threadId),

  isDraining: (threadId: string): boolean =>
    get().drainingThreads.has(threadId),

  isAborting: (threadId: string): boolean =>
    get().abortingThreads.has(threadId),

  startStream: (threadId: string, streamId: string): void =>
    set((state) => {
      const newLocal = new Set(state.localStreamThreadIds);
      newLocal.add(threadId);
      const newDraining = new Set(state.drainingThreads);
      newDraining.delete(threadId);
      const newAborting = new Set(state.abortingThreads);
      newAborting.delete(threadId);
      return {
        activeStreams: { ...state.activeStreams, [threadId]: { streamId } },
        localStreamThreadIds: newLocal,
        drainingThreads: newDraining,
        abortingThreads: newAborting,
        isStreaming: true,
      };
    }),

  stopStream: (threadId?: string): void =>
    set((state) => {
      const newLocal = new Set(state.localStreamThreadIds);
      const newDraining = new Set(state.drainingThreads);
      const newAborting = new Set(state.abortingThreads);
      if (threadId) {
        newLocal.delete(threadId);
        newDraining.delete(threadId);
        newAborting.delete(threadId);
        const rest = Object.fromEntries(
          Object.entries(state.activeStreams).filter(([k]) => k !== threadId),
        );
        return {
          activeStreams: rest,
          localStreamThreadIds: newLocal,
          drainingThreads: newDraining,
          abortingThreads: newAborting,
          isStreaming: Object.keys(rest).length > 0,
        };
      }
      return {
        activeStreams: {},
        localStreamThreadIds: new Set<string>(),
        drainingThreads: new Set<string>(),
        abortingThreads: new Set<string>(),
        isStreaming: false,
      };
    }),

  setDraining: (threadId: string, value: boolean): void =>
    set((state) => {
      const newDraining = new Set(state.drainingThreads);
      if (value) {
        newDraining.add(threadId);
      } else {
        newDraining.delete(threadId);
      }
      return { drainingThreads: newDraining };
    }),

  setAborting: (threadId: string, value: boolean): void =>
    set((state) => {
      const newAborting = new Set(state.abortingThreads);
      const newDraining = new Set(state.drainingThreads);
      if (value) {
        newAborting.add(threadId);
        // Aborting implies draining - suppress incoming deltas
        newDraining.add(threadId);
      } else {
        newAborting.delete(threadId);
        newDraining.delete(threadId);
      }
      return { abortingThreads: newAborting, drainingThreads: newDraining };
    }),

  reset: (): void =>
    set({
      activeStreams: {},
      localStreamThreadIds: new Set<string>(),
      drainingThreads: new Set<string>(),
      abortingThreads: new Set<string>(),
      isStreaming: false,
    }),
}));
