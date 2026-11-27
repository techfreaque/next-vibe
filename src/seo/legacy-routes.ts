/**
 * Permanent redirects for URLs search engines still crawl: the pre-/story
 * route structure (/<locale>/about-us, /login, /contact, ...) and bare locale
 * roots (/de-US -> /de-DE/story). The web middleware resolves them in the
 * same hop as the locale redirect, so no URL ever takes two redirects.
 *
 * Public targets go to the canonical SEO locale (de-PL/about-us ->
 * de-DE/story/about-us): those pages canonicalize there anyway. App targets
 * (login, chat) keep the visitor's locale, which carries their region and
 * currency.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { canonicalSeoLocale } from "next-vibe/core/i18n/core/seo-locales";

interface LegacyRoute {
  /** Locale-less target path without a leading slash. */
  target: string;
  /** Indexable public page: redirect to the canonical SEO locale. */
  canonical: boolean;
}

/** Exact old paths (locale-less, no slashes at either end). */
const EXACT_ROUTES: Readonly<Record<string, LegacyRoute>> = {
  "about-us": { target: "story/about-us", canonical: true },
  imprint: { target: "story/imprint", canonical: true },
  "terms-of-service": { target: "story/terms-of-service", canonical: true },
  "privacy-policy": { target: "story/privacy-policy", canonical: true },
  careers: { target: "story/careers", canonical: true },
  framework: { target: "story/framework", canonical: true },
  "self-host": { target: "story/self-host", canonical: true },
  blog: { target: "story/blog", canonical: true },
  contact: { target: "help", canonical: true },
  faq: { target: "help", canonical: true },
  "story/referral": { target: "story/earn", canonical: true },
  "story/docs": { target: "story/framework", canonical: true },
  "story/blog/i-got-fired": { target: "story/blog", canonical: true },
  "story/blog/repository": { target: "story/framework", canonical: true },
  "story/blog/definition": { target: "story/framework", canonical: true },
  v1: { target: "docs/api", canonical: true },
  login: { target: "user/login", canonical: false },
  signup: { target: "user/signup", canonical: false },
  register: { target: "user/signup", canonical: false },
  "reset-password": { target: "user/reset-password", canonical: false },
  chat: { target: "threads/incognito/new", canonical: false },
};

/** Old path prefixes: every path below them goes to one page. */
const PREFIX_ROUTES: readonly (readonly [string, LegacyRoute])[] = [
  ["story/docs/", { target: "story/framework", canonical: true }],
  // API reference paths quoted in docs text (/v1/audio, /v1/media/...).
  ["v1/", { target: "docs/api", canonical: true }],
];

/** Next route groups leaked into old links: /user/(account)/referral. */
const ROUTE_GROUP_SEGMENT = /\/(?:\(|%28)[a-z-]+(?:\)|%29)(?=\/)/gi;

function findLegacyRoute(rest: string): LegacyRoute | null {
  const exact = EXACT_ROUTES[rest];
  if (exact) {
    return exact;
  }
  for (const [prefix, route] of PREFIX_ROUTES) {
    if (rest.startsWith(prefix)) {
      return route;
    }
  }
  if (/^user\/(?:\(|%28)/i.test(rest)) {
    const target = rest.replace(ROUTE_GROUP_SEGMENT, "");
    return target === rest ? null : { target, canonical: false };
  }
  return null;
}

export interface CanonicalRedirectOptions {
  /** A bare locale root lands on the story page (guests on the web build). */
  storyHome: boolean;
}

/**
 * Where `/<locale>/<rest>` must permanently redirect to, or null when the
 * path is served as is. `rest` is the path after the locale, without slashes
 * at either end ("" for a bare locale root).
 */
export function legacyRedirectPath(
  locale: CountryLanguage,
  rest: string,
  { storyHome }: CanonicalRedirectOptions,
): string | null {
  if (rest === "") {
    return storyHome ? `/${canonicalSeoLocale(locale)}/story` : null;
  }
  const route = findLegacyRoute(rest);
  if (!route) {
    return null;
  }
  const targetLocale = route.canonical ? canonicalSeoLocale(locale) : locale;
  return `/${targetLocale}/${route.target}`;
}

/** Path after the locale segment, without slashes at either end. */
export function pathAfterLocale(path: string, locale: CountryLanguage): string {
  const prefix = `/${locale}`;
  const rest = path.startsWith(prefix) ? path.slice(prefix.length) : path;
  return rest.replace(/^\/+|\/+$/g, "");
}
