/**
 * Reverse Connection Update Repository
 *
 * Called by the initiating (local) instance via HTTP to mirror syncScope changes
 * to the remote side's reverse entry. The remote updates its stored record so
 * the sync serve-filter stays consistent on both sides.
 *
 * Only updates the reverse entry (isReverseEntry=true). Normal outbound rows
 * are managed by the initiating side directly.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { remoteConnections } from "../../db";
import type { ReverseUpdatePatchRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class ReverseConnectionUpdateRepository {
  static async updateReverseEntry(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    data: ReverseUpdatePatchRequestOutput,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ updated: boolean }>> {
    const { t } = scopedTranslation.scopedT(locale);
    const { instanceId, syncScope } = data;

    const [row] = await db
      .select({ id: remoteConnections.id })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
          eq(remoteConnections.isReverseEntry, true),
        ),
      )
      .limit(1);

    if (!row) {
      logger.warn("[ReverseUpdate] No reverse entry found", {
        userId: user.id,
        instanceId,
      });
      return fail({
        message: t("patch.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const patch: Partial<typeof remoteConnections.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (syncScope !== undefined) {
      patch.syncScope = syncScope;
    }

    await db
      .update(remoteConnections)
      .set(patch)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
          eq(remoteConnections.isReverseEntry, true),
        ),
      );

    logger.info("[ReverseUpdate] Updated reverse entry", {
      userId: user.id,
      instanceId,
      syncScope,
    });

    return success({ updated: true });
  }
}
