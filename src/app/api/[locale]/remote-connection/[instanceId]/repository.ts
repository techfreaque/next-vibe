/**
 * Remote Connection by Instance ID Repository
 * GET    - full connection detail (status + all settings)
 * PATCH  - update settings: rename, reauth, behavior flags, sync scope
 * DELETE - disconnect: delete row, close WS, archive subfolder, notify remote
 */

import "server-only";

import { and, eq, isNull } from "drizzle-orm";
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

import { invalidateUnbottledCache } from "@/app/api/[locale]/remote-connection/transport";
import { BEARER_LEAD_ID_SEPARATOR } from "@/config/constants";

import { remoteConnections } from "../db";
import { RemoteConnectionRepository } from "../repository";
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
        remoteInstanceId: null,
        capabilitiesVersion: null,
        transportMode: null,
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
      remoteInstanceId: row.remoteInstanceId ?? null,
      capabilitiesVersion: row.capabilitiesVersion ?? null,
      transportMode: row.transportMode ?? null,
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
    } = data;

    const isAdmin = user.roles?.includes(UserPermissionRole.ADMIN) === true;

    // These fields are admin-only — customers can only rename and disconnect.
    const adminOnlyFields = [
      forceSystemProvider,
      isInferenceProvider,
      transportMode,
    ];
    if (!isAdmin && adminOnlyFields.some((f) => f !== undefined)) {
      return fail({
        message: t("get.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // If enabling forceSystemProvider: clear it on all other connections first
    if (forceSystemProvider === true) {
      await db
        .update(remoteConnections)
        .set({ forceSystemProvider: false, updatedAt: new Date() })
        .where(eq(remoteConnections.userId, user.id));
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
      invalidateUnbottledCache();
    }

    logger.info("Updated remote connection settings", {
      userId: user.id,
      instanceId,
      newInstanceId,
      isInferenceProvider,
      forceSystemProvider,
      syncScope,
      transportMode,
    });

    // Mirror changed settings to the peer's reverse entry via the peer's real
    // connect-reverse/update endpoint, over the single canonical remote-call
    // (runInProcessTyped resolves the leg + auth). No magic WS control events —
    // "do X on the peer" is always a definition-driven endpoint call.
    //   • syncScope          — keeps the sync serve-filter consistent both sides.
    //   • remoteTransportMode — our transportMode IS the peer's "how the remote
    //     reaches me"; the peer stores it and (re)opens/closes its connector.
    if (
      (syncScope !== undefined || transportMode !== undefined) &&
      row.token &&
      row.remoteUrl
    ) {
      void (async (): Promise<void> => {
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
              ...(syncScope !== undefined ? { syncScope } : {}),
              ...(transportMode !== undefined
                ? { remoteTransportMode: transportMode }
                : {}),
            },
          });
        } catch (err) {
          logger.warn(
            "[PATCH] Failed to mirror settings to peer — picked up on reconnect",
            { instanceId: targetInstanceId, error: String(err) },
          );
        }
      })();
    }

    // Connector lifecycle: a side runs an outbound connector (subscribing to the
    // peer's remote-event hub) exactly when the PEER reaches it via reverse-ws —
    // i.e. remoteTransportMode === "reverse-ws". Our own transportMode is our
    // SEND leg and never opens a socket. Recompute from the post-patch row.
    // (cloud instances never open outbound sockets; openConnection no-ops there.)
    const effectiveRemoteMode =
      (await RemoteConnectionRepository.getRemoteTransportMode(
        user.id,
        targetInstanceId,
      )) ?? row.remoteTransportMode;
    if (reconnectNow === true) {
      const { restartConnection } =
        await import("next-vibe/realtime/connector");
      await restartConnection(targetInstanceId);
    } else if (effectiveRemoteMode === "reverse-ws") {
      const { restartConnection } =
        await import("next-vibe/realtime/connector");
      await restartConnection(targetInstanceId);
    } else {
      const { closeConnection } =
        await import("@/app/api/[locale]/system/unified-interface/websocket/connector");
      closeConnection(targetInstanceId);
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

    invalidateUnbottledCache();

    logger.info("Disconnected remote connection locally", {
      userId: user.id,
      instanceId,
    });

    // Hot-close the WS connection immediately
    void import("@/app/api/[locale]/system/unified-interface/websocket/connector")
      .then(({ closeConnection }) => closeConnection(instanceId))
      .catch((err: Error) => {
        logger.warn("[DISCONNECT] Failed to close WS connector", {
          error: err.message,
        });
      });

    // Soft-archive the remote subfolder: rename to "${instanceId} (disconnected)"
    void (async (): Promise<void> => {
      try {
        const { chatFolders } =
          await import("@/app/api/[locale]/agent/chat/db");
        const { DefaultFolderId } =
          await import("@/app/api/[locale]/agent/chat/config");
        await db
          .update(chatFolders)
          .set({
            name: `${instanceId} (disconnected)`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(chatFolders.userId, user.id),
              eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
              eq(chatFolders.name, instanceId),
              isNull(chatFolders.parentId),
            ),
          );
      } catch (folderErr) {
        logger.warn("[DISCONNECT] Failed to archive remote subfolder", {
          instanceId,
          error:
            folderErr instanceof Error ? folderErr.message : String(folderErr),
        });
      }
    })();

    // Fire-and-forget: notify remote to remove its record of us
    if (row.token && row.remoteUrl) {
      const plainToken = RemoteConnectionRepository.decryptToken(row.token);
      const selfId = row.remoteInstanceId;
      if (!selfId) {
        logger.warn(
          "No remoteInstanceId — skipping remote disconnect notification",
          { instanceId },
        );
        return success({ disconnected: true });
      }
      const remoteDeleteUrl = `${row.remoteUrl}/api/${locale}/user/remote-connection/${selfId}`;
      const bearerWithLead = row.leadId
        ? `${plainToken}${BEARER_LEAD_ID_SEPARATOR}${row.leadId}`
        : plainToken;
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
          try {
            const res = await fetch(remoteDeleteUrl, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${bearerWithLead}` },
              signal: AbortSignal.timeout(10000),
            });
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
          } catch (err) {
            logger.warn("Remote disconnect request errored — retrying", {
              instanceId,
              error: String(err),
            });
          }
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
    try {
      const loginEndpoints =
        await import("@/app/api/[locale]/user/public/login/definition");
      const loginUrl = `${remoteUrl}/api/${locale}/${loginEndpoints.default.POST.path.join("/")}`;
      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe: true }),
        signal: AbortSignal.timeout(15000),
      });

      if (!loginResponse.ok) {
        if (loginResponse.status === 401) {
          return fail({
            message: t("get.errors.unauthorized.title"),
            errorType: ErrorResponseTypes.UNAUTHORIZED,
          });
        }
        if (loginResponse.status === 403) {
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

      const loginBody = (await loginResponse.json()) as {
        success?: boolean;
        data?: { token?: string; leadId?: string };
      };

      if (!loginBody.data?.token) {
        return fail({
          message: t("get.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      token = loginBody.data.token;
      // An empty leadId from login must never overwrite a stored one — every
      // later Bearer header would carry a broken `token|` auth pair.
      newLeadId = loginBody.data.leadId ?? row.leadId;
      logger.debug("[REAUTH] Logged into remote", { remoteUrl, instanceId });
    } catch (err) {
      logger.error("[REAUTH] Remote login error", { error: String(err) });
      return fail({
        message: t("get.errors.network.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Step 2: Regenerate reverse token via self-login
    let reverseToken: string | undefined;
    let reverseLeadId: string | undefined;
    const { envClient } = await import("@/config/env-client");
    const localUrl = envClient.NEXT_PUBLIC_APP_URL;
    if (localUrl) {
      try {
        const { LEAD_ID_COOKIE_NAME } = await import("@/config/constants");
        const loginEndpoints =
          await import("@/app/api/[locale]/user/public/login/definition");
        const localLoginUrl = `${localUrl}/api/${locale}/${loginEndpoints.default.POST.path.join("/")}`;
        const localLoginResp = await fetch(localLoginUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, rememberMe: true }),
          signal: AbortSignal.timeout(15000),
        });
        if (localLoginResp.ok) {
          const localLoginBody = (await localLoginResp.json()) as {
            success?: boolean;
            data?: { token?: string; leadId?: string };
          };
          if (localLoginBody.data?.token) {
            reverseToken = localLoginBody.data.token;
            reverseLeadId = localLoginBody.data.leadId ?? undefined;
          }
        }
        void LEAD_ID_COOKIE_NAME; // keep import used
      } catch (reverseErr) {
        logger.warn("[REAUTH] Self-login error for reverse token (non-fatal)", {
          error: String(reverseErr),
        });
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
      const { BEARER_LEAD_ID_SEPARATOR: sep } =
        await import("@/config/constants");
      const selfInstanceId =
        RemoteConnectionRepository.deriveDefaultSelfInstanceId();
      const registerUrl = `${remoteUrl}/api/${locale}/${registerEndpoints.default.POST.path.join("/")}`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}${sep}${newLeadId}`,
      };

      let pushed = false;
      const RETRY_DELAYS_MS = [0, 1000, 3000];
      for (const delayMs of RETRY_DELAYS_MS) {
        if (delayMs > 0) {
          await new Promise((resolve) => {
            setTimeout(resolve, delayMs);
          });
        }
        try {
          const resp = await fetch(registerUrl, {
            method: "POST",
            headers,
            body: JSON.stringify({
              instanceId: selfInstanceId,
              localUrl,
              reverseToken,
              reverseLeadId: reverseLeadId ?? user.leadId,
            }),
            signal: AbortSignal.timeout(15000),
          });
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
        } catch (err) {
          logger.warn("[REAUTH] reverseToken push failed — retrying", {
            instanceId,
            error: String(err),
          });
        }
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
      await import("@/app/api/[locale]/system/unified-interface/websocket/connector");
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
    const { cronTasks } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
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
    // keyed by instanceId and the old entry would otherwise go stale
    // (acquireConnection(newId) would open a duplicate socket). The peer learns
    // the new name from the self/rename propagation below, NOT a WS control event.
    void (async (): Promise<void> => {
      try {
        const { closeConnection, restartConnection } =
          await import("next-vibe/realtime/connector");
        closeConnection(instanceId);
        await restartConnection(newInstanceId);
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
