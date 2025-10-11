/* eslint-disable no-console */
/* eslint-disable node/no-process-env */
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

import type { ExplicitAnyType } from "../shared/types/utils";
import { Environment, validateEnv } from "../shared/utils/env-util";

const isServer = typeof window === "undefined";
const isReactNative = !isServer && !window.document;
const isBrowser = !isServer && !!window.document;

const platform = {
  isServer,
  isReactNative,
  isBrowser,
};

export const envClientBaseSchema = z.object({
  NODE_ENV: z.nativeEnum(Environment),
  NEXT_PUBLIC_APP_URL: z.string(),
  NEXT_PUBLIC_TEST_SERVER_URL: z.string(),
  NEXT_PUBLIC_DEBUG_PRODUCTION: z.string().transform((val: string): boolean => {
    if (val === "true") {
      return true;
    }
    if (val === "false") {
      return false;
    }

    // eslint-disable-next-line no-restricted-syntax
    throw new Error(
      `The env NEXT_PUBLIC_DEBUG_PRODUCTION must be a boolean, received: ${val}`,
    );
  }),
});

export const envClientSchema = envClientBaseSchema.extend({
  platform: z.object({
    isServer: z.boolean(),
    isReactNative: z.boolean(),
    isBrowser: z.boolean(),
  }),
});

export type EnvFrontend = z.infer<typeof envClientSchema>;
export type EnvFrontendInput = z.input<typeof envClientSchema>;

// Simple console logger for environment validation to avoid circular dependencies
export const envValidationLogger: EndpointLogger = {
  info: (message: string, meta?: ExplicitAnyType) =>
    console.log(`[ENV] ${message}`, meta || ""),
  error: (message: string, meta?: ExplicitAnyType) =>
    console.error(`[ENV] ${message}`, meta || ""),
  debug: (message: string, meta?: ExplicitAnyType) =>
    console.log(`[ENV] ${message}`, meta || ""),
  warn: (message: string, meta?: ExplicitAnyType) =>
    console.warn(`[ENV] ${message}`, meta || ""),
  vibe: (message: string, meta?: ExplicitAnyType) =>
    console.log(`[ENV] ${message}`, meta || ""),
  isDebugEnabled: false,
};

// Export validated environment for use throughout the application
export const envClient: EnvFrontend = validateEnv(
  {
    // explicitly use env variables so next.js can replace them
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_TEST_SERVER_URL: process.env.NEXT_PUBLIC_TEST_SERVER_URL,
    NEXT_PUBLIC_DEBUG_PRODUCTION: process.env.NEXT_PUBLIC_DEBUG_PRODUCTION,
    platform,
  } as EnvFrontendInput,
  envClientSchema,
  envValidationLogger,
);
