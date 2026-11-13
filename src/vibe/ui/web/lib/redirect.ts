import "server-only";

import type { Route } from "next";
import {
  permanentRedirect as nextPermanentRedirect,
  redirect as nextRedirect,
} from "next/navigation";

/**
 * Web implementation of server-side redirect using Next.js navigation
 * This is a server-side only function for use in Server Components and Server Actions
 */
export function redirect<RouteType extends string>(
  url: Route<RouteType>,
): never {
  return nextRedirect(url);
}

/**
 * Permanent (308) server-side redirect - for moved/duplicate URLs, so search
 * engines transfer the old URL to the new one.
 */
export function permanentRedirect<RouteType extends string>(
  url: Route<RouteType>,
): never {
  return nextPermanentRedirect(url);
}
