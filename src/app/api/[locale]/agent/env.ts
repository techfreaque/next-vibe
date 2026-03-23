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

// Base fields shared by both storage types
const baseFields = {
  CLAUDE_CODE_ENABLED: {
    schema: z
      .string()
      .optional()
      .transform((v) => {
        if (v === "true") {
          return true;
        }
        if (v === "false") {
          return false;
        }
        // Auto-detect: check if `claude` CLI is available
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { execSync } = require("node:child_process") as {
            execSync: (
              cmd: string,
              opts: { stdio: string; timeout: number },
            ) => void;
          };
          execSync("claude --version", { stdio: "ignore", timeout: 3000 });
          return true;
        } catch {
          return false;
        }
      }),
    example: "true",
    comment:
      "Claude Code provider enabled - set true/false to override, or leave unset for auto-detection (checks if `claude` CLI is installed)",
    commented: true,
    fieldType: "boolean" as const,
    onboardingStep: 4,
    onboardingGroup: "ai",
  },
  OPENROUTER_API_KEY: {
    schema: z.string().optional(),
    example: "sk-or-v1-...",
    comment:
      "OpenRouter API key - access 200+ AI models. Get yours at https://openrouter.ai/keys",
    commented: true,
    sensitive: true,
    onboardingRequired: true,
    onboardingStep: 4,
    onboardingGroup: "ai",
  },
  UNCENSORED_AI_API_KEY: {
    schema: z.string().optional(),
    example: "your-uncensored-ai-key",
    comment: "Uncensored AI API key",
    commented: true,
    sensitive: true,
    onboardingStep: 4,
    onboardingGroup: "ai",
  },
  FREEDOMGPT_API_KEY: {
    schema: z.string().optional(),
    example: "your-freedomgpt-key",
    comment: "FreedomGPT API key",
    commented: true,
    sensitive: true,
    onboardingStep: 4,
    onboardingGroup: "ai",
  },
  GAB_AI_API_KEY: {
    schema: z.string().optional(),
    example: "your-gab-ai-key",
    comment: "Gab AI API key",
    commented: true,
    sensitive: true,
    onboardingStep: 4,
    onboardingGroup: "ai",
  },
  VENICE_AI_API_KEY: {
    schema: z.string().optional(),
    example: "your-venice-ai-key",
    comment: "Venice AI API key - get yours at https://venice.ai",
    commented: true,
    sensitive: true,
    onboardingStep: 4,
    onboardingGroup: "ai",
  },
  EDEN_AI_API_KEY: {
    schema: z.string().optional(),
    example: "your-eden-ai-key",
    comment:
      "Eden AI API key (voice/TTS) - get yours at https://app.edenai.run/user/settings#api",
    commented: true,
  },
  BRAVE_SEARCH_API_KEY: {
    schema: z.string().optional(),
    example: "your-brave-search-key",
    comment:
      "Brave Search API key - get yours at https://api.search.brave.com/app/keys",
    commented: true,
  },
  KAGI_API_KEY: {
    schema: z.string().optional(),
    example: "your-kagi-api-key",
    comment: "Kagi API key - get yours at https://kagi.com/settings?p=api",
    commented: true,
  },
  SCRAPPEY_API_KEY: {
    schema: z.string().optional(),
    example: "your-scrappey-key",
    comment: "Scrappey API key",
    commented: true,
  },
} as const;

// S3 storage specific fields
const s3Fields = {
  CHAT_STORAGE_TYPE: {
    schema: z.literal("s3"),
    example: "s3",
    comment: "Storage type - S3",
    fieldType: "select",
    options: ["filesystem", "s3"],
  },
  S3_ENDPOINT: {
    schema: z.string().min(1),
    example: "https://s3.amazonaws.com",
    comment: "S3 endpoint URL",
    commented: true,
    fieldType: "url",
  },
  S3_REGION: {
    schema: z.string().min(1),
    example: "us-east-1",
    comment: "S3 region",
    commented: true,
  },
  S3_BUCKET: {
    schema: z.string().min(1),
    example: "my-chat-bucket",
    comment: "S3 bucket name",
    commented: true,
  },
  S3_ACCESS_KEY_ID: {
    schema: z.string().min(1),
    example: "AKIAIOSFODNN7EXAMPLE",
    comment: "S3 access key ID",
    commented: true,
  },
  S3_SECRET_ACCESS_KEY: {
    schema: z.string().min(1),
    example: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    comment: "S3 secret access key",
    commented: true,
  },
  S3_PUBLIC_URL_BASE: {
    schema: z.string().optional(),
    example: "https://cdn.example.com",
    comment: "Optional public URL base for S3 objects",
    commented: true,
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
    fieldType: "select",
    options: ["filesystem", "s3"],
  },
  CHAT_STORAGE_PATH: {
    schema: z.string().min(1).default("./chat-data"),
    example: "./chat-data",
    comment: "Filesystem path for chat data",
  },
  S3_ENDPOINT: {
    schema: z.string().optional(),
    example: "https://s3.amazonaws.com",
    comment: "Not used with filesystem storage",
    commented: true,
  },
  S3_REGION: {
    schema: z.string().optional(),
    example: "us-east-1",
    comment: "Not used with filesystem storage",
    commented: true,
  },
  S3_BUCKET: {
    schema: z.string().optional(),
    example: "my-bucket",
    comment: "Not used with filesystem storage",
    commented: true,
  },
  S3_ACCESS_KEY_ID: {
    schema: z.string().optional(),
    example: "AKIAIOSFODNN7EXAMPLE",
    comment: "Not used with filesystem storage",
    commented: true,
  },
  S3_SECRET_ACCESS_KEY: {
    schema: z.string().optional(),
    example: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    comment: "Not used with filesystem storage",
    commented: true,
  },
  S3_PUBLIC_URL_BASE: {
    schema: z.string().optional(),
    example: "https://cdn.example.com",
    comment: "Not used with filesystem storage",
    commented: true,
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
