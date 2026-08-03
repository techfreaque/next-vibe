/**
 * Logger Core
 * Shared implementation for both server and client loggers.
 * All formatting and console output lives here.
 * File logging and DB persistence are injected via callbacks so this file
 * stays free of node:fs and server-only imports — safe to bundle on the client.
 */

import type { CountryLanguage } from "../core/i18n/core/config";
import { parseError } from "../core/utils/parse-error";

import { colors, maybeColorize, semantic } from "./colors";
import { enableDebugLogger, mcpSilentMode } from "./debug";
import type { EndpointLogger, ErrorLogLevel, LoggerMetadata } from "./types";

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

type PersistFn = (
  level: ErrorLogLevel,
  message: string,
  error: LoggerMetadata | undefined,
  metadata: LoggerMetadata[],
  locale: CountryLanguage,
) => void;

type FileLogFn = (
  message: string,
  data?: Record<string, LoggerMetadata>,
) => void;

function getTimePrefix(): string {
  if (process.env["VIBE_LOG_TIMESTAMP"] === "iso") {
    return new Date().toISOString().slice(11, 23);
  }
  const totalSec = (Date.now() - Number(process.env["VIBE_START_TIME"])) / 1000;
  if (totalSec < 60) {
    return `${totalSec.toFixed(3)}s`;
  }
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const secs = Math.floor(totalSec % 60);
  if (days > 0) {
    return `${days}d${hours}h${minutes}m${secs}s`;
  }
  if (hours > 0) {
    return `${hours}h${minutes}m${secs}s`;
  }
  return `${minutes}m${secs}s`;
}

export function formatLogPrefix(): string {
  if (process.env["NEXT_RUNTIME"]) {
    return "";
  }
  return `[${getTimePrefix()}] `;
}

export function createLogger(
  debugEnabled = false,
  locale: CountryLanguage,
  onPersist?: PersistFn,
  onFileLog?: FileLogFn,
): EndpointLogger {
  const noTimePrefix = !!process.env["NEXT_RUNTIME"];

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
