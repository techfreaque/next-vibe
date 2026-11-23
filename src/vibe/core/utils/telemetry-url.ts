/** A storage format for request URLs, never a destination for navigation. */
const BASE = "https://telemetry.invalid";
const ATTRIBUTION_KEY = /^(?:utm_[a-z0-9_]{1,32}|ref|locale)$/;
const ATTRIBUTION_VALUE = /^[\p{L}\p{N} ._~-]+$/u;
const JWT = /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]*)?$/;
const OPAQUE_VALUE = /^(?=.*[A-Z0-9])[A-Za-z0-9_~-]{24,}$/;
const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const SECRET_ROUTE =
  /^(?:verify-email|magic-links?|(?:login|sign-in)-link|token|access-token|refresh-token)$/;

function decodedSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** Keep campaign labels and referral/locale identifiers, including Unicode labels. */
export function sanitizeAttributionValue(value: string | null): string | null {
  // eslint-disable-next-line no-control-regex -- remove control characters from attribution labels
  const label = value?.replaceAll(/[\u0000-\u001f\u007f]/g, "").trim();
  return label &&
    ATTRIBUTION_VALUE.test(label) &&
    !JWT.test(label) &&
    !OPAQUE_VALUE.test(label)
    ? label.slice(0, 100)
    : null;
}

function redactPath(
  pathname: string,
  api: boolean,
): { path: string; sensitive: boolean } {
  const segments = pathname.split("/");
  for (const [index, segment] of segments.entries()) {
    const decoded = decodedSegment(segment);
    const [name = ""] = decoded.toLowerCase().split(/[;=/?#\\]/, 1);
    const next = decodedSegment(segments[index + 1] ?? "").toLowerCase();
    const routePart = [name];
    if (name === "reset-password" && (api || next === "confirm")) {
      if (next === "confirm" || next === "validate" || next === "request") {
        routePart.push(next);
      }
    } else if (
      (name === "newsletter" &&
        (next === "confirm" || next === "unsubscribe")) ||
      (name === "unsubscribe" && next === "oneclick")
    ) {
      routePart.push(next);
      if (next === "unsubscribe" && segments[index + 2] === "oneclick") {
        routePart.push("oneclick");
      }
    } else if (
      name !== "reset-password" &&
      !SECRET_ROUTE.test(name) &&
      !(name === "shared" && index <= 2) &&
      !(name === "signup" && next === "confirm")
    ) {
      if (
        JWT.test(decoded) ||
        decoded.includes("@") ||
        (api && (OPAQUE_VALUE.test(decoded) || decoded.includes("=")))
      ) {
        segments[index] = ":token";
      }
      continue;
    } else if (name === "signup") {
      routePart.push(next);
    }
    const suffix = segments.slice(index + routePart.length).some(Boolean);
    const template = [...segments.slice(0, index), ...routePart];
    return {
      path: (suffix || name !== decoded
        ? [...template, ":token"]
        : template
      ).join("/"),
      sensitive: true,
    };
  }
  return { path: segments.join("/"), sensitive: segments.includes(":token") };
}

/** Return a path and, for ordinary web pages, optionally safe attribution params. */
export function sanitizeTelemetryUrl(
  raw: string | null | undefined,
  includeAttribution = false,
): string | null {
  const value = raw?.trim();
  if (!value || !/^(?:\/|https?:\/\/)/i.test(value)) {
    return null;
  }
  let url: URL;
  try {
    url = new URL(value, BASE);
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    return null;
  }

  // A leading // is a network-path URL on the next pass. Canonicalize it as
  // a local path now so the stored result is idempotent.
  const normalized = url.pathname.replaceAll(/%2f|%5c/gi, "/");
  const pathname = new URL(`${BASE}${normalized}`).pathname.replace(
    /^\/{2,}/,
    "/",
  );
  const api = /^(?:\/[^/]+)?\/api(?:\/|$)/i.test(pathname);
  const { path, sensitive } = redactPath(pathname, api);
  if (
    !includeAttribution ||
    api ||
    sensitive ||
    (/\/signup\/?$/i.test(path) && url.searchParams.get("confirm") === "1")
  ) {
    return path;
  }

  const safe = new URLSearchParams();
  for (const [key, rawValue] of url.searchParams) {
    if (ATTRIBUTION_KEY.test(key) && !safe.has(key)) {
      const label =
        key === "utm_id" && UUID.test(rawValue)
          ? rawValue
          : sanitizeAttributionValue(rawValue);
      if (label !== null) {
        safe.set(key, label);
      }
    }
  }
  return safe.size ? `${path}?${safe.toString()}` : path;
}

/** Allow for client-provided custom URL fields flattened into engagement metadata. */
export function isTelemetryUrlField(key: string): boolean {
  return /(?:url|urls|uri|href|referr?er|pathname|path|route)$/i.test(key);
}

export function sanitizeLeadUrlMetadata<
  T extends string | number | boolean | null,
>(metadata: Record<string, T>): Record<string, T | string> {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [
      key,
      typeof value === "string" && isTelemetryUrlField(key)
        ? (sanitizeTelemetryUrl(value, true) ?? "")
        : value,
    ]),
  );
}
