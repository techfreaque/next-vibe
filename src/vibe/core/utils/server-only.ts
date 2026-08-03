/**
 * Fails the import if this module graph is ever evaluated in a browser.
 *
 * Detection is on the RUNTIME, not on environment variables. The previous check
 * was `!process.env.NODE`, which is really "am I on Unix?" — `NODE` is set by
 * almost nobody, so on Windows this fired in cmd.exe and PowerShell while
 * staying quiet in Git Bash, for reasons that had nothing to do with browsers.
 *
 * `process.versions.node` (or `.bun`) is present in every server runtime and in
 * no browser, which is the question actually being asked. Bundlers shim
 * `process.env` to `{}` for the browser but do not invent `process.versions`.
 *
 * Deliberately does NOT log `process.env` on failure: it contains credentials
 * (AWS session tokens, API keys), and this throw is loud enough without dumping
 * them to a terminal or a CI log.
 *
 * Note this is NOT the `server-only` npm package — modules that want the
 * Next.js build-time guard import that directly. This is the runtime
 * equivalent, for builds that alias the package name onto a local module
 * because they do not ship it.
 */

const runtimeVersions: { bun?: string; node?: string } | undefined =
  typeof process === "undefined" ? undefined : process.versions;

if (!runtimeVersions?.node && !runtimeVersions?.bun) {
  // This is a module-load guard, not endpoint code: there is no caller to hand a
  // ResponseType to, and returning one would let the import succeed anyway.
  // oxlint-disable-next-line restricted/no-throw
  throw new Error(
    "This file is server-only and should not be imported in a client-side context.",
  );
}
