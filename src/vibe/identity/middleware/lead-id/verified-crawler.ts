/**
 * Verified search & social crawler detection for lead-id middleware.
 *
 * Prevents verified crawlers (Googlebot, Bingbot, Applebot, DuckDuckBot,
 * YandexBot, Baiduspider, Meta/Facebook, PetalBot, etc.) from creating guest
 * lead rows or lead cookies while still serving them full SSR HTML.
 *
 * Verification is strictly two-factor (User-Agent + IP proof) so spoofed UAs
 * can never bypass guest pooling or anti-farming protections:
 *  1. Fast path (synchronous, <0.02ms): official published CIDR blocks
 *     (Google, Bing, Apple, Meta, DuckDuckGo).
 *  2. Cached FCrDNS (reverse PTR suffix match + forward A/AAAA confirmation
 *     back to the exact client IP), bounded by a tight timeout and deduplicated
 *     across concurrent requests from the same IP.
 */

import "server-only";

import { resolve4, resolve6, reverse } from "node:dns/promises";

import { BotFamily } from "@/leads/analytics/enum";

import { isPrivateAddress } from "../../../core/utils/ssrf-guard";
import { parseIp } from "../../lead/ip-key";
import {
  APPLE_CRAWLER_CIDRS,
  BING_CRAWLER_CIDRS,
  canonicalIp,
  type CompiledCidrSet,
  DUCKDUCKGO_CRAWLER_CIDRS,
  GOOGLE_CRAWLER_CIDRS,
  matchesCidrSet,
  META_CRAWLER_CIDRS,
} from "./crawler-ranges";

export type BotFamilyValue = (typeof BotFamily)[keyof typeof BotFamily];

export type VerifiedCrawlerId =
  | "google"
  | "bing"
  | "apple"
  | "duckassist"
  | "duckduckgo"
  | "yandex"
  | "baidu"
  | "meta"
  | "petal"
  | "ahrefs"
  | "semrush"
  | "dotbot"
  | "twitter"
  | "linkedin";

export interface VerifiedCrawlerRule {
  readonly id: VerifiedCrawlerId;
  /** Matches BOT_FAMILY_PATTERNS in src/leads/analytics/bot-sql.ts. */
  readonly botFamily: BotFamilyValue;
  readonly uaPattern: RegExp;
  readonly cidrs?: CompiledCidrSet;
  /** Lowercased domain suffixes without leading dot, checked on label boundary. */
  readonly ptrSuffixes: readonly string[];
}

export interface VerifiedCrawlerMatch {
  readonly id: VerifiedCrawlerId;
  readonly botFamily: BotFamilyValue;
  readonly method: "cidr" | "fcrdns" | "cache";
}

export interface CrawlerDnsResolver {
  reverse(ip: string): Promise<string[]>;
  resolve4(hostname: string): Promise<string[]>;
  resolve6(hostname: string): Promise<string[]>;
}

export interface VerifyCrawlerOptions {
  /** Maximum time to wait for FCrDNS before failing closed (ms). */
  timeoutMs?: number;
  dnsResolver?: CrawlerDnsResolver;
  now?: () => number;
  cache?: VerifiedCrawlerCache;
}

interface CacheEntry {
  verified: boolean;
  expiresAt: number;
}

export interface VerifiedCrawlerCache {
  entries: Map<string, CacheEntry>;
  pending: Map<string, Promise<boolean>>;
}

declare global {
  var __vibeVerifiedCrawlerCache: VerifiedCrawlerCache | undefined;
}

const DEFAULT_DNS_TIMEOUT_MS = 150;
const POSITIVE_TTL_MS = 24 * 60 * 60 * 1000;
const NEGATIVE_TTL_MS = 10 * 60 * 1000;
const TIMEOUT_NEGATIVE_TTL_MS = 30 * 1000;
const MAX_CACHE_ENTRIES = 10_000;
const MAX_PTR_HOSTNAMES = 3;

const defaultDnsResolver: CrawlerDnsResolver = {
  reverse,
  resolve4,
  resolve6,
};

/**
 * Ordered crawler rules. BotFamily assignments mirror BOT_FAMILY_PATTERNS in
 * src/leads/analytics/bot-sql.ts so analytics buckets stay consistent.
 */
