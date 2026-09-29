/**
 * Preloaded into the nitro DEV WORKER via BUN_OPTIONS (see the dev branch of
 * ./vite-compiler.ts). The worker is a separate Bun child process
 * (env-runner's bun-process runner) whose srvx listener is a raw `Bun.serve`
 * without an `idleTimeout` — Bun then aborts any response that streams no
 * bytes for 10 seconds, which a cold-cache first SSR render regularly does
 * ("[Bun.serve]: request timed out after 10 seconds"). Nothing request-level
 * inside the app can extend that deadline, because the code that would is
 * itself part of the module graph still being transformed when the deadline
 * hits. Defaulting the idleTimeout at the `Bun.serve` boundary is the only
 * seam that exists before the first request; 255 seconds is Bun's maximum.
 * A caller that sets its own idleTimeout still wins (spread order).
 */
/// <reference types="bun-types" />

import type { Serve, Server } from "bun";

// HostnamePortServeOptions is the branch of Serve.Options srvx actually uses
// (a TCP listener), and the one that carries `idleTimeout`. The full
// Serve.Options XOR union cannot be spread under exactOptionalPropertyTypes.
type ServeOptions = Serve.HostnamePortServeOptions<undefined>;

declare const Bun:
  | { serve?: (options: ServeOptions) => Server<undefined> }
  | undefined;

if (typeof Bun !== "undefined" && typeof Bun.serve === "function") {
  const original = Bun.serve.bind(Bun);
  Bun.serve = (options: ServeOptions): Server<undefined> =>
    original({ idleTimeout: 255, ...options });
}
