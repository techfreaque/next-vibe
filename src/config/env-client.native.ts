/* eslint-disable no-console */
/* eslint-disable i18next/no-literal-string */
import Constants from 'expo-constants';
import {
  Environment,
} from "next-vibe/shared/utils/env-util";

import type { EnvFrontend } from "@/config/env-client";

// React Native global type
declare const __DEV__: boolean;

// Platform detection for React Native
const isServer = false; // React Native is always client-side
const isReactNative = true;
const isBrowser = false;

const platform = {
  isServer,
  isReactNative,
  isBrowser,
};

// Get dev server IP from Expo config with null checks
const devServerIp =
  Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";

// Export validated environment for use throughout the application
export const envClient: EnvFrontend = {
  // Access environment variables from React Native's environment
  // These should be configured in the React Native app (e.g., via react-native-config or expo-constants)
  NODE_ENV: Environment.DEVELOPMENT,
  NEXT_PUBLIC_APP_URL: `http://${devServerIp}:3000`,
  NEXT_PUBLIC_TEST_SERVER_URL: `http://${devServerIp}:3000`,
  NEXT_PUBLIC_DEBUG_PRODUCTION: false,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "dfgdfg",
  NEXT_PUBLIC_SUPPORT_EMAIL_DE: "dfg",
  NEXT_PUBLIC_SUPPORT_EMAIL_PL: "dfg",
  NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL: "dfgd",
  platform,
} 
// // Export validated environment for use throughout the application
// export const envClient: EnvFrontend = validateEnv(
//   {
//     // Access environment variables from React Native's environment
//     // These should be configured in the React Native app (e.g., via react-native-config or expo-constants)
//     NODE_ENV: "development",
//     NEXT_PUBLIC_APP_URL: "http://localhost:3000",
//     NEXT_PUBLIC_TEST_SERVER_URL: "http://localhost:3000",
//     NEXT_PUBLIC_DEBUG_PRODUCTION: "false",
//     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "dfgdfg",
//     NEXT_PUBLIC_SUPPORT_EMAIL_DE: "dfg",
//     NEXT_PUBLIC_SUPPORT_EMAIL_PL: "dfg",
//     NEXT_PUBLIC_SUPPORT_EMAIL_GLOBAL: "dfgd",
//     platform,
//   } as EnvFrontendInput,
//   envClientSchema,
//   envValidationLogger,
// );
