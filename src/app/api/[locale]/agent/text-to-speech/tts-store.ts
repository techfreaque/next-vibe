"use client";

/**
 * TTS Store
 *
 * Persistent TTS state keyed by messageId. Survives component unmounts so
 * playing/loading state is visible when hovering back over a message.
 *
 * Mutable refs (audio elements, abort controllers, timers) live in a
 * module-level Map — they cannot go in Zustand and don't need to trigger
 * re-renders.
 */

import { create } from "zustand";

// ── Per-message reactive state ────────────────────────────────────────────────

export interface TtsMessageState {
  isPlaying: boolean;
  isLoading: boolean;
  currentChunk: number;
  totalChunks: number;
  error: string | null;
}

const DEFAULT_STATE: TtsMessageState = {
  isPlaying: false,
  isLoading: false,
  currentChunk: 0,
  totalChunks: 0,
  error: null,
};

interface TtsStoreState {
  messages: Record<string, TtsMessageState>;
  set: (messageId: string, patch: Partial<TtsMessageState>) => void;
  reset: (messageId: string) => void;
  get: (messageId: string) => TtsMessageState;
}

export const useTtsStore = create<TtsStoreState>((setState, getState) => ({
  messages: {},

  set: (messageId, patch): void =>
    setState((s) => ({
      messages: {
        ...s.messages,
        [messageId]: { ...(s.messages[messageId] ?? DEFAULT_STATE), ...patch },
      },
    })),

  reset: (messageId): void =>
    setState((s) => ({
      messages: {
        ...s.messages,
        [messageId]: { ...DEFAULT_STATE },
      },
    })),

  get: (messageId): TtsMessageState =>
    getState().messages[messageId] ?? { ...DEFAULT_STATE },
}));

// ── Per-message mutable refs (survive unmounts, never trigger re-renders) ─────

export interface TtsRefs {
  audioQueue: (HTMLAudioElement | null)[];
  chunks: string[];
  currentPlayingIndex: number;
  currentFetchingIndex: number;
  isProcessing: boolean;
  abortController: AbortController | null;
  prefetchTimer: ReturnType<typeof setTimeout> | null;
}

const refsMap = new Map<string, TtsRefs>();

export function getTtsRefs(messageId: string): TtsRefs {
  if (!refsMap.has(messageId)) {
    refsMap.set(messageId, {
      audioQueue: [],
      chunks: [],
      currentPlayingIndex: 0,
      currentFetchingIndex: 0,
      isProcessing: false,
      abortController: null,
      prefetchTimer: null,
    });
  }
  return refsMap.get(messageId)!;
}

export function resetTtsRefs(messageId: string): void {
  refsMap.delete(messageId);
}
