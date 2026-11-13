/**
 * Audio Queue Manager
 * Manages playback of audio chunks in sequence to prevent overlap.
 *
 * Uses a precise look-ahead strategy: exactly 5 seconds before the current
 * chunk finishes playing, the next chunk's audio element is preloaded and
 * primed for instant playback - eliminating gaps between chunks.
 */

import type { EndpointLogger } from "next-vibe/logger/types";

import {
  classifyPlayRejection,
  describeAudioElement,
  describeAudioSource,
  isOwnTeardownAbort,
} from "../../../text-to-speech/audio-diagnostics";

/** How many seconds before the current chunk ends to start preloading the next */
const PREFETCH_LEAD_TIME_S = 5;

interface QueuedAudio {
  audioData: string;
  chunkIndex: number;
}

/**
 * Detach an element from its source without firing a media `error` event.
 * Assigning `src = ""` runs the load algorithm against the page URL and fires
 * MEDIA_ERR_SRC_NOT_SUPPORTED, which any still-attached error listener then
 * reports as a playback failure.
 */
function releaseAudio(audio: HTMLAudioElement): void {
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
}

export class AudioQueueManager {
  private queue: QueuedAudio[] = [];
  private isPlaying = false;
  private currentAudio: HTMLAudioElement | null = null;
  /** Pre-loaded audio elements ready for instant playback */
  private preloadedAudio: Map<number, HTMLAudioElement> = new Map();
  /** Next expected chunk index for ordered playback */
  private nextExpectedChunk = 0;
  /** Timer ID for the look-ahead prefetch trigger */
  private prefetchTimerId: ReturnType<typeof setTimeout> | null = null;
  /** Whether the look-ahead prefetch has fired for the current chunk */
  private prefetchTriggered = false;
  /** Cleanup function for listeners attached to the currently-playing audio element */
  private currentAudioCleanup: (() => void) | null = null;
  /** Logger from the most recent enqueue() - used by paths without a logger arg (stop, prefetch) */
  private logger: EndpointLogger;
  /** Bumped by stop(): async work from an older session must not touch state */
  private session = 0;
  /** In-flight preloads (not yet ready), keyed by chunk index -> cancel */
  private pendingPreloads: Map<number, () => void> = new Map();
  /** Detaches the playing chunk's listeners and settles its promise */
  private currentPlaybackCancel: (() => void) | null = null;

  constructor(logger: EndpointLogger) {
    this.logger = logger;
  }

  /**
   * Update voice mode store with playback state
   */
  private updateVoiceModeStore(isPlaying: boolean): void {
    void import("./voice-mode/store")
      .then(({ useVoiceModeStore }) => {
        useVoiceModeStore.getState().setSpeaking(isPlaying);
        return undefined;
      })
      .catch((error: Error) => {
        // Voice mode store chunk failed to load - speaking indicator goes stale
        this.logger.warn("[TTS-PLAY] Failed to load voice mode store", {
          error: error.message,
          component: "AudioQueueManager",
          operation: "updateVoiceModeStore",
          isPlaying,
        });
      });
  }

  /**
   * Add audio chunk to queue
   */
  enqueue(audioData: string, chunkIndex: number, logger: EndpointLogger): void {
    this.logger = logger;
    // The server ends every TTS stream with an `audioIsFinal` marker that
    // carries no audio. Loading "" resolves to the page URL and fails with
    // MEDIA_ERR_SRC_NOT_SUPPORTED, so it never reaches an audio element.
    if (audioData.length === 0) {
      logger.debug("[TTS-PLAY] Skipping empty audio chunk (end marker)", {
        chunkIndex,
      });
      return;
    }
    this.queue.push({ audioData, chunkIndex });
    // Sort by chunk index to ensure correct order
    this.queue.sort((a, b) => a.chunkIndex - b.chunkIndex);

    // Start preloading this audio immediately
    void this.preloadAudio(audioData, chunkIndex);

    void this.processQueue(logger);
  }

  /**
   * Preload audio in the background so it's ready when needed
   */
  private async preloadAudio(
    audioData: string,
    chunkIndex: number,
  ): Promise<void> {
    // Skip if already preloaded or loading
    if (
      this.preloadedAudio.has(chunkIndex) ||
      this.pendingPreloads.has(chunkIndex)
    ) {
      return;
    }

    const session = this.session;
    const audio = new Audio();

    // Set up the audio element
    audio.preload = "auto";

    // Create a promise that resolves when audio is ready (or the preload is
    // cancelled by stop()/clear(), which is not a failure)
    const loadPromise = new Promise<void>((resolve, reject) => {
      const detach = (): void => {
        audio.removeEventListener("canplaythrough", onCanPlayThrough);
        audio.removeEventListener("error", onError);
        this.pendingPreloads.delete(chunkIndex);
      };

      const onCanPlayThrough = (): void => {
        detach();
        if (session === this.session) {
          this.preloadedAudio.set(chunkIndex, audio);
        } else {
          releaseAudio(audio);
        }
        resolve();
      };

      const onError = (e: Event): void => {
        detach();
        reject(e);
      };

      audio.addEventListener("canplaythrough", onCanPlayThrough);
      audio.addEventListener("error", onError);
      this.pendingPreloads.set(chunkIndex, (): void => {
        detach();
        releaseAudio(audio);
        resolve();
      });
    });

    // Start loading
    audio.src = audioData;
    audio.load();

    try {
      await loadPromise;
    } catch {
      // Preload failed - will fall back to direct play
      this.logger.warn("[TTS-PLAY] Audio chunk preload failed", {
        ...describeAudioSource(audio, audioData),
        component: "AudioQueueManager",
        operation: "preloadAudio",
        chunkIndex,
        mediaErrorCode: audio.error?.code ?? null,
        mediaErrorMessage: audio.error?.message ?? null,
        mimePrefix: audioData.slice(0, audioData.indexOf(",") + 1).slice(0, 40),
      });
    }
  }

