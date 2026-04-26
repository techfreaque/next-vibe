import "server-only";

import { and, eq } from "drizzle-orm";
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
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { remoteConnections } from "@/app/api/[locale]/user/remote-connection/db";
import { BEARER_LEAD_ID_SEPARATOR } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

import { supportSessions } from "../db";
import type { SupportT } from "../i18n";
import type { JoinRequestOutput, JoinResponseOutput } from "./definition";

export class JoinRepository {
  static async join(
    data: JoinRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: SupportT,
  ): Promise<ResponseType<JoinResponseOutput>> {
    try {
      const { sessionId } = data;

      const [session] = await db
        .select()
        .from(supportSessions)
        .where(eq(supportSessions.id, sessionId))
        .limit(1);

      if (!session) {
        return fail({
          message: t("join.errors.sessionNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (session.status !== "pending") {
        return fail({
          message: t("join.errors.alreadyJoined"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Find supporter's connection to the initiating instance
      const initiatorInstanceUrl = session.initiatorInstanceUrl;
      const [conn] = initiatorInstanceUrl
        ? await db
            .select({
              remoteUrl: remoteConnections.remoteUrl,
              token: remoteConnections.token,
              leadId: remoteConnections.leadId,
            })
            .from(remoteConnections)
            .where(
              and(
                eq(remoteConnections.userId, user.id),
                eq(remoteConnections.remoteUrl, initiatorInstanceUrl),
                eq(remoteConnections.isActive, true),
              ),
            )
            .limit(1)
        : [];

      // Update session: active, supporterId, supporterInstanceUrl
      const appUrl =
        process.env["NEXT_PUBLIC_PROJECT_URL"] ??
        process.env["NEXT_PUBLIC_APP_URL"] ??
        "http://localhost:3000";

      await db
        .update(supportSessions)
        .set({
          status: "active",
          supporterId: user.id,
          supporterInstanceUrl: appUrl,
          updatedAt: new Date(),
        })
        .where(eq(supportSessions.id, sessionId));

      // Post system message and emit WS — either locally or cross-instance
      const threadId = session.threadId;
      if (threadId) {
        if (conn) {
          // Cross-instance: POST system message to initiating instance
          void notifyInitiatorInstance({
            remoteUrl: conn.remoteUrl,
            token: conn.token,
            leadId: conn.leadId,
            locale,
            sessionId,
            threadId,
            joinedMessage: t("join.systemMessage"),
            logger,
          });
        } else {
          // Same instance: insert directly
          await db.insert(chatMessages).values({
            threadId,
            role: ChatMessageRole.SYSTEM,
            content: t("join.systemMessage"),
            authorName: "System",
          });

          publishWsEvent(
            {
              channel: `agent/chat/threads/${threadId}/messages`,
              event: "support:joined",
              data: { sessionId },
            },
            logger,
            user,
          );
        }
      }

      // Emit to support sessions channel
      publishWsEvent(
        {
          channel: "support/sessions",
          event: "support:session-joined",
          data: { sessionId },
        },
        logger,
        user,
      );

      return success({
        threadId,
        initiatorInstanceUrl,
      });
    } catch (error) {
      logger.error("join failed", parseError(error));
      return fail({
        message: t("join.errors.callbackFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }
}

async function notifyInitiatorInstance({
  remoteUrl,
  token,
  leadId,
  locale,
  sessionId,
  threadId,
  joinedMessage,
  logger,
}: {
  remoteUrl: string;
  token: string;
  leadId: string;
  locale: CountryLanguage;
  sessionId: string;
  threadId: string;
  joinedMessage: string;
  logger: EndpointLogger;
}): Promise<void> {
  try {
    const url = `${remoteUrl.replace(/\/$/, "")}/api/${locale}/agent/support/session-joined`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}${BEARER_LEAD_ID_SEPARATOR}${leadId}`,
      },
      body: JSON.stringify({ sessionId, threadId, joinedMessage }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    logger.warn(
      "Failed to notify initiating instance of join",
      parseError(error),
    );
  }
}
