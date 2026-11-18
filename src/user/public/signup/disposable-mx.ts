/** Cached MX lookups for disposable mail and signup deliverability.
 * Transient errors fail open. Without MX, an A or AAAA record permits mail. */

import "server-only";

import { resolve4, resolve6, resolveMx } from "node:dns/promises";

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
const cache = new Map<string, { hosts: string[]; expiresAt: number }>();

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

async function cachedMx(domain: string): Promise<string[] | null> {
  const key = domain.toLowerCase().replace(/\.$/, "");
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expiresAt > now) {
    return hit.hosts;
  }
  const hosts = await lookupMx(key);
  if (hosts !== null) {
    if (cache.size >= MX_CACHE_MAX_ENTRIES) {
      cache.clear();
    }
    cache.set(key, { hosts, expiresAt: now + MX_CACHE_TTL_MS });
  }
  return hosts;
}

export async function hasDisposableMx(domain: string): Promise<boolean> {
  return (await cachedMx(domain))?.some(isDisposableMxHost) ?? false;
}

async function hasAddress(domain: string): Promise<boolean> {
  const answers = await Promise.allSettled([
    resolve4(domain),
    resolve6(domain),
  ]);
  return answers.some((answer) => {
    if (answer.status === "fulfilled") {
      return answer.value.length > 0;
    }
    const error = answer.reason;
    return !(
      error instanceof Error &&
      "code" in error &&
      typeof error.code === "string" &&
      NO_MX_CODES.has(error.code)
    );
  });
}

/** Explicit null MX rejects mail. A domain without MX can receive via A/AAAA. */
export async function signupDomainStatus(
  domain: string,
  addressLookup = hasAddress,
): Promise<"ok" | "disposable" | "undeliverable"> {
  const hosts = await cachedMx(domain);
  if (hosts === null) {
    return "ok";
  }
  if (hosts.some(isDisposableMxHost)) {
    return "disposable";
  }
  if (hosts.length) {
    return hosts.some((host) => host !== "." && host !== "")
      ? "ok"
      : "undeliverable";
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const implicitMx = await Promise.race([
      addressLookup(domain),
      new Promise<boolean>((resolve) => {
        timer = setTimeout(() => resolve(true), MX_LOOKUP_TIMEOUT_MS);
      }),
    ]);
    return implicitMx ? "ok" : "undeliverable";
  } catch {
    return "ok";
  } finally {
    clearTimeout(timer);
  }
}

/** MX check for a full email address (false when it has no domain) */
export async function isDisposableEmailByMx(email: string): Promise<boolean> {
  const domain = emailDomain(email);
  return domain ? hasDisposableMx(domain) : false;
}
