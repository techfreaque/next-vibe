/**
 * IMAP Configuration Repository
 * Handles IMAP server configuration management
 */

import "server-only";

import { eq } from "drizzle-orm";
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
 * Default IMAP Configuration
 */
const DEFAULT_IMAP_CONFIG = {
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
  ): Promise<ResponseType<ConfigGetResponseOutput>>;

  updateConfig(
    data: ConfigUpdateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConfigUpdateResponseOutput>>;
}

export class ImapConfigRepositoryImpl implements ImapConfigRepository {
  async getConfig(
    data: ConfigGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConfigGetResponseOutput>> {
    try {
      logger.debug("Getting IMAP configuration");

      const [config] = await db.select().from(imapConfigurations).limit(1);

      if (!config) {
        logger.debug("No IMAP configuration found, creating default");
        await this.createDefaultConfig(logger);

        logger.vibe("📧 IMAP config: Using defaults", {
          serverEnabled: DEFAULT_IMAP_CONFIG.serverEnabled,
          maxConnections: DEFAULT_IMAP_CONFIG.maxConnections,
        });

        return createSuccessResponse(DEFAULT_IMAP_CONFIG);
      }

      logger.vibe("📧 IMAP config loaded successfully", {
        serverEnabled: config.serverEnabled,
        maxConnections: config.maxConnections,
        syncEnabled: config.syncEnabled,
      });

      return createSuccessResponse({
        serverEnabled: config.serverEnabled,
        maxConnections: config.maxConnections,
        connectionTimeout: config.connectionTimeout,
        poolIdleTimeout: config.poolIdleTimeout,
        keepAlive: config.keepAlive,
        syncEnabled: config.syncEnabled,
        syncInterval: config.syncInterval,
        batchSize: config.batchSize,
        maxMessages: config.maxMessages,
        concurrentAccounts: config.concurrentAccounts,
        cacheEnabled: config.cacheEnabled,
        cacheTtl: config.cacheTtl,
        cacheMaxSize: config.cacheMaxSize,
        memoryThreshold: config.memoryThreshold,
        maxRetries: config.maxRetries,
        retryDelay: config.retryDelay,
        circuitBreakerThreshold: config.circuitBreakerThreshold,
        circuitBreakerTimeout: config.circuitBreakerTimeout,
        healthCheckInterval: config.healthCheckInterval,
        metricsEnabled: config.metricsEnabled,
        loggingLevel: config.loggingLevel,
        rateLimitEnabled: config.rateLimitEnabled,
        rateLimitRequests: config.rateLimitRequests,
        rateLimitWindow: config.rateLimitWindow,
        debugMode: config.debugMode,
        testMode: config.testMode,
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

  async updateConfig(
    data: ConfigUpdateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConfigUpdateResponseOutput>> {
    try {
      logger.debug("Updating IMAP configuration", {
        serverEnabled: data.serverEnabled,
        maxConnections: data.maxConnections,
        syncEnabled: data.syncEnabled,
      });

      const [existingConfig] = await db
        .select()
        .from(imapConfigurations)
        .limit(1);

      if (existingConfig) {
        const updateData: Partial<typeof DEFAULT_IMAP_CONFIG> = {};
        if (data.serverEnabled !== undefined) {
          updateData.serverEnabled = data.serverEnabled;
        }
        if (data.maxConnections !== undefined) {
          updateData.maxConnections = data.maxConnections;
        }
        if (data.connectionTimeout !== undefined) {
          updateData.connectionTimeout = data.connectionTimeout;
        }
        if (data.syncEnabled !== undefined) {
          updateData.syncEnabled = data.syncEnabled;
        }
        if (data.syncInterval !== undefined) {
          updateData.syncInterval = data.syncInterval;
        }
        if (data.batchSize !== undefined) {
          updateData.batchSize = data.batchSize;
        }
        if (data.loggingLevel !== undefined) {
          updateData.loggingLevel = data.loggingLevel;
        }

        await db
          .update(imapConfigurations)
          .set({
            ...updateData,
            updatedAt: new Date(),
          })
          .where(eq(imapConfigurations.id, existingConfig.id));

        logger.vibe("📧 IMAP config updated successfully", {
          configId: existingConfig.id,
          changesCount: Object.keys(updateData).length - 1, // -1 for updatedAt
        });
      } else {
        const newConfig = {
          ...DEFAULT_IMAP_CONFIG,
          ...data,
        };

        await db.insert(imapConfigurations).values(newConfig);

        logger.vibe("📧 IMAP config created with defaults", {
          serverEnabled: newConfig.serverEnabled,
          maxConnections: newConfig.maxConnections,
        });
      }

      return createSuccessResponse({
        success: true,
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
      await db.insert(imapConfigurations).values(DEFAULT_IMAP_CONFIG);
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
