/**
 * Remote Connection by Instance ID Repository
 * GET    - full connection detail (status + all settings)
 * PATCH  - update settings: rename, reauth, behavior flags, sync scope
 * DELETE - disconnect: delete row, close WS, archive subfolder, notify remote
 */

import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import { Methods } from "next-vibe/core/definition/enums";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

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
        const { RouteExecuteRepository } =
          await import("next-vibe/execute-tool/repository");
        const { CallbackMode } =
          await import("next-vibe/execute-tool/constants");
        const reverseUpdateDef =
          await import("@/app/api/[locale]/remote-connection/connect-reverse/update/definition");
        await RouteExecuteRepository.runInProcessTyped({
          definition: reverseUpdateDef.default.PATCH,
          instanceId: targetInstanceId,
          callbackMode: CallbackMode.WAIT,
          user,
          locale,
          logger,
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
          await import("next-vibe/realtime/connector");
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
    void import("next-vibe/realtime/connector")
      .then(({ closeConnection }) => closeConnection(instanceId))
      .catch((err: Error) => {
        logger.warn("[DISCONNECT] Failed to close WS connector", {
          error: err.message,
        });
      });
    void import("@/app/api/[locale]/system/realtime/local-broadcast")
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

    // Fire-and-forget: notify remote to remove its record of us
    if (row.token && row.remoteUrl) {
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
          const res = await RemoteTransport.callRaw({
            remoteUrl: row.remoteUrl,
            apiPath: `${locale}/user/remote-connection/${instanceId}`,
            method: Methods.DELETE,
            token: plainToken,
            leadId: row.leadId ?? undefined,
            timeoutMs: 10_000,
          });
          if (res.networkError) {
            logger.warn("Remote disconnect request errored — retrying", {
              instanceId,
            });
            continue;
          }
          if (res.ok) {
            logger.info("Remote disconnect acknowledged", { instanceId });
            return;
          }
          // 401/404: the remote no longer accepts or knows us — its reverse
          // entry is already unusable, retrying can't improve anything.
          if (res.status === 401 || res.status === 404) {
            logger.warn(
              "Remote disconnect rejected — remote record unusable anyway",
              { instanceId, status: res.status },
            );
            return;
          }
          logger.warn("Remote disconnect notification failed — retrying", {
            instanceId,
            status: res.status,
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
      const loginEndpoints =
        await import("@/app/api/[locale]/user/public/login/definition");
      const loginResult = await RemoteTransport.callRaw({
        remoteUrl,
        apiPath: `${locale}/${loginEndpoints.default.POST.path.join("/")}`,
        method: Methods.POST,
        body: { email, password, rememberMe: true },
        timeoutMs: 15_000,
      });

      if (loginResult.networkError) {
        logger.error("[REAUTH] Remote login error (network)");
        return fail({
          message: t("get.errors.network.title"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      if (!loginResult.ok) {
        if (loginResult.status === 401) {
          return fail({
            message: t("get.errors.unauthorized.title"),
            errorType: ErrorResponseTypes.UNAUTHORIZED,
          });
        }
        if (loginResult.status === 403) {
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

      const loginData = loginResult.body?.["data"] as
        | { token?: string; leadId?: string }
        | undefined;

      if (!loginData?.token) {
        return fail({
          message: t("get.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      token = loginData.token;
      // An empty leadId from login must never overwrite a stored one — every
      // later Bearer header would carry a broken `token|` auth pair.
      newLeadId = loginData.leadId ?? row.leadId;
      logger.debug("[REAUTH] Logged into remote", { remoteUrl, instanceId });
    }

    // Step 2: Regenerate reverse token via self-login
    let reverseToken: string | undefined;
    let reverseLeadId: string | undefined;
    const { envClient } = await import("@/config/env-client");
    const localUrl = envClient.NEXT_PUBLIC_APP_URL;
    if (localUrl) {
      const loginEndpoints =
        await import("@/app/api/[locale]/user/public/login/definition");
      const localLoginResp = await RemoteTransport.callRaw({
        remoteUrl: localUrl,
        apiPath: `${locale}/${loginEndpoints.default.POST.path.join("/")}`,
        method: Methods.POST,
        body: { email, password, rememberMe: true },
        timeoutMs: 15_000,
      });
      if (localLoginResp.ok) {
        const localLoginData = localLoginResp.body?.["data"] as
          | { token?: string; leadId?: string }
          | undefined;
        if (localLoginData?.token) {
          reverseToken = localLoginData.token;
          reverseLeadId = localLoginData.leadId ?? undefined;
        }
      } else if (localLoginResp.networkError) {
        logger.warn("[REAUTH] Self-login error for reverse token (non-fatal)");
      }
    }

    // Fallback: signed JWT
    if (!reverseToken) {
      const { AuthRepository } =
        await import("next-vibe/identity/auth/repository");
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
      const registerEndpoints =
        await import("@/app/api/[locale]/remote-connection/connect-reverse/definition");
      const selfInstanceId =
        RemoteConnectionRepository.deriveDefaultSelfInstanceId();
      const registerApiPath = `${locale}/${registerEndpoints.default.POST.path.join("/")}`;

      let pushed = false;
      const RETRY_DELAYS_MS = [0, 1000, 3000];
      for (const delayMs of RETRY_DELAYS_MS) {
        if (delayMs > 0) {
          await new Promise((resolve) => {
            setTimeout(resolve, delayMs);
          });
        }
        const resp = await RemoteTransport.callRaw({
          remoteUrl,
          apiPath: registerApiPath,
          method: Methods.POST,
          token,
          leadId: newLeadId,
          body: {
            instanceId: selfInstanceId,
            localUrl,
            reverseToken,
            reverseLeadId: reverseLeadId ?? user.leadId,
          },
          timeoutMs: 15_000,
        });
        if (resp.networkError) {
          logger.warn("[REAUTH] reverseToken push failed — retrying", {
            instanceId,
          });
          continue;
        }
        if (resp.ok) {
          pushed = true;
          logger.info("[REAUTH] Pushed reverseToken to remote", {
            instanceId,
          });
          break;
        }
        logger.warn("[REAUTH] reverseToken push rejected — retrying", {
          instanceId,
          status: resp.status,
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
    const { restartConnection } = await import("next-vibe/realtime/connector");
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
    const { cronTasks } = await import("next-vibe/tasks/cron/db");
    await db
      .update(cronTasks)
      .set({ targetInstance: newInstanceId })
      .where(eq(cronTasks.targetInstance, instanceId));

    // Rename remote subfolder (non-fatal)
    void (async (): Promise<void> => {
      try {
        const { chatFolders } =
          await import("@/app/api/[locale]/agent/chat/db");
        const { DefaultFolderId } =
          await import("@/app/api/[locale]/agent/chat/config");
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
          await import("next-vibe/realtime/connector");
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
          const { RouteExecuteRepository } =
            await import("next-vibe/execute-tool/repository");
          const selfRenameDef =
            await import("@/app/api/[locale]/remote-connection/self/rename/definition");
          const result = await RouteExecuteRepository.runInProcessTyped({
            definition: selfRenameDef.default.PATCH,
            input: { newInstanceId, propagate: false },
            instanceId,
            user,
            locale,
            logger,
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
