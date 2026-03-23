/**
 * TanStack Start shim for `server-only`.
 *
 * In Vite SSR context (import.meta.env.SSR = true), this is a no-op - the module
 * is legitimately imported on the server.
 *
 * In the client bundle (import.meta.env.SSR = false), throw to catch any server-only
 * module that leaks into the client bundle.
 */

if (!import.meta.env.SSR) {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- intentional error throw to protect server-only modules
  throw new Error(
    "This module cannot be imported from a Client Component module. " +
      "It should only be used from a Server Component.",
  );
}