export const VERIFIED_CRAWLER_RULES: readonly VerifiedCrawlerRule[] = [
  {
    id: "meta",
    botFamily: BotFamily.META,
    uaPattern:
      /facebookexternalhit|meta-externalagent|meta-externalfetcher|meta-webindexer|facebookcatalog|facebookbot/i,
    cidrs: META_CRAWLER_CIDRS,
    ptrSuffixes: ["fbsv.net", "tfbnw.net"],
  },
  {
    id: "google",
    botFamily: BotFamily.GOOGLE,
    uaPattern:
      /googlebot|google-inspectiontool|googleother|adsbot-google|mediapartners-google|storebot-google|apis-google|feedfetcher-google|google-read-aloud|google-site-verification/i,
    cidrs: GOOGLE_CRAWLER_CIDRS,
    ptrSuffixes: ["googlebot.com", "google.com"],
  },
  {
    id: "bing",
    botFamily: BotFamily.BING,
    uaPattern: /bingbot|bingpreview|msnbot|adidxbot/i,
    cidrs: BING_CRAWLER_CIDRS,
    ptrSuffixes: ["search.msn.com"],
  },
  {
    id: "apple",
    botFamily: BotFamily.OTHER_AI,
    uaPattern: /applebot/i,
    cidrs: APPLE_CRAWLER_CIDRS,
    ptrSuffixes: ["applebot.apple.com"],
  },
  {
    id: "duckassist",
    botFamily: BotFamily.OTHER_AI,
    uaPattern: /duckassistbot/i,
    cidrs: DUCKDUCKGO_CRAWLER_CIDRS,
    ptrSuffixes: ["duckduckgo.com"],
  },
  {
    id: "duckduckgo",
    botFamily: BotFamily.OTHER_BOT,
    uaPattern: /duckduckbot/i,
    cidrs: DUCKDUCKGO_CRAWLER_CIDRS,
    ptrSuffixes: ["duckduckgo.com"],
  },
  {
    id: "yandex",
    botFamily: BotFamily.OTHER_BOT,
    uaPattern: /yandex/i,
    ptrSuffixes: ["yandex.ru", "yandex.net", "yandex.com"],
  },
  {
    id: "baidu",
    botFamily: BotFamily.OTHER_BOT,
    uaPattern: /baiduspider/i,
    ptrSuffixes: ["baidu.com", "baidu.jp"],
  },
  {
    id: "petal",
    botFamily: BotFamily.OTHER_BOT,
    uaPattern: /petalbot/i,
    ptrSuffixes: ["petalsearch.com", "aspiegel.com"],
  },
  {
    id: "ahrefs",
    botFamily: BotFamily.OTHER_BOT,
    uaPattern: /ahrefsbot/i,
    ptrSuffixes: ["ahrefs.com", "ahrefs.net"],
  },
  {
    id: "semrush",
    botFamily: BotFamily.OTHER_BOT,
    uaPattern: /semrushbot/i,
    ptrSuffixes: ["semrush.com"],
  },
  {
    id: "dotbot",
    botFamily: BotFamily.OTHER_BOT,
    uaPattern: /dotbot/i,
    ptrSuffixes: ["moz.com"],
  },
  {
    id: "twitter",
    botFamily: BotFamily.SOCIAL_PREVIEW,
    uaPattern: /twitterbot/i,
    ptrSuffixes: ["twttr.com"],
  },
  {
    id: "linkedin",
    botFamily: BotFamily.SOCIAL_PREVIEW,
    uaPattern: /linkedinbot/i,
    ptrSuffixes: ["linkedin.com"],
  },
];

export function createVerifiedCrawlerCache(): VerifiedCrawlerCache {
  return { entries: new Map(), pending: new Map() };
}

function defaultCache(): VerifiedCrawlerCache {
  globalThis.__vibeVerifiedCrawlerCache ??= createVerifiedCrawlerCache();
  return globalThis.__vibeVerifiedCrawlerCache;
}

export function clearVerifiedCrawlerCache(): void {
  if (globalThis.__vibeVerifiedCrawlerCache) {
    globalThis.__vibeVerifiedCrawlerCache.entries.clear();
    globalThis.__vibeVerifiedCrawlerCache.pending.clear();
  }
}

/** Pure synchronous UA lookup: returns the matching rule or null. */
export function matchVerifiedCrawlerRule(
  userAgent: string | null | undefined,
): VerifiedCrawlerRule | null {
  if (!userAgent) {
    return null;
  }
  for (const rule of VERIFIED_CRAWLER_RULES) {
    if (rule.uaPattern.test(userAgent)) {
      return rule;
    }
  }
  return null;
}

/** Strict DNS label-boundary suffix match (rejects "evilgooglebot.com"). */
export function matchesPtrSuffix(
  hostname: string,
  suffixes: readonly string[],
): boolean {
  const normalized = hostname.trim().toLowerCase().replace(/\.$/, "");
  if (!normalized) {
    return false;
  }
  return suffixes.some(
    (suffix) => normalized === suffix || normalized.endsWith(`.${suffix}`),
  );
}

