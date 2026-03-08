/**
 * Resume Stream Repository
 * Continues an existing thread by running a headless AI turn (threadMode: "append").
 *
 * Called as a one-shot cron task by handleTaskCompletion after an async remote
 * task completes (callbackMode=wait or wakeUp).
 *
 * isStreaming check:
 * - true  → stream is still live; the backfilled tool result is already in DB and
 *           the running loop will pick it up naturally. No headless stream needed.
 * - false → stream is dead; run a headless append stream so the AI continues.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { runHeadlessAiStream } from "../repository/headless";
import type { AiStreamT } from "../stream/i18n";
import type {
  ResumeStreamRequestOutput,
  ResumeStreamResponseOutput,
} from "./definition";

export class ResumeStreamRepository {
  static async resume(
    data: ResumeStreamRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: AiStreamT,
  ): Promise<ResponseType<ResumeStreamResponseOutput>> {
    const { threadId, favoriteId, modelId, characterId } = data;

    try {
      // Check if the thread's stream is still live.
      // If so, the backfilled tool result is already in DB and the running loop
      // will pick it up on its next tool-result step — no headless stream needed.
      const [thread] = await db
        .select({ isStreaming: chatThreads.isStreaming })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (thread?.isStreaming) {
        logger.info(
          "[ResumeStream] Stream still live — tool result already injected into DB, skipping headless resume",
          { threadId },
        );
        return success({ resumed: false, lastAiMessageId: null });
      }

      logger.info("[ResumeStream] Stream dead — starting headless append", {
        threadId,
        favoriteId,
        modelId,
        characterId,
      });

      const streamResult = await runHeadlessAiStream({
        favoriteId,
        model: modelId,
        character: characterId,
        prompt: "",
        threadMode: "append",
        threadId,
        rootFolderId: DefaultFolderId.CRON,
        excludeMemories: false,
        user,
        locale,
        logger,
        t,
      });

      if (!streamResult.success) {
        return streamResult;
      }

      const { lastAiMessageId } = streamResult.data;

      logger.info("[ResumeStream] Headless stream completed", {
        threadId,
        lastAiMessageId,
      });

      return success({
        resumed: true,
        lastAiMessageId: lastAiMessageId ?? null,
      });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[ResumeStream] Failed", { threadId, error: msg });
      return fail({
        message: t("errors.unexpectedError", { error: msg }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
