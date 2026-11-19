// Container entry point. The public listener opens only after this process exits successfully.
import "next-vibe/platforms/cli/runtime/cli-widget-plugin";

import { and, eq } from "drizzle-orm";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { NodePgSession } from "drizzle-orm/node-postgres";
import { PgDialect } from "drizzle-orm/pg-core";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { databaseEnv } from "next-vibe/database/env";
import { seedDatabase } from "next-vibe/database/seed/seed-manager";
import { verifyPassword } from "next-vibe/identity/auth/password";
import { identityEnv } from "next-vibe/identity/env";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Client } from "pg";

const logger = createEndpointLogger(false, defaultLocale);
const config = {
  migrationsFolder: "./drizzle",
  migrationsSchema: "public",
  migrationsTable: "__drizzle_migrations__",
};

// Keep the upstream hashes, journal timestamps, and PostgreSQL indexes. Only
// the optional pgvector type needs adaptation on an extension-free database.
const migrations = readMigrationFiles(config).map((migration) => ({
  ...migration,
  sql: migration.sql
    .filter(
      (stmt) => !/^\s*CREATE EXTENSION IF NOT EXISTS vector;\s*$/i.test(stmt),
    )
    .map((stmt) => stmt.replace(/\bvector\(\d+\)/gi, "text")),
}));

async function bootstrap(): Promise<void> {
  const client = new Client({ connectionString: databaseEnv.DATABASE_URL });
  await client.connect();
  try {
    // Concurrent pod replacement must not race migrations or admin creation.
    await client.query("SELECT pg_advisory_lock(864122, 1)");
    const dialect = new PgDialect();
    await dialect.migrate(
      migrations,
      new NodePgSession(client, dialect, undefined),
      config,
    );
    await seedDatabase("prod", logger, defaultLocale);
    const [admin] = await db
      .select({ password: users.password })
      .from(users)
      .innerJoin(userRoles, eq(userRoles.userId, users.id))
      .where(
        and(
          eq(users.email, identityEnv.VIBE_ADMIN_USER_EMAIL),
          eq(userRoles.role, UserRole.ADMIN),
          eq(users.isActive, true),
          eq(users.isBanned, false),
        ),
      )
      .limit(1);
    if (
      !admin ||
      !(await verifyPassword(
        identityEnv.VIBE_ADMIN_USER_PASSWORD,
        admin.password,
      ))
    ) {
      logger.error("Pod administrator setup failed");
      process.exitCode = 1;
    }
  } finally {
    // Destroy this dedicated connection, releasing its session-level advisory lock.
    await client.end();
  }
  process.exit(process.exitCode ?? 0);
}

void bootstrap();
