/**
 * MX-based disposable email check for rotating temp-mail domains.
 * Resolves the domain's MX records (timeout MX_LOOKUP_TIMEOUT_MS) and matches
 * every host against DISPOSABLE_MX_HOSTS. Results are cached per domain for
 * MX_CACHE_TTL_MS. FAILS OPEN: a DNS error, NXDOMAIN or timeout never blocks
 * (NXDOMAIN/NODATA are cached as "not disposable", errors and timeouts are not).
 * Tests swap the resolver with setMxResolverForTests (no real DNS).
 */

import "server-only";

import { resolveMx } from "node:dns/promises";

import { emailDomain, isDisposableMxHost } from "./email-identity";

export const MX_LOOKUP_TIMEOUT_MS = 2500;
export const MX_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const MX_CACHE_MAX_ENTRIES = 5000;

/** Returns the MX hosts of a domain; may reject (treated as "unknown") */
export type MxResolver = (domain: string) => Promise<string[]>;

/** Reserved TLDs (RFC 2606/6761) never resolve: no DNS round trip for them */
const RESERVED_TLDS: ReadonlySet<string> = new Set([
  "invalid",
  "test",
  "localhost",
  "example",
  "local",
]);

/** DNS answers that definitively mean "no mail servers" (cacheable, not errors) */
const NO_MX_CODES: ReadonlySet<string> = new Set(["ENOTFOUND", "ENODATA"]);

const defaultResolver: MxResolver = async (domain) => {
  if (RESERVED_TLDS.has(domain.split(".").at(-1) ?? "")) {
    return [];
  }
  return resolveMx(domain).then(
    (records) => records.map((r) => r.exchange),
    (error: Error) =>
      "code" in error &&
      typeof error.code === "string" &&
      NO_MX_CODES.has(error.code)
        ? []
        : Promise.reject(error),
  );
};

let activeResolver: MxResolver = defaultResolver;
const cache = new Map<string, { disposable: boolean; expiresAt: number }>();

/** Swap the MX resolver (tests). null restores real DNS. Clears the cache. */
export function setMxResolverForTests(resolver: MxResolver | null): void {
  activeResolver = resolver ?? defaultResolver;
  cache.clear();
}

/** MX hosts, or null on error/timeout */
async function lookupMx(domain: string): Promise<string[] | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), MX_LOOKUP_TIMEOUT_MS);
  });
  const lookup = activeResolver(domain).then(
    (hosts) => hosts,
    () => null,
  );
  const result = await Promise.race([lookup, timeout]);
  clearTimeout(timer);
  return result;
}

/** True when the domain's mail is handled by a known temp-mail MX host */
export async function hasDisposableMx(domain: string): Promise<boolean> {
  const key = domain.toLowerCase().replace(/\.$/, "");
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expiresAt > now) {
    return hit.disposable;
  }
  const hosts = await lookupMx(key);
  if (hosts === null) {
    // Fail open, and do not cache: the next attempt asks DNS again
    return false;
  }
  const disposable = hosts.some(isDisposableMxHost);
  if (cache.size >= MX_CACHE_MAX_ENTRIES) {
    cache.clear();
  }
  cache.set(key, { disposable, expiresAt: now + MX_CACHE_TTL_MS });
  return disposable;
}

/** MX check for a full email address (false when it has no domain) */
export async function isDisposableEmailByMx(email: string): Promise<boolean> {
  const domain = emailDomain(email);
  return domain ? hasDisposableMx(domain) : false;
}
