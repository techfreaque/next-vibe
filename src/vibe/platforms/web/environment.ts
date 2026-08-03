/**
 * Server Environment Detection and Configuration
 * Provides centralized environment detection and configuration for the server system
 */

import "server-only";

import { coreEnv } from "../../core/env";
import { Environment } from "../../env/env-util";

/**
 * Supported server environments
 */
type ServerEnvironmentType = "development" | "production";

/**
 * Environment configuration interface
 */
interface EnvironmentConfig {
  environment: ServerEnvironmentType;
  nodeEnv: string;
  supportsTaskRunners: boolean;
  supportsHotReload: boolean;
  enableDebugLogging: boolean;
  enableTaskRunner: boolean;
  enableSeeding: boolean;
  enableMigrations: boolean;
  port: number;
  clustering: boolean;
}

/**
 * Platform information interface
 */
interface PlatformInfo {
  name: string;
  type: string;
}

/**
 * Current environment information interface
 */
interface CurrentEnvironmentInfo {
  environment: ServerEnvironmentType;
  config: EnvironmentConfig;
  isDevelopment: boolean;
  isProduction: boolean;
  nodeEnv: string;
  platform: PlatformInfo;
}

/**
 * Detect the current server environment
 */
function detectEnvironment(): ServerEnvironmentType {
  if (coreEnv.NODE_ENV === Environment.PRODUCTION) {
    return "production";
  }

  return "development";
}

/**
 * Get environment configuration for the detected environment
 */
function getEnvironmentConfig(
  environment?: ServerEnvironmentType,
): EnvironmentConfig {
  const detectedEnv = environment || detectEnvironment();

  switch (detectedEnv) {
    case "production":
      return {
        environment: "production",
        nodeEnv: "production",
        supportsTaskRunners: true,
        supportsHotReload: false,
        enableDebugLogging: false,
        enableTaskRunner: true,
        enableSeeding: true,
        enableMigrations: true,
        port: 3000,
        clustering: true,
      };

    case "development":
    default:
      return {
        environment: "development",
        nodeEnv: "development",
        supportsTaskRunners: true,
        supportsHotReload: true,
        enableDebugLogging: true,
        enableTaskRunner: true,
        enableSeeding: true,
        enableMigrations: true,
        port: 3000,
        clustering: false,
      };
  }
}

/**
 * Get platform information
 */
export function getPlatformInfo(): PlatformInfo {
  return {
    name: "Local/Server",
    type: "server",
  };
}

/**
 * Get current environment information
 */
export function getCurrentEnvironmentInfo(): CurrentEnvironmentInfo {
  const environment = detectEnvironment();
  const config = getEnvironmentConfig(environment);
  const platform = getPlatformInfo();

  return {
    environment,
    config,
    isDevelopment: environment === "development",
    isProduction: environment === "production",
    nodeEnv: coreEnv.NODE_ENV,
    platform,
  };
}
