/**
 * Base Tools Repository
 * Shared repository pattern for fetching tools across platforms
 * Eliminates duplication between AI and MCP tools repositories
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

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
export abstract class BaseToolsRepositoryImpl<TRequest, TResponse>
  implements BaseToolsRepository<TRequest, TResponse>
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
    sampleTool?: unknown,
  ): void {
    logger.info(`[${this.platformName}] Returning result`, {
      resultKeys: Object.keys(result as object),
      toolsCount,
      sampleTool,
    });
  }

  /**
   * Log error
   */
  protected logError(logger: EndpointLogger, error: unknown): void {
    logger.error(`[${this.platformName}] Error fetching tools`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  /**
   * Create user context for filtering
   */
  protected createUserContext(user: JwtPayloadType): {
    id?: string;
    isPublic: boolean;
  } {
    return {
      id: user.isPublic ? undefined : user.id,
      isPublic: user.isPublic,
    };
  }
}
