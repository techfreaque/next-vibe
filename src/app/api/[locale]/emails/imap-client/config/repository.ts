/**
 * IMAP Configuration Repository
 * Handles IMAP server configuration management
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  ConfigGetResponseOutput,
  ConfigUpdateRequestOutput,
  ConfigUpdateResponseOutput,
} from "./definition";
import { ImapLoggingLevel } from "./enum";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Default IMAP Configuration (matches API definition shape)
 */
const DEFAULT_IMAP_CONFIG = {
  host: "imap.gmail.com",
  port: 993,
  username: "",
  password: "",
  tls: true,
  autoReconnect: true,
  loggingLevel: ImapLoggingLevel.INFO,
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
  debugMode: false,
  testMode: false,
};

export interface ImapConfigRepository {
  getConfig(
    logger: EndpointLogger,
    t: ModuleT,
  ): ResponseType<ConfigGetResponseOutput>;

  updateConfig(
    data: ConfigUpdateRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
  ): ResponseType<ConfigUpdateResponseOutput>;
}

export class ImapConfigRepositoryImpl implements ImapConfigRepository {
  getConfig(
    logger: EndpointLogger,
    t: ModuleT,
  ): ResponseType<ConfigGetResponseOutput> {
    try {
      logger.debug("Getting IMAP configuration");

      // For now, return the default configuration
      // NOTE: These fields should be stored in a separate table or extend the current schema
      logger.vibe("📧 IMAP config: Using defaults", {
        host: DEFAULT_IMAP_CONFIG.host,
        port: DEFAULT_IMAP_CONFIG.port,
      });

      return success({
        ...DEFAULT_IMAP_CONFIG,
        message: t("get.response.message"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to get IMAP configuration", {
        error: parsedError.message,
      });

      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  updateConfig(
    data: ConfigUpdateRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
  ): ResponseType<ConfigUpdateResponseOutput> {
    try {
      logger.debug("Updating IMAP configuration", {
        host: data.host,
        port: data.port,
        username: data.username,
      });

      // For now, just log the update.
      // NOTE: Store in database when schema is aligned
      logger.vibe("📧 IMAP config update requested", {
        host: data.host,
        port: data.port,
      });

      return success({
        ...DEFAULT_IMAP_CONFIG,
        ...data,
        message: t("update.response.message"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update IMAP configuration", {
        error: parsedError.message,
        data,
      });

      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

export const imapConfigRepository = new ImapConfigRepositoryImpl();
