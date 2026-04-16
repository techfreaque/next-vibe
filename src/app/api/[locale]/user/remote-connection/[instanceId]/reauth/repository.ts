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
import { BEARER_LEAD_ID_SEPARATOR } from "@/config/constants";
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

    // Step 2: Regenerate reverse token (so remote can call us back)
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
        "[REAUTH] Failed to generate reverse token, continuing without it",
      );
    }

    // Step 3: Push updated reverseToken to remote via register endpoint (upsert)
    if (reverseToken) {
      try {
        const selfInstanceId =
          RemoteConnectionRepository.deriveDefaultSelfInstanceId();
        const { envClient } = await import("@/config/env-client");
        const localUrl = envClient.NEXT_PUBLIC_APP_URL ?? "";
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
            reverseLeadId: user.leadId,
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
