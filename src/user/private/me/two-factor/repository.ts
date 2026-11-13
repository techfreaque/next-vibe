/**
 * Two-factor repository (static class).
 * - handle(): settings-side lifecycle (status/setup/enable/disable/regenerate)
 * - verifyLoginCode(): used by login after the password succeeded
 * The TOTP secret is encrypted at rest and never logged or returned except
 * once, during setup, to the authenticated owner.
 */

import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { verifyPassword } from "next-vibe/identity/auth/password";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { renderSVG } from "uqr";
import { z } from "zod";

import type {
  TwoFactorPostRequestOutput,
  TwoFactorPostResponseOutput,
} from "./definition";
import { TwoFactorAction } from "./enum";
import type { TwoFactorT } from "./i18n";
import {
  buildOtpauthUri,
  consumeRecoveryCode,
  decryptSecret,
  encryptSecret,
  generateRecoveryCodes,
  generateTotpSecret,
  hashRecoveryCode,
  looksLikeRecoveryCode,
  verifyTotp,
} from "./totp";

const ISSUER = "unbottled.ai";
const MAX_FAILURES = 5;
const FAILURE_WINDOW_MS = 10 * 60 * 1000;

interface TwoFactorRow {
  id: string;
  email: string;
  password: string;
  enabled: boolean;
  secret: string | null;
  recovery: string[];
  recoveryRaw: string | null;
}

