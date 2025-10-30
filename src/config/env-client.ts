/* eslint-disable no-console */

import type { ExplicitAnyType } from "next-vibe/shared/types/utils";
import { Environment, validateEnv } from "next-vibe/shared/utils/env-util";
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

const isServer = typeof window === "undefined";
const isReactNative = false;
const isBrowser = !isServer && !!window.document;

const platform = {
  isServer,
  isReactNative,
  isBrowser,
};

// We intentionally disable process at the type level for react native and validation
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
  stdout: {
    write: (message: string) => boolean;
  };
  stderr: {
    write: (message: string) => boolean;
  };
};

export const envClientSchema = z.object({
  platform: z.object({
    isServer: z.boolean(),
    isReactNative: z.boolean(),
    isBrowser: z.boolean(),
  }),
  NODE_ENV: z.enum(Environment),
  NEXT_PUBLIC_APP_URL: z.string(),
  NEXT_PUBLIC_TEST_SERVER_URL: z.string(),
  NEXT_PUBLIC_DEBUG_PRODUCTION: z.string().transform((val: string): boolean => {
    if (val === "true") {
      return true;
    }
    if (val === "false") {
      return false;
    }

    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Environment validation needs to throw for invalid configuration at startup
    throw new Error(
      `The env NEXT_PUBLIC_DEBUG_PRODUCTION must be a boolean, received: ${val}`,
    );
  }),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPPORT_EMAIL_DE: z.email(),
  NEXT_PUBLIC_SUPPORT_EMAIL_PL: z.email(),
  NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL: z.email(),
});

export type EnvFrontend = z.infer<typeof envClientSchema>;
export type EnvFrontendInput = z.input<typeof envClientSchema>;

// Simple logger for environment validation to avoid circular dependencies
// Uses process streams directly for better performance
export const envValidationLogger: EndpointLogger = {
  info: (message: string, meta?: ExplicitAnyType) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (typeof window === "undefined") {
      process.stdout.write(`[ENV] ${message}${metaStr}\n`);
    }
  },
  error: (message: string, meta?: ExplicitAnyType) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (typeof window === "undefined") {
      process.stderr.write(`[ENV] ${message}${metaStr}\n`);
    }
  },
  debug: (message: string, meta?: ExplicitAnyType) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (typeof window === "undefined") {
      process.stdout.write(`[ENV] ${message}${metaStr}\n`);
    }
  },
  warn: (message: string, meta?: ExplicitAnyType) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (typeof window === "undefined") {
      process.stderr.write(`[ENV] ${message}${metaStr}\n`);
    }
  },
  vibe: (message: string, meta?: ExplicitAnyType) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (typeof window === "undefined") {
      process.stdout.write(`[ENV] ${message}${metaStr}\n`);
    }
  },
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
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPPORT_EMAIL_DE: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_DE,
    NEXT_PUBLIC_SUPPORT_EMAIL_PL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL_PL,
    NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL:
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL,
  } as EnvFrontendInput,
  envClientSchema,
  envValidationLogger,
);
