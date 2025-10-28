import { promises as fs } from "fs";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { join } from "path";

import type { EndpointLogger } from "../logger-types";
import type { SessionData } from "./base-auth-handler";

/**
 * Session file path
 * Stored in user's home directory or current working directory
 */
const SESSION_FILE_NAME = ".vibe.session";

/**
 * Error message patterns for file not found errors
 */
const FILE_NOT_FOUND_ERROR_PATTERNS = {
  ENOENT: "ENOENT",
  NO_SUCH_FILE: "no such file",
} as const;

/**
 * Get session file path
 * Tries home directory first, falls back to current working directory
 */
function getSessionFilePath(): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  if (homeDir) {
    return join(homeDir, SESSION_FILE_NAME);
  }
  return join(process.cwd(), SESSION_FILE_NAME);
}

/**
 * Read session data from .vibe.session file
 */
export async function readSessionFile(
  logger: EndpointLogger,
): Promise<ResponseType<SessionData>> {
  try {
    const sessionPath = getSessionFilePath();
    logger.debug("Reading session file", { path: sessionPath });

    const fileContent = await fs.readFile(sessionPath, "utf-8");
    const sessionData = JSON.parse(fileContent) as SessionData;

    // Validate session data structure
    if (
      !sessionData.token ||
      !sessionData.userId ||
      !sessionData.leadId ||
      !sessionData.expiresAt
    ) {
      return createErrorResponse(
        "app.api.v1.core.system.unifiedBackend.cli.vibe.errors.invalidFormat",
        ErrorResponseTypes.VALIDATION_ERROR,
        { path: sessionPath },
      );
    }

    // Check if session is expired
    const expiresAt = new Date(sessionData.expiresAt);
    if (expiresAt < new Date()) {
      logger.debug("Session expired", { expiresAt: sessionData.expiresAt });
      return createErrorResponse(
        "app.api.v1.core.system.unifiedBackend.cli.vibe.errors.sessionExpired",
        ErrorResponseTypes.UNAUTHORIZED,
        { expiresAt: sessionData.expiresAt },
      );
    }

    logger.debug("Session file read successfully", {
      userId: sessionData.userId,
      expiresAt: sessionData.expiresAt,
    });

    return createSuccessResponse(sessionData);
  } catch (error) {
    const parsedError = parseError(error);

    // File not found is not an error - user is not authenticated
    const isFileNotFoundError =
      parsedError.message.includes(FILE_NOT_FOUND_ERROR_PATTERNS.ENOENT) ||
      parsedError.message.includes(FILE_NOT_FOUND_ERROR_PATTERNS.NO_SUCH_FILE);
    if (isFileNotFoundError) {
      logger.debug("Session file not found - user not authenticated");
      return createErrorResponse(
        "app.api.v1.core.system.unifiedBackend.cli.vibe.errors.notFound",
        ErrorResponseTypes.NOT_FOUND,
      );
    }

    logger.error("Error reading session file", parsedError);
    return createErrorResponse(
      "app.api.v1.core.system.unifiedBackend.cli.vibe.errors.readFailed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: parsedError.message },
    );
  }
}

/**
 * Write session data to .vibe.session file
 */
export async function writeSessionFile(
  sessionData: SessionData,
  logger: EndpointLogger,
): Promise<ResponseType<void>> {
  try {
    const sessionPath = getSessionFilePath();
    logger.debug("Writing session file", {
      path: sessionPath,
      userId: sessionData.userId,
    });

    // Validate session data
    if (
      !sessionData.token ||
      !sessionData.userId ||
      !sessionData.leadId ||
      !sessionData.expiresAt
    ) {
      return createErrorResponse(
        "app.api.v1.core.system.unifiedBackend.cli.vibe.errors.invalidData",
        ErrorResponseTypes.VALIDATION_ERROR,
      );
    }

    const fileContent = JSON.stringify(sessionData, null, 2);
    await fs.writeFile(sessionPath, fileContent, "utf-8");

    logger.debug("Session file written successfully", {
      path: sessionPath,
      userId: sessionData.userId,
    });

    return createSuccessResponse(undefined);
  } catch (error) {
    const parsedError = parseError(error);
    logger.error("Error writing session file", parsedError);
    return createErrorResponse(
      "app.api.v1.core.system.unifiedBackend.cli.vibe.errors.writeFailed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: parsedError.message },
    );
  }
}

/**
 * Delete session file
 */
export async function deleteSessionFile(
  logger: EndpointLogger,
): Promise<ResponseType<void>> {
  try {
    const sessionPath = getSessionFilePath();
    logger.debug("Deleting session file", { path: sessionPath });

    await fs.unlink(sessionPath);

    logger.debug("Session file deleted successfully", { path: sessionPath });
    return createSuccessResponse(undefined);
  } catch (error) {
    const parsedError = parseError(error);

    // File not found is not an error - already logged out
    const isFileNotFoundError =
      parsedError.message.includes(FILE_NOT_FOUND_ERROR_PATTERNS.ENOENT) ||
      parsedError.message.includes(FILE_NOT_FOUND_ERROR_PATTERNS.NO_SUCH_FILE);
    if (isFileNotFoundError) {
      logger.debug("Session file not found - already logged out");
      return createSuccessResponse(undefined);
    }

    logger.error("Error deleting session file", parsedError);
    return createErrorResponse(
      "app.api.v1.core.system.unifiedBackend.cli.vibe.errors.deleteFailed",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: parsedError.message },
    );
  }
}

/**
 * Check if session file exists
 */
export async function sessionFileExists(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logger: EndpointLogger,
): Promise<boolean> {
  try {
    const sessionPath = getSessionFilePath();
    await fs.access(sessionPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get session file path for display purposes
 */
export function getSessionFilePathForDisplay(): string {
  return getSessionFilePath();
}
