/**
 * Speech-to-Text Hotkey Repository
 * Handles hotkey-triggered speech-to-text with automatic insertion
 */

/// <reference types="bun-types" />

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import { FEATURE_COSTS } from "@/app/api/[locale]/v1/core/agent/chat/model-access/costs";
import { speechToTextRepository } from "@/app/api/[locale]/v1/core/agent/speech-to-text/repository";

import { createAdapters } from "./adapters/factory";
import type {
  SttHotkeyPostRequestOutput,
  SttHotkeyPostResponseOutput,
} from "./definition";
import { HotkeyAction, RecordingStatus } from "./enum";
import { type SpeechHotkeySession, createSession } from "./session";
import { checkPlatformDependencies, platformDetector } from "./utils/platform";
import { creditRepository } from "../../../credits/repository";

/**
 * Session store (in-memory for now, could be Redis in production)
 */
const sessions = new Map<string, SpeechHotkeySession>();

/**
 * Get session key for user
 */
function getSessionKey(user: JwtPayloadType): string {
  const userId = user.isPublic ? user.leadId : user.id;
  return `stt_hotkey_${userId}`;
}

/**
 * Speech-to-Text Hotkey Repository Interface
 */
export interface SttHotkeyRepository {
  /**
   * Handle hotkey action (start/stop/toggle)
   */
  handleHotkeyAction(
    data: SttHotkeyPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SttHotkeyPostResponseOutput>>;
}

/**
 * Speech-to-Text Hotkey Repository Implementation
 */
export class SttHotkeyRepositoryImpl implements SttHotkeyRepository {
  /**
   * Handle hotkey action
   */
  async handleHotkeyAction(
    data: SttHotkeyPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SttHotkeyPostResponseOutput>> {
    logger.info("Handling hotkey action", {
      action: data.action,
      provider: data.provider,
      language: data.language,
      userId: user.isPublic ? user.leadId : user.id,
    });

    try {
      // Check platform dependencies
      const platform = platformDetector.detect();
      const deps = await checkPlatformDependencies(platform);

      if (!deps.available) {
        logger.error("Platform dependencies not available", {
          platform: String(platform),
          missing: deps.missing.join(", "),
        });
        return fail({
          message:
            "app.api.v1.core.agent.speechToText.hotkey.post.errors.dependenciesMissing",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            missing: deps.missing.join(", "),
            recommendations: deps.recommendations.join("; "),
          },
        });
      }

      // Get or create session
      const sessionKey = getSessionKey(user);
      let session = sessions.get(sessionKey);

      if (!session) {
        session = await this.createNewSession(data, user, locale, logger);
        sessions.set(sessionKey, session);
      }

      // Handle action
      switch (data.action) {
        case HotkeyAction.START:
          return await this.handleStart(session, data, logger);

        case HotkeyAction.STOP:
          return await this.handleStop(session, data, user, locale, logger);

        case HotkeyAction.TOGGLE:
          return await this.handleToggle(session, data, user, locale, logger);

        case HotkeyAction.STATUS:
          return this.handleStatus(session, logger);

        default:
          // No action provided - should not happen from CLI daemon mode
          return fail({
            message:
              "app.api.v1.core.agent.speechToText.hotkey.post.errors.invalidAction",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: { action: "none" },
          });
      }
    } catch (error) {
      // Enhanced error logging to debug the "unknown error" issue
      const errorDetails: Record<
        string,
        string | number | boolean | null | undefined
      > = {
        action: data.action || "none",
        errorType: typeof error,
        errorName: error instanceof Error ? error.name : "unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      };

      // Log full error object for debugging
      if (error && typeof error === "object") {
        try {
          errorDetails.errorJson = JSON.stringify(error);
        } catch {
          errorDetails.errorJson = "Could not serialize error";
        }
      }

      logger.error("Failed to handle hotkey action", errorDetails);

      const errorMessage = parseError(error).message;

      return fail({
        message:
          "app.api.v1.core.agent.speechToText.hotkey.post.errors.actionFailed",
        errorType: ErrorResponseTypes.UNKNOWN_ERROR,
        messageParams: { error: errorMessage },
      });
    }
  }

  /**
   * Create new session
   */
  private async createNewSession(
    data: SttHotkeyPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<SpeechHotkeySession> {
    logger.debug("Creating new STT hotkey session");

    // Create adapters for current platform
    const { recorder, typer } = createAdapters();

    // Create STT function that wraps the existing repository
    const sttFunction = async (audioPath: string): Promise<string> => {
      logger.debug("Transcribing audio", { audioPath });

      // Read audio file
      const file = Bun.file(audioPath);
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/wav" });
      const audioFile = new File([blob], "recording.wav", {
        type: "audio/wav",
      });

      // Call existing STT repository
      const result = await speechToTextRepository.transcribeAudio(
        audioFile,
        {
          provider: data.provider,
          language: data.language,
          fileUpload: { file: audioFile },
        },
        user,
        locale,
        logger,
      );

      if (!result.success) {
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- STT error
        throw new Error(result.message || "Transcription failed");
      }

      return result.data.response.text;
    };

    // Create session
    return createSession({
      recorder,
      typer,
      stt: sttFunction,
      insertPrefix: data.insertPrefix,
      insertSuffix: data.insertSuffix,
      autoCleanup: true,
    });
  }

  /**
   * Handle START action
   */
  private async handleStart(
    session: SpeechHotkeySession,
    data: SttHotkeyPostRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<SttHotkeyPostResponseOutput>> {
    if (session.isRecording) {
      logger.warn("Recording already in progress");
      return fail({
        message:
          "app.api.v1.core.agent.speechToText.hotkey.post.errors.alreadyRecording",
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    await session.start();
    logger.info("Recording started");

    return success({
      response: {
        success: true,
        status: RecordingStatus.RECORDING,
        message: "Recording started",
      },
    });
  }

  /**
   * Handle STOP action
   */
  private async handleStop(
    session: SpeechHotkeySession,
    data: SttHotkeyPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SttHotkeyPostResponseOutput>> {
    if (!session.isRecording) {
      logger.warn("No recording in progress");
      return fail({
        message:
          "app.api.v1.core.agent.speechToText.hotkey.post.errors.notRecording",
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    const startTime = session.currentState.recordingStartedAt || Date.now();
    const text = await session.stopAndInsert();
    const duration = Date.now() - startTime;

    logger.info("Recording stopped and text inserted", {
      textLength: text.length,
      duration,
    });

    // Deduct credits AFTER successful completion
    await creditRepository.deductCreditsForFeature(
      user,
      FEATURE_COSTS.STT,
      "stt-hotkey",
      logger,
    );

    return success({
      response: {
        success: true,
        status: RecordingStatus.COMPLETED,
        message: "Text inserted successfully",
        text,
        recordingDuration: duration,
      },
    });
  }

  /**
   * Handle TOGGLE action
   */
  private async handleToggle(
    session: SpeechHotkeySession,
    data: SttHotkeyPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SttHotkeyPostResponseOutput>> {
    if (session.isRecording) {
      return await this.handleStop(session, data, user, locale, logger);
    } else {
      return await this.handleStart(session, data, logger);
    }
  }

  /**
   * Handle STATUS action
   */
  private handleStatus(
    session: SpeechHotkeySession,
    logger: EndpointLogger,
  ): ResponseType<SttHotkeyPostResponseOutput> {
    const state = session.currentState;
    logger.debug("Returning session status", { status: state.status });

    return success({
      response: {
        success: true,
        status: state.status,
        message: `Current status: ${state.status}`,
        text: state.lastTranscription || undefined,
        recordingDuration: state.recordingStartedAt
          ? Date.now() - state.recordingStartedAt
          : undefined,
      },
    });
  }
}

/**
 * Singleton instance
 */
export const sttHotkeyRepository = new SttHotkeyRepositoryImpl();
