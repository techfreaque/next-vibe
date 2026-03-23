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
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import {
  DEFAULT_REMOTE_TOOL_IDS,
  getDefaultToolIdsForUser,
} from "@/app/api/[locale]/agent/chat/constants";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { LEAD_ID_COOKIE_NAME } from "@/config/constants";
import { env } from "@/config/env";
import { envClient } from "@/config/env-client";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

import loginEndpoints, {
  type LoginPostResponseOutput,
} from "../../public/login/definition";
import { remoteConnections } from "../db";
import registerEndpoints from "../register/definition";
import { RemoteConnectionRepository } from "../repository";
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
    // Allow loopback/private addresses in development or preview mode (for local-to-local testing)
    const isDev =
      envClient.NODE_ENV === "development" ||
      env.NODE_ENV === "development" ||
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
    remoteInstanceId: string | null;
  }> {
    const {
      remoteUrl,
      token,
      leadId,
      instanceId,
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
        Authorization: `Bearer ${token}`,
      };
      if (leadId) {
        headers.Cookie = `${LEAD_ID_COOKIE_NAME}=${leadId}`;
      }

      const response = await fetch(registerUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          instanceId,
          localUrl,
          ...(reverseToken ? { reverseToken } : {}),
          ...(reverseLeadId ? { reverseLeadId } : {}),
        }),
        signal: AbortSignal.timeout(15000),
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
        signal: AbortSignal.timeout(10000),
      });
      const setCookie = pingResponse.headers.get("set-cookie") ?? "";
      const match = setCookie.match(
        new RegExp(`${LEAD_ID_COOKIE_NAME}=([^;]+)`),
      );
      if (match?.[1]) {
        remotePingLeadId = match[1];
        logger.info("[CONNECT] Got remote leadId from ping", {
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
        signal: AbortSignal.timeout(15000),
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
      logger.info("[CONNECT] Successfully logged into remote", { remoteUrl });
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

    // ── Step 3b: Generate reverse token for bidirectional auth ───────────────
    // The remote needs a JWT signed by OUR secret to call our /report endpoint.
    // This enables the remote to push task completion status back to us.
    let reverseToken: string | undefined;
    const reverseTokenResult = await AuthRepository.signJwt(
      user,
      logger,
      locale,
    );
    if (reverseTokenResult.success) {
      reverseToken = reverseTokenResult.data;
    } else {
      logger.warn(
        "[CONNECT] Failed to generate reverse token, continuing without it",
      );
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
        reverseLeadId: user.leadId,
        logger,
      });

    if (!registerResult.ok) {
      return fail({
        message: registerResult.conflict
          ? t("post.errors.conflict.title")
          : t("post.errors.server.title"),
        errorType: registerResult.conflict
          ? ErrorResponseTypes.CONFLICT
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
        isDefault: true,
        logger,
      },
    );

    if (!storeResult.success) {
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
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

    // ── Step 6: Write default remote tools to user's availableTools setting ───────
    try {
      const { ChatSettingsRepository } =
        await import("@/app/api/[locale]/agent/chat/settings/repository");
      const { scopedTranslation: settingsScopedT } =
        await import("@/app/api/[locale]/agent/chat/settings/i18n");
      const { t: settingsT } = settingsScopedT.scopedT(defaultLocale);

      const existingResult = await ChatSettingsRepository.getSettings(
        user,
        logger,
        settingsT,
      );
      // When availableTools is null the user hasn't customised the list yet —
      // fall back to the role-based defaults so we merge on top of them instead
      // of replacing them with only the 4 remote tools.
      const rawAllowed = existingResult.success
        ? existingResult.data.availableTools
        : null;
      const existingAllowed =
        rawAllowed ??
        getDefaultToolIdsForUser(user).map((id) => ({
          toolId: id,
          requiresConfirmation: false,
        }));
      const remoteTools = DEFAULT_REMOTE_TOOL_IDS.map((id) => ({
        toolId: `${instanceId}__${id}`,
        requiresConfirmation: false,
      }));
      const existingIds = new Set(existingAllowed.map((tool) => tool.toolId));
      const newTools = remoteTools.filter(
        (tool) => !existingIds.has(tool.toolId),
      );
      if (newTools.length > 0) {
        await ChatSettingsRepository.upsertSettings(
          { availableTools: [...existingAllowed, ...newTools] },
          user,
          logger,
          settingsT,
        );
        logger.info(
          `[CONNECT] Added ${newTools.length.toString()} remote tools to availableTools`,
          {
            instanceId,
          },
        );
      }
    } catch (toolWriteError) {
      // Non-fatal - connection is established, tools can be added manually
      logger.warn("[CONNECT] Failed to write remote tools to availableTools", {
        error: String(toolWriteError),
      });
    }

    logger.info(`[CONNECT] Successfully connected to ${remoteUrl}`, {
      userId: user.id,
      instanceId,
    });

    // ── Step 7: Immediate bidirectional capability sync ────────────────────────
    // Fire-and-forget: sends our capabilities to the remote and pulls theirs back.
    // This populates both sides without waiting for the next cron pulse (~1 min).
    void (async (): Promise<void> => {
      try {
        const { TaskSyncRepository } =
          await import("@/app/api/[locale]/system/unified-interface/tasks/task-sync/repository");
        await TaskSyncRepository.pullFromRemote(logger, locale);
        logger.info("[CONNECT] Initial capability sync completed", {
          instanceId,
        });
      } catch (syncError) {
        // Non-fatal - capabilities will sync on the next cron pulse
        logger.warn("[CONNECT] Initial capability sync failed (non-fatal)", {
          error: String(syncError),
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
