/**
 * Logger Core
 * Shared implementation for both server and client loggers.
 * All formatting and console output lives here.
 * File logging and DB persistence are injected via callbacks so this file
 * stays free of node:fs and server-only imports — safe to bundle on the client.
 */

import type { CountryLanguage } from "../core/i18n/core/config";
import { colors, maybeColorize, semantic } from "./colors";
import {
  colorizeLogMessage,
  formatConnectorMetadata,
  formatMetadata,
  usesCompactMetadata,
} from "./formatters";
import { enableDebugLogger, mcpSilentMode } from "./debug";
import { formatElapsed } from "./uptime";
import { serializeLogRecord } from "./serialize";
import type { EndpointLogger, ErrorLogLevel, LoggerMetadata } from "./types";

function serializeDebugMeta(meta: LoggerMetadata[], pretty: boolean): string {
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
      if (pretty) {
        return m instanceof Error
          ? `${m.name}: ${m.message}`
          : formatMetadata(m);
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

/**
 * Console args for metadata: Errors stay raw (stack via util.inspect),
 * strings stay as-is, everything else is pretty-printed and dimmed.
 */
function prettyConsoleArgs(
  meta: LoggerMetadata[],
  message = "",
): Array<string | Error> {
  const compact = usesCompactMetadata(message);
  return meta.flatMap((m): Array<string | Error> => {
    if (m === undefined || m === null) {
      return [];
    }
    if (m instanceof Error || typeof m === "string") {
      return [m];
    }
    return [
      compact
        ? formatConnectorMetadata(m)
        : maybeColorize(formatMetadata(m), colors.dim),
    ];
  });
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

/** File sinks JSON-encode metadata - serialize first so Errors are not `{}`. */
function withSerializedData(
  onFileLog: FileLogFn | undefined,
): FileLogFn | undefined {
  if (!onFileLog) {
    return undefined;
  }
  return (message, data) =>
    onFileLog(message, data ? serializeLogRecord(data) : undefined);
}

function getTimePrefix(): string {
  const startTime = Number(process.env["VIBE_START_TIME"]);
  // Browsers have no VIBE_START_TIME — uptime would print as "NaNmNaNs"
  if (
    process.env["VIBE_LOG_TIMESTAMP"] === "iso" ||
    !Number.isFinite(startTime)
  ) {
    return new Date().toISOString().slice(11, 23);
  }
  return formatElapsed((Date.now() - startTime) / 1000);
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
  rawOnFileLog?: FileLogFn,
): EndpointLogger {
  const onFileLog = withSerializedData(rawOnFileLog);
  const noTimePrefix = !!process.env["NEXT_RUNTIME"];

  const fmt = (message: string): string =>
    noTimePrefix ? message : `[${getTimePrefix()}] ${message}`;

  /** Console variant: the `[time]` prefix is white, the message keeps its category colour. */
  const fmtC = (message: string): string =>
    noTimePrefix
      ? message
      : `${maybeColorize(`[${getTimePrefix()}]`, semantic.highlight)} ${message}`;

  return {
    info(message: string, ...metadata: LoggerMetadata[]): void {
      const metadataObj = metadata.length > 0 ? { metadata } : undefined;
      if (mcpSilentMode) {
        onFileLog?.(`[INFO] ${fmt(message)}`, metadataObj);
        return;
      }
      // oxlint-disable-next-line no-console
      console.log(
        fmtC(colorizeLogMessage(message)),
        ...prettyConsoleArgs(metadata, message),
      );
      onFileLog?.(fmt(message), metadataObj);
    },

    error(
      message: string,
      error?: LoggerMetadata,
      ...metadata: LoggerMetadata[]
    ): void {
      onPersist?.("error", message, error, metadata, locale);

      // Raw error (not parseError's flattened copy) so the cause chain and
      // provider fields (statusCode, responseBody, ...) survive serialization.
      const metadataObj = {
        ...(error !== undefined && error !== null && { error }),
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
        fmtC(colorizeLogMessage(message)),
        ...(error instanceof Error
          ? [error]
          : prettyConsoleArgs(error === undefined ? [] : [error])),
        ...prettyConsoleArgs(metadata, message),
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
      console.warn(
        fmtC(colorizeLogMessage(message)),
        ...prettyConsoleArgs(metadata, message),
      );
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
      console.log(
        `${noTimePrefix ? "" : `${maybeColorize(`[${getTimePrefix()}]`, semantic.highlight)} `}${colorizeLogMessage(message)}`,
        ...prettyConsoleArgs(metadata, message),
      );
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
      const meta = serializeDebugMeta(metadata, true);
      const timeTag = noTimePrefix
        ? ""
        : `${colors.dim}[${getTimePrefix()}]${colors.reset} `;
      // oxlint-disable-next-line no-console
      console.log(
        `${timeTag}${maybeColorize(`${message}${meta}`, semantic.debug)}`,
      );
      const meta2 = serializeDebugMeta(metadata, false);
      const timeTag2 = noTimePrefix ? "" : `[${getTimePrefix()}] `;
      onFileLog?.(`${timeTag2}${message}${meta2}`, metadataObj);
    },

    isDebugEnabled: debugEnabled || enableDebugLogger,
  };
}
