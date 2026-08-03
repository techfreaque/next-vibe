// oxlint-disable oxlint-plugin-restricted/no-throw
/**
 * TanStack Start shim for `server-only`.
 *
 * SSR (import.meta.env.SSR = true): no-op.
 * Client bundle: throw
 */

if (!import.meta.env.SSR) {
  throw new Error("[server-only] imported in client bundle");
}
