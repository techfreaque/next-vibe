/**
 * Growth Attribution - pure touch extraction + first/last-touch rules.
 *
 * No DB, no IO. Used by the request middleware (via the repository) and unit
 * tested directly. Stores only what attribution needs: UTM values, referrer
 * host (never the full URL), landing path (never the query string), ref code.
 */

import type { ChannelTypeValue } from "./enum";
import { ChannelType } from "./enum";

/** Max stored length for any single attribution value. */
const MAX_VALUE_LENGTH = 100;
const MAX_PATH_LENGTH = 200;
const MAX_REF_LENGTH = 64;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Query params that make a later visit count as a new (last) touch. */
export const ATTRIBUTION_QUERY_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "ref",
] as const;

const BOT_PATTERN =
  /bot|crawler|spider|slurp|crawling|facebookexternalhit|embedly|uptime/i;

/** Crawlers and link-preview fetchers are not visitors - never attribute them. */
export function isLikelyBot(userAgent: string | null | undefined): boolean {
  return !userAgent || BOT_PATTERN.test(userAgent);
}

/** One touch: how a visitor arrived on a given request. */
export interface Touch {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
  referrerHost: string | null;
  landingPath: string | null;
  refCode: string | null;
  /** Campaign link id (utm_id), only when it is a UUID */
  linkId: string | null;
}

export interface TouchWithChannel extends Touch {
  channel: string;
  channelType: typeof ChannelTypeValue;
}

/** Strip control characters, trim, cap length. Empty → null. */
function clean(value: string | null, maxLength: number): string | null {
  if (value === null) {
    return null;
  }
  // eslint-disable-next-line no-control-regex -- strip control characters from untrusted query input
  const stripped = value.replaceAll(/[\u0000-\u001f\u007f]/g, "").trim();
  if (stripped.length === 0) {
    return null;
  }
  return stripped.slice(0, maxLength);
}

/** UTM source/medium are case-insensitive by convention - normalize to lowercase. */
function cleanLower(value: string | null): string | null {
  const cleaned = clean(value, MAX_VALUE_LENGTH);
  return cleaned === null ? null : cleaned.toLowerCase();
}

function hostOf(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.length > 0 ? host : null;
  } catch {
    return null;
  }
}

function stripWww(host: string): string {
  return host.startsWith("www.") ? host.slice(4) : host;
}

/**
 * Resolve the effective landing URL. A `/track?url=/dest` request lands on
 * `/dest`: the tracking page only redirects. Its own query (ref, utm_*) still
 * applies, merged with the destination's query (outer wins).
 */
function resolveLanding(requestUrl: URL): {
  path: string;
  params: URLSearchParams;
} {
  const outer = requestUrl.searchParams;
  const isTrack = /^\/[a-z]{2}-[A-Z]+\/track\/?$|^\/track\/?$/.test(
    requestUrl.pathname,
  );
  const inner = outer.get("url");
  if (!isTrack || !inner) {
    return { path: requestUrl.pathname, params: outer };
  }
  let destination: URL;
  try {
    destination = new URL(inner, requestUrl.origin);
  } catch {
    return { path: requestUrl.pathname, params: outer };
  }
  const merged = new URLSearchParams(destination.searchParams);
  for (const key of ATTRIBUTION_QUERY_PARAMS) {
    const value = outer.get(key);
    if (value !== null) {
      merged.set(key, value);
    }
  }
  // Off-site destination: keep /track as landing path, never store foreign paths
  const path =
    destination.origin === requestUrl.origin
      ? destination.pathname
      : requestUrl.pathname;
  return { path, params: merged };
}

/**
 * Extract a touch from a page request.
 * @param requestUrl - full request URL (query included)
 * @param referer - Referer header, if any
 * @param ownHosts - hosts considered internal (referrers from these are ignored)
 */
export function extractTouch(
  requestUrl: URL,
  referer: string | null | undefined,
  ownHosts: readonly string[],
): Touch {
  const { path, params } = resolveLanding(requestUrl);
  const refererHost = hostOf(referer);
  const internal = new Set(
    [requestUrl.hostname, ...ownHosts].map((h) => stripWww(h.toLowerCase())),
  );
  const referrerHost =
    refererHost && !internal.has(stripWww(refererHost))
      ? stripWww(refererHost)
      : null;
  const rawLinkId = params.get("utm_id");
  return {
    source: cleanLower(params.get("utm_source")),
    medium: cleanLower(params.get("utm_medium")),
    campaign: clean(params.get("utm_campaign"), MAX_VALUE_LENGTH),
    content: clean(params.get("utm_content"), MAX_VALUE_LENGTH),
    term: clean(params.get("utm_term"), MAX_VALUE_LENGTH),
    referrerHost,
    landingPath: clean(path, MAX_PATH_LENGTH),
    refCode: clean(params.get("ref"), MAX_REF_LENGTH),
    linkId: rawLinkId && UUID_PATTERN.test(rawLinkId) ? rawLinkId : null,
  };
}

