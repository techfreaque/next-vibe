/**
 * Server Environment Detection and Configuration
 * Provides centralized environment detection and configuration for the server system
 */

/* eslint-disable i18next/no-literal-string */
import "server-only";

import { Environment } from "next-vibe/shared/utils/env-util";

import { env } from "@/config/env";

import { serverSystemEnv } from "./env";

/**
 * Supported server environments
 */
export type ServerEnvironmentType = "development" | "production" | "serverless";

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  environment: ServerEnvironmentType;
  nodeEnv: string;
  supportsSideTasks: boolean;
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
export interface PlatformInfo {
  name: string;
  type: string;
  region?: string;
  url?: string;
  functionName?: string;
  site?: string;
  environment?: string;
}

/**
 * Current environment information interface
 */
export interface CurrentEnvironmentInfo {
  environment: ServerEnvironmentType;
  config: EnvironmentConfig;
  isServerless: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  nodeEnv: string;
  platform: PlatformInfo;
}

/**
 * Detect the current server environment
 */
export function detectEnvironment(): ServerEnvironmentType {
  // Check for serverless environments first
  if (isServerlessEnvironment()) {
    return "serverless";
  }

  // Check NODE_ENV
  const nodeEnv = env.NODE_ENV;
  if (nodeEnv === Environment.PRODUCTION) {
    return "production";
  }

  // Default to development
  return "development";
}

/**
 * Check if running in a serverless environment
 */
export function isServerlessEnvironment(): boolean {
  return !!(
    serverSystemEnv.VERCEL ||
    serverSystemEnv.AWS_LAMBDA_FUNCTION_NAME ||
    serverSystemEnv.NETLIFY ||
    serverSystemEnv.CLOUDFLARE_WORKERS ||
    serverSystemEnv.RAILWAY_ENVIRONMENT
  );
}

/**
 * Get environment configuration for the detected environment
 */
export function getEnvironmentConfig(environment?: ServerEnvironmentType): EnvironmentConfig {
  const detectedEnv = environment || detectEnvironment();

  switch (detectedEnv) {
    case "development":
      return {
        environment: "development",
        nodeEnv: "development",
        supportsSideTasks: true,
        supportsHotReload: true,
        enableDebugLogging: true,
        enableTaskRunner: true,
        enableSeeding: true,
        enableMigrations: true,
        port: 3000,
        clustering: false,
      };

    case "production":
      return {
        environment: "production",
        nodeEnv: "production",
        supportsSideTasks: true,
        supportsHotReload: false,
        enableDebugLogging: false,
        enableTaskRunner: true,
        enableSeeding: true,
        enableMigrations: true,
        port: 3000,
        clustering: true,
      };

    case "serverless":
      return {
        environment: "serverless",
        nodeEnv: "production",
        supportsSideTasks: false,
        supportsHotReload: false,
        enableDebugLogging: false,
        enableTaskRunner: false,
        enableSeeding: false,
        enableMigrations: false,
        port: 3000,
        clustering: false,
      };

    default:
      return {
        environment: "development",
        nodeEnv: "development",
        supportsSideTasks: true,
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
  if (serverSystemEnv.VERCEL) {
    const result: PlatformInfo = {
      name: "Vercel",
      type: "serverless",
    };
    if (serverSystemEnv.VERCEL_REGION) {
      result.region = serverSystemEnv.VERCEL_REGION;
    }
    if (serverSystemEnv.VERCEL_URL) {
      result.url = serverSystemEnv.VERCEL_URL;
    }
    return result;
  }

  if (serverSystemEnv.AWS_LAMBDA_FUNCTION_NAME) {
    return {
      name: "AWS Lambda",
      type: "serverless",
      region: serverSystemEnv.AWS_REGION,
      functionName: serverSystemEnv.AWS_LAMBDA_FUNCTION_NAME,
    };
  }

  if (serverSystemEnv.NETLIFY) {
    return {
      name: "Netlify",
      type: "serverless",
      site: serverSystemEnv.NETLIFY_SITE_NAME,
    };
  }

  if (serverSystemEnv.RAILWAY_ENVIRONMENT) {
    return {
      name: "Railway",
      type: "container",
      environment: serverSystemEnv.RAILWAY_ENVIRONMENT,
    };
  }

  // Default to local/server
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
    isServerless: environment === "serverless",
    isDevelopment: environment === "development",
    isProduction: environment === "production",
    nodeEnv: env.NODE_ENV,
    platform,
  };
}
