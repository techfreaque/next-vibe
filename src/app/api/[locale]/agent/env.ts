/**
 * Agent Environment
 */

import "server-only";

import { validateEnv } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

import { envValidationLogger } from "@/app/api/[locale]/system/unified-interface/shared/env/validation-logger";

const baseEnvSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(1),
  UNCENSORED_AI_API_KEY: z.string(),
  FREEDOMGPT_API_KEY: z.string(),
  GAB_AI_API_KEY: z.string(),
  EDEN_AI_API_KEY: z.string().min(1),
  BRAVE_SEARCH_API_KEY: z.string(),
});

const s3StorageSchema = baseEnvSchema.extend({
  CHAT_STORAGE_TYPE: z.literal("s3"),
  S3_ENDPOINT: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  S3_PUBLIC_URL_BASE: z.string().optional(),
  CHAT_STORAGE_PATH: z.string().optional(),
});

const filesystemStorageSchema = baseEnvSchema.extend({
  CHAT_STORAGE_TYPE: z.literal("filesystem"),
  CHAT_STORAGE_PATH: z.string().min(1),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_PUBLIC_URL_BASE: z.string().optional(),
});

const agentEnvSchema = z.discriminatedUnion("CHAT_STORAGE_TYPE", [
  s3StorageSchema,
  filesystemStorageSchema,
]);

export const agentEnv = validateEnv(process.env, agentEnvSchema, envValidationLogger);
