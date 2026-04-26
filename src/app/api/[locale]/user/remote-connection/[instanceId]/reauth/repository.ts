/**
 * Remote Connection Re-authenticate Repository
 * POST - refresh token for an existing connection
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  BEARER_LEAD_ID_SEPARATOR,
  LEAD_ID_COOKIE_NAME,
} from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

import loginEndpoints, {
  type LoginPostResponseOutput,
} from "../../../public/login/definition";
import { remoteConnections } from "../../db";
import registerEndpoints from "../../register/definition";
import { RemoteConnectionRepository } from "../../repository";
import type {
  RemoteConnectionReauthPostRequestInput,
  RemoteConnectionReauthPostResponseOutput,
} from "./definition";
import type { RemoteConnectionReauthT } from "./i18n";

export class RemoteConnectionReauthRepository {
  static async reauthConnection(
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    t: RemoteConnectionReauthT,
    instanceId: string,
    data: RemoteConnectionReauthPostRequestInput,
    locale: CountryLanguage,
  ): Promise<ResponseType<RemoteConnectionReauthPostResponseOutput>> {
    const { email, password } = data;

    // Fetch existing connection to get remoteUrl
    const [row] = await db
      .select()
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, user.id),
          eq(remoteConnections.instanceId, instanceId),
        ),
      );

    if (!row || !row.remoteUrl) {
      return fail({
        message: t("post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const remoteUrl = row.remoteUrl;

    // Step 1: Login to remote with new credentials
    let token: string;
    let newLeadId: string;
    try {
      const loginUrl = `${remoteUrl}/api/${locale}/${loginEndpoints.POST.path.join("/")}`;
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
      newLeadId = loginBody.data.leadId ?? "";
      logger.debug("[REAUTH] Successfully logged into remote", {
        remoteUrl,
        instanceId,
      });
    } catch (err) {
      logger.error("[REAUTH] Remote login error", { error: String(err) });
      return fail({
        message: t("post.errors.network.title"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    // Step 2: Regenerate reverse token via self-login (session-backed)
    // The remote needs a token that passes validateWebSession on OUR server,
    // so we log into ourselves to create a real DB session.
    let reverseToken: string | undefined;
    let reverseLeadId: string | undefined;
    const { envClient } = await import("@/config/env-client");
    const localUrl = envClient.NEXT_PUBLIC_APP_URL;
    if (localUrl) {
      try {
        // Ping ourselves to get a fresh leadId cookie
        let localPingLeadId: string | undefined;
        try {
          const localPingResp = await fetch(`${localUrl}/${locale}`, {
            method: "GET",
            redirect: "follow",
            signal: AbortSignal.timeout(10000),
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

        // Login to ourselves to get a session-backed token
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
          body: JSON.stringify({ email, password, rememberMe: true }),
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
              "[REAUTH] Obtained reverse session token via self-login",
            );
          }
        } else {
          logger.warn("[REAUTH] Self-login for reverse token failed", {
            status: localLoginResp.status,
          });
        }
      } catch (reverseErr) {
        logger.warn("[REAUTH] Self-login error for reverse token (non-fatal)", {
          error: String(reverseErr),
        });
      }
    }

    // Fallback: use a self-signed JWT - reverse calls may fail auth
    if (!reverseToken) {
      logger.warn(
        "[REAUTH] No reverse session token - falling back to signed JWT (reverse calls may fail auth)",
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

    // Step 3: Push updated reverseToken to remote via register endpoint (upsert)
    if (reverseToken) {
      try {
        const selfInstanceId =
          RemoteConnectionRepository.deriveDefaultSelfInstanceId();
        const registerUrl = `${remoteUrl}/api/${locale}/${registerEndpoints.POST.path.join("/")}`;
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}${BEARER_LEAD_ID_SEPARATOR}${newLeadId}`,
        };
        await fetch(registerUrl, {
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
        logger.info("[REAUTH] Pushed updated reverseToken to remote", {
          instanceId,
        });
      } catch (err) {
        // Non-fatal - main token is already updated
        logger.warn("[REAUTH] Failed to push reverseToken to remote", {
          error: String(err),
        });
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

    logger.info("[REAUTH] Token refreshed for remote connection", {
      userId: user.id,
      instanceId,
    });

    return success({ reauthenticated: true });
  }
}
