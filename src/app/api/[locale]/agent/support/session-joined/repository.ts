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
import type { SupportT } from "../i18n";
import type {
  SessionJoinedRequestOutput,
  SessionJoinedResponseOutput,
} from "./definition";

export class SessionJoinedRepository {
  static async sessionJoined(
    data: SessionJoinedRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: SupportT,
  ): Promise<ResponseType<SessionJoinedResponseOutput>> {
    try {
      const { sessionId, threadId, joinedMessage } = data;

      // Update local session mirror to active
      await db
        .update(supportSessions)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(supportSessions.id, sessionId));

      // Insert system message into thread
      await db.insert(chatMessages).values({
        threadId,
        role: ChatMessageRole.SYSTEM,
        content: joinedMessage,
        authorName: "System",
      });

      // Notify thread subscribers live
      publishWsEvent(
        {
          channel: `agent/chat/threads/${threadId}/messages`,
          event: "support:joined",
          data: { sessionId },
        },
        logger,
        user,
      );

      return success({ acknowledged: true });
    } catch (error) {
      logger.error("session-joined callback failed", parseError(error));
      return fail({
        message: t("sessionJoined.errors.failed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }
}
