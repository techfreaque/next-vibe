/**
 * Streaming TTS Handler
 * Buffers streaming text and generates TTS audio chunks at sentence boundaries
 *
 * This is used in the ai-stream to emit AUDIO_CHUNK events as text streams in.
 */

import "server-only";

import { ApiProvider } from "@/app/api/[locale]/agent/models/models";

import { parseError } from "next-vibe/shared/utils";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import { buildMissingKeyMessage } from "@/app/api/[locale]/agent/env-availability";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { TTS_COST_PER_CHARACTER } from "@/app/api/[locale]/products/repository-client";
import { ErrorResponseTypes } from "@/app/api/[locale]/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";

import { ChatMessageRole } from "../../chat/enum";
import type { WsEmitCallback } from "../../chat/threads/[threadId]/messages/emitter";
import {
  getBestTtsModel,
  type TtsModelOption,
  type VoiceModelSelection,
} from "../../text-to-speech/models";

/**
 * Minimum skills before emitting a TTS chunk
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
 *
 * Uses a look-ahead strategy: while a chunk is playing on the client (~5-10s),
 * the next chunk's TTS is already being generated in parallel so it's ready
 * the moment the client finishes playing the current one.
 */
export class StreamingTTSHandler {
  private buffer = "";
  private chunkIndex = 0;
  private isInsideThinkTag = false;
  private isInsideChatTag = false;
  private messageId: string | null = null;
  private readonly wsEmit: WsEmitCallback;
  private readonly logger: EndpointLogger;
  private readonly locale: CountryLanguage;
  private readonly voiceModelSelection: VoiceModelSelection;
  private readonly user: JwtPayloadType;
  private isEnabled: boolean;
  private isCancelled = false;
  /**
   * Cached resolved TTS model. `false` = not yet resolved. `null` = no provider available.
   * Resolved once on first TTS attempt to avoid per-chunk resolution overhead.
   */
  private resolvedTtsModel: TtsModelOption | null | false = false;
  private totalSkillsProcessed = 0;
  /**
   * Sequential generation chain: at most one TTS API call in-flight at a time.
   * The next chunk's generation starts as soon as the previous one resolves,
   * giving exactly one chunk of look-ahead without hammering the API.
   */
  private generationChain: Promise<void> = Promise.resolve();

