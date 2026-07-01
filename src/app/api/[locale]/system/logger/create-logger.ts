/**
 * Logger Core
 * Shared implementation for both server and client loggers.
 * All formatting and console output lives here.
 * File logging and DB persistence are injected via callbacks so this file
 * stays free of node:fs and server-only imports — safe to bundle on the client.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type {
  EndpointLogger,
  ErrorLogLevel,
  LoggerMetadata,
} from "next-vibe/logger/types";

import { colors, maybeColorize, semantic } from "./colors";
import { enableDebugLogger, mcpSilentMode } from "./debug";

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
  locale: CountryLanguage,
) => void;

export type FileLogFn = (
  message: string,
  data?: Record<string, LoggerMetadata>,
) => void;

export function formatLogPrefix(
  startTime = Number(process.env["VIBE_START_TIME"] ?? Date.now()),
): string {
  if (process.env["NEXT_RUNTIME"]) {
    return "";
  }
  if (process.env["VIBE_LOG_TIMESTAMP"] === "iso") {
    return `[${new Date().toISOString().slice(11, 23)}] `;
  }
  return `[${((Date.now() - startTime) / 1000).toFixed(3)}s] `;
}

export function createLogger(
  debugEnabled = false,
  locale: CountryLanguage,
  onPersist?: PersistFn,
  onFileLog?: FileLogFn,
): EndpointLogger {
  const startTime = Number(process.env["VIBE_START_TIME"] ?? Date.now());
  const noTimePrefix = !!process.env["NEXT_RUNTIME"];

  const getTimePrefix = (): string => {
    if (process.env["VIBE_LOG_TIMESTAMP"] === "iso") {
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
        onFileLog?.(`[INFO] ${fmt(message)}`, metadataObj);
        return;
      }
      // oxlint-disable-next-line no-console
      console.log(fmt(message), ...metadata);
      onFileLog?.(fmt(message), metadataObj);
    },

    error(
      message: string,
      error?: LoggerMetadata,
      ...metadata: LoggerMetadata[]
    ): void {
      onPersist?.("error", message, error, metadata, locale);

      const typedError = error ? parseError(error) : undefined;
      const metadataObj = {
        ...(typedError !== undefined && { error: typedError }),
        ...(metadata.length > 0 && { metadata }),
      };
      const hasMetadata = Object.keys(metadataObj).length > 0;

      if (mcpSilentMode) {
        onFileLog?.(
          `[ERROR] ${fmt(message)}`,
          hasMetadata ? metadataObj : undefined,
        );
        return;
      }
      // oxlint-disable-next-line no-console
      console.error(
        fmt(message),
        ...(error !== undefined ? [error] : []),
        ...metadata,
      );
      onFileLog?.(fmt(message), hasMetadata ? metadataObj : undefined);
    },

    warn(message: string, ...metadata: LoggerMetadata[]): void {
      onPersist?.("warn", message, undefined, metadata, locale);

      const metadataObj = metadata.length > 0 ? { metadata } : undefined;
      if (mcpSilentMode) {
        onFileLog?.(`[WARN] ${fmt(message)}`, metadataObj);
        return;
      }
      // oxlint-disable-next-line no-console
      console.warn(fmt(message), ...metadata);
      onFileLog?.(fmt(message), metadataObj);
    },

    vibe(message: string, ...metadata: LoggerMetadata[]): void {
      const metadataObj = metadata.length > 0 ? { metadata } : undefined;
      const prefix = noTimePrefix ? "" : `[${getTimePrefix()}] `;
      if (mcpSilentMode) {
        onFileLog?.(`[VIBE] ${prefix}${message}`, metadataObj);
        return;
      }
      // oxlint-disable-next-line no-console
      console.log(`${prefix}${message}`, ...metadata);
      onFileLog?.(`${prefix}${message}`, metadataObj);
    },

    debug(message: string, ...metadata: LoggerMetadata[]): void {
      if (!(debugEnabled || enableDebugLogger)) {
        return;
      }
      const metadataObj = metadata.length > 0 ? { metadata } : undefined;
      if (mcpSilentMode) {
        onFileLog?.(`[DEBUG] ${fmt(message)}`, metadataObj);
        return;
      }
      const meta = serializeDebugMeta(metadata);
      const timeTag = noTimePrefix
        ? ""
        : `${colors.dim}[${getTimePrefix()}]${colors.reset} `;
      // oxlint-disable-next-line no-console
      console.log(
        `${timeTag}${maybeColorize(`${message}${meta}`, semantic.debug)}`,
      );
      const meta2 = serializeDebugMeta(metadata);
      const timeTag2 = noTimePrefix ? "" : `[${getTimePrefix()}] `;
      onFileLog?.(`${timeTag2}${message}${meta2}`, metadataObj);
    },

    isDebugEnabled: debugEnabled || enableDebugLogger,
  };
}
