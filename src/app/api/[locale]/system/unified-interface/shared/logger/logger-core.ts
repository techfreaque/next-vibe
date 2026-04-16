/**
 * Logger Core
 * Shared implementation for both server and client loggers.
 * All formatting, timing, MCP mode, and file logging logic lives here.
 * Persistence is injected via the onPersist callback.
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  enableDebugLogger,
  isFileLoggingEnabled,
  mcpSilentMode,
} from "@/config/debug";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger, ErrorLogLevel, LoggerMetadata } from "./endpoint";
import { colors, maybeColorize, semantic } from "./colors";

// Lazy import keeps file-logger (which uses node:fs + process.cwd()) out of
// the static module graph so Turbopack's NFT tracer doesn't scan next.config.ts.
const _fl = (): Promise<{
  fileLog: (
    message: string,
    data?: Record<string, LoggerMetadata>,
  ) => Promise<void>;
  devFileLog: (
    message: string,
    data?: Record<string, LoggerMetadata>,
  ) => Promise<void>;
  startFileLog: (
    message: string,
    data?: Record<string, LoggerMetadata>,
  ) => Promise<void>;
}> => import("./file-logger");

function writeToFile(
  message: string,
  data?: Record<string, LoggerMetadata>,
): void {
  void _fl().then(({ fileLog }) => fileLog(message, data));
}

function serializeDebugMeta(meta: LoggerMetadata[]): string {
  if (meta.length === 0) {
    return "";
  }
  return ` ${meta
    .map((m) => {
      if (m === null || m === undefined) {
        return "";
      }
      if (typeof m === "string") {
        return m;
      }
      if (typeof m === "number" || typeof m === "boolean") {
        return String(m);
      }
      try {
        return JSON.stringify(m);
      } catch {
        return String(m);
      }
    })
    .filter(Boolean)
    .join(" ")}`;
}

export type PersistFn = (
  level: ErrorLogLevel,
  message: string,
  error: LoggerMetadata | undefined,
  metadata: LoggerMetadata[],
) => void;

export function createLogger(
  debugEnabled = false,
  startTime: number = Date.now(),
  locale: CountryLanguage,
  onPersist?: PersistFn,
): EndpointLogger {
  const isProduction = process.env["NODE_ENV"] === "production";
  const noTimePrefix = !!process.env["NEXT_RUNTIME"];

  const getTimePrefix = (): string => {
    if (isProduction) {
      return new Date().toISOString().slice(11, 23);
    }
    return `${((Date.now() - startTime) / 1000).toFixed(3)}s`;
  };

  const fmt = (message: string): string =>
    noTimePrefix ? message : `[${getTimePrefix()}] ${message}`;

  return {
    info(message: string, ...metadata: LoggerMetadata[]): void {
      const metadataObj = metadata.length > 0 ? { metadata } : undefined;
      if (mcpSilentMode) {
        if (!(debugEnabled || enableDebugLogger)) {
          return;
        }
        writeToFile(`[INFO] ${fmt(message)}`, metadataObj);
      } else {
        // oxlint-disable-next-line no-console
        console.log(fmt(message), ...metadata);
      }
      if (isFileLoggingEnabled()) {
        void _fl().then(({ devFileLog, startFileLog }) =>
          Promise.all([
            devFileLog(fmt(message), metadataObj),
            startFileLog(fmt(message), metadataObj),
          ]),
        );
      }
    },

    error(
      message: string,
      error?: LoggerMetadata,
      ...metadata: LoggerMetadata[]
    ): void {
      onPersist?.("error", message, error, metadata);

      const typedError = error ? parseError(error) : undefined;
      const metadataObj = {
        ...(typedError !== undefined && { error: typedError }),
        ...(metadata.length > 0 && { metadata }),
      };
      const hasMetadata = Object.keys(metadataObj).length > 0;

      if (mcpSilentMode) {
        if (!(debugEnabled || enableDebugLogger)) {
          return;
        }
        writeToFile(
          `[ERROR] ${fmt(message)}`,
          hasMetadata ? metadataObj : undefined,
        );
      } else {
        // oxlint-disable-next-line no-console
        console.error(fmt(message), error, ...metadata, locale);
      }
      if (isFileLoggingEnabled()) {
        void _fl().then(({ devFileLog, startFileLog }) =>
          Promise.all([
            devFileLog(fmt(message), hasMetadata ? metadataObj : undefined),
            startFileLog(fmt(message), hasMetadata ? metadataObj : undefined),
          ]),
        );
      }
    },

    warn(message: string, ...metadata: LoggerMetadata[]): void {
      onPersist?.("warn", message, undefined, metadata);

      const metadataObj = metadata.length > 0 ? { metadata } : undefined;
      if (mcpSilentMode) {
        if (!(debugEnabled || enableDebugLogger)) {
          return;
        }
        writeToFile(`[WARN] ${fmt(message)}`, metadataObj);
      } else {
        // oxlint-disable-next-line no-console
        console.warn(fmt(message), ...metadata, locale);
      }
      if (isFileLoggingEnabled()) {
        void _fl().then(({ devFileLog, startFileLog }) =>
          Promise.all([
            devFileLog(fmt(message), metadataObj),
            startFileLog(fmt(message), metadataObj),
          ]),
        );
      }
    },

    vibe(message: string, ...metadata: LoggerMetadata[]): void {
      const metadataObj = metadata.length > 0 ? { metadata } : undefined;
      if (mcpSilentMode) {
        if (!(debugEnabled || enableDebugLogger)) {
          return;
        }
        writeToFile(`[VIBE] [${getTimePrefix()}] ${message}`, metadataObj);
      } else {
        const prefix = noTimePrefix ? "" : `[${getTimePrefix()}] `;
        // oxlint-disable-next-line no-console
        console.log(`${prefix}${message}`, ...metadata);
      }
      if (isFileLoggingEnabled()) {
        const prefix = noTimePrefix ? "" : `[${getTimePrefix()}] `;
        void _fl().then(({ devFileLog, startFileLog }) =>
          Promise.all([
            devFileLog(`${prefix}${message}`, metadataObj),
            startFileLog(`${prefix}${message}`, metadataObj),
          ]),
        );
      }
    },

    debug(message: string, ...metadata: LoggerMetadata[]): void {
      if (!(debugEnabled || enableDebugLogger)) {
        return;
      }
      const metadataObj = metadata.length > 0 ? { metadata } : undefined;
      if (mcpSilentMode) {
        writeToFile(`[DEBUG] ${fmt(message)}`, metadataObj);
      } else {
        const meta = serializeDebugMeta(metadata);
        const timeTag = noTimePrefix
          ? ""
          : `${colors.dim}[${getTimePrefix()}]${colors.reset} `;
        // oxlint-disable-next-line no-console
        console.log(
          `${timeTag}${maybeColorize(`${message}${meta}`, semantic.debug)}`,
        );
      }
      if (isFileLoggingEnabled()) {
        const meta = serializeDebugMeta(metadata);
        const timeTag = noTimePrefix ? "" : `[${getTimePrefix()}] `;
        void _fl().then(({ devFileLog, startFileLog }) =>
          Promise.all([
            devFileLog(`${timeTag}${message}${meta}`, metadataObj),
            startFileLog(`${timeTag}${message}${meta}`, metadataObj),
          ]),
        );
      }
    },

    isDebugEnabled: debugEnabled || enableDebugLogger,
  };
}
