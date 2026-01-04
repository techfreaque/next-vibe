/**
 * Audio Queue Manager
 * Manages playback of audio chunks in sequence to prevent overlap
 */

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

  /**
   * Update voice mode store with playback state
   */
  private updateVoiceModeStore(isPlaying: boolean): void {
    // Dynamically import to avoid circular dependencies and ensure it works client-side only
    if (typeof window !== "undefined") {
      void import("../../chat/voice-mode/store")
        .then(({ useVoiceModeStore }) => {
          useVoiceModeStore.getState().setSpeaking(isPlaying);
          return undefined;
        })
        .catch(() => {
          // Silently fail - voice mode store not available
        });
    }
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
  private async preloadAudio(audioData: string, chunkIndex: number): Promise<void> {
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

      const onEnded = (): void => {
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
        this.currentAudio = null;
        resolve();
      };

      const onError = (e: Event): void => {
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
        this.currentAudio = null;
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
    if (this.currentAudio) {
      this.currentAudio.pause();
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