function parseHashes(raw: string | null): string[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = z.array(z.string()).safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export class TwoFactorRepository {
  /** Per-user failure counter for settings-side code checks (process-local). */
  private static failures = new Map<
    string,
    { count: number; resetAt: number }
  >();

  private static isThrottled(userId: string): boolean {
    const entry = TwoFactorRepository.failures.get(userId);
    if (!entry) {
      return false;
    }
    if (entry.resetAt < Date.now()) {
      TwoFactorRepository.failures.delete(userId);
      return false;
    }
    return entry.count >= MAX_FAILURES;
  }

  private static noteFailure(userId: string): void {
    const entry = TwoFactorRepository.failures.get(userId);
    if (!entry || entry.resetAt < Date.now()) {
      TwoFactorRepository.failures.set(userId, {
        count: 1,
        resetAt: Date.now() + FAILURE_WINDOW_MS,
      });
    } else {
      entry.count += 1;
    }
  }

  static resetThrottleForTests(): void {
    TwoFactorRepository.failures.clear();
  }

  private static async loadRow(userId: string): Promise<TwoFactorRow | null> {
    const [row] = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        enabled: users.twoFactorEnabled,
        secret: users.twoFactorSecret,
        recovery: users.twoFactorRecoveryCodes,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!row) {
      return null;
    }
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      enabled: row.enabled,
      secret: row.secret,
      recovery: parseHashes(row.recovery),
      recoveryRaw: row.recovery,
    };
  }

  /**
   * Check a TOTP or recovery code for a user with 2FA enabled.
   * A matching recovery code is consumed (single use, atomic on the stored value).
   */
  static async checkCode(
    row: TwoFactorRow,
    code: string,
  ): Promise<{ ok: boolean; usedRecovery: boolean }> {
    const trimmed = code.trim();
    if (!row.secret) {
      return { ok: false, usedRecovery: false };
    }
    if (/^\s*\d{3}\s?\d{3}\s*$/.test(trimmed)) {
      const secret = decryptSecret(row.secret);
      return {
        ok: secret !== null && verifyTotp(secret, trimmed),
        usedRecovery: false,
      };
    }
    if (looksLikeRecoveryCode(trimmed)) {
      const remaining = consumeRecoveryCode(row.recovery, trimmed);
      if (!remaining) {
        return { ok: false, usedRecovery: false };
      }
      // Compare-and-set so one code can never be spent twice concurrently
      const updated = await db
        .update(users)
        .set({
          twoFactorRecoveryCodes: JSON.stringify(remaining),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(users.id, row.id),
            row.recoveryRaw === null
              ? isNull(users.twoFactorRecoveryCodes)
              : eq(users.twoFactorRecoveryCodes, row.recoveryRaw),
          ),
        )
        .returning({ id: users.id });
      return { ok: updated.length > 0, usedRecovery: true };
    }
    return { ok: false, usedRecovery: false };
  }

  /**
   * Login gate. Returns:
   *  - { required: false } for users without 2FA (login unchanged)
   *  - { required: true, ok } otherwise
   */
  static async verifyLoginCode(
    userId: string,
    code: string | undefined,
  ): Promise<{ required: boolean; ok: boolean }> {
    const row = await TwoFactorRepository.loadRow(userId);
    if (!row || !row.enabled) {
      return { required: false, ok: true };
    }
    if (!code || code.trim() === "") {
      return { required: true, ok: false };
    }
    const result = await TwoFactorRepository.checkCode(row, code);
    return { required: true, ok: result.ok };
  }

  private static state(
    row: TwoFactorRow,
    message: string,
    extra: Partial<TwoFactorPostResponseOutput> = {},
  ): TwoFactorPostResponseOutput {
    return {
      enabled: row.enabled,
      message,
      recoveryCodesRemaining: row.enabled ? row.recovery.length : 0,
      ...extra,
    };
  }

  static async handle(
    user: JwtPayloadType,
    data: TwoFactorPostRequestOutput,
    logger: EndpointLogger,
    t: TwoFactorT,
  ): Promise<ResponseType<TwoFactorPostResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    const userId = user.id;
    try {
      const row = await TwoFactorRepository.loadRow(userId);
      if (!row) {
        return fail({
          message: t("errors.userNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      switch (data.action) {
        case TwoFactorAction.STATUS:
          return success(TwoFactorRepository.state(row, t("success.status")));

        case TwoFactorAction.SETUP: {
          if (row.enabled) {
            return fail({
              message: t("errors.alreadyEnabled"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          const secret = generateTotpSecret();
          const encrypted = encryptSecret(secret);
          if (!encrypted) {
            logger.error("2FA setup failed: server key not configured");
            return fail({
              message: t("errors.notConfigured"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }
          await db
            .update(users)
            .set({
              twoFactorSecret: encrypted,
              twoFactorEnabled: false,
              twoFactorRecoveryCodes: null,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
          const otpauthUri = buildOtpauthUri(secret, row.email, ISSUER);
          const svg = renderSVG(otpauthUri, { border: 2 });
          logger.debug("2FA setup started", { userId });
          return success(
            TwoFactorRepository.state(row, t("success.setupStarted"), {
              otpauthUri,
              secret,
              qrDataUri: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
            }),
          );
        }

        case TwoFactorAction.ENABLE: {
          if (row.enabled) {
            return fail({
              message: t("errors.alreadyEnabled"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          if (!row.secret) {
            return fail({
              message: t("errors.noPendingSetup"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          if (!data.code) {
            return fail({
              message: t("errors.codeRequired"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          if (TwoFactorRepository.isThrottled(userId)) {
            return fail({
              message: t("errors.tooManyAttempts"),
              errorType: ErrorResponseTypes.FORBIDDEN,
            });
          }
          const secret = decryptSecret(row.secret);
          if (!secret || !verifyTotp(secret, data.code)) {
            TwoFactorRepository.noteFailure(userId);
            return fail({
              message: t("errors.invalidCode"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          const codes = generateRecoveryCodes();
          const hashes = codes.map(hashRecoveryCode);
          await db
            .update(users)
            .set({
              twoFactorEnabled: true,
              twoFactorRecoveryCodes: JSON.stringify(hashes),
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
          logger.info("2FA enabled", { userId });
          return success(
            TwoFactorRepository.state(
              { ...row, enabled: true, recovery: hashes },
              t("success.enabled"),
              { recoveryCodes: codes },
            ),
          );
        }

        case TwoFactorAction.DISABLE:
        case TwoFactorAction.REGENERATE: {
          if (!row.enabled) {
            return fail({
              message: t("errors.notEnabled"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          if (!data.code && !data.password) {
            return fail({
              message: t("errors.credentialRequired"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          if (TwoFactorRepository.isThrottled(userId)) {
            return fail({
              message: t("errors.tooManyAttempts"),
              errorType: ErrorResponseTypes.FORBIDDEN,
            });
          }
          // Disable: a current code OR the password. Regenerate: a code only.
          let authorized = false;
          if (data.code) {
            authorized = (await TwoFactorRepository.checkCode(row, data.code))
              .ok;
          } else if (data.password && data.action === TwoFactorAction.DISABLE) {
            authorized = await verifyPassword(data.password, row.password);
          }
          if (!authorized) {
            TwoFactorRepository.noteFailure(userId);
            return fail({
              message: data.code
                ? t("errors.invalidCode")
                : t("errors.invalidPassword"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }

          if (data.action === TwoFactorAction.DISABLE) {
            await db
              .update(users)
              .set({
                twoFactorEnabled: false,
                twoFactorSecret: null,
                twoFactorRecoveryCodes: null,
                updatedAt: new Date(),
              })
              .where(eq(users.id, userId));
            logger.info("2FA disabled", { userId });
            return success(
              TwoFactorRepository.state(
                { ...row, enabled: false, recovery: [] },
                t("success.disabled"),
              ),
            );
          }

          const codes = generateRecoveryCodes();
          const hashes = codes.map(hashRecoveryCode);
          await db
            .update(users)
            .set({
              twoFactorRecoveryCodes: JSON.stringify(hashes),
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
          logger.info("2FA recovery codes regenerated", { userId });
          return success(
            TwoFactorRepository.state(
              { ...row, recovery: hashes },
              t("success.regenerated"),
              { recoveryCodes: codes },
            ),
          );
        }
      }
    } catch (error) {
      logger.error("Two-factor operation failed", parseError(error));
      return fail({
        message: t("errors.failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
