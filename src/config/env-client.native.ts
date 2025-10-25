/* eslint-disable no-console */
/* eslint-disable i18next/no-literal-string */
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EnvFrontend, EnvFrontendInput } from "@/config/env-client";
import { envClientSchema } from "@/config/env-client";
import type { ExplicitAnyType } from "next-vibe/shared/types/utils";
import { validateEnv } from "next-vibe/shared/utils/env-util";

// Platform detection for React Native
const isServer = false; // React Native is always client-side
const isReactNative = true;
const isBrowser = false;

const platform = {
  isServer,
  isReactNative,
  isBrowser,
};

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