  constructor(params: {
    wsEmit: WsEmitCallback;
    logger: EndpointLogger;
    locale: CountryLanguage;
    voiceModelSelection: VoiceModelSelection;
    user: JwtPayloadType;
    enabled: boolean;
  }) {
    this.wsEmit = params.wsEmit;
    this.logger = params.logger;
    this.locale = params.locale;
    this.voiceModelSelection = params.voiceModelSelection;
    this.user = params.user;
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
   * Add a text delta to the buffer.
   * May trigger TTS generation if a boundary is detected.
   *
   * Buffer manipulation is synchronous and fast - TTS generation runs in
   * the background via `generationChain`, so this never blocks on the
   * Eden AI API.
   */
  addDelta(delta: string): void {
    this.addDeltaInternal(delta);
  }

  private addDeltaInternal(delta: string): void {
    if (!this.isEnabled || this.isCancelled) {
      return;
    }

    if (!this.messageId) {
      this.logger.debug("[Streaming TTS] Skipping - no messageId set yet");
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

    // Check if we should emit a chunk (non-blocking - generation runs in background)
    this.checkAndEmit();
  }

  /**
   * Check if buffer should be emitted.
   *
   * When a boundary is detected, the text is captured and generation + emission
   * is appended to `generationChain`.  The buffer is cleared immediately so new
   * deltas keep flowing without blocking on the TTS API.
   *
   * Because generation is sequential (one API call at a time), we get exactly
   * one chunk of look-ahead: while chunk N plays on the client, chunk N+1's
   * generation is already running - but N+2 won't start until N+1 finishes.
   */
  private checkAndEmit(): void {
    const cleanBuffer = this.stripSpecialTags(this.buffer).trim();

    if (cleanBuffer.length < MIN_CHUNK_SIZE) {
      return;
    }

    let shouldEmit = false;

    // Check for sentence ending
    if (SENTENCE_ENDINGS.test(cleanBuffer)) {
      shouldEmit = true;
    }

    // Check for natural break if buffer is large
    if (!shouldEmit && cleanBuffer.length >= MAX_BUFFER_SIZE) {
      if (NATURAL_BREAKS.test(cleanBuffer)) {
        shouldEmit = true;
      }
      // Force emit if buffer is too large
      if (cleanBuffer.length >= MAX_BUFFER_SIZE * 1.5) {
        shouldEmit = true;
      }
    }

    if (shouldEmit) {
      // Capture text & index, clear buffer immediately so deltas keep flowing
      const textToEmit = cleanBuffer;
      const idx = this.chunkIndex++;
      this.buffer = "";

      // Chain onto generationChain: sequential generation (1 API call at a time)
      // but non-blocking for delta processing
      this.generationChain = this.generationChain.then(() =>
        this.generateAndEmitChunk(textToEmit, idx),
      );
    }
  }

  /**
   * Generate TTS audio for a chunk and emit it over WebSocket.
   * Runs inside `generationChain` - sequential, one at a time.
   */
  private async generateAndEmitChunk(
    text: string,
    chunkIdx: number,
  ): Promise<void> {
    if (this.isCancelled) {
      return;
    }

    if (!this.messageId) {
      this.logger.warn("[Streaming TTS] No message ID set - skipping chunk");
      return;
    }

    const cleanText = this.stripMarkdownForTTS(text);
    if (cleanText.trim().length === 0) {
      this.logger.debug("[Streaming TTS] Empty text after cleanup - skipping");
      return;
    }

    this.logger.debug("[Streaming TTS] Generating TTS for chunk", {
      chunkIndex: chunkIdx,
      textLength: cleanText.length,
      textPreview: cleanText.substring(0, 100),
    });

    try {
      const audioDataUrl = await this.generateTTS(cleanText);

      if (audioDataUrl) {
        if (this.wsEmit) {
          this.wsEmit("audio-chunk", {
            audioMessageId: this.messageId,
            audioData: audioDataUrl,
            chunkIndex: chunkIdx,
            audioIsFinal: false,
            audioText: cleanText,
          });
        }

        this.logger.debug("[Streaming TTS] Emitted audio chunk successfully", {
          chunkIndex: chunkIdx,
          textLength: cleanText.length,
          audioDataLength: audioDataUrl.length,
        });

        // Track skill count for credit deduction
        this.totalSkillsProcessed += cleanText.length;

        const creditsNeeded = cleanText.length * TTS_COST_PER_CHARACTER;
        if (creditsNeeded > 0) {
          const { t: creditsT } = creditsScopedTranslation.scopedT(this.locale);
          const deductResult = await CreditRepository.deductCreditsForTTS(
            this.user,
            creditsNeeded,
            this.logger,
            this.locale,
            creditsT,
          );

          if (deductResult.success) {
            this.logger.debug("[Streaming TTS] Credits deducted", {
              skills: cleanText.length,
              credits: creditsNeeded,
              partial: deductResult.data.partialDeduction,
            });
          } else {
            this.logger.warn("[Streaming TTS] Failed to deduct credits", {
              skills: cleanText.length,
              creditsNeeded,
            });
          }
        }
      } else {
        this.logger.warn("[Streaming TTS] TTS conversion returned null", {
          text: cleanText.substring(0, 100),
          textLength: cleanText.length,
          chunkIndex: chunkIdx,
          locale: this.locale,
          selectionType: this.voiceModelSelection.selectionType,
        });
      }
    } catch (error) {
      this.logger.error("[Streaming TTS] Error generating TTS", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        chunkIndex: chunkIdx,
        textLength: cleanText.length,
      });
    }
  }

  /**
   * Generate TTS audio using model-based provider routing with fallback.
   * Resolves the cheapest available provider via the standard filterTtsModels path.
   * Returns base64 data URL or null on failure.
   */
  private async generateTTS(text: string): Promise<string | null> {
    const language = getLanguageFromLocale(this.locale);

    // Resolve model once and cache. Emit WS error only on first failed resolution.
    if (this.resolvedTtsModel === false) {
      // Resolution: MANUAL → cheapest available provider for that model → FILTERS fallback using selection constraints.
      // All logic lives in getBestTtsModel → filterRoleModels → agentEnvAvailability imported directly.
      this.resolvedTtsModel =
        getBestTtsModel(this.voiceModelSelection, this.user) ?? null;

      if (!this.resolvedTtsModel) {
        const message = buildMissingKeyMessage("openAiTts");
        this.logger.error("[Streaming TTS] No TTS provider available", {
          selectionType: this.voiceModelSelection.selectionType,
          hint: "Configure OPENAI_API_KEY, ELEVENLABS_API_KEY, or EDEN_AI_API_KEY",
        });
        if (this.wsEmit) {
          this.wsEmit("error", {
            messages: [
              {
                id: crypto.randomUUID(),
                role: ChatMessageRole.ERROR,
                content: message,
                parentId: null,
                sequenceId: null,
                model: null,
                skill: null,
                metadata: null,
                errorMessage: message,
                errorCode: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR.errorKey,
              },
            ],
          });
        }
        // Disable TTS for this session to avoid per-chunk error spam
        this.isEnabled = false;
      }
    }

    const modelOption = this.resolvedTtsModel;
    if (!modelOption) {
      return null;
    }

    this.logger.debug("[Streaming TTS] Generating TTS", {
      modelId: modelOption.id,
      apiProvider: modelOption.apiProvider,
      textLength: text.length,
      language,
    });

    try {
      switch (modelOption.apiProvider) {
        case ApiProvider.OPENAI_TTS:
          return await this.callOpenAITTS(text, modelOption);

        case ApiProvider.EDEN_AI_TTS: {
          const gender =
            modelOption.voiceMeta?.gender === "male" ? "MALE" : "FEMALE";
          return await this.callEdenAITTS(
            text,
            modelOption.providerModel,
            gender,
            language,
          );
        }

        case ApiProvider.ELEVENLABS:
          return await this.callElevenLabsTTS(text, modelOption.providerModel);

        default:
          this.logger.error("[Streaming TTS] Unsupported TTS provider", {
            apiProvider: modelOption.apiProvider,
            modelId: modelOption.id,
          });
          return null;
      }
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
   * Call OpenAI TTS API directly.
   * `modelOption.providerModel` is the voice name (e.g. "nova", "alloy").
   * The OpenAI TTS model ("tts-1") is the same for all voices and hardcoded.
   */
  private async callOpenAITTS(
    text: string,
    modelOption: TtsModelOption,
  ): Promise<string | null> {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        // eslint-disable-next-line i18next/no-literal-string
        Authorization: `Bearer ${agentEnv.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // eslint-disable-next-line i18next/no-literal-string
        model: "tts-1",
        input: text,
        voice: modelOption.providerModel,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error("[Streaming TTS] OpenAI TTS API error", {
        status: response.status,
        error: errorText,
      });
      return null;
    }

    const audioBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    this.logger.debug("[Streaming TTS] OpenAI TTS succeeded", {
      audioSizeBytes: audioBuffer.byteLength,
    });
    // eslint-disable-next-line i18next/no-literal-string
    return `data:${contentType};base64,${base64Audio}`;
  }

  /**
   * Call Eden AI TTS API
   */
  private async callEdenAITTS(
    text: string,
    providerModel: string,
    voiceGender: "MALE" | "FEMALE",
    language: string,
  ): Promise<string | null> {
    interface EdenAITTSResponse {
      [provider: string]: {
        audio_resource_url?: string;
        error?: { message?: string };
        status?: string;
      };
    }

    const response = await fetch(
      "https://api.edenai.run/v2/audio/text_to_speech",
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.EDEN_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providers: providerModel,
          text,
          language: language.toLowerCase(),
          option: voiceGender,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error("[Streaming TTS] Eden AI TTS API error", {
        status: response.status,
        error: errorText,
      });
      return null;
    }

    const responseData = (await response.json()) as EdenAITTSResponse;
    const providerResult = responseData[providerModel];

    if (providerResult?.error || providerResult?.status === "fail") {
      this.logger.error("[Streaming TTS] Eden AI provider error", {
        provider: providerModel,
        error: providerResult?.error?.message,
      });
      return null;
    }

    const audioResourceUrl = providerResult?.audio_resource_url;
    if (!audioResourceUrl) {
      this.logger.error("[Streaming TTS] No audio URL in Eden AI response");
      return null;
    }

    const audioResponse = await fetch(audioResourceUrl);
    if (!audioResponse.ok) {
      this.logger.error("[Streaming TTS] Failed to fetch audio from URL", {
        status: audioResponse.status,
        url: audioResourceUrl.substring(0, 100),
      });
      return null;
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    let contentType = audioResponse.headers.get("content-type") || "audio/mpeg";
    if (
      contentType === "binary/octet-stream" ||
      contentType === "application/octet-stream"
    ) {
      contentType = "audio/mpeg";
    }

    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    this.logger.debug("[Streaming TTS] Eden AI TTS succeeded", {
      audioSizeBytes: audioBuffer.byteLength,
    });
    // eslint-disable-next-line i18next/no-literal-string
    return `data:${contentType};base64,${base64Audio}`;
  }

  /**
   * Call ElevenLabs TTS API
   */
  private async callElevenLabsTTS(
    text: string,
    providerModel: string,
  ): Promise<string | null> {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${providerModel}`,
      {
        method: "POST",
        headers: {
          // eslint-disable-next-line i18next/no-literal-string
          "xi-api-key": agentEnv.ELEVENLABS_API_KEY ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error("[Streaming TTS] ElevenLabs TTS API error", {
        status: response.status,
        error: errorText,
      });
      return null;
    }

    const audioBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    this.logger.debug("[Streaming TTS] ElevenLabs TTS succeeded", {
      audioSizeBytes: audioBuffer.byteLength,
    });
    // eslint-disable-next-line i18next/no-literal-string
    return `data:${contentType};base64,${base64Audio}`;
  }

  /**
   * Flush any remaining content in the buffer.
   * Call this when the stream ends.
   *
   * 1. Enqueues any remaining buffer text for generation
   * 2. Awaits ALL pending background generations
   * 3. Emits the final isFinal marker
   */
  async flush(): Promise<void> {
    this.logger.debug("[Streaming TTS] flush() called", {
      isEnabled: this.isEnabled,
      hasMessageId: !!this.messageId,
      messageId: this.messageId,
      bufferLength: this.buffer.length,
      bufferPreview: this.buffer.substring(0, 100),
    });

    if (!this.isEnabled || !this.messageId || this.isCancelled) {
      this.logger.debug(
        "[Streaming TTS] flush() skipped - not enabled, no messageId, or cancelled",
      );
      return;
    }

    // Enqueue remaining buffer content for generation
    const cleanBuffer = this.stripSpecialTags(this.buffer).trim();
    this.logger.debug("[Streaming TTS] flush() cleanBuffer", {
      cleanBufferLength: cleanBuffer.length,
      cleanBufferPreview: cleanBuffer.substring(0, 100),
    });

    if (cleanBuffer.length > 0) {
      const idx = this.chunkIndex++;
      this.buffer = "";

      // Chain like normal chunks
      this.generationChain = this.generationChain.then(() =>
        this.generateAndEmitChunk(cleanBuffer, idx),
      );
    } else {
      this.logger.debug("[Streaming TTS] flush() - no content to emit");
    }

    // Wait for ALL background generations + emissions to finish
    await this.generationChain;

    // Emit final chunk marker
    if (this.chunkIndex > 0 && this.wsEmit) {
      this.wsEmit("audio-chunk", {
        audioMessageId: this.messageId,
        audioData: "",
        chunkIndex: this.chunkIndex,
        audioIsFinal: true,
        audioText: "",
      });
    }

    // Reset state
    this.buffer = "";
    this.isInsideThinkTag = false;
    this.isInsideChatTag = false;
  }

  /**
   * Cancel all pending and future TTS generation.
   * Call this on stream abort / client disconnect to stop wasting API calls
   * and credit deductions for audio that will never be played.
   */
  cancel(): void {
    this.isCancelled = true;
    this.buffer = "";
    this.logger.debug(
      "[Streaming TTS] Cancelled - no further chunks will generate",
    );
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
    this.isCancelled = false;
    this.generationChain = Promise.resolve();
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
    // Remove orphaned closing tags
    result = result.replace(/<\/think>/gi, "");

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
  wsEmit: WsEmitCallback;
  logger: EndpointLogger;
  locale: CountryLanguage;
  voiceModelSelection: VoiceModelSelection;
  user: JwtPayloadType;
  enabled: boolean;
}): StreamingTTSHandler {
  return new StreamingTTSHandler(params);
}
