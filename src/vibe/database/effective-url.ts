/**
 * Single source of truth for the DATABASE_URL a process actually connects to.
 *
 * Atlas (no flags) uses DATABASE_URL as-is (PGlite `file:` or Postgres).
 * Hermes / preview (`--hermes`, `--preview`, build/start) must NEVER share
 * Atlas's database:
 *   - Postgres URL  -> port swapped to PREVIEW_DB_PORT (docker-compose.preview.yml)
 *   - `file:` URL   -> HERMES_DATABASE_URL if set (Postgres or its own `file:`),
 *                      otherwise the Hermes Docker Postgres on PREVIEW_DB_PORT.
 *
 * Pure (no `server-only`, no env module imports) so env.ts and client.ts can
 * both import it without a cycle. Idempotent: resolving an already-resolved
 * URL returns the same value.
 */
import { cliArgs, isPreviewMode } from "../env/detect";

export const DEFAULT_PREVIEW_DB_PORT = "5433";
const HERMES_DB_NAME = "hermes";

/** Postgres URL of the Hermes docker container (docker-compose.preview.yml). */
function defaultHermesPostgresUrl(): string {
  const port = process.env["PREVIEW_DB_PORT"] ?? DEFAULT_PREVIEW_DB_PORT;
  return `postgres://postgres:postgres@localhost:${port}/${HERMES_DB_NAME}`;
}

export function resolveEffectiveDatabaseUrl(raw: string): string {
  if (!isPreviewMode || cliArgs.includes("--skip-db-setup")) {
    return raw;
  }
  return resolveHermesDatabaseUrl(raw);
}

/**
 * The Hermes database URL derived from Atlas's DATABASE_URL, regardless of the
 * current process mode. Test harnesses running as Atlas use it to reach the
 * Hermes DB directly (a plain port swap breaks on a PGlite `file:` URL).
 */
export function resolveHermesDatabaseUrl(raw: string): string {
  const hermesUrl = process.env["HERMES_DATABASE_URL"];
  if (hermesUrl && hermesUrl.length > 0) {
    return hermesUrl;
  }
  if (raw.startsWith("file:")) {
    // Atlas PGlite must not be shared with Hermes.
    return defaultHermesPostgresUrl();
  }
  try {
    const parsed = new URL(raw);
    parsed.port = process.env["PREVIEW_DB_PORT"] ?? DEFAULT_PREVIEW_DB_PORT;
    return parsed.toString();
  } catch {
    return raw;
  }
}
