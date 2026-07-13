// oxlint-disable oxlint-plugin-restricted/restricted-syntax
/**
 * TanStack Start shim for `server-only`.
 *
 * SSR (import.meta.env.SSR = true): no-op.
 * Client bundle: throw
 */

if (!import.meta.env.SSR) {
  throw new Error("[server-only] imported in client bundle");
}
