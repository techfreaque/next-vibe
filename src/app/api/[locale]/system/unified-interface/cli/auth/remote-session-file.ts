/**
 * Remote Session File Manager
 *
 * Manages `.vibe.remote.session` for storing JWT tokens from remote hosts.
 * Mirrors `session-file.ts` but for `--target remote` execution.
 *
 * Key difference from local session:
 * - Stores `host` field to validate session matches target URL
 * - LeadId is preserved across logout for reuse on re-login
 */

import { promises as fs } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../shared/logger/endpoint";
import type { SessionData } from "../../shared/server-only/auth/base-auth-handler";
import { scopedTranslation as cliScopedTranslation } from "../i18n";

/**
 * Remote session extends SessionData with a host field.
 * On logout, token/userId/expiresAt are cleared but leadId + host are kept.
 */
export interface RemoteSessionData extends SessionData {
  /** The remote URL this session is for (e.g. "https://unbottled.ai") */
  host: string;
}

const REMOTE_SESSION_FILE_NAME = ".vibe.remote.session";

function getProjectRoot(): string {
  if (process.env.VIBE_PROJECT_ROOT) {
    return process.env.VIBE_PROJECT_ROOT;
  }
  return process.cwd();
}

function getRemoteSessionFilePath(): string {
  return join(getProjectRoot(), REMOTE_SESSION_FILE_NAME);
}

/**
 * Read remote session data from `.vibe.remote.session`
 */
export async function readRemoteSessionFile(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<RemoteSessionData>> {
  const { t } = cliScopedTranslation.scopedT(locale);
  try {
    const sessionPath = getRemoteSessionFilePath();
    const fileContent = await fs.readFile(sessionPath, "utf-8");
    const sessionData = JSON.parse(fileContent) as RemoteSessionData;

    // A session without a token is a "logged out" session — only leadId remains
    if (!sessionData.token || !sessionData.host) {
      return fail({
        message: t("vibe.errors.remoteNoToken"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    // Check expiration
    if (sessionData.expiresAt) {
      const expiresAt = new Date(sessionData.expiresAt);
      if (expiresAt < new Date()) {
        return fail({
          message: t("vibe.errors.remoteExpired"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
    }

    return success(sessionData);
  } catch (error) {
    const parsedError = parseError(error);
    if (
      parsedError.message.includes("ENOENT") ||
      parsedError.message.includes("no such file")
    ) {
      return fail({
        message: t("vibe.errors.remoteNotFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    logger.error(`[REMOTE SESSION] Error reading: ${parsedError.message}`); // eslint-disable-line i18next/no-literal-string
    return fail({
      message: t("vibe.errors.remoteReadFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Read only the leadId from a previous remote session (even if token is expired/cleared).
 * Used to preserve leadId across logout/re-login.
 */
export async function readRemoteLeadId(
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    const sessionPath = getRemoteSessionFilePath();
    const fileContent = await fs.readFile(sessionPath, "utf-8");
    const sessionData = JSON.parse(fileContent) as Partial<RemoteSessionData>;
    return sessionData.leadId ?? null;
  } catch {
    logger.debug("[REMOTE SESSION] No existing session file for leadId lookup"); // eslint-disable-line i18next/no-literal-string
    return null;
  }
}

/**
 * Write remote session data to `.vibe.remote.session`
 */
export async function writeRemoteSessionFile(
  sessionData: RemoteSessionData,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<void>> {
  const { t } = cliScopedTranslation.scopedT(locale);
  try {
    const sessionPath = getRemoteSessionFilePath();
    const fileContent = JSON.stringify(sessionData, null, 2);
    await fs.writeFile(sessionPath, fileContent, "utf-8");
    logger.debug(`[REMOTE SESSION] Written (host: ${sessionData.host})`); // eslint-disable-line i18next/no-literal-string
    return success();
  } catch (error) {
    logger.error(
      `[REMOTE SESSION] Error writing: ${parseError(error).message}`, // eslint-disable-line i18next/no-literal-string
    );
    return fail({
      message: t("vibe.errors.remoteWriteFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Clear remote session token but preserve leadId and host.
 * Used on logout to maintain leadId for next login.
 */
export async function clearRemoteSessionToken(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<void>> {
  const { t } = cliScopedTranslation.scopedT(locale);
  try {
    const sessionPath = getRemoteSessionFilePath();
    let existing: Partial<RemoteSessionData> = {};

    try {
      const fileContent = await fs.readFile(sessionPath, "utf-8");
      existing = JSON.parse(fileContent) as Partial<RemoteSessionData>;
    } catch {
      // No existing file — nothing to clear
      return success();
    }

    // Keep leadId and host, clear auth
    const cleared: Partial<RemoteSessionData> = {
      host: existing.host,
      leadId: existing.leadId,
    };
    await fs.writeFile(sessionPath, JSON.stringify(cleared, null, 2), "utf-8");
    logger.debug("[REMOTE SESSION] Token cleared, leadId preserved"); // eslint-disable-line i18next/no-literal-string
    return success();
  } catch (error) {
    logger.error(
      `[REMOTE SESSION] Error clearing: ${parseError(error).message}`, // eslint-disable-line i18next/no-literal-string
    );
    return fail({
      message: t("vibe.errors.remoteClearFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