  /**
   * Process queue - play next audio if not already playing
   */
  private async processQueue(logger: EndpointLogger): Promise<void> {
    if (this.isPlaying || this.queue.length === 0) {
      return;
    }

    this.isPlaying = true;
    this.updateVoiceModeStore(true);

    const next = this.queue.shift();

    if (!next) {
      this.isPlaying = false;
      this.updateVoiceModeStore(false);
      return;
    }

    const session = this.session;
    try {
      await this.playAudio(next.audioData, next.chunkIndex, logger);
      this.nextExpectedChunk = next.chunkIndex + 1;
    } catch {
      // Playback failed - continue with next chunk. The failure itself is
      // already logged in playAudio (media error / play() rejection).
    }

    // stop() ran while this chunk was playing: it already reset the state,
    // and a newer session may be playing now.
    if (session !== this.session) {
      return;
    }

    // Check if there are more chunks to play
    const hasMoreChunks = this.queue.length > 0;

    if (!hasMoreChunks) {
      this.isPlaying = false;
      this.updateVoiceModeStore(false);
    } else {
      this.isPlaying = false;
      // Process next in queue
      void this.processQueue(logger);
    }
  }

  /**
   * Schedule a prefetch of the next chunk exactly PREFETCH_LEAD_TIME_S seconds
   * before the current audio element finishes playing.
   *
   * Uses the audio element's duration and currentTime to compute the exact
   * moment. If the chunk is shorter than the lead time, prefetch fires
   * immediately.
   */
  private schedulePrefetch(
    audio: HTMLAudioElement,
    currentChunkIndex: number,
  ): void {
    this.clearPrefetchTimer();
    this.prefetchTriggered = false;

    const trySchedule = (): void => {
      if (this.prefetchTriggered) {
        return;
      }
      const { duration, currentTime } = audio;

      // duration is NaN until metadata loads
      if (!Number.isFinite(duration)) {
        return;
      }

      const remaining = duration - currentTime;
      const delayMs = Math.max(0, (remaining - PREFETCH_LEAD_TIME_S) * 1000);

      this.clearPrefetchTimer();
      this.prefetchTimerId = setTimeout(() => {
        this.prefetchTriggered = true;
        this.ensureNextChunkReady(currentChunkIndex + 1);
      }, delayMs);
    };

    // If duration is already known (preloaded), schedule now
    if (Number.isFinite(audio.duration)) {
      trySchedule();
    }

    // Also listen for loadedmetadata in case duration wasn't ready yet
    const onMeta = (): void => {
      audio.removeEventListener("loadedmetadata", onMeta);
      trySchedule();
    };
    audio.addEventListener("loadedmetadata", onMeta);

    // Also listen to timeupdate as a fallback - recalculate if the first
    // schedule attempt couldn't fire (duration was NaN)
    const onTimeUpdate = (): void => {
      if (this.prefetchTriggered) {
        audio.removeEventListener("timeupdate", onTimeUpdate);
        return;
      }
      const remaining = audio.duration - audio.currentTime;
      if (Number.isFinite(remaining) && remaining <= PREFETCH_LEAD_TIME_S) {
        this.prefetchTriggered = true;
        audio.removeEventListener("timeupdate", onTimeUpdate);
        this.clearPrefetchTimer();
        this.ensureNextChunkReady(currentChunkIndex + 1);
      }
    };
    audio.addEventListener("timeupdate", onTimeUpdate);

    // Track cleanup so stop() can remove these listeners if called mid-playback
    this.currentAudioCleanup = (): void => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }

  /**
   * Ensure the next chunk is preloaded and ready for instant playback.
   * Called exactly PREFETCH_LEAD_TIME_S seconds before the current chunk ends.
   */
  private ensureNextChunkReady(nextChunkIndex: number): void {
    // Already preloaded - nothing to do
    if (this.preloadedAudio.has(nextChunkIndex)) {
      return;
    }

    // Check if the next chunk is in the queue
    const nextInQueue = this.queue.find((q) => q.chunkIndex === nextChunkIndex);

    if (nextInQueue) {
      // Kick off preload now so it's ready by the time current chunk ends
      void this.preloadAudio(nextInQueue.audioData, nextInQueue.chunkIndex);
    }
    // If not in queue yet, it hasn't arrived from the server - preload will
    // happen automatically when it's enqueued via enqueue()
  }

