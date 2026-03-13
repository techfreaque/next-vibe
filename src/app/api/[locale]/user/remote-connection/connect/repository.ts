/**
 * Remote Connection Connect Repository
 *
 * Server-side login: receives email + password, logs into the remote,
 * extracts the token, and stores only the token locally.
 *
 * Flow:
 * 1. SSRF guard on remoteUrl
 * 2. Login to remote server (email + password → token)
 * 3. Local collision check — instanceId must not already exist locally
 * 4. Register this instance on the remote (cloud-side collision check)
 * 5. Store connection locally (only if remote registration succeeded)
 */

import "server-only";

import { and, eq, ne } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { DEFAULT_REMOTE_TOOL_IDS } from "@/app/api/[locale]/agent/chat/constants";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { LEAD_ID_COOKIE_NAME } from "@/config/constants";
import { env } from "@/config/env";
import { envClient } from "@/config/env-client";
import { defaultLocale } from "@/i18n/core/config";

import loginEndpoints, {
  type LoginPostResponseOutput,
} from "../../public/login/definition";
import { userRemoteConnections } from "../db";
import registerEndpoints from "../register/definition";
import {
  invalidateInstanceIdCache,
  upsertRemoteConnection,
} from "../repository";
import type { RemoteConnectPostRequestInput } from "./definition";
import type { RemoteConnectT } from "./i18n";

/**
 * Call the register endpoint on the remote to store this local instance there.
 * Returns true if registration succeeded, false if instanceId already exists (CONFLICT).
 */
async function registerOnRemote(params: {
  remoteUrl: string;
  token: string;
  leadId: string;
  instanceId: string;
  logger: EndpointLogger;
}): Promise<{
  ok: boolean;
  conflict: boolean;
  remoteInstanceId: string | null;
}> {
  const { remoteUrl, token, leadId, instanceId, logger } = params;
  const localUrl = envClient.NEXT_PUBLIC_APP_URL ?? "";
  const registerUrl = `${remoteUrl}/api/${defaultLocale}/${registerEndpoints.POST.path.join("/")}`;

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
      body: JSON.stringify({ instanceId, localUrl }),
      signal: AbortSignal.timeout(15000),
    });

    if (response.status === 409) {
      logger.warn("[CONNECT] Instance ID already registered on remote", {
        instanceId,
      });
      return { ok: false, conflict: true, remoteInstanceId: null };
    }

    if (!response.ok) {
      logger.warn("[CONNECT] Remote registration failed", {
        status: response.status,
        instanceId,
      });
      return { ok: false, conflict: false, remoteInstanceId: null };
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
    return { ok: false, conflict: false, remoteInstanceId: null };
  }
}

/**
 * Private IP / loopback ranges that must never be used as remote URLs.
 * Prevents SSRF attacks where an authenticated user points the server at
 * internal services (AWS metadata, Kubernetes, local DB, etc.).
 */
const PRIVATE_IP_PATTERNS = [
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
function validateRemoteUrl(rawUrl: string): string | null {
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
  // Allow loopback/private addresses in development (for local-to-local testing)
  if (envClient.NODE_ENV !== "development" && env.NODE_ENV !== "development") {
    if (PRIVATE_IP_PATTERNS.some((re) => re.test(host))) {
      return "Remote URL must not point to a private or loopback address";
    }
  }
  return null;
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
 * 6. Write default remote tools to user's allowedTools setting
 */
export async function connectRemote(
  data: RemoteConnectPostRequestInput,
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
  t: RemoteConnectT,
): Promise<ResponseType<{ remoteUrlResult: string; isConnected: boolean }>> {
  const { email, password, friendlyName } = data;
  const remoteUrl = data.remoteUrl ?? "";
  const instanceId = data.instanceId ?? "";

  // ── Step 1: SSRF guard — reject private/loopback URLs ──────────────────────
  const urlError = validateRemoteUrl(remoteUrl);
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
  let token: string;
  let effectiveLeadId: string;
  try {
    const loginUrl = `${remoteUrl}/api/${defaultLocale}/${loginEndpoints.POST.path.join("/")}`;
    const loginResponse = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  // ── Step 3: Local collision check (ignore self-record with token="self") ───
  const [localExisting] = await db
    .select({ id: userRemoteConnections.id })
    .from(userRemoteConnections)
    .where(
      and(
        eq(userRemoteConnections.userId, user.id),
        eq(userRemoteConnections.instanceId, instanceId),
        ne(userRemoteConnections.token, "self"),
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

  // ── Step 3: Register this instance on the remote ───────────────────────────
  const registerResult = await registerOnRemote({
    remoteUrl,
    token,
    leadId: effectiveLeadId,
    instanceId,
    logger,
  });

  if (!registerResult.ok) {
    if (registerResult.conflict) {
      return fail({
        message: t("post.errors.instanceIdConflict.title"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
    return fail({
      message: t("post.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  // ── Step 4: Store locally ───────────────────────────────────────────────────
  const storeResult = await upsertRemoteConnection({
    userId: user.id,
    remoteUrl,
    token,
    leadId: effectiveLeadId,
    instanceId,
    friendlyName: friendlyName ?? instanceId,
    remoteInstanceId: registerResult.remoteInstanceId ?? undefined,
    logger,
  });

  if (!storeResult.success) {
    return fail({
      message: t("post.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  // Invalidate cache so pulse/task-sync pick up the new instanceId immediately
  invalidateInstanceIdCache();

  // ── Step 4b: Upsert local self-identity record (token="self") ──────────────
  // This lets getLocalInstanceId() return our own instanceId even when no remote
  // has registered here yet (e.g. outbound-only setups).
  try {
    await db
      .insert(userRemoteConnections)
      .values({
        userId: user.id,
        instanceId,
        friendlyName: `${instanceId} (self)`,
        remoteUrl: envClient.NEXT_PUBLIC_APP_URL ?? "",
        localUrl: null,
        token: "self",
        isActive: true,
        updatedAt: new Date(),
      })
      .onConflictDoNothing();
  } catch {
    // Non-fatal — self-record may already exist or conflict with the connection row
  }

  // ── Step 5: Write default remote tools to user's allowedTools setting ───────
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
    const existingAllowed = existingResult.success
      ? (existingResult.data.allowedTools ?? [])
      : [];
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
        { allowedTools: [...existingAllowed, ...newTools] },
        user,
        logger,
        settingsT,
      );
      logger.info(
        `[CONNECT] Added ${newTools.length.toString()} remote tools to allowedTools`,
        {
          instanceId,
        },
      );
    }
  } catch (toolWriteError) {
    // Non-fatal — connection is established, tools can be added manually
    logger.warn("[CONNECT] Failed to write remote tools to allowedTools", {
      error: String(toolWriteError),
    });
  }

  logger.info(`[CONNECT] Successfully connected to ${remoteUrl}`, {
    userId: user.id,
    instanceId,
  });

  return {
    success: true,
    data: { remoteUrlResult: remoteUrl, isConnected: true },
  };
}
