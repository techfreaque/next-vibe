/**
 * Streaming TTS Buffer
 * Buffers streaming text and emits chunks at sentence boundaries for TTS
 *
 * Strategy:
 * 1. Buffer text as it streams in token-by-token
 * 2. Detect sentence boundaries (. ! ?)
 * 3. When a complete sentence is detected (min 50 chars), emit it for TTS
 * 4. Also emit on natural breaks (comma, newline) if buffer is large enough (200+ chars)
 * 5. Flush remaining text when stream ends
 */

import { stripSpecialTags } from "../../text-to-speech/content-processing";

/**
 * Minimum characters before emitting a chunk
 * Avoids choppy audio from very short phrases
 */
const MIN_CHUNK_SIZE = 50;

/**
 * Characters to emit on when buffer is large
 */
const LARGE_BUFFER_SIZE = 200;

/**
 * Sentence ending pattern
 */
const SENTENCE_ENDINGS = /[.!?]+\s*$/;

/**
 * Natural break pattern (for large buffers)
 */
const NATURAL_BREAKS = /[,;:\n]+\s*$/;

/**
 * Callback for when a TTS chunk is ready
 */
export type OnTTSChunkReady = (text: string, chunkIndex: number) => void;

/**
 * Streaming TTS Buffer
 * Collects streaming text and emits chunks for TTS at appropriate boundaries
 */
export class StreamingTTSBuffer {
  private buffer = "";
  private chunkIndex = 0;
  private isInsideThinkTag = false;
  private isInsideChatTag = false;
  private onChunkReady: OnTTSChunkReady;

  constructor(onChunkReady: OnTTSChunkReady) {
    this.onChunkReady = onChunkReady;
  }

  /**
   * Add a text delta to the buffer
   * May trigger a chunk emission if boundary is detected
   */
  addDelta(delta: string): void {
    // Track think tag state
    if (delta.includes("<think>")) {
      this.isInsideThinkTag = true;
    }
    if (delta.includes("</think>")) {
      this.isInsideThinkTag = false;
      // Strip any special tags from buffer
      this.buffer = stripSpecialTags(this.buffer);
      return;
    }

    // Track Chat tag state (case-insensitive)
    if (/<Chat>/i.test(delta)) {
      this.isInsideChatTag = true;
    }
    if (/<\/Chat>/i.test(delta)) {
      this.isInsideChatTag = false;
      // Strip any special tags from buffer
      this.buffer = stripSpecialTags(this.buffer);
      return;
    }

    // Skip content inside think or Chat tags
    if (this.isInsideThinkTag || this.isInsideChatTag) {
      return;
    }

    // Add to buffer
    this.buffer += delta;

    // Check if we should emit a chunk
    this.checkAndEmit();
  }

  /**
   * Check if buffer should be emitted
   */
  private checkAndEmit(): void {
    // Clean the buffer (strip any special tags that might have accumulated)
    const cleanBuffer = stripSpecialTags(this.buffer).trim();

    if (cleanBuffer.length < MIN_CHUNK_SIZE) {
      return;
    }

    // Check for sentence ending
    if (SENTENCE_ENDINGS.test(cleanBuffer)) {
      this.emit(cleanBuffer);
      return;
    }

    // Check for natural break if buffer is large
    if (cleanBuffer.length >= LARGE_BUFFER_SIZE) {
      if (NATURAL_BREAKS.test(cleanBuffer)) {
        this.emit(cleanBuffer);
        return;
      }
    }
  }

  /**
   * Emit a chunk for TTS
   */
  private emit(text: string): void {
    // Strip markdown for TTS
    const cleanText = this.stripMarkdownForTTS(text);

    if (cleanText.trim().length > 0) {
      this.onChunkReady(cleanText, this.chunkIndex);
      this.chunkIndex++;
    }

    // Clear the buffer
    this.buffer = "";
  }

  /**
   * Flush any remaining content in the buffer
   * Call this when the stream ends
   */
  flush(): void {
    const cleanBuffer = stripSpecialTags(this.buffer).trim();

    if (cleanBuffer.length > 0) {
      this.emit(cleanBuffer);
    }

    // Reset state
    this.buffer = "";
    this.isInsideThinkTag = false;
    this.isInsideChatTag = false;
  }

  /**
   * Get current chunk index
   */
  getChunkIndex(): number {
    return this.chunkIndex;
  }

  /**
   * Reset the buffer
   */
  reset(): void {
    this.buffer = "";
    this.chunkIndex = 0;
    this.isInsideThinkTag = false;
    this.isInsideChatTag = false;
  }

  /**
   * Strip markdown formatting for TTS
   * Simplified version - removes common markdown that shouldn't be spoken
   */
  private stripMarkdownForTTS(text: string): string {
    let result = text;

    // Remove code blocks
    result = result.replaceAll(/```[\s\S]*?```/g, "");

    // Remove inline code
    result = result.replaceAll(/`([^`]+)`/g, "$1");

    // Remove bold/italic markers
    result = result.replaceAll(/(\*\*|__)(.*?)\1/g, "$2");
    result = result.replaceAll(/(\*|_)(.*?)\1/g, "$2");

    // Remove heading markers
    result = result.replaceAll(/^#{1,6}\s+/gm, "");

    // Remove blockquote markers
    result = result.replaceAll(/^>\s+/gm, "");

    // Remove list markers
    result = result.replaceAll(/^[\s]*[-*+]\s+/gm, "");
    result = result.replaceAll(/^[\s]*\d+\.\s+/gm, "");

    // Remove links - keep text
    result = result.replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Clean up extra whitespace
    result = result.replaceAll(/\s+/g, " ").trim();

    return result;
  }
}

/**
 * Create a streaming TTS buffer
 */
export function createStreamingTTSBuffer(
  onChunkReady: OnTTSChunkReady,
): StreamingTTSBuffer {
  return new StreamingTTSBuffer(onChunkReady);
}
