/**
 * Environment Validation Logger
 * Simple logger for environment validation that works in both browser and server contexts
 */

import type { ExplicitAnyType } from "next-vibe/shared/types/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

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
