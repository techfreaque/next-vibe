import { promises as fs } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "../../shared/logger/endpoint";
import type { SessionData } from "../../shared/server-only/auth/base-auth-handler";

/**
 * Session file path
 * Stored in project root directory
 */
const SESSION_FILE_NAME = ".vibe.session";

/**
 * Get project root directory
 * This is more reliable than process.cwd() which depends on where the process was started
 */
function getProjectRoot(): string {
  // Try environment variable first (can be set by CLI or MCP config)
  if (process.env.VIBE_PROJECT_ROOT) {
    return process.env.VIBE_PROJECT_ROOT;
  }

  // Fall back to process.cwd() - this will work when MCP server runs from project root
  return process.cwd();
}

/**
 * Error message patterns for file not found errors
 */
const FILE_NOT_FOUND_ERROR_PATTERNS = {
  ENOENT: "ENOENT",
  NO_SUCH_FILE: "no such file",
} as const;

/**
 * Get session file path
 * Uses project root from environment variable or falls back to cwd
 */
function getSessionFilePath(): string {
  const projectRoot = getProjectRoot();
  const sessionPath = join(projectRoot, SESSION_FILE_NAME);

  return sessionPath;
}

/**
 * Read session data from .vibe.session file
 */
export async function readSessionFile(logger: EndpointLogger): Promise<ResponseType<SessionData>> {
  try {
    const sessionPath = getSessionFilePath();
    const projectRoot = getProjectRoot();
    const cwd = process.cwd();

    // Enhanced debugging: Log current working directory and full path

    logger.debug(
      `[SESSION FILE] Reading session file (path: ${sessionPath}, projectRoot: ${projectRoot}, cwd: ${cwd})`,
    );

    // Check if file exists before attempting to read
    try {
      await fs.access(sessionPath);

      logger.debug(`[SESSION FILE] File exists at path: ${sessionPath}`);
    } catch (accessError) {
      const errorMsg = parseError(accessError).message;

      logger.debug(`[SESSION FILE] File does not exist at path: ${sessionPath} (${errorMsg})`);
    }

    const fileContent = await fs.readFile(sessionPath, "utf-8");
    const sessionData = JSON.parse(fileContent) as SessionData;

    // Validate session data structure
    if (
      !sessionData.token ||
      !sessionData.userId ||
      !sessionData.leadId ||
      !sessionData.expiresAt
    ) {
      return fail({
        message: "app.api.system.unifiedInterface.cli.vibe.errors.invalidFormat",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: { path: sessionPath },
      });
    }

    // Check if session is expired
    const expiresAt = new Date(sessionData.expiresAt);
    if (expiresAt < new Date()) {
      logger.debug(`[SESSION FILE] Session expired (expiresAt: ${sessionData.expiresAt})`);
      return fail({
        message: "app.api.system.unifiedInterface.cli.vibe.errors.sessionExpired",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: { expiresAt: sessionData.expiresAt },
      });
    }

    logger.debug(
      `[SESSION FILE] Read successfully (userId: ${sessionData.userId}, expiresAt: ${sessionData.expiresAt})`,
    );

    return success(sessionData);
  } catch (error) {
    const parsedError = parseError(error);

    // File not found is not an error - user is not authenticated
    const isFileNotFoundError =
      parsedError.message.includes(FILE_NOT_FOUND_ERROR_PATTERNS.ENOENT) ||
      parsedError.message.includes(FILE_NOT_FOUND_ERROR_PATTERNS.NO_SUCH_FILE);
    if (isFileNotFoundError) {
      // Enhanced debugging: Log path details when file not found
      const searchedPath = getSessionFilePath();
      const projectRoot = getProjectRoot();
      const cwd = process.cwd();

      logger.debug(
        `[SESSION FILE] File not found - user not authenticated (searchedPath: ${searchedPath}, projectRoot: ${projectRoot}, cwd: ${cwd}, error: ${parsedError.message})`,
      );
      return fail({
        message: "app.api.system.unifiedInterface.cli.vibe.errors.notFound",
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    logger.error(
      `[SESSION FILE] Error reading session file: ${parsedError.message} (path: ${getSessionFilePath()}, projectRoot: ${getProjectRoot()}, cwd: ${process.cwd()})`,
    );
    return fail({
      message: "app.api.system.unifiedInterface.cli.vibe.errors.readFailed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: parsedError.message },
    });
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

    logger.debug(
      `[SESSION FILE] Writing session file (path: ${sessionPath}, userId: ${sessionData.userId})`,
    );

    // Validate session data
    if (
      !sessionData.token ||
      !sessionData.userId ||
      !sessionData.leadId ||
      !sessionData.expiresAt
    ) {
      return fail({
        message: "app.api.system.unifiedInterface.cli.vibe.errors.invalidData",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    const fileContent = JSON.stringify(sessionData, null, 2);
    await fs.writeFile(sessionPath, fileContent, "utf-8");

    logger.debug(
      `[SESSION FILE] Written successfully (path: ${sessionPath}, userId: ${sessionData.userId})`,
    );

    return success();
  } catch (error) {
    const parsedError = parseError(error);

    logger.error(`[SESSION FILE] Error writing session file: ${parsedError.message}`);
    return fail({
      message: "app.api.system.unifiedInterface.cli.vibe.errors.writeFailed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: parsedError.message },
    });
  }
}

/**
 * Delete session file
 */
export async function deleteSessionFile(logger: EndpointLogger): Promise<ResponseType<void>> {
  try {
    const sessionPath = getSessionFilePath();

    logger.debug(`[SESSION FILE] Deleting session file (path: ${sessionPath})`);

    await fs.unlink(sessionPath);

    logger.debug(`[SESSION FILE] Deleted successfully (path: ${sessionPath})`);
    return success();
  } catch (error) {
    const parsedError = parseError(error);

    // File not found is not an error - already logged out
    const isFileNotFoundError =
      parsedError.message.includes(FILE_NOT_FOUND_ERROR_PATTERNS.ENOENT) ||
      parsedError.message.includes(FILE_NOT_FOUND_ERROR_PATTERNS.NO_SUCH_FILE);
    if (isFileNotFoundError) {
      logger.debug("[SESSION FILE] File not found - already logged out");
      return success();
    }

    logger.error(`[SESSION FILE] Error deleting session file: ${parsedError.message}`);
    return fail({
      message: "app.api.system.unifiedInterface.cli.vibe.errors.deleteFailed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: parsedError.message },
    });
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
