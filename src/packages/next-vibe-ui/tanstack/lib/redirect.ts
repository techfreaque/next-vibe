import { redirect as tsRedirect } from "@tanstack/react-router";

/**
 * TanStack Start implementation of server-side redirect
 * Mirrors the web/lib/redirect.ts interface
 */
export function redirect(url: string): never {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
  throw tsRedirect({ href: url, throw: true });
}
