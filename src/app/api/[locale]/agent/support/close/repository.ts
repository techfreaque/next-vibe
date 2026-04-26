import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole } from "@/app/api/[locale]/agent/chat/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { publishWsEvent } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { supportSessions } from "../db";
import type { CloseRequestOutput, CloseResponseOutput } from "./definition";
import type { SupportT } from "../i18n";

export class CloseRepository {
  static async close(
    data: CloseRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: SupportT,
  ): Promise<ResponseType<CloseResponseOutput>> {
    try {
      const { sessionId } = data;

      const [session] = await db
        .select()
        .from(supportSessions)
        .where(eq(supportSessions.id, sessionId))
        .limit(1);

      if (!session) {
        return fail({
          message: t("close.errors.sessionNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (session.status === "closed") {
        return fail({
          message: t("close.errors.alreadyClosed"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Update session to closed
      await db
        .update(supportSessions)
        .set({ status: "closed", updatedAt: new Date() })
        .where(eq(supportSessions.id, sessionId));

      // Insert system message if thread exists
      if (session.threadId) {
        const systemMessageContent = t("close.systemMessage");
        await db.insert(chatMessages).values({
          threadId: session.threadId,
          role: ChatMessageRole.SYSTEM,
          content: systemMessageContent,
          authorName: "System",
        });

        // Emit WS event
        publishWsEvent(
          {
            channel: `agent/chat/threads/${session.threadId}/messages`,
            event: "support:closed",
            data: { sessionId },
          },
          logger,
          user,
        );
      }

      // Emit to support sessions channel
      publishWsEvent(
        {
          channel: "support/sessions",
          event: "support:session-closed",
          data: { sessionId },
        },
        logger,
        user,
      );

      return success({ closed: true });
    } catch (error) {
      logger.error("close session failed", parseError(error));
      return fail({
        message: t("close.errors.sessionNotFound"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }
}
