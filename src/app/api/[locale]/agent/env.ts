/**
 * Agent Environment
 *
 * When NEXT_PUBLIC_LOCAL_MODE is enabled (default for self-hosted installs),
 * all AI provider API keys are optional. Missing keys disable the corresponding
 * feature with user-friendly setup instructions rather than crashing on startup.
 */

import "server-only";

import { z } from "zod";

import { defineEnv } from "@/app/api/[locale]/system/unified-interface/shared/env/define-env";

// In LOCAL_MODE all AI keys are optional - the app starts without them
// and shows setup instructions instead of errors when features are used.
const isLocalMode = process.env.NEXT_PUBLIC_LOCAL_MODE !== "false";

const requiredOrOptionalString = (
  required: boolean,
): z.ZodString | z.ZodDefault<z.ZodOptional<z.ZodString>> =>
  required ? z.string().min(1) : z.string().optional().default("");

// Base fields shared by both storage types
const baseFields = {
  OPENROUTER_API_KEY: {
    schema: requiredOrOptionalString(!isLocalMode),
    example: "sk-or-v1-...",
    comment: "OpenRouter API key - get yours at https://openrouter.ai/keys",
  },
  UNCENSORED_AI_API_KEY: {
    schema: z.string().optional().default(""),
    example: "your-uncensored-ai-key",
    comment: "Uncensored AI API key",
  },
  FREEDOMGPT_API_KEY: {
    schema: z.string().optional().default(""),
    example: "your-freedomgpt-key",
    comment: "FreedomGPT API key",
  },
  GAB_AI_API_KEY: {
    schema: z.string().optional().default(""),
    example: "your-gab-ai-key",
    comment: "Gab AI API key",
  },
  VENICE_AI_API_KEY: {
    schema: z.string().optional().default(""),
    example: "your-venice-ai-key",
    comment: "Venice AI API key - get yours at https://venice.ai",
  },
  EDEN_AI_API_KEY: {
    schema: requiredOrOptionalString(!isLocalMode),
    example: "your-eden-ai-key",
    comment:
      "Eden AI API key (voice/TTS) - get yours at https://app.edenai.run/user/settings#api",
  },
  BRAVE_SEARCH_API_KEY: {
    schema: z.string().optional().default(""),
    example: "your-brave-search-key",
    comment:
      "Brave Search API key - get yours at https://api.search.brave.com/app/keys",
  },
  KAGI_API_KEY: {
    schema: z.string().optional().default(""),
    example: "your-kagi-api-key",
    comment: "Kagi API key - get yours at https://kagi.com/settings?p=api",
  },
  SCRAPPEY_API_KEY: {
    schema: z.string().optional().default(""),
    example: "your-scrappey-key",
    comment: "Scrappey API key",
  },
} as const;

// S3 storage specific fields
const s3Fields = {
  CHAT_STORAGE_TYPE: {
    schema: z.literal("s3"),
    example: "s3",
    comment: "Storage type - S3",
  },
  S3_ENDPOINT: {
    schema: z.string().min(1),
    example: "https://s3.amazonaws.com",
    comment: "S3 endpoint URL",
  },
  S3_REGION: {
    schema: z.string().min(1),
    example: "us-east-1",
    comment: "S3 region",
  },
  S3_BUCKET: {
    schema: z.string().min(1),
    example: "my-chat-bucket",
    comment: "S3 bucket name",
  },
  S3_ACCESS_KEY_ID: {
    schema: z.string().min(1),
    example: "AKIAIOSFODNN7EXAMPLE",
    comment: "S3 access key ID",
  },
  S3_SECRET_ACCESS_KEY: {
    schema: z.string().min(1),
    example: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    comment: "S3 secret access key",
  },
  S3_PUBLIC_URL_BASE: {
    schema: z.string().optional(),
    example: "https://cdn.example.com",
    comment: "Optional public URL base for S3 objects",
  },
  CHAT_STORAGE_PATH: {
    schema: z.string().optional(),
    example: "chat-data/",
    comment: "Optional path prefix in S3",
  },
} as const;

// Filesystem storage specific fields
const filesystemFields = {
  CHAT_STORAGE_TYPE: {
    schema: z.literal("filesystem"),
    example: "filesystem",
    comment: "Storage type - Filesystem",
  },
  CHAT_STORAGE_PATH: {
    schema: z.string().min(1),
    example: "/var/lib/chat-data",
    comment: "Filesystem path for chat data",
  },
  S3_ENDPOINT: {
    schema: z.string().optional(),
    example: "https://s3.amazonaws.com",
    comment: "Not used with filesystem storage",
  },
  S3_REGION: {
    schema: z.string().optional(),
    example: "us-east-1",
    comment: "Not used with filesystem storage",
  },
  S3_BUCKET: {
    schema: z.string().optional(),
    example: "my-bucket",
    comment: "Not used with filesystem storage",
  },
  S3_ACCESS_KEY_ID: {
    schema: z.string().optional(),
    example: "AKIAIOSFODNN7EXAMPLE",
    comment: "Not used with filesystem storage",
  },
  S3_SECRET_ACCESS_KEY: {
    schema: z.string().optional(),
    example: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    comment: "Not used with filesystem storage",
  },
  S3_PUBLIC_URL_BASE: {
    schema: z.string().optional(),
    example: "https://cdn.example.com",
    comment: "Not used with filesystem storage",
  },
} as const;

export const {
  env: agentEnv,
  schema: agentEnvSchema,
  examples: agentEnvExamples,
} = defineEnv({
  discriminator: "CHAT_STORAGE_TYPE",
  variants: {
    filesystem: { ...baseFields, ...filesystemFields },
    s3: { ...baseFields, ...s3Fields },
  },
});