function setCached(
  cache: VerifiedCrawlerCache,
  key: string,
  verified: boolean,
  ttlMs: number,
  nowMs: number,
): void {
  if (cache.entries.size >= MAX_CACHE_ENTRIES && !cache.entries.has(key)) {
    const oldestKey = cache.entries.keys().next().value;
    if (oldestKey !== undefined) {
      cache.entries.delete(oldestKey);
    }
  }
  cache.entries.set(key, { verified, expiresAt: nowMs + ttlMs });
}

async function runWithTimeout<T>(
  work: Promise<T>,
  timeoutMs: number,
): Promise<{ timedOut: true } | { timedOut: false; value: T }> {
  if (timeoutMs <= 0) {
    return { timedOut: true };
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<{ timedOut: true }>((resolve) => {
    timer = setTimeout(() => resolve({ timedOut: true }), timeoutMs);
  });
  try {
    return await Promise.race([
      work.then((value) => ({ timedOut: false as const, value })),
      timeoutPromise,
    ]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

async function performFcrdns(
  lookupIp: string,
  canonical: string,
  ipVersion: 4 | 6,
  ptrSuffixes: readonly string[],
  resolver: CrawlerDnsResolver,
): Promise<boolean> {
  let hostnames: string[];
  try {
    hostnames = await resolver.reverse(lookupIp);
  } catch {
    return false;
  }

  const matchingHosts = hostnames
    .map((h) => h.trim().replace(/\.$/, ""))
    .filter((h) => matchesPtrSuffix(h, ptrSuffixes))
    .slice(0, MAX_PTR_HOSTNAMES);

  for (const host of matchingHosts) {
    let resolvedIps: string[];
    try {
      resolvedIps =
        ipVersion === 4
          ? await resolver.resolve4(host)
          : await resolver.resolve6(host);
    } catch {
      continue;
    }
    for (const candidate of resolvedIps) {
      const parsedCandidate = parseIp(candidate);
      if (parsedCandidate && canonicalIp(parsedCandidate) === canonical) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Verify that (userAgent, ipAddress) belongs to a legitimate crawler.
 * Never trusts UA alone; fails closed on missing/private IPs or DNS timeouts.
 */
export async function verifyCrawler(
  userAgent: string | null | undefined,
  ipAddress: string | null | undefined,
  options?: VerifyCrawlerOptions,
): Promise<VerifiedCrawlerMatch | null> {
  const rule = matchVerifiedCrawlerRule(userAgent);
  if (!rule || !ipAddress) {
    return null;
  }

  const parsed = parseIp(ipAddress);
  if (!parsed) {
    return null;
  }

  // Never treat loopback/private addresses as public search crawlers.
  const lookupIp = parsed.v === 4 ? parsed.octets.join(".") : ipAddress.trim();
  if (isPrivateAddress(lookupIp)) {
    return null;
  }

  // Fast path: official published CIDR blocks (0ms, zero network I/O).
  if (rule.cidrs && matchesCidrSet(parsed, rule.cidrs)) {
    return { id: rule.id, botFamily: rule.botFamily, method: "cidr" };
  }

  if (rule.ptrSuffixes.length === 0) {
    return null;
  }

  const canonical = canonicalIp(parsed);
  const cache = options?.cache ?? defaultCache();
  const now = options?.now ?? Date.now;
  const cacheKey = `${rule.id}:${canonical}`;
  const nowMs = now();

  const cached = cache.entries.get(cacheKey);
  if (cached && cached.expiresAt > nowMs) {
    return cached.verified
      ? { id: rule.id, botFamily: rule.botFamily, method: "cache" }
      : null;
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_DNS_TIMEOUT_MS;
  const resolver = options?.dnsResolver ?? defaultDnsResolver;

  let lookup = cache.pending.get(cacheKey);
  if (!lookup) {
    lookup = performFcrdns(
      lookupIp,
      canonical,
      parsed.v,
      rule.ptrSuffixes,
      resolver,
    )
      .then((verified) => {
        setCached(
          cache,
          cacheKey,
          verified,
          verified ? POSITIVE_TTL_MS : NEGATIVE_TTL_MS,
          now(),
        );
        return verified;
      })
      .finally(() => {
        if (cache.pending.get(cacheKey) === lookup) {
          cache.pending.delete(cacheKey);
        }
      });
    cache.pending.set(cacheKey, lookup);
  }

  const outcome = await runWithTimeout(lookup, timeoutMs);
  if (outcome.timedOut) {
    setCached(cache, cacheKey, false, TIMEOUT_NEGATIVE_TTL_MS, now());
    return null;
  }

  return outcome.value
    ? { id: rule.id, botFamily: rule.botFamily, method: "fcrdns" }
    : null;
}
