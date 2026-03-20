/**
 * Remote Connection Rename Repository
 * PATCH — update the local instanceId label for a remote connection.
 *         When propagate=true, also calls the remote's self/rename with
 *         propagate=false so the remote updates its own identity without
 *         calling us back.
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

import { remoteConnections } from "../../db";
import { RemoteConnectionRepository } from "../../repository";
import type { RemoteConnectionRenamePatchResponseOutput } from "./definition";
import type { RemoteConnectionRenameT } from "./i18n";

export class RemoteConnectionRenameRepository {
  static async renameConnection(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: RemoteConnectionRenameT,
    instanceId: string,
    newInstanceId: string,
    locale: CountryLanguage,
    propagate: boolean,
  ): Promise<ResponseType<RemoteConnectionRenamePatchResponseOutput>> {
    const [conn] = await db
      .select({
        remoteUrl: remoteConnections.remoteUrl,
        token: remoteConnections.token,
        leadId: remoteConnections.leadId,
      })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      )
      .limit(1);

    if (!conn) {
      return fail({
        message: t("patch.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    await db
      .update(remoteConnections)
      .set({ instanceId: newInstanceId, updatedAt: new Date() })
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );

    // Update ALL local tasks targeting the old label → new label
    await db
      .update(cronTasks)
      .set({ targetInstance: newInstanceId })
      .where(eq(cronTasks.targetInstance, instanceId));

    logger.debug("Renamed remote connection", {
      userId: user.id,
      instanceId,
      newInstanceId,
    });

    // Propagate to remote: call their self/rename with propagate=false so they
    // update their own identity without calling us back.
    if (propagate && conn.token && conn.remoteUrl) {
      void (async (): Promise<void> => {
        try {
          const decryptedToken = RemoteConnectionRepository.decryptToken(
            conn.token as string,
          );
          const selfRenameUrl = `${conn.remoteUrl}/api/${locale}/user/remote-connection/self/rename`;
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decryptedToken}`,
          };
          if (conn.leadId) {
            headers.Cookie = `${LEAD_ID_COOKIE_NAME}=${conn.leadId}`;
          }
          await fetch(selfRenameUrl, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ newInstanceId, propagate: false }),
            signal: AbortSignal.timeout(10000),
          });
          logger.info("[RENAME] Propagated self-rename to remote", {
            remoteUrl: conn.remoteUrl,
            newInstanceId,
          });
        } catch (err) {
          logger.warn(
            "[RENAME] Failed to propagate self-rename to remote (non-fatal)",
            {
              remoteUrl: conn.remoteUrl,
              error: String(err),
            },
          );
        }
      })();
    }

    return success({ updated: true });
  }
}
