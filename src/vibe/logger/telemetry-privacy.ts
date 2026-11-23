import {
  isTelemetryUrlField,
  sanitizeTelemetryUrl,
} from "../core/utils/telemetry-url";
import type { LoggerMetadata } from "./types";

const SECRET_FIELD =
  /^(?:token|resetToken|verificationToken|confirmationToken|accessToken|refreshToken|authToken|magicLinkToken|password|confirmPassword)$/i;
const REDACTED = "[redacted]";
// Handle both intact and truncated JSON in historical validation diagnostics.
const SERIALIZED_SECRET =
  /("(?:token|resetToken|verificationToken|confirmationToken|accessToken|refreshToken|authToken|magicLinkToken|password|confirmPassword)"\s*:\s*")(?:\\.|[^"\\\r\n])*/gi;
const URL_IN_TEXT =
  /https?:\/\/[^\s"'<>()]+|(?<![\w/%])\/{1,2}[^/\s"'<>()][^\s"'<>()]*/gi;

/** Keep the host for diagnostics, with user info, credentials and queries removed. */
function describeLogUrl(raw: string): string | null {
  const path = sanitizeTelemetryUrl(raw);
  if (path === null) {
    return null;
  }
  if (!/^(?:https?:)?\/\//i.test(raw)) {
    return path;
  }
  const { origin } = new URL(raw.startsWith("//") ? `https:${raw}` : raw);
  return `${origin}${path}`;
}

/** Errors also embed request URLs in free text, including in stack traces. */
export function sanitizeLogText(text: string): string {
  return text
    .replace(SERIALIZED_SECRET, `$1${REDACTED}`)
    .replace(URL_IN_TEXT, (match) => {
      // Preserve file/line information in stack frames.
      const position = /:\d+:\d+$/.exec(match)?.[0] ?? "";
      const url = position ? match.slice(0, -position.length) : match;
      return `${describeLogUrl(url) ?? REDACTED}${position}`;
    });
}

export function sanitizeLogString(key: string, value: string): string {
  if (SECRET_FIELD.test(key)) {
    return REDACTED;
  }
  if (isTelemetryUrlField(key) && /^(?:\/|https?:\/\/)/i.test(value.trim())) {
    return describeLogUrl(value.trim()) ?? REDACTED;
  }
  return sanitizeLogText(value);
}

/** Scrub previously serialized metadata without reformatting unrelated fields. */
export function scrubStoredLogValue(
  value: LoggerMetadata,
  key = "",
): LoggerMetadata {
  if (typeof value === "string") {
    return sanitizeLogString(key, value);
  }
  if (
    value === null ||
    typeof value !== "object" ||
    value instanceof Date ||
    value instanceof Error
  ) {
    return value;
  }
  if (isLogArray(value)) {
    const entries = value.map((item) => scrubStoredLogValue(item, key));
    return entries.some((entry, index) => entry !== value[index])
      ? entries
      : value;
  }
  const entries = Object.entries(value);
  const scrubbed = entries.map(([field, entry]): [string, LoggerMetadata] => [
    field,
    scrubStoredLogValue(entry, field),
  ]);
  return scrubbed.some(([, entry], index) => entry !== entries[index]?.[1])
    ? Object.fromEntries(scrubbed)
    : value;
}

function isLogArray(value: LoggerMetadata): value is readonly LoggerMetadata[] {
  return Array.isArray(value);
}
