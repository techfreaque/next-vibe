/**
 * IMAP Seeds
 * Sample data for testing the IMAP system
 */

import { eq } from "drizzle-orm";
import { env } from "next-vibe/server/env";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { imapAccounts, type NewImapAccount } from "../messages/db";
import { ImapAuthMethod, ImapSpecialUseType, ImapSyncStatus } from "./enum";

/**
 * Get environment variables for IMAP seeding
 */
function getImapSeedConfig(): NewImapAccount {
  // Required account-specific environment variables
  const name = env.IMAP_SEED_ACCOUNT_NAME || "Development IMAP Account";
  const email = env.IMAP_SEED_EMAIL || "test@example.com";
  const host = env.IMAP_SEED_HOST || "imap.gmail.com";
  const username = env.IMAP_SEED_USERNAME || "";
  const password = env.IMAP_SEED_PASSWORD || "";
  const port = env.IMAP_SEED_PORT || 993;
  const secure =
    env.IMAP_SEED_SECURE !== undefined ? env.IMAP_SEED_SECURE : true;

  // Hardcoded settings for consistency
  const authMethod = ImapAuthMethod.PLAIN;
  const connectionTimeout = 30000;
  const keepAlive = true;
  const syncInterval = 180; // 3 minutes
  const maxMessages = 1000;
  const syncFolders = [
    ImapSpecialUseType.INBOX,
    ImapSpecialUseType.SENT,
    ImapSpecialUseType.DRAFTS,
  ];

  return {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase().trim(),
    host: host.trim(),
    port,
    secure,
    username: username.trim(),
    password, // In production, this should be encrypted
    authMethod,
    connectionTimeout,
    keepAlive,
    enabled: true,
    syncInterval,
    maxMessages,
    syncFolders,
    syncStatus: ImapSyncStatus.PENDING,
    isConnected: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Development seed data
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding development IMAP accounts...");

  // Check if environment variables are configured
  const email = env.IMAP_SEED_EMAIL;
  if (!email || email === "your-email@example.com") {
    logger.debug(
      "⚠️  IMAP seed environment variables not configured, skipping seeding",
    );
    logger.debug(
      "   Configure IMAP_SEED_* environment variables to enable IMAP account seeding",
    );
    return;
  }

  try {
    // Check if account already exists
    const existingAccount = await db
      .select()
      .from(imapAccounts)
      .where(eq(imapAccounts.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingAccount.length > 0) {
      logger.debug(`✅ IMAP account already exists for ${email}`);
      return;
    }

    // Create the seed account
    const seedAccount = getImapSeedConfig();
    await db.insert(imapAccounts).values([seedAccount]);

    logger.debug(
      `✅ Seeded IMAP account: ${seedAccount.name} (${seedAccount.email})`,
    );
  } catch (error) {
    logger.error("❌ Failed to seed IMAP accounts:", error);
  }
}

/**
 * Production seed data
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Skipping production IMAP accounts seeding");
}

/**
 * Test seed data
 */
export function test(logger: EndpointLogger): void {
  logger.debug("🌱 Skipping test IMAP accounts seeding");
}

// Register seeds with the seed manager
// IMAP accounts have medium-low priority (30) - after users (100), leads (50), but before business data (10)
registerSeed(
  "imap-accounts",
  {
    dev,
    test,
    prod,
  },
  30,
);
