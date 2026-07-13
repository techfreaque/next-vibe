/**
 * Environment Validation Logger
 * Simple logger for environment validation that works in both browser and server contexts
 */

import type { EndpointLogger } from "next-vibe/logger/types";

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

/**
 * Simple logger for environment validation
 * Works in both browser and server contexts
 */
export const envValidationLogger: EndpointLogger = {
  // oxlint-disable-next-line typescript/no-explicit-any
  info: (message: string, meta?: any) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (typeof window === "undefined") {
      process.stdout.write(`[ENV] ${message}${metaStr}\n`);
    }
  },
  // oxlint-disable-next-line typescript/no-explicit-any
  error: (message: string, meta?: any) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (typeof window === "undefined") {
      process.stderr.write(`[ENV] ${message}${metaStr}\n`);
    }
  },
  // oxlint-disable-next-line typescript/no-explicit-any
  debug: (message: string, meta?: any) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (typeof window === "undefined") {
      process.stdout.write(`[ENV] ${message}${metaStr}\n`);
    }
  },
  // oxlint-disable-next-line typescript/no-explicit-any
  warn: (message: string, meta?: any) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (typeof window === "undefined") {
      process.stderr.write(`[ENV] ${message}${metaStr}\n`);
    }
  },
  // oxlint-disable-next-line typescript/no-explicit-any
  vibe: (message: string, meta?: any) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (typeof window === "undefined") {
      process.stdout.write(`[ENV] ${message}${metaStr}\n`);
    }
  },
  isDebugEnabled: false,
};
