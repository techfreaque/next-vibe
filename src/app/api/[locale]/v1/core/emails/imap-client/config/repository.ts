/**
 * IMAP Configuration Repository
 * Handles IMAP server configuration management
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { imapConfigurations } from "./db";
import type {
  ConfigGetRequestOutput,
  ConfigGetResponseOutput,
  ConfigUpdateRequestOutput,
  ConfigUpdateResponseOutput,
} from "./definition";
import { ImapLoggingLevel } from "./enum";

/**
 * Default IMAP Configuration (matches API definition shape)
 */
const DEFAULT_IMAP_CONFIG = {
  host: "app.api.v1.core.emails.imapClient.imap.gmail.com",
  port: 993,
  username: "",
  password: "",
  tls: true,
  autoReconnect: true,
  loggingLevel: ImapLoggingLevel.INFO as typeof ImapLoggingLevel.INFO,
};

/**
 * Default IMAP Configuration for DB (internal storage)
 */
const DEFAULT_IMAP_CONFIG_DB = {
  serverEnabled: true,
  maxConnections: 100,
  connectionTimeout: 30000,
  poolIdleTimeout: 300000,
  keepAlive: true,
  syncEnabled: true,
  syncInterval: 300,
  batchSize: 50,
  maxMessages: 1000,
  concurrentAccounts: 5,
  cacheEnabled: true,
  cacheTtl: 300000,
  cacheMaxSize: 1000,
  memoryThreshold: 80,
  maxRetries: 3,
  retryDelay: 1000,
  circuitBreakerThreshold: 5,
  circuitBreakerTimeout: 60000,
  healthCheckInterval: 60000,
  metricsEnabled: true,
  loggingLevel: ImapLoggingLevel.INFO,
  rateLimitEnabled: true,
  rateLimitRequests: 100,
  rateLimitWindow: 60000,
  debugMode: false,
  testMode: false,
};

export interface ImapConfigRepository {
  getConfig(
    data: ConfigGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<ConfigGetResponseOutput>;

  updateConfig(
    data: ConfigUpdateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<ConfigUpdateResponseOutput>;
}

export class ImapConfigRepositoryImpl implements ImapConfigRepository {
  getConfig(
    data: ConfigGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<ConfigGetResponseOutput> {
    try {
      logger.debug("Getting IMAP configuration");

      // For now, return the default configuration
      // TODO: Store these fields in a separate table or extend the current schema
      logger.vibe("📧 IMAP config: Using defaults", {
        host: DEFAULT_IMAP_CONFIG.host,
        port: DEFAULT_IMAP_CONFIG.port,
      });

      return createSuccessResponse({
        host: DEFAULT_IMAP_CONFIG.host,
        port: DEFAULT_IMAP_CONFIG.port,
        username: DEFAULT_IMAP_CONFIG.username,
        password: DEFAULT_IMAP_CONFIG.password,
        tls: DEFAULT_IMAP_CONFIG.tls,
        autoReconnect: DEFAULT_IMAP_CONFIG.autoReconnect,
        loggingLevel: ImapLoggingLevel.INFO,
        message:
          "app.api.v1.core.emails.imapClient.config.get.response.message",
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to get IMAP configuration", {
        error: parsedError.message,
      });

      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.config.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  updateConfig(
    data: ConfigUpdateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<ConfigUpdateResponseOutput> {
    try {
      logger.debug("Updating IMAP configuration", {
        host: data.host,
        port: data.port,
        username: data.username,
      });

      // For now, just log the update.
      // TODO: Store in database when schema is aligned
      logger.vibe("📧 IMAP config update requested", {
        host: data.host,
        port: data.port,
      });

      return createSuccessResponse({
        host: data.host,
        port: data.port,
        username: data.username,
        password: data.password,
        tls: data.tls,
        autoReconnect: data.autoReconnect,
        loggingLevel: data.loggingLevel,
        message:
          "app.api.v1.core.emails.imapClient.config.update.response.message",
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update IMAP configuration", {
        error: parsedError.message,
        data,
      });

      return createErrorResponse(
        "app.api.v1.core.emails.imapClient.config.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  private async createDefaultConfig(logger: EndpointLogger): Promise<void> {
    try {
      await db.insert(imapConfigurations).values(DEFAULT_IMAP_CONFIG_DB);
      logger.debug("Default IMAP configuration created");
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create default IMAP configuration", {
        error: parsedError.message,
      });
    }
  }
}

export const imapConfigRepository = new ImapConfigRepositoryImpl();
