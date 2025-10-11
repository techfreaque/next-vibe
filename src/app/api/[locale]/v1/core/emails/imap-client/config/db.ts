/**
 * IMAP Client Configuration Database Schema
 * Database tables for IMAP configuration
 */

import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { ImapLoggingLevel, ImapLoggingLevelDB } from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * IMAP Client Configuration Database Schema
 * Database tables for IMAP configuration
 */

import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { ImapLoggingLevel, ImapLoggingLevelDB } from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * IMAP Configuration Table
 * Stores IMAP server configuration settings
 */
export const imapConfigurations = pgTable("imap_configurations", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Server settings
  serverEnabled: boolean("server_enabled").notNull().default(true),
  maxConnections: integer("max_connections").notNull().default(100),
  connectionTimeout: integer("connection_timeout").notNull().default(30000),
  poolIdleTimeout: integer("pool_idle_timeout").notNull().default(300000),
  keepAlive: boolean("keep_alive").notNull().default(true),

  // Sync settings
  syncEnabled: boolean("sync_enabled").notNull().default(true),
  syncInterval: integer("sync_interval").notNull().default(300),
  batchSize: integer("batch_size").notNull().default(50),
  maxMessages: integer("max_messages").notNull().default(1000),
  concurrentAccounts: integer("concurrent_accounts").notNull().default(5),

  // Performance settings
  cacheEnabled: boolean("cache_enabled").notNull().default(true),
  cacheTtl: integer("cache_ttl").notNull().default(300000),
  cacheMaxSize: integer("cache_max_size").notNull().default(1000),
  memoryThreshold: integer("memory_threshold").notNull().default(80),

  // Resilience settings
  maxRetries: integer("max_retries").notNull().default(3),
  retryDelay: integer("retry_delay").notNull().default(1000),
  circuitBreakerThreshold: integer("circuit_breaker_threshold")
    .notNull()
    .default(5),
  circuitBreakerTimeout: integer("circuit_breaker_timeout")
    .notNull()
    .default(60000),

  // Monitoring settings
  healthCheckInterval: integer("health_check_interval")
    .notNull()
    .default(60000),
  metricsEnabled: boolean("metrics_enabled").notNull().default(true),
  loggingLevel: text("logging_level", { enum: ImapLoggingLevelDB })
    .notNull()
    .default(ImapLoggingLevel.INFO),

  // Rate limiting
  rateLimitEnabled: boolean("rate_limit_enabled").notNull().default(false),
  rateLimitRequests: integer("rate_limit_requests").notNull().default(100),
  rateLimitWindow: integer("rate_limit_window").notNull().default(60000),

  // Development settings
  debugMode: boolean("debug_mode").notNull().default(false),
  testMode: boolean("test_mode").notNull().default(false),

  // Metadata
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Zod Schemas
 */
export const selectImapConfigurationSchema =
  createSelectSchema(imapConfigurations);
export const insertImapConfigurationSchema =
  createInsertSchema(imapConfigurations);

/**
 * Type Exports
 */
export type ImapConfiguration = typeof imapConfigurations.$inferSelect;
export type NewImapConfiguration = typeof imapConfigurations.$inferInsert;
