import "server-only";

import { mkdirSync, readFileSync } from "node:fs";
import { hostname } from "node:os";
import { join } from "node:path";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { isPglite } from "next-vibe/database/index";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  HeadlessClientRequestOutput,
  HeadlessClientResponseOutput,
} from "./definition";
import { scopedTranslation } from "next-vibe/server/server/headless-client/i18n";

import { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";

const TASK_RESTART_DELAYS_MS = [5000, 10000, 30000, 60000];

export class HeadlessClientRepository {
  private static shuttingDown = false;
  private static taskRunnerRestartCount = 0;

  static async start(
    request: HeadlessClientRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<HeadlessClientResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    // Resolve computer name: explicit CLI arg → env override → dev fixed name → OS hostname
    // In development, default to "headless-client" so all dev machines share a stable ID.
    // In production, fall back to the OS hostname so each machine is distinct.
    const isDev = process.env["NODE_ENV"] !== "production";
    const computerName =
      request.computerName ??
      process.env["VIBE_COMPUTER_NAME"] ??
      (isDev ? "headless-client" : (hostname().split(".")[0] ?? "headless"));

    // Ensure .tmp exists for pid/log files and activate file logging
    mkdirSync(".tmp", { recursive: true });
    process.env["VIBE_LOG_TARGET"] = "file";
    process.env["VIBE_LOG_PATH"] = ".tmp";
    process.env["VIBE_LOG_FILE"] = `.headless-${computerName}.log`;
    process.env["VIBE_LOG_TIMESTAMP"] = "iso";

    logger.info("[HeadlessClient] Starting", { computerName });

    // PGlite: run migrations in-process using exec() — drizzle-kit uses pg driver,
    // and drizzle-orm/pglite/migrator uses query() which rejects multi-statement files.
    // Standard pg: migrations are assumed to have run already (vibe migrate).
    if (isPglite) {
      const migrationError = await HeadlessClientRepository.runPgliteMigrations(
        logger,
        locale,
      );
      if (migrationError) {
        logger.error("[HeadlessClient] Migration error", {
          error: migrationError,
        });
        return fail({
          message: t("post.errors.migrationError"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      logger.info("[HeadlessClient] Migrations complete");
    }

    // Register the connection from CLI args and open all active reverse-WS connections.
    try {
      const [{ openConnection }, { remoteConnections }, { eq, and }] =
        await Promise.all([
          import("next-vibe/realtime/connector"),
          import("@/app/api/[locale]/remote-connection/db"),
          import("drizzle-orm"),
        ]);

      // Resolve DB user ID — CLI bypass user (00000000-...-0001) has no DB row.
      // Fall back to looking up the real admin user from VIBE_ADMIN_USER_EMAIL.
      const CLI_BYPASS_ID = "00000000-0000-0000-0000-000000000001";
      const rawUserId = "id" in user ? user.id : undefined;
      let userId =
        rawUserId && rawUserId !== CLI_BYPASS_ID ? rawUserId : undefined;
      if (!userId) {
        const { AuthRepository } =
          await import("next-vibe/identity/auth/repository");
        const adminEmail = process.env["VIBE_ADMIN_USER_EMAIL"] ?? "";
        const adminAuth = await AuthRepository.authenticateUserByEmail(
          adminEmail,
          locale,
          logger,
        );
        if (adminAuth.success) {
          userId = adminAuth.data.id;
        }
      }

      if (!userId) {
        logger.warn(
          "[HeadlessClient] Could not resolve user ID for connection upsert",
        );
      }

      // Upsert the connection passed on the command line.
      // instanceId = computerName so the remote sees this client by its machine name.
      const upsertResult =
        await RemoteConnectionRepository.upsertRemoteConnection({
          userId: userId ?? "",
          instanceId: computerName,
          remoteUrl: request.remoteUrl,
          token: request.token,
          leadId: request.leadId,
          transportMode: "reverse-ws",
          isReverseEntry: false,
          logger,
        });
      if (!upsertResult.success) {
        logger.warn("[HeadlessClient] Failed to upsert connection", {
          error: upsertResult.message,
        });
      } else {
        // Set connection mode: AI loop runs on cloud (loopLocation=server = relay to us).
        // toolSource=local: atlas builds system prompt + tools locally using the client's
        // identity (headless-client), then sends them in the relay body. The remote ws-provider
        // runs the AI with those tools — so the AI's system prompt says "Instance ID: headless-client".
        // toolSource=remote would mean the provider builds its own prompt (atlas identity) — wrong.
        await db
          .update(remoteConnections)
          .set({
            threadMirrorMode: "cloud",
            loopLocation: "server",
            toolSource: "local",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(remoteConnections.userId, userId ?? ""),
              eq(remoteConnections.instanceId, computerName),
              eq(remoteConnections.isReverseEntry, false),
            ),
          );
        logger.info("[HeadlessClient] Connection mode set", {
          transportMode: "reverse-ws",
          threadMirrorMode: "cloud",
          loopLocation: "server",
          toolSource: "local",
        });
      }

      // Open all active reverse-WS connections (includes the one we just upserted).
      const connections =
        await RemoteConnectionRepository.getAllActiveConnectionsForSync();
      let opened = 0;
      for (const conn of connections) {
        if (conn.transportMode === "reverse-ws" && !conn.isReverseEntry) {
          openConnection({
            id: conn.instanceId,
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
          });
          opened++;
        }
      }
      logger.info(`[HeadlessClient] Opened ${opened.toString()} connection(s)`);
    } catch (error) {
      logger.warn("[HeadlessClient] Failed to open connections", {
        error: parseError(error).message,
      });
    }

    // Start the task runner (handles cron tasks and tool execution callbacks)
    void HeadlessClientRepository.startTaskRunner(user, locale, logger);

    // Register graceful shutdown
    const handleShutdown = (): void => {
      HeadlessClientRepository.shuttingDown = true;
      logger.info("[HeadlessClient] Shutting down");
      process.exit(0);
    };
    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);

    logger.info("[HeadlessClient] Ready — waiting for tool requests");

    // Run forever
    return await new Promise<never>(() => {
      /* exits only via signal handlers */
    });
  }

  private static async runPgliteMigrations(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<string | null> {
    const { pgliteClient: client } = await import("next-vibe/database");
    if (!client) {
      return "pgliteClient is null — not running in PGlite mode";
    }

    try {
      // Bootstrap migrations tracking table (mirrors drizzle's schema)
      await client.exec(`
        CREATE SCHEMA IF NOT EXISTS drizzle;
        CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
          id SERIAL PRIMARY KEY,
          hash TEXT NOT NULL,
          created_at BIGINT
        );
      `);

      const applied = await client.query<{ hash: string }>(
        "SELECT hash FROM drizzle.__drizzle_migrations",
      );
      const appliedSet = new Set(applied.rows.map((r) => r.hash));

      const journalPath = join(
        process.cwd(),
        "drizzle",
        "meta",
        "_journal.json",
      );
      const journal = JSON.parse(readFileSync(journalPath, "utf8")) as {
        entries: Array<{ tag: string }>;
      };

      for (const entry of journal.entries) {
        if (appliedSet.has(entry.tag)) {
          continue;
        }
        const sqlPath = join(process.cwd(), "drizzle", `${entry.tag}.sql`);
        // Strip pgvector (not bundled in PGlite WASM) and rewrite vector columns to text.
        const sql = readFileSync(sqlPath, "utf8")
          .replace(/CREATE EXTENSION IF NOT EXISTS vector[^;]*;/gi, "")
          .replace(/vector\(\d+\)/gi, "text");
        logger.info(`[HeadlessClient] Applying migration: ${entry.tag}`);
        await client.exec(sql);
        await client.query(
          "INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)",
          [entry.tag, Date.now()],
        );
      }

      // Seed production data (admin user + roles) so the task runner can authenticate.
      const { seedDatabase } =
        await import("next-vibe/database/seed/seed-manager");
      await seedDatabase("prod", logger, locale);
      logger.info("[HeadlessClient] Production seed complete");
      return null;
    } catch (error) {
      return parseError(error).message;
    }
  }

  private static async startTaskRunner(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const { UnifiedTaskRunnerRepository } =
        await import("next-vibe/tasks/unified-runner/repository");

      UnifiedTaskRunnerRepository.environment = "production";

      const runRunner = (): void => {
        void UnifiedTaskRunnerRepository.manageRunner(
          { action: "start", taskFilter: "cron", dryRun: false },
          user,
          locale,
          logger,
          true,
        ).catch((err) => {
          if (HeadlessClientRepository.shuttingDown) {
            return;
          }
          const delay =
            TASK_RESTART_DELAYS_MS[
              Math.min(
                HeadlessClientRepository.taskRunnerRestartCount,
                TASK_RESTART_DELAYS_MS.length - 1,
              )
            ] ?? 60000;
          HeadlessClientRepository.taskRunnerRestartCount++;
          logger.error(
            `[HeadlessClient] Task runner exited — restarting in ${Math.round(delay / 1000)}s`,
            { error: parseError(err).message },
          );
          setTimeout(() => {
            if (!HeadlessClientRepository.shuttingDown) {
              runRunner();
            }
          }, delay);
        });
      };

      runRunner();
      logger.info("[HeadlessClient] Task runner started");
    } catch (error) {
      logger.warn("[HeadlessClient] Task runner failed to start", {
        error: parseError(error).message,
      });
    }
  }
}
