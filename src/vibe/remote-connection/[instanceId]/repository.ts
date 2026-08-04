/**
 * Remote Connection by Instance ID Repository
 * GET    - full connection detail (status + all settings)
 * PATCH  - update settings: rename, reauth, behavior flags, sync scope
 * DELETE - disconnect: delete row, close WS, archive subfolder, notify remote
 */

import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import type { CountryLanguage } from "../../core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "../../core/route/response.schema";
import { db } from "../../database";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import type { EndpointLogger } from "../../logger/types";
import type { Platform } from "../../platforms/platforms";
import { remoteConnections } from "../db";
import { RemoteConnectionRepository } from "../repository";
import { ExecuteToolRouting } from "../routing";
import { RemoteTransport } from "../transport";
import type {
  RemoteConnectionByIdDeleteResponseOutput,
  RemoteConnectionByIdGetResponseOutput,
  RemoteConnectionByIdPatchRequestOutput,
  RemoteConnectionByIdPatchResponseOutput,
} from "./definition";
import definitions from "./definition";
import { scopedTranslation } from "./i18n";

export class RemoteConnectionInstanceRepository {
  // ─── GET ────────────────────────────────────────────────────────────────────

  static async getConnectionById(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    instanceId: string,
  ): Promise<ResponseType<RemoteConnectionByIdGetResponseOutput>> {
    const [row] = await db
      .select()
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );

    if (!row || !row.isActive) {
      logger.debug("No active remote connection for user+instance", {
        userId: user.id,
        instanceId,
      });
      return success({
        isConnected: false,
        remoteUrl: null,
        isActive: null,
        lastSyncedAt: null,
        wsConnectedAt: null,
        capabilitiesVersion: null,
        transportMode: null,
        remoteTransportMode: null,
        isInferenceProvider: null,
        forceSystemProvider: null,
        syncScope: null,
      });
    }

