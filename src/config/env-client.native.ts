/* eslint-disable i18next/no-literal-string */
import Constants from "expo-constants";
import { Environment } from "next-vibe/shared/utils/env-util";

import type { EnvClient } from "@/config/env-client";

// React Native global type
declare const __DEV__: boolean;

// Platform detection for React Native (exported separately)
const isServer = false;
const isReactNative = true;
const isBrowser = false;

export const platform = {
  isServer,
  isReactNative,
  isBrowser,
};

// Get dev server IP from Expo config
const devServerIp = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";

/**
 * React Native client environment
 */
export const envClient: EnvClient = {
  NODE_ENV: __DEV__ ? Environment.DEVELOPMENT : Environment.PRODUCTION,
  NEXT_PUBLIC_APP_URL: `http://${devServerIp}:3000`,
  NEXT_PUBLIC_TEST_SERVER_URL: `http://${devServerIp}:3000`,
  NEXT_PUBLIC_DEBUG_PRODUCTION: false,
};
