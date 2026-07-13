/**
 * Remote Connection Self Rename Repository
 * PATCH - update the instanceId of the current instance's own identity.
 *         Propagates to all connected remotes so they update their local label for us.
 */

import "server-only";

import { eq } from "drizzle-orm";
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

import { instanceIdentities } from "../../db";
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
      .where(eq(instanceIdentities.userId, user.id))
      .limit(1);

    if (!oldIdentity) {
      return fail({
        message: t("patch.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const oldInstanceId = oldIdentity.instanceId;

    // No-op rename (same id): nothing changed — skip the DB writes, the peer
    // propagation, and the connector reconnect entirely. Prevents a defensive
    // "restore identity" (atlas→atlas) from pointlessly reconnecting the tunnel.
    if (newInstanceId === oldInstanceId) {
      return success({ updated: true });
    }

    const result = await db
      .update(instanceIdentities)
      .set({ instanceId: newInstanceId, updatedAt: new Date() })
      .where(eq(instanceIdentities.userId, user.id))
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
    // hand-rolled URL/auth). The peer's connect-reverse/update finds its row by
    // our OLD id and updates its label (row instanceId + REMOTE subfolder +
    // task targets). It must NOT be the peer's self/rename — that would rename
    // the peer's own identity.
    void (async (): Promise<void> => {
      const { RouteExecuteRepository } =
        await import("next-vibe/execute-tool/repository");
      const { default: reverseUpdateDef } =
        await import("../../connect-reverse/update/definition");
      const conns = await RemoteConnectionRepository.getAllActiveConnections(
        user.id,
      );
      for (const conn of conns) {
        try {
          const propagateResult =
            await RouteExecuteRepository.runInProcessTyped({
              definition: reverseUpdateDef.PATCH,
              input: {
                instanceId: oldInstanceId,
                newInstanceId,
                // NEVER carry syncScope on a rename. syncScope is DIRECTIONAL —
                // each side owns its OWN outbound scope, mirrored to the peer only
                // when a real scope PATCH changes it (via [instanceId] PATCH →
                // connect-reverse/update). A rename is a pure identity change; the
                // `conn.syncScope` here is OUR view of the peer's connection (our
                // outbound toward them), which is NOT the peer's outbound scope.
                // Sending it clobbered the peer's own choice — e.g. the peer had
                // enabled threads sync toward us and our all-default view reset it
                // to false, silently dropping every folder/thread mirror event.
                // Omit it: connect-reverse/update leaves scope untouched.
                //
                // The reverse-ws channel key is derived from our instanceId, so
                // renaming us changes it — the peer must reconnect its connector
                // (with our new id) or the tunnel goes dead. connect-reverse/
                // update restarts it when reconnectNow is set.
                reconnectNow: true,
              },
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
