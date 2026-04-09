/**
 * WS Provider Stream Repository
 *
 * Delegates to AiStreamRepository.createAiStream() to run the AI stream.
 * The cloud side executes all tools server-side - the client only observes
 * events via WebSocket (subscribe + unsubscribe, no tool-result messages).
 */

import "server-only";

import type { NextRequest } from "next-vibe-ui/lib/request";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { DEFAULT_TTS_VOICE_ID } from "@/app/api/[locale]/agent/text-to-speech/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { AiStreamRepository } from "../../repository";
import type { AiStreamPostRequestOutput } from "../../stream/definition";
import type { AiStreamT } from "../../stream/i18n";
import type {
  WsProviderStreamPostRequestOutput,
  WsProviderStreamPostResponseOutput,
} from "./definition";

export class WsProviderStreamRepository {
  static async stream({
    data,
    locale,
    logger,
    user,
    request,
  }: {
    data: WsProviderStreamPostRequestOutput;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request?: NextRequest;
  }): Promise<ResponseType<WsProviderStreamPostResponseOutput>> {
    // Get AI stream translation function (needed for createAiStream and error messages)
    const { scopedTranslation: aiStreamI18n } =
      await import("@/app/api/[locale]/agent/ai-stream/stream/i18n");
    const t: AiStreamT = aiStreamI18n.scopedT(locale).t;

    try {
      // 1. Resolve threadId - use existing or generate new
      const threadId = data.threadId ?? crypto.randomUUID();

      // 2. Build AiStream-compatible data object
      const aiStreamData: AiStreamPostRequestOutput = {
        operation: "send",
        rootFolderId: DefaultFolderId.PRIVATE,
        subFolderId: data.instanceId ?? null,
        threadId,
        userMessageId: crypto.randomUUID(),
        parentMessageId: null,
        leafMessageId: null,
        content: data.content,
        role: ChatMessageRole.USER,
        model: data.model,
        skill: data.skill,
        availableTools: null,
        pinnedTools: null,
        toolConfirmations: null,
        messageHistory: [],
        attachments: [],
        resumeToken: null,
        voiceMode: { enabled: false, voice: DEFAULT_TTS_VOICE_ID },
        audioInput: { file: null },
        timezone: data.timezone,
        imageSize: undefined,
        imageQuality: undefined,
        musicDuration: undefined,
      };

      // 3. Call AiStreamRepository.createAiStream() - cloud executes all tools server-side
      const result = await AiStreamRepository.createAiStream({
        data: aiStreamData,
        locale,
        logger,
        user,
        request,
        headless: false,
        t,
        extraInstructions: data.systemPrompt,
      });

      if (!result.success) {
        return fail({
          message: result.message,
          errorType: result.errorType ?? ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // 4. Return threadId and messageId
      return success({
        responseThreadId: result.data.responseThreadId ?? threadId,
        messageId: result.data.messageId,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("[WsProviderStream] Unexpected error", {
        error: parsedError,
      });
      return fail({
        message: t("errors.unexpectedError", {
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