  /** Clear the prefetch timer if active */
  private clearPrefetchTimer(): void {
    if (this.prefetchTimerId !== null) {
      clearTimeout(this.prefetchTimerId);
      this.prefetchTimerId = null;
    }
  }

  /**
   * Play a single audio chunk
   * Uses preloaded audio if available, otherwise loads and plays
   */
  private playAudio(
    audioData: string,
    chunkIndex: number,
    logger: EndpointLogger,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if we have a preloaded audio element
      let audio = this.preloadedAudio.get(chunkIndex);

      if (audio) {
        // Use preloaded audio - it's ready to play immediately
        this.preloadedAudio.delete(chunkIndex);
      } else {
        // No preloaded audio - create and wait for it to be ready
        audio = new Audio();
        audio.preload = "auto";
        audio.src = audioData;
      }

      this.currentAudio = audio;

      // Schedule look-ahead prefetch of the next chunk
      this.schedulePrefetch(audio, chunkIndex);

      /** Set only by stop() (via currentPlaybackCancel) when we tear this playback down on purpose */
      let cancelled = false;

      const detach = (): void => {
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
        audio.removeEventListener("canplaythrough", onCanPlay);
        this.clearPrefetchTimer();
        this.currentAudio = null;
        this.currentAudioCleanup = null;
        this.currentPlaybackCancel = null;
      };

      const onEnded = (): void => {
        detach();
        resolve();
      };

      const onError = (e: Event): void => {
        logger.error("[TTS-PLAY] Audio chunk playback error", {
          ...describeAudioElement(audio),
          ...describeAudioSource(audio, audioData),
          component: "AudioQueueManager",
          operation: "playAudio",
          chunkIndex,
          mediaErrorCode: audio.error?.code ?? null,
          mediaErrorMessage: audio.error?.message ?? null,
        });
        detach();
        reject(e);
      };

      const startPlayback = (): void => {
        audio.play().catch((e: Error) => {
          // stop() pausing/releasing the element rejects a pending play()
          // with AbortError: that is our own teardown, not a playback failure.
          // Anything else (other errors, or an AbortError we did not cause)
          // is still logged.
          if (isOwnTeardownAbort(e, cancelled)) {
            return;
          }
          logger.error("[TTS-PLAY] play() failed", e, {
            ...describeAudioElement(audio),
            ...describeAudioSource(audio, audioData),
            component: "AudioQueueManager",
            chunkIndex,
            failureKind: classifyPlayRejection(e),
            stoppedByUs: cancelled,
          });
          if (cancelled) {
            // stop() already detached and settled this playback
            return;
          }
          detach();
          reject(e);
        });
      };

      const onCanPlay = (): void => {
        audio.removeEventListener("canplaythrough", onCanPlay);
        startPlayback();
      };

      this.currentPlaybackCancel = (): void => {
        cancelled = true;
        detach();
        resolve();
      };

      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);

      // If audio is already loaded (preloaded case), play immediately
      // Otherwise wait for canplaythrough before playing
      if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        startPlayback();
      } else {
        audio.addEventListener("canplaythrough", onCanPlay);
        // Start loading if not already
        if (audio.readyState === HTMLMediaElement.HAVE_NOTHING) {
          audio.load();
        }
      }
    });
  }

  /**
   * Stop playback and clear queue
   */
  stop(): void {
    const wasPlaying = this.isPlaying;
    this.session++;
    this.queue = [];
    this.clearPrefetchTimer();
    if (this.currentAudioCleanup) {
      this.currentAudioCleanup();
      this.currentAudioCleanup = null;
    }
    // Detach the playing chunk's listeners BEFORE releasing its source, or
    // the teardown is reported as "[TTS-PLAY] Audio chunk playback error".
    const playing = this.currentAudio;
    if (this.currentPlaybackCancel) {
      this.currentPlaybackCancel();
      this.currentPlaybackCancel = null;
    }
    if (playing) {
      releaseAudio(playing);
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.releasePreloads();
    this.nextExpectedChunk = 0;

    // Update voice mode store if we were playing
    if (wasPlaying) {
      this.updateVoiceModeStore(false);
    }
  }

  /**
   * Clear queue but let current audio finish
   */
  clear(): void {
    this.queue = [];
    this.clearPrefetchTimer();
    // Clear preloaded audio that won't be played
    this.releasePreloads();
  }

  /** Cancel in-flight preloads and release ready ones (no error events) */
  private releasePreloads(): void {
    [...this.pendingPreloads.values()].forEach((cancel) => cancel());
    this.pendingPreloads.clear();
    this.preloadedAudio.forEach((audio) => releaseAudio(audio));
    this.preloadedAudio.clear();
  }

  /**
   * Reset the queue manager for a new session
   */
  reset(): void {
    this.stop();
    this.nextExpectedChunk = 0;
  }
}

// Singleton instance for global access
let audioQueueInstance: AudioQueueManager | null = null;

export function getAudioQueue(logger: EndpointLogger): AudioQueueManager {
  if (!audioQueueInstance) {
    audioQueueInstance = new AudioQueueManager(logger);
  }
  return audioQueueInstance;
}
