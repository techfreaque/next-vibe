import "server-only";

import type { Route } from "next";
import { redirect as nextRedirect } from "next/navigation";

/**
 * Web implementation of server-side redirect using Next.js navigation
 * This is a server-side only function for use in Server Components and Server Actions
 */
export function redirect<RouteType extends string>(
  url: Route<RouteType>,
): never {
  return nextRedirect(url);
}
