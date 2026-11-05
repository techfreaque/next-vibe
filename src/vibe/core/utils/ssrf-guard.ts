/**
 * SSRF guard for server-side fetches of user-supplied URLs.
 *
 * A URL a user (or an AI acting for one) hands us must never make the server
 * call internal services — cloud metadata (169.254.169.254), the local DB,
 * admin ports. Hostname patterns alone miss `evil.com → 10.0.0.1`, so in
 * production the host is also resolved and every address checked.
 *
 * Dev/test/preview allow private targets: local-to-local instances and E2E
 * runs legitimately fetch from localhost.
 */

import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import { coreEnv } from "../env";
import { Environment } from "../../env/env-util";

const PRIVATE_ADDRESS_PATTERNS = [
  /^localhost$/i,
  /\.localhost$/i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // carrier-grade NAT
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./, // link-local / cloud metadata
  /^::1?$/,
  /^\[::1\]$/,
  /^::ffff:/i, // IPv4-mapped IPv6 — re-checked as IPv4 below
  /^fc[0-9a-f]{2}:/i, // IPv6 unique local
  /^fd[0-9a-f]{2}:/i,
  /^fe80:/i, // IPv6 link-local
];

/** True for loopback / private / link-local hosts and literal addresses. */
export function isPrivateAddress(host: string): boolean {
  const bare = host.replace(/^\[|\]$/g, "");
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(bare)?.[1];
  if (mapped) {
    return isPrivateAddress(mapped);
  }
  return PRIVATE_ADDRESS_PATTERNS.some((re) => re.test(bare));
}

export function allowsPrivateTargets(): boolean {
  return (
    coreEnv.NODE_ENV === Environment.DEVELOPMENT ||
    coreEnv.NODE_ENV === Environment.TEST ||
    coreEnv.IS_PREVIEW_MODE === true
  );
}

/**
 * Null when `rawUrl` is a public http(s) URL the server may fetch, else the
 * reason it may not.
 */
export async function checkPublicHttpUrl(
  rawUrl: string,
): Promise<string | null> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return "Invalid URL";
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return "URL must use http or https";
  }
  if (allowsPrivateTargets()) {
    return null;
  }
  const host = parsed.hostname;
  if (isPrivateAddress(host)) {
    return "URL must not point to a private or loopback address";
  }
  if (isIP(host.replace(/^\[|\]$/g, "")) === 0) {
    const addresses = await lookup(host, { all: true }).catch(() => null);
    if (!addresses || addresses.length === 0) {
      return "URL host does not resolve";
    }
    if (addresses.some((entry) => isPrivateAddress(entry.address))) {
      return "URL must not point to a private or loopback address";
    }
  }
  return null;
}

const MAX_REDIRECTS = 3;

/**
 * Fetch a user-supplied URL, re-checking every redirect hop — a public URL
 * that 302s to http://169.254.169.254/ is the classic bypass. Null when any
 * hop is refused.
 */
export async function fetchPublicUrl(
  url: string,
  fetchImpl: typeof globalThis.fetch,
  init: RequestInit = {},
): Promise<Response | null> {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if ((await checkPublicHttpUrl(current)) !== null) {
      return null;
    }
    const response = await fetchImpl(current, { ...init, redirect: "manual" });
    const location = response.headers.get("location");
    if (response.status < 300 || response.status >= 400 || !location) {
      return response;
    }
    current = new URL(location, current).toString();
  }
  return null;
}
