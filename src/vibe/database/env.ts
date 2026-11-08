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
