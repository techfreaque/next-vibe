import { z } from "zod";

import { envClientSchema, EnvFrontend, EnvFrontendInput, envValidationLogger } from "@/config/env-client";
import { validateEnv } from "@/packages/next-vibe/shared/utils/env-util";

// Platform detection for React Native
const isServer = false; // React Native is always client-side
const isReactNative = true;
const isBrowser = false;

const platform = {
  isServer,
  isReactNative,
  isBrowser,
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
