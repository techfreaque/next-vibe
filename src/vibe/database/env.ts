import "server-only";

import { defineEnv } from "next-vibe/env/define-env";
import { z } from "zod";

import { cliArgs, isPreviewMode } from "@/vibe/env/detect";

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
      if (!isPreviewMode || cliArgs.includes("--skip-db-setup")) {
        return raw;
      }
      try {
        const previewDbPort = process.env["PREVIEW_DB_PORT"] ?? "5433";
        const parsed = new URL(raw);
        parsed.port = previewDbPort;
        return parsed.toString();
      } catch {
        return raw;
      }
    }, z.string().url().default("postgres://postgres:postgres@localhost:5432/postgres")),
    example: "postgres://postgres:postgres@localhost:5432/postgres",
    comment: "Database connection URL",
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
