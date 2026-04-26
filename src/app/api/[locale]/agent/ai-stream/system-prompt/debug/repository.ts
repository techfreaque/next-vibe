import "server-only";

import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { buildSystemPrompt } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/builder";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";
import { users as usersTable } from "@/app/api/[locale]/user/db";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { eq } from "drizzle-orm";

import type { SystemPromptDebugResponseOutput } from "./definition";
import type { SystemPromptDebugT } from "./i18n";

interface DebugSystemPromptParams {
  rootFolderId: DefaultFolderId;
  userRole: "public" | "customer" | "admin";
  userMessage?: string;
  threadId?: string;
  userId?: string;
  skillId?: string;
  subFolderId?: string;
  requestingUser: JwtPrivatePayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: SystemPromptDebugT;
}

export async function buildDebugSystemPrompt(
  params: DebugSystemPromptParams,
): Promise<ResponseType<SystemPromptDebugResponseOutput>> {
  const {
    rootFolderId,
    userRole,
    userMessage,
    threadId,
    userId,
    skillId,
    subFolderId,
    requestingUser,
    locale,
    logger,
    t,
  } = params;

  // Resolve target user: use provided userId or fall back to requesting admin
  let baseUser: JwtPrivatePayloadType = requestingUser;

  if (userId && userId !== requestingUser.id) {
    try {
      const rows = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      const row = rows[0];
      if (!row) {
        return fail({
          message: t("get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      baseUser = {
        id: row.id,
        // Use requesting admin's leadId since user_leads is separate table
        leadId: requestingUser.leadId,
        isPublic: false,
        roles: [UserPermissionRole.CUSTOMER],
      };
    } catch (error) {
      logger.error("Failed to load target user", parseError(error), {
        userId,
      });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // Apply simulated role overlay
  const simulatedUser: JwtPayloadType =
    userRole === "public"
      ? {
          isPublic: true,
          leadId: baseUser.leadId,
          roles: [UserPermissionRole.PUBLIC],
        }
      : {
          ...baseUser,
          isPublic: false,
          roles:
            userRole === "admin"
              ? [UserPermissionRole.ADMIN]
              : [UserPermissionRole.CUSTOMER],
        };

  try {
    const targetUserId = simulatedUser.isPublic ? undefined : simulatedUser.id;

    const [{ systemPrompt, trailingSystemMessage }, rawScores] =
      await Promise.all([
        buildSystemPrompt({
          skillId: skillId ?? null,
          user: simulatedUser,
          logger,
          locale,
          rootFolderId: rootFolderId as DefaultFolderId,
          subFolderId: subFolderId ?? null,
          callMode: false,
          headless: false,
          subAgentDepth: 0,
          lastUserMessage: userMessage,
          threadId: threadId ?? null,
        }),
        userMessage && targetUserId
          ? import("@/app/api/[locale]/agent/cortex/system-prompt/server")
              .then(({ loadRawEmbeddingScores }) =>
                loadRawEmbeddingScores(targetUserId, userMessage),
              )
              .catch((err) => {
                logger.warn("loadRawEmbeddingScores failed", {
                  error: err instanceof Error ? err.message : String(err),
                });
                return null;
              })
          : Promise.resolve(null),
      ]);

    const totalChars = systemPrompt.length + trailingSystemMessage.length;

    return success({
      systemPrompt,
      trailingSystemMessage,
      charCount: totalChars,
      tokenEstimate: Math.ceil(totalChars / 4),
      cortexDiagnostics: rawScores
        ? {
            embeddingGenerated: rawScores.embeddingGenerated,
            topScores: rawScores.scores,
          }
        : undefined,
    });
  } catch (error) {
    logger.error("Failed to build debug system prompt", parseError(error));
    return fail({
      message: t("get.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
