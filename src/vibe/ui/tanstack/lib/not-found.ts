import { notFound as tsNotFound } from "@tanstack/react-router";

/**
 * TanStack Start implementation of not-found
 * Mirrors the web/lib/not-found.ts interface
 */
export function notFound(): never {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
  throw tsNotFound();
}
