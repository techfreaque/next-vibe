/**
 * Base Tools Repository
 * Shared repository pattern for fetching tools across platforms
 * Eliminates duplication between AI and MCP tools repositories
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Type for tool metadata - any JSON-serializable object
 * Using unknown instead of strict Record to support various tool formats (MCP, AI, etc.)
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Tool result handling requires 'unknown' for flexible return types
type ToolMetadata = unknown;

/**
 * Base tools repository interface
 */
export interface BaseToolsRepository<TRequest, TResponse> {
  getTools(
    data: TRequest,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<TResponse> | TResponse;
}

/**
 * Base tools repository implementation
 * Provides common logging and error handling patterns
 */
export abstract class BaseToolsRepositoryImpl<
  TRequest,
  // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Parameter extraction requires 'unknown' for dynamic tool arguments
  TResponse extends Record<string, unknown>,
>implements BaseToolsRepository<TRequest, TResponse>
{
  protected platformName: string;

  constructor(platformName: string) {
    this.platformName = platformName;
  }

  /**
   * Get tools - must be implemented by subclasses
   */
  abstract getTools(
    data: TRequest,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<TResponse> | TResponse;

  /**
   * Log fetching start
   */
  protected logFetchStart(logger: EndpointLogger, user: JwtPayloadType): void {
    logger.info(`[${this.platformName}] Fetching available tools`, {
      userId: user.isPublic ? undefined : user.id,
      isPublic: user.isPublic,
    });
  }

  /**
   * Log tools found
   */
  protected logToolsFound(logger: EndpointLogger, count: number): void {
    logger.info(`[${this.platformName}] Found tools`, {
      count,
    });
  }

  /**
   * Log result
   */
  protected logResult(
    logger: EndpointLogger,
    result: TResponse,
    toolsCount: number,
    sampleTool?: ToolMetadata,
  ): void {
    logger.info(`[${this.platformName}] Returning result`, {
      resultKeys: Object.keys(result),
      toolsCount,
      sampleTool:
        sampleTool !== undefined ? JSON.stringify(sampleTool) : undefined,
    });
  }

  /**
   * Log error
   */
  protected logError(logger: EndpointLogger, error: Error | string): void {
    logger.error(`[${this.platformName}] Error fetching tools`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  /**
   * Create user context for filtering
   * Returns the full JwtPayloadType for proper type flow
   */
  protected createUserContext(user: JwtPayloadType): JwtPayloadType {
    return user;
  }
}
