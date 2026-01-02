/**
 * Streaming TTS Handler
 * Buffers streaming text and generates TTS audio chunks at sentence boundaries
 *
 * This is used in the ai-stream to emit AUDIO_CHUNK events as text streams in.
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";

import { TtsVoice, type TtsVoiceValue } from "../../text-to-speech/enum";
import { createStreamEvent, formatSSEEvent } from "../events";

/**
 * Minimum characters before emitting a TTS chunk
 * Avoids choppy audio from very short phrases
 */
const MIN_CHUNK_SIZE = 50;

/**
 * Maximum buffer size before forcing a chunk
 */
const MAX_BUFFER_SIZE = 300;

/**
 * Sentence ending pattern
 */
const SENTENCE_ENDINGS = /[.!?]+\s*$/;

/**
 * Natural break pattern (for large buffers)
 */
const NATURAL_BREAKS = /[,;:\n]+\s*$/;

/**
 * Streaming TTS Handler
 * Collects streaming text and emits TTS audio chunks
 */
export class StreamingTTSHandler {
  private buffer = "";
  private chunkIndex = 0;
  private isInsideThinkTag = false;
  private isInsideChatTag = false;
  private messageId: string | null = null;
  private readonly controller: ReadableStreamDefaultController<Uint8Array>;
  private readonly encoder: TextEncoder;
  private readonly logger: EndpointLogger;
  private readonly locale: CountryLanguage;
  private readonly voice: typeof TtsVoiceValue;
  private readonly userId: string | undefined;
  private isEnabled: boolean;

  constructor(params: {
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
    locale: CountryLanguage;
    voice: typeof TtsVoiceValue;
    userId: string | undefined;
    enabled: boolean;
  }) {
    this.controller = params.controller;
    this.encoder = params.encoder;
    this.logger = params.logger;
    this.locale = params.locale;
    this.voice = params.voice;
    this.userId = params.userId;
    this.isEnabled = params.enabled;
  }

  /**
   * Set the current message ID (called when assistant message is created)
   */
  setMessageId(messageId: string): void {
    this.messageId = messageId;
  }

  /**
   * Check if TTS is enabled
   */
  get enabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Add a text delta to the buffer
   * May trigger TTS generation if boundary is detected
   */
  async addDelta(delta: string): Promise<void> {
    // Use info level for key diagnostics since debug might be filtered
    this.logger.info("[Streaming TTS] addDelta called", {
      deltaLength: delta.length,
      deltaPreview: delta.substring(0, 50),
      isEnabled: this.isEnabled,
      hasMessageId: !!this.messageId,
      messageId: this.messageId,
      bufferLength: this.buffer.length,
    });

    if (!this.isEnabled) {
      this.logger.info("[Streaming TTS] Skipping - TTS not enabled");
      return;
    }

    if (!this.messageId) {
      this.logger.info("[Streaming TTS] Skipping - no messageId set yet");
      return;
    }

    // Track think tag state
    if (delta.includes("<think>")) {
      this.isInsideThinkTag = true;
      this.logger.debug("[Streaming TTS] Entered <think> tag");
    }
    if (delta.includes("</think>")) {
      this.isInsideThinkTag = false;
      // Clear any think content from buffer
      this.buffer = this.stripSpecialTags(this.buffer);
      this.logger.debug("[Streaming TTS] Exited </think> tag, buffer cleared");
      return;
    }

    // Track Chat tag state (case-insensitive)
    if (/<Chat>/i.test(delta)) {
      this.isInsideChatTag = true;
      this.logger.debug("[Streaming TTS] Entered <Chat> tag");
    }
    if (/<\/Chat>/i.test(delta)) {
      this.isInsideChatTag = false;
      // Clear any Chat content from buffer
      this.buffer = this.stripSpecialTags(this.buffer);
      this.logger.debug("[Streaming TTS] Exited </Chat> tag, buffer cleared");
      return;
    }

    // Skip content inside think or Chat tags
    if (this.isInsideThinkTag || this.isInsideChatTag) {
      this.logger.debug("[Streaming TTS] Skipping - inside special tag", {
        isInsideThinkTag: this.isInsideThinkTag,
        isInsideChatTag: this.isInsideChatTag,
      });
      return;
    }

    // Add to buffer
    this.buffer += delta;
    this.logger.debug("[Streaming TTS] Buffer updated", {
      newBufferLength: this.buffer.length,
      bufferPreview: this.buffer.substring(0, 100),
    });

    // Check if we should emit a chunk
    await this.checkAndEmit();
  }

