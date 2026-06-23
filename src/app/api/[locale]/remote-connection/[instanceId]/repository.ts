/**
 * Remote Connection by Instance ID Repository
 * GET    - full connection detail (status + all settings)
 * PATCH  - update settings: rename, reauth, behavior flags, sync scope
 * DELETE - disconnect: delete row, close WS, archive subfolder, notify remote
 */

import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { publishWsEvent } from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import { invalidateUnbottledCache } from "@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/transport/transport";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { BEARER_LEAD_ID_SEPARATOR } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

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

    if (transportMode !== undefined) {
      const { reloadWsProviderConnector } =
        await import("@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/transport/connector");
      reloadWsProviderConnector();
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

    // Mirror syncScope to the remote side via connect-reverse/update.
    // This keeps the serve-filter consistent: both sides know which domains to
    // include when responding to sync pulls.
    //
    // Direction logic:
    //   outbound row  — local initiated, so remote holds a reverse entry for
    //                   our selfInstanceId. Call remote's connect-reverse/update
    //                   via HTTP with the remote token.
    //   reverse entry — cloud side; we ARE the remote. Publish on the local WS
    //                   hub (system/control/{userId}) so the initiator's
    //                   persistent reverse-ws picks it up immediately.
    if (syncScope !== undefined) {
      if (row.isReverseEntry) {
        publishWsEvent(
          {
            channel: `system/control/${user.id}`,
            event: "settings-update",
            data: { syncScope },
          },
          logger,
          user,
        );
      } else if (row.token && row.remoteUrl) {
        void (async (): Promise<void> => {
          try {
            const selfInstanceId =
              RemoteConnectionRepository.deriveDefaultSelfInstanceId();
            const { executeRemote } =
              await import("@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/transport/dispatch");
            const reverseUpdateDef =
              await import("@/app/api/[locale]/remote-connection/connect-reverse/update/definition");
            const plainToken = RemoteConnectionRepository.decryptToken(
              row.token,
            );
            await executeRemote({
              definition: reverseUpdateDef.default.PATCH,
              data: { instanceId: selfInstanceId, syncScope },
              token: plainToken,
              leadId: row.leadId,
              remoteUrl: row.remoteUrl,
              locale,
              logger,
            });
          } catch (err) {
            logger.warn(
              "[PATCH] Failed to mirror syncScope to remote — remote picks up on next reconnect",
              { instanceId: targetInstanceId, error: String(err) },
            );
          }
        })();
      }
    }

    // transportMode is auto-negotiated and dispatch-driven (spec.md) — no
    // user-triggered transport flips, no WS lifecycle changes from PATCH.
    // isInferenceProvider / forceSystemProvider are routing priority flags
    // read at request time; they do not touch the channel either.

    // reconnectNow: close and reopen the WS connection so pullOnConnect fires
    // naturally on the WS open event — the correct sync trigger per spec.
    if (reconnectNow === true) {
      const { restartConnection } =
        await import("@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/transport/connector");
      await restartConnection(targetInstanceId);
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
    void import("@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/transport/connector")
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
        await import("@/app/api/[locale]/user/auth/repository");
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
      await import("@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/transport/connector");
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

    // Send rename control message via WS if live (remote applies immediately),
    // then re-home the local connector under the new instanceId — the registry
    // is keyed by instanceId and the old entry would otherwise go stale
    // (acquireConnection(newId) would open a duplicate socket).
    void (async (): Promise<void> => {
      try {
        const { getWsConnection, closeConnection, restartConnection } =
          await import("@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/transport/connector");
        const conn = getWsConnection(instanceId);
        if (conn?.isConnected()) {
          conn.send(`system/control/${user.id}`, "rename", { newInstanceId });
        }
        closeConnection(instanceId);
        await restartConnection(newInstanceId);
      } catch {
        /* non-fatal */
      }
    })();

    // Propagate to remote: update their self-identity record
    if (row.token && row.remoteUrl) {
      void (async (): Promise<void> => {
        try {
          const decryptedToken = RemoteConnectionRepository.decryptToken(
            row.token as string,
          );
          const { LEAD_ID_COOKIE_NAME: COOKIE } =
            await import("@/config/constants");
          const selfRenameUrl = `${row.remoteUrl}/api/${locale}/remote-connection/self-rename`;
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decryptedToken}`,
          };
          if (row.leadId) {
            headers.Cookie = `${COOKIE}=${row.leadId}`;
          }
          await fetch(selfRenameUrl, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ newInstanceId, propagate: false }),
            signal: AbortSignal.timeout(10000),
          });
          logger.info("[RENAME] Propagated self-rename to remote", {
            remoteUrl: row.remoteUrl,
            newInstanceId,
          });
        } catch (err) {
          logger.warn("[RENAME] Failed to propagate (non-fatal)", {
            remoteUrl: row.remoteUrl,
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
