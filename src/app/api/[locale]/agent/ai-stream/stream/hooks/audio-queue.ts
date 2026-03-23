/**
 * Audio Queue Manager
 * Manages playback of audio chunks in sequence to prevent overlap.
 *
 * Uses a precise look-ahead strategy: exactly 5 seconds before the current
 * chunk finishes playing, the next chunk's audio element is preloaded and
 * primed for instant playback - eliminating gaps between chunks.
 */

/** How many seconds before the current chunk ends to start preloading the next */
const PREFETCH_LEAD_TIME_S = 5;

interface QueuedAudio {
  audioData: string;
  chunkIndex: number;
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

  /**
   * Update voice mode store with playback state
   */
  private updateVoiceModeStore(isPlaying: boolean): void {
    void import("@/app/api/[locale]/agent/ai-stream/stream/hooks/voice-mode/store")
      .then(({ useVoiceModeStore }) => {
        useVoiceModeStore.getState().setSpeaking(isPlaying);
        return undefined;
      })
      .catch(() => {
        // Silently fail - voice mode store not available
      });
  }

  /**
   * Add audio chunk to queue
   */
  enqueue(audioData: string, chunkIndex: number): void {
    this.queue.push({ audioData, chunkIndex });
    // Sort by chunk index to ensure correct order
    this.queue.sort((a, b) => a.chunkIndex - b.chunkIndex);

    // Start preloading this audio immediately
    void this.preloadAudio(audioData, chunkIndex);

    void this.processQueue();
  }

  /**
   * Preload audio in the background so it's ready when needed
   */
  private async preloadAudio(
    audioData: string,
    chunkIndex: number,
  ): Promise<void> {
    // Skip if already preloaded
    if (this.preloadedAudio.has(chunkIndex)) {
      return;
    }

    const audio = new Audio();

    // Set up the audio element
    audio.preload = "auto";

    // Create a promise that resolves when audio is ready
    const loadPromise = new Promise<void>((resolve, reject) => {
      const onCanPlayThrough = (): void => {
        audio.removeEventListener("canplaythrough", onCanPlayThrough);
        audio.removeEventListener("error", onError);
        this.preloadedAudio.set(chunkIndex, audio);
        resolve();
      };

      const onError = (e: Event): void => {
        audio.removeEventListener("canplaythrough", onCanPlayThrough);
        audio.removeEventListener("error", onError);
        reject(e);
      };

      audio.addEventListener("canplaythrough", onCanPlayThrough);
      audio.addEventListener("error", onError);
    });

    // Start loading
    audio.src = audioData;
    audio.load();

    try {
      await loadPromise;
    } catch {
      // Preload failed - will fall back to direct play
    }
  }

  /**
   * Process queue - play next audio if not already playing
   */
  private async processQueue(): Promise<void> {
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

    try {
      await this.playAudio(next.audioData, next.chunkIndex);
      this.nextExpectedChunk = next.chunkIndex + 1;
    } catch {
      // Playback failed - continue with next chunk
    }

    // Check if there are more chunks to play
    const hasMoreChunks = this.queue.length > 0;

    if (!hasMoreChunks) {
      this.isPlaying = false;
      this.updateVoiceModeStore(false);
    } else {
      this.isPlaying = false;
      // Process next in queue
      void this.processQueue();
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
  private playAudio(audioData: string, chunkIndex: number): Promise<void> {
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

      const onEnded = (): void => {
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
        this.clearPrefetchTimer();
        this.currentAudio = null;
        this.currentAudioCleanup = null;
        resolve();
      };

      const onError = (e: Event): void => {
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
        this.clearPrefetchTimer();
        this.currentAudio = null;
        this.currentAudioCleanup = null;
        reject(e);
      };

      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);

      // If audio is already loaded (preloaded case), play immediately
      // Otherwise wait for canplaythrough before playing
      if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        audio.play().catch(reject);
      } else {
        const onCanPlay = (): void => {
          audio.removeEventListener("canplaythrough", onCanPlay);
          audio.play().catch(reject);
        };
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
    this.queue = [];
    this.clearPrefetchTimer();
    if (this.currentAudioCleanup) {
      this.currentAudioCleanup();
      this.currentAudioCleanup = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = "";
      this.currentAudio = null;
    }
    this.isPlaying = false;
    // Clear preloaded audio
    this.preloadedAudio.forEach((audio) => {
      audio.src = "";
    });
    this.preloadedAudio.clear();
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
    this.preloadedAudio.forEach((audio) => {
      audio.src = "";
    });
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

export function getAudioQueue(): AudioQueueManager {
  if (!audioQueueInstance) {
    audioQueueInstance = new AudioQueueManager();
  }
  return audioQueueInstance;
}
