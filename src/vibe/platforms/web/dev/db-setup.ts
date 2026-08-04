/**
 * Dev-server database setup — the DB seam.
 *
 * Everything docker/drizzle/seed lives here: compose up/down, hard resets,
 * migration generation + run, db-function deploys, seeding and the
 * reverse-ws reconnect that follows a successful setup. DevRepository calls
 * {@link DevDatabaseSetup.setup} and imports nothing else from the database
 * layer, so a build without a database (e.g. pcvibe) omits this module and
 * the one call site behind `data.skipDbSetup` — a two-line fork diff.
 */

import { basename } from "node:path";

import { coreEnv } from "../../../core/env";
import type { CountryLanguage } from "../../../core/i18n/core/config";
import { parseError } from "../../../core/utils/parse-error";
import { databaseEnv } from "../../../database/env";
import { DatabaseGenerateRepository } from "../../../database/generate/repository";
import { closeDatabase, reopenDatabase } from "../../../database/index";
import { DatabaseMigrationRepository } from "../../../database/migrate/repository";
import { SeedRepository } from "../../../database/seed/repository";
import { scopedTranslation as dockerScopedTranslation } from "../../../database/utils/docker-operations/i18n";
import { DockerOperationsRepository } from "../../../database/utils/docker-operations/repository";
import { scopedTranslation as dbUtilsScopedTranslation } from "../../../database/utils/i18n";
import { DbUtilsRepository } from "../../../database/utils/repository";
import {
  formatActionCommand,
  formatCommand,
  formatDatabase,
  formatDuration,
  formatError,
  formatSkip,
  formatWarning,
} from "../../../logger/formatters";
import type { EndpointLogger } from "../../../logger/types";
import { cleanupPidFile } from "../pid";
import type { DevRequestOutput } from "./definition";

export class DevDatabaseSetup {
  private static readonly ATLAS_COMPOSE_FILE = "docker-compose-dev.yml";
  private static readonly PREVIEW_COMPOSE_FILE = "docker-compose.preview.yml";

  private static get projectSlug(): string {
    return basename(coreEnv.PROJECT_ROOT ?? process.cwd());
  }

  private static get ATLAS_PROJECT_NAME(): string {
    return `${DevDatabaseSetup.projectSlug}-atlas`;
  }

  private static get PREVIEW_PROJECT_NAME(): string {
    return `${DevDatabaseSetup.projectSlug}-hermes`;
  }

  /**
   * Setup database based on configuration.
   * Returns false if setup failed critically and the app server should start immediately.
   */
  static async setup(
    data: DevRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
    isPreview: boolean,
    activePidFile: string,
  ): Promise<boolean> {
    if (data.skipDbSetup) {
      logger.vibe(formatSkip("Database setup skipped"));
      return true;
    }

    try {
      const { t: dbUtilsT } = dbUtilsScopedTranslation.scopedT(locale);
      const dockerCheckResult = await DbUtilsRepository.isDockerAvailable(
        dbUtilsT,
        logger,
      );

      if (!dockerCheckResult.success || !dockerCheckResult.data) {
        logger.vibe(formatWarning("Docker unavailable (continuing anyway)"));
        logger.vibe(
          `🐳 ${formatCommand("Install Docker")} to enable database functionality`,
        );
        return true;
      }

      // Perform database operations based on reset flag
      const dbOperationSuccess =
        await DevDatabaseSetup.performDatabaseOperations(
          data,
          locale,
          logger,
          isPreview,
          activePidFile,
        );

      if (!dbOperationSuccess) {
        return false; // Critical failure, start the app server immediately
      }

      logger.info(formatDatabase("Database ready", "🗄️ "));

      // Re-run pull-on-connect for all active connections (and re-open reverse-ws
      // sockets) so cross-instance sync converges after a server restart without
      // requiring the user to reconnect manually.
      void DevDatabaseSetup.openReverseWsConnectors(logger);

      return true;
    } catch (error) {
      const parsedError = parseError(error);
      logger.vibe(formatError("Database setup failed (continuing anyway)"));
      logger.error("Database setup error details", parsedError);
      logger.vibe(`💡 Error: ${parsedError.message}`);
      return true;
    }
  }