/**
 * A touch is a campaign signal when it carries an explicit marker we put
 * there (UTM, ref code, link id). Only these update the last touch - a plain
 * revisit or an organic referrer does not.
 */
export function hasCampaignSignal(touch: Touch): boolean {
  return (
    touch.source !== null ||
    touch.medium !== null ||
    touch.campaign !== null ||
    touch.refCode !== null ||
    touch.linkId !== null
  );
}

/**
 * Channel key + type for a touch. Precedence:
 *   utm_source → campaign, ref code → "ref:CODE", external referrer → host, else direct.
 */
export function deriveChannel(touch: Touch): TouchWithChannel {
  if (touch.source !== null) {
    return {
      ...touch,
      channel: touch.source,
      channelType: ChannelType.CAMPAIGN,
    };
  }
  if (touch.refCode !== null) {
    return {
      ...touch,
      channel: `ref:${touch.refCode}`,
      channelType: ChannelType.REFERRAL,
    };
  }
  if (touch.medium !== null || touch.campaign !== null) {
    // UTM-tagged without a source - still a campaign, grouped as "(none)"
    return {
      ...touch,
      channel: "(none)",
      channelType: ChannelType.CAMPAIGN,
    };
  }
  if (touch.referrerHost !== null) {
    return {
      ...touch,
      channel: touch.referrerHost,
      channelType: ChannelType.ORGANIC,
    };
  }
  return { ...touch, channel: "direct", channelType: ChannelType.DIRECT };
}

/** What to write for a touch given whether the journey already exists. */
export interface TouchPlan {
  /** Insert a new journey with first = last = this touch */
  insert: boolean;
  /** Overwrite last-touch columns on the existing journey */
  updateLast: boolean;
  /** Increment the campaign link's visit counter */
  countLinkVisit: boolean;
}

/**
 * First/last-touch rules:
 * - No journey yet → insert; this touch is both first and last.
 * - Journey exists → first touch is immutable; last touch moves only on a
 *   campaign signal (UTM / ref / link id).
 * - A link visit counts whenever the touch carries a link id.
 */
export function planTouch(journeyExists: boolean, touch: Touch): TouchPlan {
  const signal = hasCampaignSignal(touch);
  return {
    insert: !journeyExists,
    updateLast: journeyExists && signal,
    countLinkVisit: touch.linkId !== null,
  };
}

/**
 * Landing path for a campaign link: same-site path only, no query or hash.
 * Returns null for anything that could leave the site ("//host", "https:").
 */
export function normalizeDestinationPath(input: string): string | null {
  const trimmed = input.trim() || "/";
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("\\") ||
    trimmed.includes("://")
  ) {
    return null;
  }
  const path = trimmed.split(/[?#]/)[0] ?? "/";
  return path.length > 0 ? path : "/";
}

/** UTM source/medium normalization shared by links, spend and touch extraction. */
export function normalizeChannelKey(input: string): string {
  const trimmed = input.trim();
  // ref:CODE keeps the code's case - referral codes are matched verbatim
  return trimmed.startsWith("ref:") ? trimmed : trimmed.toLowerCase();
}

/**
 * Build the shareable URL for a campaign link. With a referral code the link
 * goes through /track so the code is credited; /track redirects to the
 * destination, and attribution reads the UTMs from the /track request itself.
 */
export function buildCampaignUrl(
  appUrl: string,
  link: {
    id: string;
    source: string;
    medium: string;
    campaign: string;
    content: string | null;
    term: string | null;
    destinationPath: string;
    refCode: string | null;
  },
): string {
  const origin = new URL(appUrl).origin;
  const utm = new URLSearchParams();
  utm.set("utm_source", link.source);
  utm.set("utm_medium", link.medium);
  utm.set("utm_campaign", link.campaign);
  if (link.content) {
    utm.set("utm_content", link.content);
  }
  if (link.term) {
    utm.set("utm_term", link.term);
  }
  utm.set("utm_id", link.id);

  if (link.refCode) {
    const track = new URLSearchParams();
    track.set("ref", link.refCode);
    track.set("url", link.destinationPath);
    return `${origin}/track?${track.toString()}&${utm.toString()}`;
  }
  return `${origin}${link.destinationPath}?${utm.toString()}`;
}
