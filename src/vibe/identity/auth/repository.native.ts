/**
 * Native Auth Repository
 * Implements AuthRepository interface for React Native
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { AuthT } from "next-vibe/identity/auth/i18n";
import { scopedTranslation } from "next-vibe/identity/auth/i18n";
import type { UserRoleValue } from "next-vibe/identity/roles/enum";
import type { CompleteUserType } from "next-vibe/identity/user/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { storage } from "next-vibe/ui/lib/storage";

import { AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS } from "@/env/constants";

import type { AuthContext } from "./base-auth-handler";
import type { AuthRepositoryType } from "./repository";
import type { InferUserType, JwtPrivatePayloadType } from "./types";

const AUTH_TOKEN_STORAGE_KEY = "@auth/token";
const AUTH_EXPIRES_AT_STORAGE_KEY = "@auth/expiresAt";

/**
 * Native Auth Repository - Static class pattern
 */
export class AuthRepository {
  static async validateSession(
    // oxlint-disable-next-line no-unused-vars
    _token: string,
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null> {
    return null;
  }

  static async authenticate(
    // oxlint-disable-next-line no-unused-vars
    _context: AuthContext,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("authenticate is not implemented on native");
  }

  static async setAuthCookies(
    token: string,
    logger: EndpointLogger,
    t: AuthT,
  ): Promise<ResponseType<void>> {
    try {
      const expiresAt = new Date(
        Date.now() + AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS * 1000,
      );

      await storage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      await storage.setItem(
        AUTH_EXPIRES_AT_STORAGE_KEY,
        expiresAt.toISOString(),
      );

      return success();
    } catch (error) {
      logger.error("Error storing auth token", parseError(error));
      return fail({
        message: t("errors.native.storage_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  static async clearAuthCookies(
    logger: EndpointLogger,
    t: AuthT,
  ): Promise<ResponseType<void>> {
    try {
      await storage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      await storage.removeItem(AUTH_EXPIRES_AT_STORAGE_KEY);

      return success();
    } catch (error) {
      logger.error("Error clearing auth token", parseError(error));
      return fail({
        message: t("errors.native.clear_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  static signJwt(
    // oxlint-disable-next-line no-unused-vars
    _payload: JwtPrivatePayloadType,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<ResponseType<string>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("signJwt is not implemented on native");
  }

  static verifyJwt(
    // oxlint-disable-next-line no-unused-vars
    _token: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("verifyJwt is not implemented on native");
  }

  static getAuthMinimalUser<TRoles extends readonly UserRoleValue[]>(
    // oxlint-disable-next-line no-unused-vars
    _roles: TRoles,
    // oxlint-disable-next-line no-unused-vars
    _context: AuthContext,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getAuthMinimalUser is not implemented on native");
  }

  static async storeAuthTokenForPlatform(
    token: string,
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _leadId: string,
    // oxlint-disable-next-line no-unused-vars
    _platform: Platform,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = scopedTranslation.scopedT(locale);
    return await AuthRepository.setAuthCookies(token, logger, t);
  }

  static async clearAuthTokenForPlatform(
    // oxlint-disable-next-line no-unused-vars
    _platform: Platform,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<void>> {
    const { t } = scopedTranslation.scopedT(locale);
    return await AuthRepository.clearAuthCookies(logger, t);
  }

  static createCliToken(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("createCliToken is not implemented on native");
  }

  static extractUserId(payload: JwtPrivatePayloadType): string | null {
    return payload.id || null;
  }

  static requireUserId(
    payload: JwtPrivatePayloadType,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): string {
    const userId = AuthRepository.extractUserId(payload);
    if (!userId) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error("JWT payload missing user ID");
    }
    return userId;
  }

  static requireAdminUser(
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
    // oxlint-disable-next-line no-unused-vars
    _callbackUrl: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<CompleteUserType> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("requireAdminUser is not implemented on native");
  }

  static authenticateUserByEmail(
    // oxlint-disable-next-line no-unused-vars
    _email: string,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("authenticateUserByEmail is not implemented on native");
  }
}

// Compile-time type check
const _typeCheck: AuthRepositoryType = AuthRepository;
void _typeCheck;