  private static async openReverseWsConnectors(
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const { RemoteConnectionRepository } =
        await import("../../../remote-connection/repository");
      const { openConnection } =
        await import("../../../realtime/server/connector");
      const connections =
        await RemoteConnectionRepository.getAllActiveConnectionsForSync();
      let opened = 0;
      for (const conn of connections) {
        // openConnection runs the ONE HTTP pull-on-connect for EVERY transport
        // and opens a persistent socket only for a reverse-ws leg — so every
        // active connection re-syncs on boot, direct-http included, and only
        // reverse-ws legs get a socket.
        openConnection({
          id: conn.id,
          instanceId: conn.instanceId,
          remoteUrl: conn.remoteUrl,
          token: conn.token,
          leadId: conn.leadId,
          userId: conn.userId,
          remoteUserId: conn.remoteUserId,
          capabilitiesVersion: conn.capabilitiesVersion,
          sentCapabilitiesVersion: conn.sentCapabilitiesVersion,
          syncScope: conn.syncScope,
          syncCursors: conn.syncCursors,
          pushCursors: null,
          transportMode: conn.transportMode,
          remoteTransportMode: conn.remoteTransportMode,
        });
        opened++;
      }
      if (opened > 0) {
        logger.info(
          `[Connector] Re-synced ${String(opened)} connection(s) on startup`,
        );
      }
    } catch (err) {
      logger.warn("[Connector] Failed to auto-open reverse-ws connectors", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  /**
   * Perform database operations (reset or start) and migrations
   * Returns false if critical failure occurred
   */
  private static async performDatabaseOperations(
    data: DevRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
    isPreview: boolean,
    activePidFile: string,
  ): Promise<boolean> {
    try {
      if (data.dbReset || data.r) {
        if (isPreview) {
          logger.vibe(
            formatError(
              "Preview DB reset refused — resetting the preview database requires explicit user consent. Remove -r or run without --hermes to reset Atlas instead.",
            ),
          );
          cleanupPidFile(activePidFile);
          process.exit(1);
        }
        // Reset includes migrations, so we pass the migration flags
        await DevDatabaseSetup.resetDatabase(
          locale,
          logger,
          data,
          activePidFile,
        );
      } else {
        await DevDatabaseSetup.startDatabaseWithoutReset(
          locale,
          logger,
          isPreview,
        );

        // Run migrations if not skipped (only when not resetting)
        if (data.skipMigrations) {
          logger.vibe(formatSkip("Migrations skipped"));
        } else {
          if (!data.skipMigrationGeneration) {
            const generateResult = await DatabaseGenerateRepository.runGenerate(
              logger,
              true,
            );
            if (!generateResult.success) {
              DevDatabaseSetup.logDatabaseError(
                new Error(generateResult.message ?? "Generation failed"),
                logger,
              );
              cleanupPidFile(activePidFile);
              process.exit(1);
            }
          }
          const migrateResult =
            await DatabaseMigrationRepository.migrate(logger);
          if (!migrateResult.success) {
            DevDatabaseSetup.logDatabaseError(
              new Error(migrateResult.message ?? "Migration failed"),
              logger,
            );
            cleanupPidFile(activePidFile);
            process.exit(1);
          }
        }
      }

      // Deploy db-functions (idempotent - runs after every migration)
      const { deployDbFunctions } =
        await import("../../../database/db-functions/deploy");
      await deployDbFunctions(logger);

      // Seed database if not skipped
      if (data.skipSeeding) {
        logger.vibe(formatSkip("Database seeding skipped"));
      } else {
        await SeedRepository.seed("dev", logger);
      }

      return true;
    } catch (error) {
      DevDatabaseSetup.logDatabaseError(
        error instanceof Error ? error : new Error(String(error)),
        logger,
      );
      cleanupPidFile(activePidFile);
      process.exit(1);
    }
  }

  /**
   * Reset database with hard reset
   */
  private static async resetDatabase(
    locale: CountryLanguage,
    logger: EndpointLogger,
    data: DevRequestOutput,
    activePidFile: string,
    isPreview = false,
  ): Promise<void> {
    const startTime = Date.now();
    logger.debug(
      `🔄 ${formatActionCommand("Resetting database using:", "docker compose down && docker volume rm")}`,
    );
    await DevDatabaseSetup.performHardDatabaseReset(logger, locale, isPreview);
    const duration = Date.now() - startTime;
    logger.info(`✓  Reset completed in ${formatDuration(duration)}`);

    // Run migrations if not skipped
    if (data.skipMigrations) {
      logger.vibe(formatSkip("Migrations skipped"));
    } else {
      if (!data.skipMigrationGeneration) {
        const generateResult = await DatabaseGenerateRepository.runGenerate(
          logger,
          true,
        );
        if (!generateResult.success) {
          DevDatabaseSetup.logDatabaseError(
            new Error(generateResult.message ?? "Generation failed"),
            logger,
          );
          cleanupPidFile(activePidFile);
          process.exit(1);
        }
      }
      const migrateResult = await DatabaseMigrationRepository.migrate(logger);
      if (!migrateResult.success) {
        DevDatabaseSetup.logDatabaseError(
          new Error(migrateResult.message ?? "Migration failed"),
          logger,
        );
        cleanupPidFile(activePidFile);
        process.exit(1);
      }
    }
  }

  /**
   * Perform hard database reset: stop containers, delete data, restart
   */
  private static async performHardDatabaseReset(
    logger: EndpointLogger,
    locale: CountryLanguage,
    isPreview: boolean,
  ): Promise<void> {
    const { exec } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execAsync = promisify(exec);

    const composeFile = isPreview
      ? DevDatabaseSetup.PREVIEW_COMPOSE_FILE
      : DevDatabaseSetup.ATLAS_COMPOSE_FILE;
    const projectName = isPreview
      ? DevDatabaseSetup.PREVIEW_PROJECT_NAME
      : DevDatabaseSetup.ATLAS_PROJECT_NAME;
    const containerName = isPreview
      ? `${DevDatabaseSetup.projectSlug}-hermes-postgres`
      : `${DevDatabaseSetup.projectSlug}-atlas-postgres`;

    // 0. Close any open DB pool connections so docker compose down doesn't
    //    produce "Connection terminated unexpectedly" errors.
    await closeDatabase(logger);

    // 1. Stop Docker containers
    logger.debug("Stopping Docker containers...");
    const { t: dockerT } = dockerScopedTranslation.scopedT(locale);
    const downResult = await DockerOperationsRepository.dockerComposeDown(
      logger,
      dockerT,
      composeFile,
      30000,
      projectName,
    );

    if (!downResult.success) {
      logger.warn("Failed to stop Docker containers, continuing anyway");
    }

    // 2. Force-remove the container (hardcoded container_name in compose
    //    means `docker compose down` may not clean it up properly)
    try {
      await execAsync(`docker rm -f ${containerName}`, { timeout: 10000 });
      logger.debug(`Removed ${containerName} container`);
    } catch {
      logger.debug(`No ${containerName} container to remove`);
    }

    // 3. Delete postgres data volume
    await DevDatabaseSetup.deletePostgresDataVolume(logger, isPreview);

    // 4. Start Docker containers
    logger.debug("Starting Docker containers...");
    const upResult = await DockerOperationsRepository.dockerComposeUp(
      logger,
      dockerT,
      composeFile,
      60000,
      projectName,
    );

    if (!upResult.success) {
      logger.error("Failed to start Docker containers", {
        error: upResult.message || "Unknown error",
      });
      // Continue execution - don't throw, let the process continue
      logger.vibe(
        formatError("Database startup failed, continuing without database"),
      );
    }
    // 5. Wait for database to be ready
    await DevDatabaseSetup.waitForDatabaseConnection(logger);

    // 6. Reopen the shared pool/db client (closed in step 0 above)
    reopenDatabase();
  }

  /**
   * Delete postgres data volume for clean reset
   */
  private static async deletePostgresDataVolume(
    logger: EndpointLogger,
    isPreview = false,
  ): Promise<void> {
    try {
      const { exec } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const execAsync = promisify(exec);

      const slug = DevDatabaseSetup.projectSlug;
      const volumeName = isPreview
        ? `${slug}-hermes_hermes_data`
        : `${slug}-atlas_atlas_data`;
      logger.debug(`Deleting postgres data volume: ${volumeName}...`);

      try {
        // Remove the Docker volume (this is much cleaner than dealing with file permissions)
        await execAsync(`docker volume rm ${volumeName}`, { timeout: 10000 });
        logger.debug("Postgres data volume deleted");
      } catch {
        logger.debug("Postgres data volume not found or already deleted");
      }
    } catch (error) {
      logger.warn("Failed to delete postgres data volume", parseError(error));
      // Don't throw - continue anyway
    }
  }

  /**
   * Wait for database connection to be ready using proper database ping
   * Uses the same approach as CLI reset script for consistency
   */
  private static async waitForDatabaseConnection(
    logger: EndpointLogger,
  ): Promise<void> {
    const maxAttempts = 60; // 60 attempts = 30 seconds
    const delayMs = 500; // 500ms between attempts

    logger.debug("Waiting for database to be ready...");

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Wait a bit before checking
        await new Promise<void>((resolve) => {
          setTimeout(resolve, delayMs);
        });

        // Use proper database connection test
        const { Pool } = await import("pg");

        const pool = new Pool({
          connectionString: databaseEnv.DATABASE_URL,
          connectionTimeoutMillis: 5000,
        });

        try {
          await pool.query("SELECT 1");
          await pool.end();

          logger.debug(
            `✅ Database connection ready after ${attempt} attempts (${(attempt * delayMs) / 1000}s)`,
          );
          return;
        } catch {
          // Intentionally suppress pool.end() errors - pool might already be closed
          // oxlint-disable-next-line no-empty-function
          await pool.end().catch(() => {});
          // Log progress every 10 attempts
          if (attempt % 10 === 0) {
            logger.debug(
              `⏳ Still waiting for database... (${attempt}/${maxAttempts})`,
            );
          }
        }
      } catch {
        if (attempt === maxAttempts) {
          logger.error(
            "❌ Database connection timeout - this will cause errors",
          );
          // eslint-disable-next-line restricted/restricted-syntax -- CLI fatal error requires throw to halt execution
          throw new Error(
            `Database connection timeout after ${maxAttempts} attempts (${(maxAttempts * delayMs) / 1000}s)`,
          );
        }

        if (attempt % 10 === 0) {
          logger.debug(
            `⏳ Database not ready yet, retrying (${attempt}/${maxAttempts})...`,
          );
        }
      }
    }
  }

