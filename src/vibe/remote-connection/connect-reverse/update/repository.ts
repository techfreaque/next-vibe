/**
 * Reverse Connection Update Repository
 *
 * The canonical "mirror a setting to the peer" endpoint. Either side calls it on
 * the other (via runInProcessTyped) to keep both rows in sync: syncScope (sync
 * serve-filter) and remoteTransportMode (how the peer reaches us → drives our
 * connector lifecycle).
 */

import "server-only";

import { and, eq } from "drizzle-orm";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "../../../core/route/response.schema";
import { db } from "../../../database";
import type { JwtPrivatePayloadType } from "../../../identity/auth/types";
import type { EndpointLogger } from "../../../logger/types";
import { cronTaskOwnerScope } from "../../cron-scope";
import { isRemoteAdmin } from "../../customer-access/access";
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
    const {
      instanceId,
      syncScope,
      remoteTransportMode,
      transportMode,
      newInstanceId,
      reconnectNow,
    } = data;

    const [row] = await db
      .select({
        id: remoteConnections.id,
        instanceId: remoteConnections.instanceId,
      })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.isActive, true),
          eq(remoteConnections.instanceId, instanceId),
        ),
      )
      .limit(1);

    if (!row) {
      logger.warn("[ReverseUpdate] No connection found for caller", {
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

    // Customers' transports are pinned (customer-access): a peer may mirror
    // its scope and name, never steer how we reach it.
    const isAdmin = isRemoteAdmin(user);
    if (!isAdmin && (remoteTransportMode ?? transportMode) !== undefined) {
      logger.debug("[ReverseUpdate] Ignoring transport change (pinned)", {
        userId: user.id,
        instanceId,
      });
    }
    if (syncScope !== undefined) {
      patch.syncScope = syncScope;
    }
    if (isAdmin && remoteTransportMode !== undefined) {
      patch.remoteTransportMode = remoteTransportMode;
    }
    if (isAdmin && transportMode !== undefined) {
      patch.transportMode = transportMode;
    }
    // The caller renamed itself: our row's instanceId is OUR label for the
    // caller — update it, the REMOTE subfolder, and any tasks targeting the
    // old label. (`instanceId` in the request is the caller's OLD id; that is
    // what found the row above.)
    if (newInstanceId !== undefined && newInstanceId !== row.instanceId) {
      patch.instanceId = newInstanceId;
    }

    const localInstanceId = row.instanceId;

    await db
      .update(remoteConnections)
      .set(patch)
      .where(eq(remoteConnections.id, row.id));

    if (patch.instanceId) {
      const { renameInstanceFolder } = await import("../../instance-folder");
      await renameInstanceFolder(user.id, localInstanceId, patch.instanceId);
      const { cronTasks } = await import("../../../tasks/cron/db");
      await db
        .update(cronTasks)
        .set({ targetInstance: patch.instanceId })
        .where(
          and(
            eq(cronTasks.targetInstance, localInstanceId),
            cronTaskOwnerScope(user, cronTasks.userId),
          ),
        );
      // Rekey the live connector (registry + reconnect state are keyed by
      // instanceId). restartConnection reloads the row under the new id.
      // Customers never own a connector here (pinned transports), and the
      // registry is keyed by instanceId alone — never touch it for them.
      if (isAdmin) {
        const { getWsConnection, closeConnection, restartConnection } =
          await import("../../../realtime/server/connector");
        if (getWsConnection(localInstanceId, user.id)) {
          closeConnection(localInstanceId);
          await restartConnection(patch.instanceId, user.id);
        }
      }
    }

    logger.info("[ReverseUpdate] Mirrored settings to local connection", {
      userId: user.id,
      callerInstanceId: instanceId,
      localInstanceId,
      syncScope,
      remoteTransportMode,
      newInstanceId,
    });

    // Connector lifecycle on THIS side. restartConnection is transport-aware: it
    // re-runs the ONE HTTP pull-on-connect for EVERY transport (so a mirrored
    // `reconnectNow` re-syncs a direct-http pair too — the exchange rides HTTP,
    // never a socket) and opens a persistent outbound connector ONLY when the
    // peer reaches us via reverse-ws. A direct-http pair therefore re-syncs
    // without ever opening a pointless "closed before established" socket.
    // (cloud instances never open outbound sockets; openConnection no-ops there.)
    // Open / close / restart the connector AS NEEDED — when EITHER transport leg
    // changed (our remoteTransportMode or our transportMode) or the caller asked
    // to reconnect. restartConnection opens a socket iff a leg is reverse-ws,
    // else stays pull-only (dropping any stale socket) — so this one call opens,
    // closes, or restarts to match the new mode pair.
    const effectiveInstanceId = patch.instanceId ?? localInstanceId;
    if (
      isAdmin &&
      (reconnectNow === true ||
        remoteTransportMode !== undefined ||
        transportMode !== undefined)
    ) {
      const { restartConnection } =
        await import("../../../realtime/server/connector");
      await restartConnection(effectiveInstanceId, user.id);
    }

    return success({ updated: true });
  }
}