  /**
   * Check if buffer should be emitted
   */
  private async checkAndEmit(): Promise<void> {
    const cleanBuffer = this.stripSpecialTags(this.buffer).trim();

    if (cleanBuffer.length < MIN_CHUNK_SIZE) {
      return;
    }

    // Check for sentence ending
    if (SENTENCE_ENDINGS.test(cleanBuffer)) {
      await this.emitChunk(cleanBuffer);
      return;
    }

    // Check for natural break if buffer is large
    if (cleanBuffer.length >= MAX_BUFFER_SIZE) {
      if (NATURAL_BREAKS.test(cleanBuffer)) {
        await this.emitChunk(cleanBuffer);
        return;
      }
      // Force emit if buffer is too large
      if (cleanBuffer.length >= MAX_BUFFER_SIZE * 1.5) {
        await this.emitChunk(cleanBuffer);
      }
    }
  }

  /**
   * Emit a TTS chunk
   */
  private async emitChunk(text: string): Promise<void> {
    if (!this.messageId) {
      this.logger.warn("[Streaming TTS] No message ID set - skipping chunk");
      return;
    }

    const cleanText = this.stripMarkdownForTTS(text);
    if (cleanText.trim().length === 0) {
      this.logger.debug("[Streaming TTS] Empty text after cleanup - skipping");
      this.buffer = "";
      return;
    }

    this.logger.debug("[Streaming TTS] Generating TTS for chunk", {
      chunkIndex: this.chunkIndex,
      textLength: cleanText.length,
      textPreview: cleanText.substring(0, 100),
    });

    try {
      // Generate TTS audio using Eden AI
      const audioDataUrl = await this.generateTTS(cleanText);

      if (audioDataUrl) {
        // Emit AUDIO_CHUNK event
        const event = createStreamEvent.audioChunk({
          messageId: this.messageId,
          audioData: audioDataUrl,
          chunkIndex: this.chunkIndex,
          isFinal: false,
          text: cleanText,
        });

        this.controller.enqueue(this.encoder.encode(formatSSEEvent(event)));
        this.chunkIndex++;

        this.logger.info("[Streaming TTS] Emitted audio chunk successfully", {
          chunkIndex: this.chunkIndex - 1,
          textLength: cleanText.length,
          audioDataLength: audioDataUrl.length,
        });
      } else {
        this.logger.warn("[Streaming TTS] TTS conversion returned null", {
          text: cleanText.substring(0, 100),
          textLength: cleanText.length,
          chunkIndex: this.chunkIndex,
          locale: this.locale,
          voice: this.voice,
        });
      }
    } catch (error) {
      this.logger.error("[Streaming TTS] Error generating TTS", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        chunkIndex: this.chunkIndex,
        textLength: cleanText.length,
      });
    }

