/**
 * Session Cleanup Task Definitions
 * Defines types and schemas for session and token cleanup operations
 */

import "server-only";

import { z } from "zod";

/**
 * Task Configuration Schema
 */
export const sessionCleanupConfigSchema = z.object({
  sessionRetentionDays: z.coerce.number().min(1).max(365).default(30),
  tokenRetentionDays: z.coerce.number().min(1).max(365).default(7),
  batchSize: z.coerce.number().min(1).max(1000).default(100),
  dryRun: z.boolean().default(false),
});

export type SessionCleanupConfigType = z.output<typeof sessionCleanupConfigSchema>;

/**
 * Task Result Schema
 */
export const sessionCleanupResultSchema = z.object({
  sessionsDeleted: z.coerce.number().default(0),
  tokensDeleted: z.coerce.number().default(0),
  totalProcessed: z.coerce.number().default(0),
  executionTimeMs: z.coerce.number().default(0),
  errors: z.array(z.string()).default([]),
});

export type SessionCleanupResultType = z.output<typeof sessionCleanupResultSchema>;

/**
 * Task Execution Request Schema
 */
export const sessionCleanupRequestSchema = sessionCleanupConfigSchema;

export type SessionCleanupRequestOutput = z.output<typeof sessionCleanupRequestSchema>;

/**
 * Task Execution Response Schema
 */
export const sessionCleanupResponseSchema = sessionCleanupResultSchema;

export type SessionCleanupResponseOutput = z.output<typeof sessionCleanupResponseSchema>;
