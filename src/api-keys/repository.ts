/**
 * API Keys Repository - create / list / revoke the caller's own keys.
 * Every query is scoped by userId: one user can never see or revoke another's key.
 */

import "server-only";

import { and, count, desc, eq, isNull } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ApiKeyDeleteResponseOutput } from "./[id]/definition";
import { API_KEY_MAX_ACTIVE } from "./constants";
import { userApiKeys } from "./db";
import type {
  ApiKeysGetResponseOutput,
  ApiKeysPostResponseOutput,
} from "./definition";
import type { ApiKeysT } from "./i18n";
import { generateApiKey, resetRateLimit } from "./keys";
import { isPaidUser } from "./paid";

/** Public base URL of the OpenAI-compatible API, derived from the request. */
export function buildApiBaseUrl(
  request: Request | undefined,
  locale: CountryLanguage,
): string {
  const forwardedHost = request?.headers.get("x-forwarded-host");
  const forwardedProto = request?.headers.get("x-forwarded-proto") ?? "https";
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : request
      ? new URL(request.url).origin
      : "";
  return `${origin}/api/${locale}/v1`;
}

export class ApiKeysRepository {
  static async list(
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    request: Request | undefined,
    t: ApiKeysT,
  ): Promise<ResponseType<ApiKeysGetResponseOutput>> {
    try {
      const rows = await db
        .select({
          id: userApiKeys.id,
          name: userApiKeys.name,
          keyPrefix: userApiKeys.keyPrefix,
          lastUsedAt: userApiKeys.lastUsedAt,
          createdAt: userApiKeys.createdAt,
          revokedAt: userApiKeys.revokedAt,
          rateLimitPerMinute: userApiKeys.rateLimitPerMinute,
        })
        .from(userApiKeys)
        .where(
          and(eq(userApiKeys.userId, user.id), isNull(userApiKeys.revokedAt)),
        )
        .orderBy(desc(userApiKeys.createdAt));
      return success({
        baseUrl: buildApiBaseUrl(request, locale),
        isPaid: await isPaidUser(user.id),
        keys: rows,
      });
    } catch (error) {
      logger.error("Failed to list API keys", parseError(error));
      return fail({
        message: t("errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Creates a key. The plaintext is returned here and never again. */
  static async create(
    user: JwtPrivatePayloadType,
    name: string,
    logger: EndpointLogger,
    t: ApiKeysT,
  ): Promise<ResponseType<ApiKeysPostResponseOutput>> {
    try {
      // /v1 is a paid feature: no plan and no purchase history, no key.
      if (!(await isPaidUser(user.id))) {
        return fail({
          message: t("create.errors.paidRequired"),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        });
      }
      const [active] = await db
        .select({ n: count() })
        .from(userApiKeys)
        .where(
          and(eq(userApiKeys.userId, user.id), isNull(userApiKeys.revokedAt)),
        );
      if ((active?.n ?? 0) >= API_KEY_MAX_ACTIVE) {
        return fail({
          message: t("create.errors.limit", { max: API_KEY_MAX_ACTIVE }),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      const generated = generateApiKey();
      const [row] = await db
        .insert(userApiKeys)
        .values({
          userId: user.id,
          name,
          keyPrefix: generated.keyPrefix,
          hashedKey: generated.hashedKey,
        })
        .returning({ id: userApiKeys.id });
      if (!row) {
        return fail({
          message: t("errors.server.detail", { error: "insert" }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      logger.info("API key created", { userId: user.id, keyId: row.id });
      return success({
        key: generated.plaintext,
        id: row.id,
        keyPrefix: generated.keyPrefix,
      });
    } catch (error) {
      logger.error("Failed to create API key", parseError(error));
      return fail({
        message: t("errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Revokes (soft) a key. Only the owner can; unknown/foreign ids are 404. */
  static async revoke(
    user: JwtPrivatePayloadType,
    keyId: string,
    logger: EndpointLogger,
    t: ApiKeysT,
  ): Promise<ResponseType<ApiKeyDeleteResponseOutput>> {
    try {
      const revoked = await db
        .update(userApiKeys)
        .set({ revokedAt: new Date() })
        .where(
          and(
            eq(userApiKeys.id, keyId),
            eq(userApiKeys.userId, user.id),
            isNull(userApiKeys.revokedAt),
          ),
        )
        .returning({ id: userApiKeys.id });
      if (revoked.length === 0) {
        return fail({
          message: t("revoke.errors.notFound.detail"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      resetRateLimit(keyId);
      logger.info("API key revoked", { userId: user.id, keyId });
      return success({ message: t("revoke.response.message") });
    } catch (error) {
      logger.error("Failed to revoke API key", parseError(error));
      return fail({
        message: t("errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