    return success({
      isConnected: true,
      remoteUrl: row.remoteUrl,
      isActive: row.isActive,
      lastSyncedAt: row.lastSyncedAt?.toISOString() ?? null,
      wsConnectedAt: row.wsConnectedAt?.toISOString() ?? null,
      capabilitiesVersion: row.capabilitiesVersion ?? null,
      transportMode: row.transportMode ?? null,
      remoteTransportMode: row.remoteTransportMode ?? null,
      isInferenceProvider: row.isInferenceProvider,
      forceSystemProvider: row.forceSystemProvider,
      syncScope: row.syncScope ?? null,
    });
  }

  // ─── PATCH ──────────────────────────────────────────────────────────────────

  static async updateConnection(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    instanceId: string,
    data: RemoteConnectionByIdPatchRequestOutput,
    locale: CountryLanguage,
    platform: Platform,
  ): Promise<ResponseType<RemoteConnectionByIdPatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    const [row] = await db
      .select()
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );

    if (!row) {
      return fail({
        message: t("get.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const {
      newInstanceId,
      email,
      password,
      isInferenceProvider,
      forceSystemProvider,
      syncScope,
      reconnectNow,
      transportMode,
      remoteTransportMode,
      threadMirrorMode,
      loopLocation,
    } = data;

    const isAdmin = user.roles?.includes(UserPermissionRole.ADMIN) === true;

    // These fields are admin-only — customers can only rename and disconnect.
    const adminOnlyFields = [
      forceSystemProvider,
      isInferenceProvider,
      transportMode,
      remoteTransportMode,
    ];
    if (!isAdmin && adminOnlyFields.some((f) => f !== undefined)) {
      return fail({
        message: t("get.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // If enabling forceSystemProvider: clear it on all connections instance-wide first
    if (forceSystemProvider === true) {
      await db
        .update(remoteConnections)
        .set({ forceSystemProvider: false, updatedAt: new Date() })
        .where(eq(remoteConnections.forceSystemProvider, true));
    }
    // If enabling isInferenceProvider: clear it on all connections instance-wide first
    if (isInferenceProvider === true) {
      await db
        .update(remoteConnections)
        .set({ isInferenceProvider: false, updatedAt: new Date() })
        .where(eq(remoteConnections.isInferenceProvider, true));
    }

    // ── Reauth: refresh token from remote ────────────────────────────────────
    if (email !== undefined && password !== undefined) {
      const reauthResult = await RemoteConnectionInstanceRepository._reauth(
        user,
        logger,
        t,
        row,
        instanceId,
        email,
        password,
        locale,
      );
      if (!reauthResult.success) {
        return reauthResult;
      }
    }

    // ── Rename: update instanceId ─────────────────────────────────────────────
    if (newInstanceId !== undefined && newInstanceId !== instanceId) {
      await RemoteConnectionInstanceRepository._rename(
        user,
        logger,
        row,
        instanceId,
        newInstanceId,
        locale,
        platform,
      );
    }

    // ── Settings patch ────────────────────────────────────────────────────────
    const patch: Partial<typeof remoteConnections.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (isInferenceProvider !== undefined) {
      patch.isInferenceProvider = isInferenceProvider;
    }
    if (forceSystemProvider !== undefined) {
      patch.forceSystemProvider = forceSystemProvider;
    }
    if (syncScope !== undefined) {
      patch.syncScope = syncScope;
    }
    if (transportMode !== undefined) {
      patch.transportMode = transportMode;
    }
    if (remoteTransportMode !== undefined) {
      patch.remoteTransportMode = remoteTransportMode;
    }
    if (threadMirrorMode !== undefined) {
      patch.threadMirrorMode = threadMirrorMode;
    }
    if (loopLocation !== undefined) {
      patch.loopLocation = loopLocation;
    }

    // Apply to the (potentially renamed) instanceId
    const targetInstanceId = newInstanceId ?? instanceId;

    await db
      .update(remoteConnections)
      .set(patch)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, targetInstanceId),
        ),
      );

    if (
      isInferenceProvider !== undefined ||
      forceSystemProvider !== undefined
    ) {
      ExecuteToolRouting.invalidateUnbottledCache();
    }

    logger.info("Updated remote connection settings", {
      userId: user.id,
      instanceId,
      newInstanceId,
      isInferenceProvider,
      forceSystemProvider,
      syncScope,
      outbound: transportMode,
      inbound: remoteTransportMode,
    });

    // Mirror changed settings to the peer's reverse entry via the peer's real
    // connect-reverse/update endpoint, over the single canonical remote-call
    // (runInProcessTyped resolves the leg + auth). No magic WS control events —
    // "do X on the peer" is always a definition-driven endpoint call.
    //   • syncScope          — keeps the sync serve-filter consistent both sides.
    //   • remoteTransportMode — our transportMode IS the peer's "how the remote
    //     reaches me"; the peer stores it and (re)opens/closes its connector.
    //   • reconnectNow       — tell the peer to restart its outbound connector too
    //     (covers the case where the peer's socket was the one that dropped).
    const shouldSignalPeer =
      (syncScope !== undefined ||
        transportMode !== undefined ||
        remoteTransportMode !== undefined ||
        reconnectNow === true) &&
      row.token &&
      row.remoteUrl;

    // AWAIT the mirror BEFORE the connector lifecycle below fires its pull.
    // The peer's stored syncScope is the authoritative serve-filter when WE pull
    // FROM it; if we reconnect + pull before the mirror lands, the peer still
    // holds its OLD scope and serves domains we just disabled (the observed leak:
    // an all-false PATCH still pulled memories/skills/favorites because the peer's
    // reverse entry was still all-true). Blocking here orders scope-consistency
    // before the pull. Best-effort: a mirror failure must not fail the PATCH (the
    // row is saved; the peer converges on its next reconnect), so it is caught.
    if (shouldSignalPeer) {
      try {
        const selfInstanceId =
          RemoteConnectionRepository.deriveDefaultSelfInstanceId();
        const { runEndpointRemote } =
          await import("../../execute-tool/repository/run-endpoint-remote");
        const { CallbackMode } = await import("../../execute-tool/constants");
        const reverseUpdateDef =
          await import("../connect-reverse/update/definition");
        await runEndpointRemote({
          definition: reverseUpdateDef.default.PATCH,
          instanceId: targetInstanceId,
          callbackMode: CallbackMode.WAIT,
          user,
          locale,
          logger,
          platform,
          input: {
            instanceId: selfInstanceId,
            // Mirror syncScope ONLY when the PATCH actually changed it — an
            // absent scope must NOT be sent, or the peer's optional schema keeps
            // it undefined (correct) while a sent `undefined` would round-trip.
            // A transportMode-only PATCH leaves the peer's scope untouched.
            ...(syncScope !== undefined ? { syncScope } : {}),
            // Our transportMode IS the peer's "how the remote reaches me"
            // (its remoteTransportMode). And if WE set remoteTransportMode
            // directly (how the peer reaches us), that IS the peer's own
            // transportMode — mirror it so both rows stay in lockstep.
            ...(transportMode !== undefined
              ? { remoteTransportMode: transportMode }
              : {}),
            ...(remoteTransportMode !== undefined
              ? { transportMode: remoteTransportMode }
              : {}),
            ...(reconnectNow === true ? { reconnectNow: true } : {}),
          },
        });
      } catch (err) {
        logger.warn(
          "[PATCH] Failed to mirror settings to peer — picked up on reconnect",
          { instanceId: targetInstanceId, error: String(err) },
        );
      }
    }

    // Connector lifecycle: the outbound connector (the ONE socket we open to
    // the peer) carries BOTH reverse-ws legs — the peer's sends come DOWN it
    // (remoteTransportMode === "reverse-ws") and our own reverse-ws sends go
    // UP it (transportMode === "reverse-ws"; the NAT'd side can't be reached,
    // so its send leg rides the socket it holds). Keep it open when EITHER
    // post-patch leg is reverse-ws; only a fully direct-http pair closes it.
    // (cloud instances never open outbound sockets; openConnection no-ops there.)
    // The settings PATCH above is already committed — the connector lifecycle
    // below is BEST-EFFORT. A transient hiccup here (a slow transport-mode read,
    // a connector module that throws under load, a failed WS open) must NEVER
    // 500 the whole PATCH: the row is saved and the connector self-heals on its
    // next acquire/pulse. Wrapping the entire block is the root fix for the
    // intermittent "Handler timed out or threw" reconnect 500s under load.
    // Open / close / restart the outbound connector AS NEEDED — only when a
    // transport leg actually changed or the caller asked to reconnect. A
    // rename-only or scope-only PATCH leaves the socket untouched (no needless
    // reconnect). restartConnection is transport-aware: it re-runs the ONE HTTP
    // pull-on-connect for EVERY transport (so `reconnectNow` re-syncs a
    // direct-http pair too — the sync exchange rides HTTP, never a socket) and
    // opens a persistent outbound socket ONLY when a leg is genuinely reverse-ws
    // (EITHER our transportMode OR the peer's remoteTransportMode). A leg flipping
    // AWAY from reverse-ws is handled too: restartConnection's closeConnection
    // drops the old socket, then openConnection opens pull-only. Thus this single
    // call correctly OPENS (leg became reverse-ws), CLOSES (both legs now
    // direct-http → openConnection is pull-only, stale socket dropped), or
    // RESTARTS (reconnectNow / credential refresh) as the new modes require.
    const transportChanged =
      transportMode !== undefined || remoteTransportMode !== undefined;
    if (transportChanged || reconnectNow === true) {
      try {
        const { restartConnection } =
          await import("../../realtime/server/connector");
        await restartConnection(targetInstanceId);
      } catch (connectorErr) {
        logger.error("[PATCH] connector lifecycle failed (settings saved)", {
          targetInstanceId,
          error:
            connectorErr instanceof Error
              ? connectorErr.message
              : String(connectorErr),
          stack: connectorErr instanceof Error ? connectorErr.stack : undefined,
        });
      }
    }

    return success({ updated: true });
  }

  // ─── DELETE ─────────────────────────────────────────────────────────────────

  static async disconnectConnection(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    instanceId: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<RemoteConnectionByIdDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    // Fetch full record before deleting - need remoteUrl + token to notify cloud
    const [row] = await db
      .select()
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );

    if (!row) {
      return fail({
        message: t("get.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    await db
      .delete(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );

    ExecuteToolRouting.invalidateUnbottledCache();

    logger.info("Disconnected remote connection locally", {
      userId: user.id,
      instanceId,
    });

    // Hot-close both sides of the WS connection immediately:
    // - outbound connector (local → remote outbound WS, if any)
    // - inbound connector socket (remote → local inbound WS, if any)
    void import("../../realtime/server/connector")
      .then(({ closeConnection }) => closeConnection(instanceId))
      .catch((err: Error) => {
        logger.warn("[DISCONNECT] Failed to close WS connector", {
          error: err.message,
        });
      });
    void import("../../realtime/core/local-broadcast")
      .then(({ closeLocalConnectorSocket }) =>
        closeLocalConnectorSocket(instanceId),
      )
      .catch((err: Error) => {
        logger.warn("[DISCONNECT] Failed to close inbound connector socket", {
          error: err.message,
        });
      });

    // The REMOTE/<instanceId> folder and its mirrored threads stay untouched —
    // "disconnected" is the absence of the remoteConnections row, and a
    // reconnect converges on the same folder (find-or-create by name).

    // Fire-and-forget: notify remote to remove its record of us.
    // Reverse entries are system-managed — skip the back-notify to avoid a ping-pong loop.
    if (!row.isReverseEntry && row.token && row.remoteUrl) {
      const plainToken = RemoteConnectionRepository.decryptToken(row.token);
      // Bounded retries (background): a missed DELETE leaves an orphaned
      // reverse entry on the remote holding a token that no longer rotates.
      void (async (): Promise<void> => {
        const RETRY_DELAYS_MS = [0, 2000, 5000];
        for (const delayMs of RETRY_DELAYS_MS) {
          if (delayMs > 0) {
            await new Promise((resolve) => {
              setTimeout(resolve, delayMs);
            });
          }
          const { status, networkError } =
            await RemoteTransport.callEndpointDirect({
              connection: {
                remoteUrl: row.remoteUrl,
                token: plainToken,
                leadId: row.leadId ?? undefined,
              },
              definition: definitions.DELETE,
              urlPathParams: { instanceId },
              locale,
              timeoutMs: 10_000,
            });
          if (networkError) {
            logger.warn("Remote disconnect request errored — retrying", {
              instanceId,
            });
            continue;
          }
          if (status >= 200 && status < 300) {
            logger.info("Remote disconnect acknowledged", { instanceId });
            return;
          }
          // 401/404: the remote no longer accepts or knows us — its reverse
          // entry is already unusable, retrying can't improve anything.
          if (status === 401 || status === 404) {
            logger.warn(
              "Remote disconnect rejected — remote record unusable anyway",
              { instanceId, status },
            );
            return;
          }
          logger.warn("Remote disconnect notification failed — retrying", {
            instanceId,
            status,
          });
        }
        logger.error(
          "Remote disconnect failed after all retries — orphaned reverse entry remains on the remote until its token 401s",
          { instanceId },
        );
      })();
    }

    return success({ disconnected: true });
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private static async _reauth(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: ReturnType<typeof scopedTranslation.scopedT>["t"],
    row: typeof remoteConnections.$inferSelect,
    instanceId: string,
    email: string,
    password: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ updated: boolean }>> {
    const { remoteUrl } = row;

    // Step 1: Login to remote with new credentials
    let token: string;
    let newLeadId: string;
    {
      const loginEndpoints = await import("@/user/public/login/definition");
      const {
        response: loginResult,
        status: loginStatus,
        networkError: loginNetworkError,
      } = await RemoteTransport.callEndpointDirect({
        connection: { remoteUrl, token: "" },
        definition: loginEndpoints.default.POST,
        input: { email, password, rememberMe: true },
        locale,
        timeoutMs: 15_000,
      });

      if (loginNetworkError) {
        logger.error("[REAUTH] Remote login error (network)");
        return fail({
          message: t("get.errors.network.title"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      if (!loginResult.success) {
        if (loginStatus === 401) {
          return fail({
            message: t("get.errors.unauthorized.title"),
            errorType: ErrorResponseTypes.UNAUTHORIZED,
          });
        }
        if (loginStatus === 403) {
          return fail({
            message: t("get.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        return fail({
          message: t("get.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      if (!loginResult.data.token) {
        return fail({
          message: t("get.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      token = loginResult.data.token;
      // An empty leadId from login must never overwrite a stored one — every
      // later Bearer header would carry a broken `token|` auth pair.
      newLeadId = loginResult.data.leadId ?? row.leadId;
      logger.debug("[REAUTH] Logged into remote", { remoteUrl, instanceId });
    }

    // Step 2: Regenerate reverse token via self-login
    let reverseToken: string | undefined;
    let reverseLeadId: string | undefined;
    const { coreClientEnv } = await import("../../core/env-client");
    const localUrl = coreClientEnv.NEXT_PUBLIC_APP_URL;
    if (localUrl) {
      const loginEndpoints = await import("@/user/public/login/definition");
      const { response: localLoginResp, networkError: localLoginNetworkError } =
        await RemoteTransport.callEndpointDirect({
          connection: { remoteUrl: localUrl, token: "" },
          definition: loginEndpoints.default.POST,
          input: { email, password, rememberMe: true },
          locale,
          timeoutMs: 15_000,
        });
      if (localLoginResp.success) {
        if (localLoginResp.data.token) {
          reverseToken = localLoginResp.data.token;
          reverseLeadId = localLoginResp.data.leadId ?? undefined;
        }
      } else if (localLoginNetworkError) {
        logger.warn("[REAUTH] Self-login error for reverse token (non-fatal)");
      }
    }

    // Fallback: signed JWT
    if (!reverseToken) {
      const { AuthRepository } = await import("../../identity/auth/repository");
      const reverseTokenResult = await AuthRepository.signJwt(
        user,
        logger,
        locale,
      );
      if (reverseTokenResult.success) {
        reverseToken = reverseTokenResult.data;
        reverseLeadId = user.leadId;
      }
    }

    // Step 3: Push reverseToken to remote via register endpoint.
    // Bounded retries — if all fail, the remote's reverse entry keeps the
    // expired token and every cloud→local call will 401 until the next reauth.
    if (reverseToken) {
      const selfInstanceId =
        RemoteConnectionRepository.deriveDefaultSelfInstanceId();

      let pushed = false;
      const RETRY_DELAYS_MS = [0, 1000, 3000];
      for (const delayMs of RETRY_DELAYS_MS) {
        if (delayMs > 0) {
          await new Promise((resolve) => {
            setTimeout(resolve, delayMs);
          });
        }
        const registerEndpoints = await import("../connect-reverse/definition");
        const {
          response: resp,
          status: respStatus,
          networkError: respNetworkError,
        } = await RemoteTransport.callEndpointDirect({
          connection: { remoteUrl, token, leadId: newLeadId },
          definition: registerEndpoints.default.POST,
          input: {
            instanceId: selfInstanceId,
            localUrl,
            reverseToken,
            reverseLeadId: reverseLeadId ?? user.leadId,
            // connect-reverse REQUIRES syncScope — the reauth re-register must
            // carry THIS connection's current scope (from the DB row), not omit
            // it (omission 400'd every reauth push, so the remote kept the stale
            // token and cloud→local calls 401'd).
            syncScope: row.syncScope,
          },
          locale,
          timeoutMs: 15_000,
        });
        if (respNetworkError) {
          logger.warn("[REAUTH] reverseToken push failed — retrying", {
            instanceId,
          });
          continue;
        }
        if (resp.success) {
          pushed = true;
          logger.info("[REAUTH] Pushed reverseToken to remote", {
            instanceId,
          });
          break;
        }
        logger.warn("[REAUTH] reverseToken push rejected — retrying", {
          instanceId,
          status: respStatus,
        });
      }
      if (!pushed) {
        logger.error(
          "[REAUTH] reverseToken push failed after all retries — the remote's reverse entry keeps the OLD token; cloud→local calls will 401 until the next successful reauth",
          { instanceId, remoteUrl },
        );
      }
    }

    // Step 4: Update local connection with fresh token + leadId
    const encryptedToken = RemoteConnectionRepository.encryptToken(token);
    await db
      .update(remoteConnections)
      .set({
        token: encryptedToken,
        leadId: newLeadId,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );

    // Step 5: Restart the live channel so it reconnects with the NEW token —
    // otherwise the open WS keeps authenticating with the rotated-out one.
    const { restartConnection } =
      await import("../../realtime/server/connector");
    await restartConnection(instanceId);

    logger.info("[REAUTH] Token refreshed and channel restarted", {
      userId: user.id,
      instanceId,
    });
    return success({ updated: true });
  }

  private static async _rename(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    row: typeof remoteConnections.$inferSelect,
    instanceId: string,
    newInstanceId: string,
    locale: CountryLanguage,
    platform: Platform,
  ): Promise<void> {
    await db
      .update(remoteConnections)
      .set({ instanceId: newInstanceId, updatedAt: new Date() })
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );

    // Update cron tasks targeting old instanceId
    const { cronTasks } = await import("../../tasks/cron/db");
    await db
      .update(cronTasks)
      .set({ targetInstance: newInstanceId })
      .where(eq(cronTasks.targetInstance, instanceId));

    // Rename remote subfolder (non-fatal)
    void (async (): Promise<void> => {
      try {
        const { chatFolders } = await import("../../agent/chat/db");
        const { DefaultFolderId } =
          await import("next-vibe/core/execution-context");
        await db
          .update(chatFolders)
          .set({ name: newInstanceId, updatedAt: new Date() })
          .where(
            and(
              eq(chatFolders.userId, user.id),
              eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
              eq(chatFolders.name, instanceId),
              isNull(chatFolders.parentId),
            ),
          );
      } catch (folderErr) {
        logger.warn("[RENAME] Failed to rename remote subfolder (non-fatal)", {
          instanceId,
          error:
            folderErr instanceof Error ? folderErr.message : String(folderErr),
        });
      }
    })();

    // Re-home the local connector under the new instanceId — the registry is
    // keyed by instanceId and the old entry would otherwise go stale. Only when a
    // connector is ACTUALLY open (reverse-ws): closeConnection(old) +
    // restartConnection(new). A direct-http pair has no socket, so there is
    // nothing to re-home — never open a WS that wasn't already open. The peer
    // learns the new name from the self/rename propagation below, NOT a WS event.
    void (async (): Promise<void> => {
      try {
        const { getWsConnection, closeConnection, restartConnection } =
          await import("../../realtime/server/connector");
        if (getWsConnection(instanceId)) {
          closeConnection(instanceId);
          await restartConnection(newInstanceId);
        }
      } catch {
        /* non-fatal */
      }
    })();

    // Propagate to remote: update their self-identity record via the typed
    // remote-dispatch door — routed by instanceId, no hand-rolled URL/auth.
    if (row.token && row.remoteUrl) {
      void (async (): Promise<void> => {
        try {
          const { runEndpointRemote } =
            await import("../../execute-tool/repository/run-endpoint-remote");
          const selfRenameDef = await import("../self/rename/definition");
          const result = await runEndpointRemote({
            definition: selfRenameDef.default.PATCH,
            input: { newInstanceId, propagate: false },
            instanceId,
            user,
            locale,
            logger,
            platform,
          });
          if (result.success) {
            logger.info("[RENAME] Propagated self-rename to remote", {
              instanceId,
              newInstanceId,
            });
          } else {
            logger.warn("[RENAME] Failed to propagate (non-fatal)", {
              instanceId,
              error: result.message,
            });
          }
        } catch (err) {
          logger.warn("[RENAME] Failed to propagate (non-fatal)", {
            instanceId,
            error: String(err),
          });
        }
      })();
    }

    logger.debug("Renamed remote connection", {
      userId: user.id,
      instanceId,
      newInstanceId,
    });
  }
}
