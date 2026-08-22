/**
 * DB Functions - Deployment
 *
 * Auto-discovers all `db-functions.ts` files colocated with endpoints,
 * extracts compiled Drizzle queries + logic, and deploys them
 * to PostgreSQL via `CREATE OR REPLACE FUNCTION`.
 *
 * Runs after Drizzle migrations on every `vibe dev` / `vibe start`.
 * Functions are idempotent code - safe to deploy fresh on every startup.
 */

import "server-only";

import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { sql } from "drizzle-orm";

import { getApiDir } from "@/env/paths";

import { toImportUrl } from "../../core/generators/shared/utils";
import { parseError } from "../../core/utils/parse-error";
import {
  formatDatabase,
  formatDuration,
  formatError,
} from "../../logger/formatters";
import type { EndpointLogger } from "../../logger/types";
import { db, isPglite } from "..";
import type { DbFunction } from "./define";
import type { PgType } from "./types";

/** Shape we check for at runtime to identify db function exports */
type DbFunctionLike = DbFunction<
  Record<string, PgType>,
  Record<string, PgType>
>;

/**
 * Deploy all database functions found in the codebase.
 * Called from server startup after Drizzle migrations.
 */
export async function deployDbFunctions(logger: EndpointLogger): Promise<void> {
  if (isPglite) {
    logger.debug("PGlite mode — skipping db functions (plv8 not available)");
    return;
  }

  const startTime = Date.now();

  try {
    await ensurePlv8Extension(logger);

    const dbFunctionFiles = discoverDbFunctionFiles();
    if (dbFunctionFiles.length === 0) {
      logger.debug("No db-functions files found");
      return;
    }

    logger.debug(
      `Found ${String(dbFunctionFiles.length)} db-functions file(s)`,
    );

    let deployed = 0;
    for (const filePath of dbFunctionFiles) {
      const count = await deployFile(filePath, logger);
      deployed += count;
    }

    const duration = Date.now() - startTime;
    if (deployed > 0) {
      logger.info(
        formatDatabase(
          `Deployed ${String(deployed)} db function(s) in ${formatDuration(duration)}`,
          "\u26A1",
        ),
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(
      formatError(
        `DB functions deployment failed after ${formatDuration(duration)}`,
      ),
      parseError(error),
    );
    // Don't re-throw - deployment failure shouldn't block server startup
  }
}

/**
 * Ensure the plv8 PostgreSQL extension is installed.
 */
async function ensurePlv8Extension(logger: EndpointLogger): Promise<void> {
  try {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS plv8`);
    logger.debug("PL/v8 extension ready");
  } catch (error) {
    const parsed = parseError(error);
    logger.error(
      "Failed to create PL/v8 extension. Is plv8 installed in your PostgreSQL instance?",
      parsed,
    );
    // eslint-disable-next-line restricted/restricted-syntax -- Extension is a hard requirement
    throw new Error(`PL/v8 extension not available: ${parsed.message}`, {
      cause: error,
    });
  }
}

/**
 * Recursively scan for db-functions.ts files under src/.
 */
function discoverDbFunctionFiles(): string[] {
  const apiDir = getApiDir();
  const files: string[] = [];

  function scan(dir: string): void {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (entry === "db-functions.ts") {
        files.push(fullPath);
      } else if (entry !== "node_modules") {
        try {
          if (statSync(fullPath).isDirectory()) {
            scan(fullPath);
          }
        } catch {
          // Skip inaccessible entries
        }
      }
    }
  }

  scan(apiDir);
  return files;
}

/**
 * Import a single db-functions.ts file and deploy all exported functions.
 */
async function deployFile(
  filePath: string,
  logger: EndpointLogger,
): Promise<number> {
  const projectRoot = process.cwd();
  const relativePath = relative(projectRoot, filePath);

  try {
    const mod = (await import(
      /* webpackIgnore: true */ /* turbopackIgnore: true */ toImportUrl(
        filePath,
      )
    )) as Record<string, DbFunctionLike | undefined>;
    let count = 0;

    for (const [exportName, value] of Object.entries(mod)) {
      if (value && isDbFunction(value)) {
        await deploySingleFunction(value, relativePath, exportName, logger);
        count++;
      }
    }

    return count;
  } catch (error) {
    logger.error(
      `Failed to deploy db functions from ${relativePath}`,
      parseError(error),
    );
    return 0;
  }
}

/**
 * Deploy a single database function.
 * If the return type changed, PostgreSQL rejects CREATE OR REPLACE —
 * we detect this, DROP the old function, and retry.
 */
async function deploySingleFunction(
  fn: DbFunctionLike,
  filePath: string,
  exportName: string,
  logger: EndpointLogger,
): Promise<void> {
  const sqlStatement = fn.toSQL();

  logger.debug(
    `Deploying db function: ${fn.name} (from ${filePath}:${exportName})`,
  );

  try {
    await db.execute(sql.raw(sqlStatement));
  } catch (error) {
    const message = parseError(error).message;
    if (message.includes("cannot change return type of existing function")) {
      logger.debug(
        `Return type changed for ${fn.name}, dropping and recreating`,
      );
      await db.execute(sql.raw(`DROP FUNCTION IF EXISTS ${fn.name} CASCADE`));
      await db.execute(sql.raw(sqlStatement));
    } else {
      // eslint-disable-next-line restricted/restricted-syntax -- Re-throw non-return-type errors
      throw error;
    }
  }

  logger.debug(
    `Deployed db function: ${fn.name} (tables: ${fn.tableNames.join(", ")})`,
  );
}

/**
 * Type guard for DbFunction objects.
 */
function isDbFunction(value: DbFunctionLike): value is DbFunctionLike {
  return (
    typeof value === "object" &&
    "name" in value &&
    "tableNames" in value &&
    "call" in value &&
    "toSQL" in value &&
    typeof value.call === "function" &&
    typeof value.toSQL === "function"
  );
}
