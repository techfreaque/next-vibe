/**
 * Reverse Connection Update Repository
 *
 * The canonical "mirror a setting to the peer" endpoint. Either side calls it on
 * the other (via runInProcessTyped) to keep both rows in sync: syncScope (sync
 * serve-filter) and remoteTransportMode (how the peer reaches us → drives our
 * connector lifecycle). Matches the local connection to the caller by either
 * instanceId or remoteInstanceId — works for both the reverse entry and the
 * outbound row.
 */

import "server-only";

import { and, eq, or } from "drizzle-orm";
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
    const { instanceId, syncScope, remoteTransportMode } = data;

    // `instanceId` is the CALLER's self-id. On this (callee) side the connection
    // to that caller is keyed either by instanceId (we are the caller's reverse
    // entry) or by remoteInstanceId (we initiated to the caller, so it's our
    // outbound row). Match either — both sides must stay in sync; the mirror is
    // not specific to reverse entries.
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
          or(
            eq(remoteConnections.instanceId, instanceId),
            eq(remoteConnections.remoteInstanceId, instanceId),
          ),
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

    if (syncScope !== undefined) {
      patch.syncScope = syncScope;
    }
    if (remoteTransportMode !== undefined) {
      patch.remoteTransportMode = remoteTransportMode;
    }

    // The local row's own instanceId (may differ from the caller's self-id when
    // this is our outbound row, keyed by remoteInstanceId).
    const localInstanceId = row.instanceId;

    await db
      .update(remoteConnections)
      .set(patch)
      .where(eq(remoteConnections.id, row.id));

    logger.info("[ReverseUpdate] Mirrored settings to local connection", {
      userId: user.id,
      callerInstanceId: instanceId,
      localInstanceId,
      syncScope,
      remoteTransportMode,
    });

    // Connector lifecycle on THIS side: open the outbound connector to the peer
    // (subscribing to its remote-event hub) exactly when the peer reaches us via
    // reverse-ws — i.e. remoteTransportMode became "reverse-ws". Otherwise the
    // peer reaches us directly and we keep no socket. (cloud instances never open
    // outbound sockets; openConnection no-ops there.)
    if (remoteTransportMode !== undefined) {
      if (remoteTransportMode === "reverse-ws") {
        const { restartConnection } =
          await import("@/app/api/[locale]/system/unified-interface/websocket/connector");
        await restartConnection(localInstanceId);
      } else {
        const { closeConnection } =
          await import("@/app/api/[locale]/system/unified-interface/websocket/connector");
        closeConnection(localInstanceId);
      }
    }

    return success({ updated: true });
  }
}
