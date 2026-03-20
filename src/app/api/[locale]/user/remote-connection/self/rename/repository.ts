/**
 * Remote Connection Self Rename Repository
 * PATCH — update the instanceId of the current instance's own identity.
 *         Propagates to all connected remotes so they update their local label for us.
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
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { LEAD_ID_COOKIE_NAME } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";

import { instanceIdentities, remoteConnections } from "../../db";
import { RemoteConnectionRepository } from "../../repository";
import type { RemoteConnectionSelfRenamePatchResponseOutput } from "./definition";
import type { RemoteConnectionSelfRenameT } from "./i18n";

export class RemoteConnectionSelfRenameRepository {
  static async renameSelf(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: RemoteConnectionSelfRenameT,
    newInstanceId: string,
    locale: CountryLanguage,
    propagate: boolean,
  ): Promise<ResponseType<RemoteConnectionSelfRenamePatchResponseOutput>> {
    const [oldIdentity] = await db
      .select({ instanceId: instanceIdentities.instanceId })
      .from(instanceIdentities)
      .where(
        and(
          eq(instanceIdentities.userId, user.id),
          eq(instanceIdentities.isDefault, true),
        ),
      )
      .limit(1);

    if (!oldIdentity) {
      return fail({
        message: t("patch.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const oldInstanceId = oldIdentity.instanceId;

    const result = await db
      .update(instanceIdentities)
      .set({ instanceId: newInstanceId, updatedAt: new Date() })
      .where(
        and(
          eq(instanceIdentities.userId, user.id),
          eq(instanceIdentities.isDefault, true),
        ),
      )
      .returning({ id: instanceIdentities.id });

    if (result.length === 0) {
      return fail({
        message: t("patch.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Update ALL local tasks that target our old instanceId → new instanceId
    await db
      .update(cronTasks)
      .set({ targetInstance: newInstanceId })
      .where(eq(cronTasks.targetInstance, oldInstanceId));

    // Update remoteInstanceId on all our outbound rows (stores our own selfInstanceId)
    await db
      .update(remoteConnections)
      .set({ remoteInstanceId: newInstanceId, updatedAt: new Date() })
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.remoteInstanceId, oldInstanceId),
        ),
      );

    if (!propagate) {
      logger.info("Renamed self instance", {
        userId: user.id,
        oldInstanceId,
        newInstanceId,
      });
      return success({ updated: true });
    }

    // Fire-and-forget: notify all connected remotes to update their local label for us.
    // Sends propagate:false so remotes do not call us back.
    void (async (): Promise<void> => {
      const conns = await RemoteConnectionRepository.getAllActiveConnections(
        user.id,
      );
      for (const conn of conns) {
        try {
          const renameUrl = `${conn.remoteUrl}/api/${locale}/user/remote-connection/${oldInstanceId}/rename`;
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${conn.token}`,
          };
          if (conn.leadId) {
            headers.Cookie = `${LEAD_ID_COOKIE_NAME}=${conn.leadId}`;
          }
          await fetch(renameUrl, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ newInstanceId, propagate: false }),
            signal: AbortSignal.timeout(10000),
          });
          logger.info("[SELF-RENAME] Propagated rename to remote", {
            remoteUrl: conn.remoteUrl,
            oldInstanceId,
            newInstanceId,
          });
        } catch (err) {
          logger.warn(
            "[SELF-RENAME] Failed to propagate rename to remote (non-fatal)",
            {
              remoteUrl: conn.remoteUrl,
              error: String(err),
            },
          );
        }
      }
    })();

    logger.info("Renamed self instance", {
      userId: user.id,
      oldInstanceId,
      newInstanceId,
    });
    return success({ updated: true });
  }
}