  /**
   * Start database without reset
   */
  private static async startDatabaseWithoutReset(
    locale: CountryLanguage,
    logger: EndpointLogger,
    isPreview = false,
  ): Promise<void> {
    const composeFile = isPreview
      ? DevDatabaseSetup.PREVIEW_COMPOSE_FILE
      : DevDatabaseSetup.ATLAS_COMPOSE_FILE;
    const projectName = isPreview
      ? DevDatabaseSetup.PREVIEW_PROJECT_NAME
      : DevDatabaseSetup.ATLAS_PROJECT_NAME;

    const startTime = Date.now();
    logger.debug(
      `🐘 ${formatActionCommand("Starting PostgreSQL using:", `docker compose -f ${composeFile} up -d`)}`,
    );
    const { t: dockerT } = dockerScopedTranslation.scopedT(locale);
    const dbStartResult = await DockerOperationsRepository.dockerComposeUp(
      logger,
      dockerT,
      composeFile,
      60000,
      projectName,
    );

    if (!dbStartResult.success) {
      logger.error("Failed to start database", {
        error: dbStartResult.message,
      });
      logger.vibe(formatError("Database startup failed"));
      logger.vibe(
        `   Try: ${formatCommand(`docker compose -f ${composeFile} up -d`)}`,
      );
      // eslint-disable-next-line restricted/restricted-syntax -- CLI fatal error requires throw to halt execution
      throw new Error("Failed to start database");
    }

    const duration = Date.now() - startTime;
    logger.info(
      formatDatabase(
        `${formatActionCommand("Started PostgreSQL using:", `docker compose -f ${composeFile} up -d`)} in ${formatDuration(duration)}`,
        "🐘",
      ),
    );
  }

  /**
   * Log database error with helpful suggestions
   */
  private static logDatabaseError(error: Error, logger: EndpointLogger): void {
    const parsedError = parseError(error);
    logger.vibe(
      formatError(`Database operation failed: ${parsedError.message}`),
    );
    logger.vibe(`💡 Try running: ${formatCommand("vibe dev -r")}`);
  }
}
