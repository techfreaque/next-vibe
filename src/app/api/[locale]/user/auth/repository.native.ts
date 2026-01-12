/**
 * Native Auth Repository
 * Implements AuthRepository interface for React Native
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { storage } from "next-vibe-ui/lib/storage";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { AuthContext } from "@/app/api/[locale]/system/unified-interface/shared/server-only/auth/base-auth-handler";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CompleteUserType } from "@/app/api/[locale]/user/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { UserRoleValue } from "../user-roles/enum";
import type { AuthRepositoryType, InferUserType } from "./repository";

const AUTH_TOKEN_STORAGE_KEY = "@auth/token";
const AUTH_EXPIRES_AT_STORAGE_KEY = "@auth/expiresAt";

/**
 * Native Auth Repository - Static class pattern
 */
export class AuthRepository {
  static async getPrimaryLeadId(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
  ): Promise<string | null> {
    return null;
  }

  static async getAllLeadIds(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
  ): Promise<string[]> {
    return [];
  }

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

  static async getTypedAuthMinimalUser<TRoles extends readonly UserRoleValue[]>(
    // oxlint-disable-next-line no-unused-vars
    _roles: TRoles,
    // oxlint-disable-next-line no-unused-vars
    _context: AuthContext,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getTypedAuthMinimalUser is not implemented on native");
  }

  static async setAuthCookies(
    token: string,
    rememberMe: boolean,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      const expirationDays = rememberMe ? 30 : 7;
      const expiresAt = new Date(
        Date.now() + expirationDays * 24 * 60 * 60 * 1000,
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
        message: "app.api.user.auth.errors.native.storage_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  static async clearAuthCookies(
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      await storage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      await storage.removeItem(AUTH_EXPIRES_AT_STORAGE_KEY);

      return success();
    } catch (error) {
      logger.error("Error clearing auth token", parseError(error));
      return fail({
        message: "app.api.user.auth.errors.native.clear_failed",
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
  ): Promise<ResponseType<string>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("signJwt is not implemented on native");
  }

  static verifyJwt(
    // oxlint-disable-next-line no-unused-vars
    _token: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("verifyJwt is not implemented on native");
  }

  static getCurrentUser(
    // oxlint-disable-next-line no-unused-vars
    _context: AuthContext,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getCurrentUser is not implemented on native");
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

  static getUserRoles(
    // oxlint-disable-next-line no-unused-vars
    _requiredRoles: readonly UserRoleValue[],
    // oxlint-disable-next-line no-unused-vars
    _context: AuthContext,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<UserRoleValue[]> {
    return Promise.resolve([]);
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
  ): Promise<ResponseType<void>> {
    return await AuthRepository.setAuthCookies(token, true, logger);
  }

  static async clearAuthTokenForPlatform(
    // oxlint-disable-next-line no-unused-vars
    _platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    return await AuthRepository.clearAuthCookies(logger);
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

  static validateCliToken(
    // oxlint-disable-next-line no-unused-vars
    _token: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null> {
    return Promise.resolve(null);
  }

  static extractUserId(payload: JwtPrivatePayloadType): string | null {
    return payload.id || null;
  }

  static requireUserId(payload: JwtPrivatePayloadType): string {
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
