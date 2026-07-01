/**
 * Remote Connection Self Rename Repository
 * PATCH - update the instanceId of the current instance's own identity.
 *         Propagates to all connected remotes so they update their local label for us.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTasks } from "next-vibe/tasks/cron/db";

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

    // Fire-and-forget: notify all connected remotes to update their local label
    // for us, via the typed remote-dispatch door (routed by instanceId — no
    // hand-rolled URL/auth). Sends propagate:false so remotes do not call us back.
    void (async (): Promise<void> => {
      const { RouteExecuteRepository } =
        await import("next-vibe/execute-tool/repository");
      const selfRenameDef = await import("./definition");
      const conns = await RemoteConnectionRepository.getAllActiveConnections(
        user.id,
      );
      for (const conn of conns) {
        try {
          const propagateResult =
            await RouteExecuteRepository.runInProcessTyped({
              definition: selfRenameDef.default.PATCH,
              input: { newInstanceId, propagate: false },
              instanceId: conn.instanceId,
              user,
              locale,
              logger,
            });
          if (propagateResult.success) {
            logger.info("[SELF-RENAME] Propagated rename to remote", {
              instanceId: conn.instanceId,
              oldInstanceId,
              newInstanceId,
            });
          } else {
            logger.warn(
              "[SELF-RENAME] Failed to propagate rename to remote (non-fatal)",
              {
                instanceId: conn.instanceId,
                error: propagateResult.message,
              },
            );
          }
        } catch (err) {
          logger.warn(
            "[SELF-RENAME] Failed to propagate rename to remote (non-fatal)",
            {
              instanceId: conn.instanceId,
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