    // Clear the buffer
    this.buffer = "";
  }

  /**
   * Generate TTS audio using Eden AI
   * Returns base64 data URL or null on failure
   */
  private async generateTTS(text: string): Promise<string | null> {
    if (!agentEnv.EDEN_AI_API_KEY) {
      this.logger.error("[Streaming TTS] Eden AI API key not configured - TTS disabled");
      return null;
    }

    const language = getLanguageFromLocale(this.locale);
    const voiceOption = this.voice === TtsVoice.MALE ? "MALE" : "FEMALE";

    this.logger.debug("[Streaming TTS] Calling Eden AI TTS API", {
      textLength: text.length,
      language,
      voice: voiceOption,
    });

    try {
      const response = await fetch("https://api.edenai.run/v2/audio/text_to_speech", {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.EDEN_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providers: "openai",
          text,
          language: language.toLowerCase(),
          option: voiceOption,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error("[Streaming TTS] Eden AI API HTTP error", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          textLength: text.length,
        });
        return null;
      }

      interface EdenAITTSResponse {
        [provider: string]: {
          audio_resource_url?: string;
          error?: { message?: string };
          status?: string;
        };
      }

      const responseData = (await response.json()) as EdenAITTSResponse;
      const providerResult = responseData.openai;

      if (providerResult?.error || providerResult?.status === "fail") {
        this.logger.error("[Streaming TTS] OpenAI provider error via Eden AI", {
          error: providerResult.error?.message,
          status: providerResult.status,
          fullResponse: JSON.stringify(responseData).substring(0, 500),
        });
        return null;
      }

      const audioResourceUrl = providerResult?.audio_resource_url;
      if (!audioResourceUrl) {
        this.logger.error("[Streaming TTS] No audio URL in Eden AI response", {
          fullResponse: JSON.stringify(responseData).substring(0, 500),
        });
        return null;
      }

      // Fetch the audio file and convert to base64
      const audioResponse = await fetch(audioResourceUrl);
      if (!audioResponse.ok) {
        this.logger.error("[Streaming TTS] Failed to fetch audio file from URL", {
          status: audioResponse.status,
          statusText: audioResponse.statusText,
          url: audioResourceUrl.substring(0, 100),
        });
        return null;
      }

      const audioBuffer = await audioResponse.arrayBuffer();
      let contentType = audioResponse.headers.get("content-type") || "audio/mpeg";

      if (contentType === "binary/octet-stream" || contentType === "application/octet-stream") {
        contentType = "audio/mpeg";
      }

      const base64Audio = Buffer.from(audioBuffer).toString("base64");
      this.logger.debug("[Streaming TTS] Successfully generated audio", {
        audioSizeBytes: audioBuffer.byteLength,
        contentType,
      });
      // eslint-disable-next-line i18next/no-literal-string
      return `data:${contentType};base64,${base64Audio}`;
    } catch (error) {
      this.logger.error("[Streaming TTS] TTS generation exception", {
        error: parseError(error).message,
        stack: (error as Error)?.stack?.substring(0, 500),
        textLength: text.length,
      });
      return null;
    }
  }

  /**
   * Flush any remaining content in the buffer
   * Call this when the stream ends
   */
  async flush(): Promise<void> {
    this.logger.info("[Streaming TTS] flush() called", {
      isEnabled: this.isEnabled,
      hasMessageId: !!this.messageId,
      messageId: this.messageId,
      bufferLength: this.buffer.length,
      bufferPreview: this.buffer.substring(0, 100),
    });

    if (!this.isEnabled || !this.messageId) {
      this.logger.info("[Streaming TTS] flush() skipped - not enabled or no messageId");
      return;
    }

    const cleanBuffer = this.stripSpecialTags(this.buffer).trim();
    this.logger.info("[Streaming TTS] flush() cleanBuffer", {
      cleanBufferLength: cleanBuffer.length,
      cleanBufferPreview: cleanBuffer.substring(0, 100),
    });

    if (cleanBuffer.length > 0) {
      await this.emitChunk(cleanBuffer);
    } else {
      this.logger.info("[Streaming TTS] flush() - no content to emit");
    }

    // Emit final chunk marker
    if (this.chunkIndex > 0) {
      const event = createStreamEvent.audioChunk({
        messageId: this.messageId,
        audioData: "",
        chunkIndex: this.chunkIndex,
        isFinal: true,
        text: "",
      });

      this.controller.enqueue(this.encoder.encode(formatSSEEvent(event)));
    }

    // Reset state
    this.buffer = "";
    this.isInsideThinkTag = false;
    this.isInsideChatTag = false;
  }

  /**
   * Reset the handler for a new message
   */
  reset(): void {
    this.buffer = "";
    this.chunkIndex = 0;
    this.isInsideThinkTag = false;
    this.isInsideChatTag = false;
    this.messageId = null;
  }

  /**
   * Strip special tags (think and Chat) from text
   */
  private stripSpecialTags(text: string): string {
    let result = text;

    // Remove closed think tags
    result = result.replace(/<think>[\s\S]*?<\/think>/gi, "");
    // Remove unclosed think tags
    result = result.replace(/<think>[\s\S]*/gi, "");

    // Remove closed Chat tags
    result = result.replace(/<Chat>[\s\S]*?<\/Chat>/gi, "");
    // Remove unclosed Chat tags
    result = result.replace(/<Chat>[\s\S]*/gi, "");

    return result;
  }

  /**
   * Strip markdown formatting for TTS
   */
  private stripMarkdownForTTS(text: string): string {
    let result = text;

    // Remove code blocks
    result = result.replace(/```[\s\S]*?```/g, "");

    // Remove inline code
    result = result.replace(/`([^`]+)`/g, "$1");

    // Remove bold/italic markers
    result = result.replace(/(\*\*|__)(.*?)\1/g, "$2");
    result = result.replace(/(\*|_)(.*?)\1/g, "$2");

    // Remove heading markers
    result = result.replace(/^#{1,6}\s+/gm, "");

    // Remove blockquote markers
    result = result.replace(/^>\s+/gm, "");

    // Remove list markers
    result = result.replace(/^[\s]*[-*+]\s+/gm, "");
    result = result.replace(/^[\s]*\d+\.\s+/gm, "");

    // Remove links - keep text
    result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Clean up extra whitespace
    result = result.replace(/\s+/g, " ").trim();

    return result;
  }
}

/**
 * Create a streaming TTS handler
 */
export function createStreamingTTSHandler(params: {
  controller: ReadableStreamDefaultController<Uint8Array>;
  encoder: TextEncoder;
  logger: EndpointLogger;
  locale: CountryLanguage;
  voice: typeof TtsVoiceValue;
  userId: string | undefined;
  enabled: boolean;
}): StreamingTTSHandler {
  return new StreamingTTSHandler(params);
}
