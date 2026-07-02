/**
 * Remote Connection Connect Repository
 *
 * Server-side login: receives email + password, logs into the remote,
 * extracts the token, and stores only the token locally.
 *
 * Flow:
 * 1. SSRF guard on remoteUrl
 * 2. Login to remote server (email + password → token)
 * 3. Local collision check - instanceId must not already exist locally
 * 4. Register this instance on the remote (cloud-side collision check)
 * 5. Store connection locally (only if remote registration succeeded)
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
import { invalidateUnbottledCache } from "next-vibe/execute-tool/routing";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  DEFAULT_REMOTE_TOOL_IDS,
  getDefaultToolIdsForUser,
} from "@/app/api/[locale]/agent/chat/constants";
import loginEndpoints, {
  type LoginPostResponseOutput,
} from "@/app/api/[locale]/user/public/login/definition";
import { env } from "@/config/env";
import { envClient } from "@/config/env-client";

import registerEndpoints from "../connect-reverse/definition";
import { remoteConnections, SyncScopeSchema } from "../db";
import { RemoteConnectionRepository } from "../repository";
import { RemoteTransport } from "../transport";
import type {
  RemoteConnectPostRequestInput,
  RemoteConnectPostResponseOutput,
} from "./definition";
import type { RemoteConnectT } from "./i18n";

export class RemoteConnectionConnectRepository {
  /**
   * Private IP / loopback ranges that must never be used as remote URLs.
   * Prevents SSRF attacks where an authenticated user points the server at
   * internal services (AWS metadata, Kubernetes, local DB, etc.).
   */
  private static readonly PRIVATE_IP_PATTERNS = [
    /^localhost$/i,
    /^127\./,
    /^0\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^169\.254\./, // link-local / AWS metadata
    /^::1$/,
    /^\[::1\]/,
    /^fc00:/i, // IPv6 unique local
    /^fd[0-9a-f]{2}:/i,
  ];

  /**
   * Returns an error string if the URL hostname resolves to a private/loopback
   * range, null if the URL is acceptable.
   */
  private static validateRemoteUrl(rawUrl: string): string | null {
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return "Invalid URL";
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "Remote URL must use http or https";
    }
    const host = parsed.hostname;
    // Allow loopback/private addresses in development, test, or preview mode (for local-to-local testing)
    const isDev =
      envClient.NODE_ENV === "development" ||
      envClient.NODE_ENV === "test" ||
      env.NODE_ENV === "development" ||
      env.NODE_ENV === "test" ||
      env.IS_PREVIEW_MODE === true;
    if (!isDev) {
      if (
        RemoteConnectionConnectRepository.PRIVATE_IP_PATTERNS.some((re) =>
          re.test(host),
        )
      ) {
        return "Remote URL must not point to a private or loopback address";
      }
    }
    return null;
  }

  /**
   * Call the register endpoint on the remote to store this local instance there.
   * Returns true if registration succeeded, false if instanceId already exists (CONFLICT).
   */
  private static async registerOnRemote(params: {
    remoteUrl: string;
    token: string;
    leadId: string;
    instanceId: string;
    locale: CountryLanguage;
    reverseToken?: string;
    reverseLeadId?: string;
    logger: EndpointLogger;
  }): Promise<{
    ok: boolean;
    conflict: boolean;
    forbidden?: boolean;
    remoteInstanceId: string | null;
  }> {
    const {
      remoteUrl,
      token,
      leadId,
      instanceId,
      selfUserId,
      locale,
      reverseToken,
      reverseLeadId,
      logger,
    } = params;
    const localUrl = envClient.NEXT_PUBLIC_APP_URL ?? "";
    const registerUrl = `${remoteUrl}/api/${locale}/${registerEndpoints.POST.path.join("/")}`;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}${BEARER_LEAD_ID_SEPARATOR}${leadId}`,
      };

      const response = await fetch(registerUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          instanceId,
          localUrl,
          selfUserId,
          ...(reverseToken ? { reverseToken } : {}),
          ...(reverseLeadId ? { reverseLeadId } : {}),
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (response.status === 409) {
        logger.warn("[CONNECT] Instance ID already registered on remote", {
          instanceId,
        });
        return {
          ok: false,
          conflict: true,
          remoteInstanceId: null,
        };
      }

      if (response.status === 403) {
        logger.warn(
          "[CONNECT] Remote rejected registration (not a cloud instance or missing permissions)",
          {
            instanceId,
          },
        );
        return {
          ok: false,
          conflict: false,
          forbidden: true,
          remoteInstanceId: null,
        };
      }

      if (!response.ok) {
        logger.warn("[CONNECT] Remote registration failed", {
          status: response.status,
          instanceId,
        });
        return {
          ok: false,
          conflict: false,
          remoteInstanceId: null,
        };
      }

      const body = (await response.json()) as {
        data?: { remoteInstanceId?: string };
      };
      return {
        ok: true,
        conflict: false,
        remoteInstanceId: body.data?.remoteInstanceId ?? null,
      };
    } catch (error) {
      logger.error(`[CONNECT] Remote registration error: ${String(error)}`);
      return {
        ok: false,
        conflict: false,
        forbidden: false,
        remoteInstanceId: null,
      };
    }
  }

  /**
   * Connect to a remote instance.
   * Server-side login: receives email + password, logs into the remote,
   * extracts the token, and stores only the token locally.
   *
   * Steps:
   * 1. SSRF guard on remoteUrl
   * 2. Login to remote server (email + password → token)
   * 3. Local collision check
   * 4. Register this instance on the remote (cloud-side collision check)
   * 5. Store connection locally
   * 6. Write default remote tools to user's availableTools setting
   */
  static async connectRemote(
    data: RemoteConnectPostRequestInput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: RemoteConnectT,
    locale: CountryLanguage,
  ): Promise<ResponseType<RemoteConnectPostResponseOutput>> {
    const { email, password } = data;
    const remoteUrl = data.remoteUrl ?? "";

    // ── Step 1: SSRF guard - reject private/loopback URLs ──────────────────────
    const urlError =
      RemoteConnectionConnectRepository.validateRemoteUrl(remoteUrl);
    if (urlError) {
      logger.warn("[CONNECT] Rejected remote URL", {
        remoteUrl,
        reason: urlError,
      });
      return fail({
        message: t("post.errors.invalidUrl.title"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // ── Step 2: Login to remote server ─────────────────────────────────────────
    // Ping the login API endpoint first (HEAD request) to get the lead_id cookie
    // set by middleware, then send it with the actual login request.
    let remotePingLeadId: string | undefined;
    const loginUrl = `${remoteUrl}/api/${locale}/${loginEndpoints.POST.path.join("/")}`;
    try {
      const pingResponse = await fetch(`${remoteUrl}/${locale}`, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(30000),
      });
      const setCookie = pingResponse.headers.get("set-cookie") ?? "";
      const match = setCookie.match(
        new RegExp(`${LEAD_ID_COOKIE_NAME}=([^;]+)`),
      );
      if (match?.[1]) {
        remotePingLeadId = match[1];
        logger.debug("[CONNECT] Got remote leadId from ping", {
          leadId: remotePingLeadId,
        });
      }
    } catch (pingErr) {
      logger.error("[CONNECT] Remote ping failed", { error: String(pingErr) });
      return fail({
        message: t("post.errors.network.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    let token: string;
    let effectiveLeadId: string;
    try {
      const loginHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (remotePingLeadId) {
        loginHeaders.Cookie = `${LEAD_ID_COOKIE_NAME}=${remotePingLeadId}`;
      }
      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify({ email, password, rememberMe: true }),
        signal: AbortSignal.timeout(30000),
      });

      if (!loginResponse.ok) {
        if (loginResponse.status === 401) {
          return fail({
            message: t("post.errors.unauthorized.title"),
            errorType: ErrorResponseTypes.UNAUTHORIZED,
          });
        }
        if (loginResponse.status === 403) {
          return fail({
            message: t("post.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        if (loginResponse.status === 404) {
          return fail({
            message: t("post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const loginBody = (await loginResponse.json()) as {
        success?: boolean;
        data?: LoginPostResponseOutput;
      };

      if (!loginBody.data?.token) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      token = loginBody.data.token;
      effectiveLeadId = loginBody.data.leadId ?? "";
      logger.debug("[CONNECT] Successfully logged into remote", { remoteUrl });
    } catch (err) {
      logger.error("[CONNECT] Remote login error", { error: String(err) });
      return fail({
        message: t("post.errors.network.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // ── Step 3: Local collision check ──────────────────────────────────────────

    const selfInstanceId = await RemoteConnectionRepository.getLocalInstanceId(
      user.id,
    );

    // ── Step 3b: Obtain reverse session token for bidirectional auth ─────────
    // The remote needs a REAL session token (not a self-signed JWT) to call our
    // endpoints. We log into ourselves so the remote gets a session-backed token
    // that passes validateWebSession on our server. Same flow as how we logged
    // into the remote in step 2.
    let reverseToken: string | undefined;
    let reverseLeadId: string | undefined;
    const localUrl = envClient.NEXT_PUBLIC_APP_URL ?? "";
    if (localUrl) {
      try {
        // Ping ourselves to get a fresh leadId cookie.
        let localPingLeadId: string | undefined;
        try {
          const localPingResp = await fetch(`${localUrl}/${locale}`, {
            method: "GET",
            redirect: "follow",
            signal: AbortSignal.timeout(30000),
          });
          const setCookieLocal = localPingResp.headers.get("set-cookie") ?? "";
          const localMatch = setCookieLocal.match(
            new RegExp(`${LEAD_ID_COOKIE_NAME}=([^;]+)`),
          );
          if (localMatch?.[1]) {
            localPingLeadId = localMatch[1];
          }
        } catch {
          // Non-fatal - continue without ping leadId
        }

        // Login to ourselves to get a session-backed token.
        const localLoginUrl = `${localUrl}/api/${locale}/${loginEndpoints.POST.path.join("/")}`;
        const localLoginHeaders: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (localPingLeadId) {
          localLoginHeaders.Cookie = `${LEAD_ID_COOKIE_NAME}=${localPingLeadId}`;
        }
        const localLoginResp = await fetch(localLoginUrl, {
          method: "POST",
          headers: localLoginHeaders,
          body: JSON.stringify({
            email,
            password,
            rememberMe: true,
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (localLoginResp.ok) {
          const localLoginBody = (await localLoginResp.json()) as {
            success?: boolean;
            data?: LoginPostResponseOutput;
          };
          if (localLoginBody.data?.token) {
            reverseToken = localLoginBody.data.token;
            reverseLeadId = localLoginBody.data.leadId ?? undefined;
            logger.debug(
              "[CONNECT] Obtained reverse session token via self-login",
            );
          }
        } else {
          logger.warn("[CONNECT] Self-login for reverse token failed", {
            status: localLoginResp.status,
          });
        }
      } catch (reverseErr) {
        logger.warn(
          "[CONNECT] Self-login error for reverse token (non-fatal)",
          {
            error: String(reverseErr),
          },
        );
      }
    }

    if (!reverseToken) {
      // Fallback: use a self-signed JWT - only works if remote skips session validation.
      logger.warn(
        "[CONNECT] No reverse session token - falling back to signed JWT (reverse calls may fail auth)",
      );
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

    // ── Step 4: Register this instance on the remote ───────────────────────────
    // Send our self-identity so the remote knows us by our actual instanceId.
    // `instanceId` is the name WE give the remote in OUR DB (derived from its URL);
    // the remote should see us as `selfInstanceId`.
    const registerResult =
      await RemoteConnectionConnectRepository.registerOnRemote({
        remoteUrl,
        token,
        leadId: effectiveLeadId,
        instanceId: selfInstanceId,
        locale,
        reverseToken,
        reverseLeadId,
        logger,
      });

    if (!registerResult.ok) {
      return fail({
        message: registerResult.conflict
          ? t("post.errors.conflict.title")
          : registerResult.forbidden
            ? t("post.errors.forbidden.title")
            : t("post.errors.server.title"),
        errorType: registerResult.conflict
          ? ErrorResponseTypes.CONFLICT
          : registerResult.forbidden
            ? ErrorResponseTypes.FORBIDDEN
            : ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // instanceId = what the remote calls itself (its self-identity)
    const instanceId = registerResult.remoteInstanceId ?? selfInstanceId;

    // ── Step 4b: Local collision check - reject if this instanceId already exists ──
    const [localExisting] = await db
      .select({ id: remoteConnections.id })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      )
      .limit(1);

    if (localExisting) {
      logger.warn("[CONNECT] Instance ID already exists locally", {
        userId: user.id,
        instanceId,
      });
      return fail({
        message: t("post.errors.conflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    // ── Step 5: Store locally ───────────────────────────────────────────────────
    const storeResult = await RemoteConnectionRepository.upsertRemoteConnection(
      {
        userId: user.id,
        remoteUrl,
        token,
        leadId: effectiveLeadId,
        instanceId,
        remoteInstanceId: selfInstanceId,
        isInferenceProvider: data.isInferenceProvider,
        syncScope: data.syncScope
          ? SyncScopeSchema.parse(data.syncScope)
          : undefined,
        logger,
      },
    );

    if (!storeResult.success) {
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (data.isInferenceProvider) {
      invalidateUnbottledCache();
    }

    // ── Step 5b: Upsert local self-identity record ─────────────────────────────
    // This lets getLocalInstanceId() return our own instanceId even when no remote
    // has registered here yet (e.g. outbound-only setups).
    // Reuses selfInstanceId from step 3a (deriveDefaultSelfInstanceId).
    await RemoteConnectionRepository.upsertInstanceIdentity({
      userId: user.id,
      instanceId: selfInstanceId,
      isDefault: true,
    });

    // ── Step 6: Add default remote tools to user's favorites ─────────────────
    // Tool config (availableTools/pinnedTools) lives in favorites, not settings.
    // Merge remote tools into every existing favorite's availableTools.
    try {
      const { chatFavorites } =
        await import("@/app/api/[locale]/agent/skills/favorites/db");

      const remoteTools = DEFAULT_REMOTE_TOOL_IDS.map((id) => ({
        toolId: `${instanceId}__${id}`,
        requiresConfirmation: false,
      }));

      const userFavorites = await db
        .select({
          id: chatFavorites.id,
          availableTools: chatFavorites.availableTools,
        })
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, user.id));

      let updatedCount = 0;
      for (const fav of userFavorites) {
        const existing =
          fav.availableTools ??
          getDefaultToolIdsForUser(user).map((id) => ({
            toolId: id,
            requiresConfirmation: false,
          }));
        const existingIds = new Set(existing.map((tc) => tc.toolId));
        const newTools = remoteTools.filter(
          (tc) => !existingIds.has(tc.toolId),
        );
        if (newTools.length > 0) {
          await db
            .update(chatFavorites)
            .set({
              availableTools: [...existing, ...newTools],
              updatedAt: new Date(),
            })
            .where(eq(chatFavorites.id, fav.id));
          updatedCount++;
        }
      }
      if (updatedCount > 0) {
        logger.info(
          `[CONNECT] Added remote tools to ${updatedCount.toString()} favorite(s)`,
          { instanceId },
        );
      }
    } catch (toolWriteError) {
      // Non-fatal - connection is established, tools can be added manually
      logger.warn("[CONNECT] Failed to write remote tools to favorites", {
        error: String(toolWriteError),
      });
    }

    logger.debug(`[CONNECT] Successfully connected to ${remoteUrl}`, {
      userId: user.id,
      instanceId,
    });

    // ── Step 6b: Create remote subfolder + set routing rule ───────────────────
    // Awaited: the subfolder must exist before the function returns so that the
    // first stream can match the routing rule immediately after connect().
    try {
      const { chatFolders } = await import("@/app/api/[locale]/agent/chat/db");
      const { DefaultFolderId } =
        await import("@/app/api/[locale]/agent/chat/config");
      const [existing] = await db
        .select({ id: chatFolders.id })
        .from(chatFolders)
        .where(
          and(
            eq(chatFolders.userId, user.id),
            eq(chatFolders.rootFolderId, DefaultFolderId.REMOTE),
            eq(chatFolders.name, instanceId),
            isNull(chatFolders.parentId),
          ),
        )
        .limit(1);
      let folderId: string;
      if (existing) {
        folderId = existing.id;
      } else {
        const [inserted] = await db
          .insert(chatFolders)
          .values({
            userId: user.id,
            rootFolderId: DefaultFolderId.REMOTE,
            name: instanceId,
            parentId: null,
          })
          .returning({ id: chatFolders.id });
        folderId = inserted!.id;
      }
      // No routing rule needed: REMOTE-root threads route natively to the
      // connection whose instance folder is an ancestor (resolveTarget).
      logger.debug("[CONNECT] Created remote subfolder", {
        instanceId,
        folderId,
      });
    } catch (folderErr) {
      logger.warn("[CONNECT] Failed to create remote subfolder (non-fatal)", {
        instanceId,
        error:
          folderErr instanceof Error ? folderErr.message : String(folderErr),
      });
    }

    // ── Step 6c: Hot-open WS connection immediately (no restart needed) ───────
    // Read back the stored row to get the DB id, then open the WS socket.
    // Fire-and-forget — connection setup is non-blocking.
    void (async (): Promise<void> => {
      try {
        const [stored] = await db
          .select({
            id: remoteConnections.id,
            userId: remoteConnections.userId,
            capabilitiesVersion: remoteConnections.capabilitiesVersion,
            sentCapabilitiesVersion: remoteConnections.sentCapabilitiesVersion,
            syncScope: remoteConnections.syncScope,
            syncCursors: remoteConnections.syncCursors,
            pushCursors: remoteConnections.pushCursors,
            transportMode: remoteConnections.transportMode,
          })
          .from(remoteConnections)
          .where(
            and(
              eq(remoteConnections.userId, user.id),
              eq(remoteConnections.instanceId, instanceId),
            ),
          )
          .limit(1);
        // Open the persistent WS when the stored row is already negotiated to
        // reverse-ws (e.g. reconnect after the ping recorded the transport).
        // Fresh connects wait for the ping to determine reachability;
        // direct-http connections POST directly to the remote stream endpoint.
        if (stored && stored.transportMode === "reverse-ws") {
          const { openConnection } =
            await import("next-vibe/realtime/connector");
          openConnection({
            id: stored.id,
            instanceId,
            remoteUrl,
            token,
            leadId: effectiveLeadId,
            userId: stored.userId,
            capabilitiesVersion: stored.capabilitiesVersion ?? null,
            sentCapabilitiesVersion: stored.sentCapabilitiesVersion ?? null,
            syncScope: stored.syncScope ?? null,
            syncCursors: stored.syncCursors ?? null,
            pushCursors: stored.pushCursors ?? null,
          });
        }
      } catch (err) {
        logger.warn("[CONNECT] Failed to open WS connection after connect", {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })();

    return success({
      remoteUrlResult: remoteUrl,
      instanceId,
      isConnected: true,
    });
  }
}
