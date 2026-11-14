/**
 * Log persistence target, resolvable from any server process.
 *
 * `loggerEnv.VIBE_LOG_TARGET` (env.ts) computes the default, but defineEnv only
 * writes it to process.env when env.ts is first evaluated, and the prod Next.js
 * server process loads env.ts lazily (browser tool, env settings). Until then
 * `process.env.VIBE_LOG_TARGET` was undefined and every server-side warn/error
 * silently skipped the error_logs table (prod 2026-11-13/14: zero server rows
 * for 30 h while the container logs showed them). Callers that decide
 * persistence read it through resolveLogTarget(), never raw process.env.
 *
 * Kept dependency-free (argv detection only) so the logger can import it
 * without an env -> validation -> logger cycle.
 */

import { isMcpCommand, isStartCommand } from "../env/detect";

export const LOG_TARGETS = ["file", "db", "none"] as const;
export type LogTarget = (typeof LOG_TARGETS)[number];

function isLogTarget(value: string | undefined): value is LogTarget {
  return value === "file" || value === "db" || value === "none";
}

/**
 * Default when nothing is configured: a prod server (`vibe start/build/
 * rebuild`, NODE_ENV=production, not MCP) persists to the DB, everything else
 * (dev servers, CLI, MCP) to files.
 */
export function defaultLogTarget(): LogTarget {
  return !isMcpCommand &&
    isStartCommand &&
    process.env["NODE_ENV"] === "production"
    ? "db"
    : "file";
}

/** The configured target (env / .env), else the default. Read at call time. */
export function resolveLogTarget(): LogTarget {
  const configured = process.env["VIBE_LOG_TARGET"];
  return isLogTarget(configured) ? configured : defaultLogTarget();
}
