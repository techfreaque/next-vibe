import "server-only";

import { redirect as tsRedirect } from "@tanstack/react-router";

/**
 * TanStack Start implementation of server-side redirect
 * Mirrors the web/lib/redirect.ts interface
 */
export function redirect(url: string): never {
  // eslint-disable-next-line restricted/restricted-syntax
  throw tsRedirect({ href: url, throw: true });
}

/** Permanent (308) redirect - mirrors web/lib/redirect.ts permanentRedirect. */
export function permanentRedirect(url: string): never {
  // eslint-disable-next-line restricted/restricted-syntax
  throw tsRedirect({ href: url, statusCode: 308, throw: true });
}
