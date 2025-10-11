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
  sessionRetentionDays: z.number().min(1).max(365),
  tokenRetentionDays: z.number().min(1).max(365),
  batchSize: z.number().min(1).max(1000),
  dryRun: z.boolean(),
});

export type SessionCleanupConfigType = z.infer<
  typeof sessionCleanupConfigSchema
>;

/**
 * Task Result Schema
 */
export const sessionCleanupResultSchema = z.object({
  sessionsDeleted: z.number(),
  tokensDeleted: z.number(),
  totalProcessed: z.number(),
  executionTimeMs: z.number(),
  errors: z.array(z.string()).optional(),
});

export type SessionCleanupResultType = z.infer<
  typeof sessionCleanupResultSchema
>;

/**
 * Task Execution Request Schema
 */
export const sessionCleanupRequestSchema = sessionCleanupConfigSchema;

export type SessionCleanupRequestTypeOutput = z.infer<
  typeof sessionCleanupRequestSchema
>;

/**
 * Task Execution Response Schema
 */
export const sessionCleanupResponseSchema = sessionCleanupResultSchema;

export type SessionCleanupResponseTypeOutput = z.infer<
  typeof sessionCleanupResponseSchema
>;
