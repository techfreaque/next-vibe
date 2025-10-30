/* eslint-disable no-console */
/* eslint-disable i18next/no-literal-string */
import type { ExplicitAnyType } from "next-vibe/shared/types/utils";
import { validateEnv } from "next-vibe/shared/utils/env-util";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { EnvFrontend, EnvFrontendInput } from "@/config/env-client";
import { envClientSchema } from "@/config/env-client";

// Platform detection for React Native
const isServer = false; // React Native is always client-side
const isReactNative = true;
const isBrowser = false;

const platform = {
  isServer,
  isReactNative,
  isBrowser,
};

// Simple logger for environment validation to avoid circular dependencies
// React Native environment - keeping simple logging for development
export const envValidationLogger: EndpointLogger = {
  info: (message: string, meta?: ExplicitAnyType) => {
    if (__DEV__) {
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
      // In React Native, we use LogBox-friendly logging
      // eslint-disable-next-line no-console
      console.log(`[ENV] ${message}${metaStr}`);
    }
  },
  error: (message: string, meta?: ExplicitAnyType) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    // eslint-disable-next-line no-console
    console.error(`[ENV] ${message}${metaStr}`);
  },
  debug: (message: string, meta?: ExplicitAnyType) => {
    if (__DEV__) {
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
      // eslint-disable-next-line no-console
      console.log(`[ENV] ${message}${metaStr}`);
    }
  },
  warn: (message: string, meta?: ExplicitAnyType) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    // eslint-disable-next-line no-console
    console.warn(`[ENV] ${message}${metaStr}`);
  },
  vibe: (message: string, meta?: ExplicitAnyType) => {
    if (__DEV__) {
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
      // eslint-disable-next-line no-console
      console.log(`[ENV] ${message}${metaStr}`);
    }
  },
  isDebugEnabled: __DEV__,
};

// Export validated environment for use throughout the application
export const envClient: EnvFrontend = validateEnv(
  {
    // Access environment variables from React Native's environment
    // These should be configured in the React Native app (e.g., via react-native-config or expo-constants)
    NODE_ENV: "development",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    NEXT_PUBLIC_TEST_SERVER_URL: "http://localhost:3000",
    NEXT_PUBLIC_DEBUG_PRODUCTION: "false",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "dfgdfg",
    NEXT_PUBLIC_SUPPORT_EMAIL_DE: "dfg",
    NEXT_PUBLIC_SUPPORT_EMAIL_PL: "dfg",
    NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL: "dfgd",
    platform,
  } as EnvFrontendInput,
  envClientSchema,
  envValidationLogger,
);
