import "server-only";

import { z } from "zod";

import { defineEnv } from "../env/define-env";
import { resolveEffectiveDatabaseUrl } from "./effective-url";

export const {
  env: databaseEnv,
  schema: databaseEnvSchema,
  examples: databaseEnvExamples,
} = defineEnv({
  DATABASE_URL: {
    schema: z.preprocess((v) => {
      const raw =
        typeof v === "string"
          ? v
          : (process.env["DATABASE_URL"] ??
            "postgres://postgres:postgres@localhost:5432/postgres");
      const effective = resolveEffectiveDatabaseUrl(raw);
      if (effective !== raw) {
        // Keep child processes / raw process.env readers on the same DB.
        process.env["DATABASE_URL"] = effective;
      }
      return effective;
    }, z.string().url().default("postgres://postgres:postgres@localhost:5432/postgres")),
    example: "postgres://postgres:postgres@localhost:5432/postgres",
    comment: "Database connection URL",
    sensitive: true,
  },
  HERMES_DATABASE_URL: {
    schema: z.string().optional(),
    example: "postgres://postgres:postgres@localhost:5433/hermes",
    comment:
      "Hermes (--hermes / --preview) database URL. Overrides DATABASE_URL in Hermes mode so Hermes never shares Atlas's PGlite. Unset: Hermes docker Postgres on PREVIEW_DB_PORT (docker-compose.preview.yml). Set to a file: URL (e.g. file:./data.hermes.db) for an isolated PGlite without Docker.",
    sensitive: true,
  },
  PREVIEW_DB_PORT: {
    schema: z.coerce.number().int().positive().optional().default(5433),
    example: "5433",
    comment:
      "Preview database port for local mode (vibe build/start). Derives DATABASE_URL by swapping the port.",
    fieldType: "number",
  },
  PREVIEW_PORT: {
    schema: z.coerce.number().int().positive().optional().default(3001),
    example: "3001",
    comment:
      "Preview app port for local mode (vibe build/start). Derives NEXT_PUBLIC_APP_URL by swapping the port.",
    fieldType: "number",
  },
  DATABASE_POOL_MAX: {
    schema: z.coerce.number().int().positive().optional().default(10),
    example: "10",
    comment:
      "Max connections in the app's Postgres pool (ignored for PGlite file: URLs).",
    commented: true,
    fieldType: "number",
  },
  DATABASE_CONNECT_TIMEOUT_MS: {
    schema: z.coerce.number().int().nonnegative().optional().default(10_000),
    example: "10000",
    comment:
      "Max wait for a pooled Postgres connection (new TCP connect or a free pool slot), in ms. Fail fast instead of piling up requests on a dead link.",
    commented: true,
    fieldType: "number",
  },
  DATABASE_IDLE_TIMEOUT_MS: {
    schema: z.coerce.number().int().nonnegative().optional().default(30_000),
    example: "30000",
    comment: "Close pooled Postgres connections idle this long, in ms.",
    commented: true,
    fieldType: "number",
  },
  DATABASE_KEEPALIVE_DELAY_MS: {
    schema: z.coerce.number().int().nonnegative().optional().default(10_000),
    example: "10000",
    comment:
      "TCP keepalive initial delay for Postgres sockets, in ms. Detects silently dropped links (WireGuard/NAT) on idle connections.",
    commented: true,
    fieldType: "number",
  },
  DATABASE_STATEMENT_TIMEOUT_MS: {
    schema: z.coerce.number().int().nonnegative().optional().default(30_000),
    example: "30000",
    comment:
      "Server-side statement_timeout for normal app queries, in ms (0 = off). Long jobs use getLongRunningDb() instead.",
    commented: true,
    fieldType: "number",
  },
  DATABASE_QUERY_TIMEOUT_MS: {
    schema: z.coerce.number().int().nonnegative().optional().default(45_000),
    example: "45000",
    comment:
      "Client-side read timeout per query, in ms (0 = off). Catches black-holed connections where the server's cancel never arrives; the connection is then destroyed. Always kept at least 5 s above the statement timeout.",
    commented: true,
    fieldType: "number",
  },
  DATABASE_IDLE_IN_TRANSACTION_TIMEOUT_MS: {
    schema: z.coerce.number().int().nonnegative().optional().default(60_000),
    example: "60000",
    comment:
      "Server-side idle_in_transaction_session_timeout, in ms (0 = off). Kills sessions that sit in an open transaction (e.g. after the client vanished) so their locks are released.",
    commented: true,
    fieldType: "number",
  },
  DATABASE_LONG_STATEMENT_TIMEOUT_MS: {
    schema: z.coerce.number().int().nonnegative().optional().default(900_000),
    example: "900000",
    comment:
      "statement_timeout for the separate long-running pool (getLongRunningDb: admin SQL, backfills, maintenance), in ms (0 = off).",
    commented: true,
    fieldType: "number",
  },
});

/**
 * PGlite mode (`DATABASE_URL=file:...`) - no Docker PostgreSQL to start or wait
 * for. Same source as database/client's isPglite, without opening the client.
 */
export function usesPglite(): boolean {
  return resolveEffectiveDatabaseUrl(
    process.env["DATABASE_URL"] ?? databaseEnv.DATABASE_URL,
  ).startsWith("file:");
}
