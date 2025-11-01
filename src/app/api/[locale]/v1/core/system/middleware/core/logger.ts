// oxlint-disable no-console
/* eslint-disable i18next/no-literal-string */

import { Environment } from "next-vibe/shared/utils";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { debugMiddleware } from "@/config/debug";

declare const process: {
  env: {
    NODE_ENV: Environment;
  };
  stdout: {
    write: (message: string) => boolean;
  };
  stderr: {
    write: (message: string) => boolean;
  };
};

const isProduction = process.env.NODE_ENV === Environment.PRODUCTION;

// Simple logger for middleware that doesn't use EndpointLogger
// to avoid circular dependencies and keep middleware lightweight
const logger = {
  info(message: string, ...args: Array<string | number | boolean | Record<string, string | number | boolean>>): void {
    if (isProduction) {
      return;
    }
    // Using process.stdout.write for better performance in middleware
    console.log(`[Middleware][INFO] ${message} ${args.length > 0 ? JSON.stringify(args) : ""}\n`);
  },

  debug(message: string, ...args: Array<string | number | boolean | Record<string, string | number | boolean>>): void {
    if (isProduction || !debugMiddleware) {
      return;
    }
    console.log(`[Middleware][DEBUG] ${message} ${args.length > 0 ? JSON.stringify(args) : ""}\n`);
  },

  error(message: string, error?: Error | string | Record<string, string | number>): void {
    if (isProduction) {
      // TODO: send to sentry like
      return;
    }
    const parsedError = error ? parseError(error) : "";
    console.error(`[Middleware][ERROR] ${message} ${parsedError ? JSON.stringify(parsedError) : ""}\n`);
  },
};

export function middlewareInfoLogger(
  message: string,
  ...args: Array<string | number | boolean | Record<string, string | number | boolean>>
): void {
  logger.info(message, ...args);
}

export function middlewareDebugLogger(
  message: string,
  ...args: Array<string | number | boolean | Record<string, string | number | boolean>>
): void {
  logger.debug(message, ...args);
}

export function middlewareErrorLogger(message: string, error?: Error | string | Record<string, string | number>): void {
  logger.error(message, error);
}
