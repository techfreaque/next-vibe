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

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import loginEndpoints, {
  type LoginPostResponseOutput,
} from "@/app/api/[locale]/user/public/login/definition";
import { env } from "@/config/env";
import { envClient } from "@/config/env-client";

import registerEndpoints from "../connect-reverse/definition";
import {
  remoteConnections,
  type SyncScope,
  SyncScopeSchema,
  type TransportMode,
} from "../db";
import { RemoteConnectionRepository } from "../repository";
import { ExecuteToolRouting } from "../routing";
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
    selfUserId: string;
    locale: CountryLanguage;
    reverseToken?: string;
    reverseLeadId?: string;
    /** The initiator's sync scope — mirrored onto the peer's reverse entry. */
    syncScope: SyncScope;
    /**
     * The initiator's OWN transport leg toward the peer (how WE reach them).
     * The peer stores it as its reverse entry's remoteTransportMode (how the
     * initiator reaches it) so it knows whether to open an outbound connector.
     */
    remoteTransportMode: TransportMode;
    logger: EndpointLogger;
  }): Promise<{
    ok: boolean;
    conflict: boolean;
    forbidden?: boolean;
    remoteInstanceId: string | null;
    remoteUserId: string | null;
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
      syncScope,
      remoteTransportMode,
      logger,
    } = params;
    const localUrl = envClient.NEXT_PUBLIC_APP_URL ?? "";

    // Register runs during connection bootstrap — no remoteConnections row exists
    // yet, so this cannot use runInProcessTyped({ instanceId }). callEndpointDirect
    // is the typed bootstrap primitive for exactly this case.
    const {
      response: result,
      status: resultStatus,
      networkError: resultNetworkError,
    } = await RemoteTransport.callEndpointDirect({
      connection: { remoteUrl, token, leadId },
      definition: registerEndpoints.POST,
      input: {
        instanceId,
        localUrl,
        selfUserId,
        syncScope,
        remoteTransportMode,
        ...(reverseToken ? { reverseToken } : {}),
        ...(reverseLeadId ? { reverseLeadId } : {}),
      },
      locale,
    });

    if (resultNetworkError) {
      logger.error("[CONNECT] Remote registration error (network)");
      return {
        ok: false,
        conflict: false,
        forbidden: false,
        remoteInstanceId: null,
        remoteUserId: null,
      };
    }

    if (resultStatus === 409) {
      logger.warn("[CONNECT] Instance ID already registered on remote", {
        instanceId,
      });
      return {
        ok: false,
        conflict: true,
        remoteInstanceId: null,
        remoteUserId: null,
      };
    }

    if (resultStatus === 403) {
      logger.warn(
        "[CONNECT] Remote rejected registration (not a cloud instance or missing permissions)",
        { instanceId },
      );
      return {
        ok: false,
        conflict: false,
        forbidden: true,
        remoteInstanceId: null,
        remoteUserId: null,
      };
    }

    if (!result.success) {
      logger.warn("[CONNECT] Remote registration failed", {
        status: resultStatus,
        instanceId,
      });
      return {
        ok: false,
        conflict: false,
        remoteInstanceId: null,
        remoteUserId: null,
      };
    }

    return {
      ok: true,
      conflict: false,
      remoteInstanceId: result.data.remoteInstanceId ?? null,
      remoteUserId: result.data.remoteUserId ?? null,
    };
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
    const remotePingLeadId = await RemoteTransport.fetchLeadId(remoteUrl);
    if (remotePingLeadId) {
      logger.debug("[CONNECT] Got remote leadId from ping", {
        leadId: remotePingLeadId,
      });
    }

    let token: string;
    let effectiveLeadId: string;
    const {
      response: loginResult,
      status: loginStatus,
      networkError: loginNetworkError,
    } = await RemoteTransport.callEndpointDirect({
      connection: { remoteUrl, token: "", leadId: remotePingLeadId },
      definition: loginEndpoints.POST,
      input: { email, password, rememberMe: true },
      locale,
    });

    if (loginNetworkError) {
      logger.error("[CONNECT] Remote login error (network)");
      return fail({
        message: t("post.errors.network.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    if (!loginResult.success) {
      if (loginStatus === 401) {
        return fail({
          message: t("post.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      if (loginStatus === 403) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      if (loginStatus === 404) {
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

    const loginData: LoginPostResponseOutput = loginResult.data;
    if (!loginData.token) {
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    token = loginData.token;
    effectiveLeadId = loginData.leadId ?? "";
    logger.debug("[CONNECT] Successfully logged into remote", { remoteUrl });

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
        const localPingLeadId = await RemoteTransport.fetchLeadId(localUrl);

        // Login to ourselves to get a session-backed token.
        const { response: localLoginResp, status: localLoginStatus } =
          await RemoteTransport.callEndpointDirect({
            connection: {
              remoteUrl: localUrl,
              token: "",
              leadId: localPingLeadId,
            },
            definition: loginEndpoints.POST,
            input: { email, password, rememberMe: true },
            locale,
            timeoutMs: 15_000,
          });
        if (localLoginResp.success) {
          if (localLoginResp.data.token) {
            reverseToken = localLoginResp.data.token;
            reverseLeadId = localLoginResp.data.leadId ?? undefined;
            logger.debug(
              "[CONNECT] Obtained reverse session token via self-login",
            );
          }
        } else {
          logger.warn("[CONNECT] Self-login for reverse token failed", {
            status: localLoginStatus,
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
        selfUserId: user.id,
        locale,
        reverseToken,
        reverseLeadId,
        // Mirror OUR chosen scope onto the peer's reverse entry (concrete).
        syncScope: SyncScopeSchema.parse(data.syncScope),
        // Our send leg toward the peer at connect time. Same-machine detection
        // runs async AFTER this and may PATCH us to direct-http; a reverse-ws
        // flip is then mirrored to the peer via connect-reverse/update. The DB
        // default is direct-http (the socket-free leg), so that is our starting
        // transport here — the peer records it as its remoteTransportMode.
        remoteTransportMode: "direct-http",
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
    // Only one inference provider allowed instance-wide — clear any existing one first
    if (data.isInferenceProvider) {
      await db
        .update(remoteConnections)
        .set({ isInferenceProvider: false, updatedAt: new Date() })
        .where(eq(remoteConnections.isInferenceProvider, true));
    }
    const storeResult = await RemoteConnectionRepository.upsertRemoteConnection(
      {
        userId: user.id,
        remoteUrl,
        token,
        leadId: effectiveLeadId,
        instanceId,
        remoteUserId: registerResult.remoteUserId ?? undefined,
        isInferenceProvider: data.isInferenceProvider,
        // Normalize through the schema so field defaults are concrete on the row.
        syncScope: SyncScopeSchema.parse(data.syncScope),
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
      ExecuteToolRouting.invalidateUnbottledCache();
    }

    // ── Step 5b: Upsert local self-identity record ─────────────────────────────
    // This lets getLocalInstanceId() return our own instanceId even when no remote
    // has registered here yet (e.g. outbound-only setups).
    // Reuses selfInstanceId from step 3a (deriveDefaultSelfInstanceId).
    await RemoteConnectionRepository.upsertInstanceIdentity({
      userId: user.id,
      instanceId: selfInstanceId,
    });

    // NOTE: remote tools are NEVER pinned into favorites. Remote calls go
    // through `execute-tool({ toolName, instanceId })` — there is no
    // per-favorite `<instance>__<tool>` entry to manage. (The old Step 6 here
    // materialized `getDefaultToolIdsForUser` into every favorite with a null
    // whitelist, silently freezing "all tools allowed" into a snapshot and
    // 403-blocking everything outside it.)

    logger.debug(`[CONNECT] Successfully connected to ${remoteUrl}`, {
      userId: user.id,
      instanceId,
    });

    // ── Step 6b: Create remote subfolder + set routing rule ───────────────────
    // Awaited: the subfolder must exist before the function returns so that the
    // first stream can match the routing rule immediately after connect().
    try {
      const { ensureInstanceFolder } = await import("../instance-folder");
      const folderId = await ensureInstanceFolder(user.id, instanceId);
      // No routing rule needed: REMOTE-root threads route natively to the
      // connection whose instance folder is an ancestor (resolveTarget).
      logger.debug("[CONNECT] Ensured remote subfolder", {
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

    // ── Step 6c: Fire the ONE pull-on-connect (and open a socket iff needed) ──
    // ALWAYS call openConnection: it runs the single HTTP pull-on-connect for
    // EVERY transport (direct-http included — the sync exchange rides HTTP, not a
    // socket) and opens a persistent outbound socket ONLY when a leg is genuinely
    // reverse-ws. Because `transportMode`/`remoteTransportMode` both default to
    // "direct-http", a fresh connect (before detection PATCHes reverse-ws) opens
    // NO socket — no premature "closed before established" noise — yet still
    // performs its connect sync. Fire-and-forget — connection setup is non-blocking.
    void (async (): Promise<void> => {
      try {
        const [stored] = await db
          .select({
            id: remoteConnections.id,
            userId: remoteConnections.userId,
            remoteUserId: remoteConnections.remoteUserId,
            capabilitiesVersion: remoteConnections.capabilitiesVersion,
            sentCapabilitiesVersion: remoteConnections.sentCapabilitiesVersion,
            syncScope: remoteConnections.syncScope,
            syncCursors: remoteConnections.syncCursors,
            pushCursors: remoteConnections.pushCursors,
            transportMode: remoteConnections.transportMode,
            remoteTransportMode: remoteConnections.remoteTransportMode,
          })
          .from(remoteConnections)
          .where(
            and(
              eq(remoteConnections.userId, user.id),
              eq(remoteConnections.instanceId, instanceId),
            ),
          )
          .limit(1);
        if (stored) {
          const { openConnection } =
            await import("next-vibe/realtime/connector");
          openConnection({
            id: stored.id,
            instanceId,
            remoteUrl,
            token,
            leadId: effectiveLeadId,
            userId: stored.userId,
            remoteUserId: stored.remoteUserId ?? null,
            capabilitiesVersion: stored.capabilitiesVersion ?? null,
            sentCapabilitiesVersion: stored.sentCapabilitiesVersion ?? null,
            syncScope: stored.syncScope ?? null,
            syncCursors: stored.syncCursors ?? null,
            pushCursors: stored.pushCursors ?? null,
            transportMode: stored.transportMode,
            remoteTransportMode: stored.remoteTransportMode,
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
