/**
 * IMAP Seeds
 * Sample data for testing the IMAP system
 */

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { imapAccounts, type NewImapAccount } from "./db";
import { ImapAuthMethod, ImapSpecialUseType, ImapSyncStatus } from "./enum";
import { imapClientEnv } from "./env";

/**
 * Get environment variables for IMAP seeding
 */
function getImapSeedConfig(): NewImapAccount {
  // Required account-specific environment variables
  const name =
    imapClientEnv.IMAP_SEED_ACCOUNT_NAME || "Development IMAP Account";
  const email = imapClientEnv.IMAP_SEED_EMAIL || "test@example.com";
  const host =
    imapClientEnv.IMAP_SEED_HOST || "app.api.emails.imapClient.imap.gmail.com";
  const username = imapClientEnv.IMAP_SEED_USERNAME || "";
  const password = imapClientEnv.IMAP_SEED_PASSWORD || "";
  const port = imapClientEnv.IMAP_SEED_PORT || 993;
  const secure = imapClientEnv.IMAP_SEED_SECURE ?? true;

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
  const email = imapClientEnv.IMAP_SEED_EMAIL;
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
    logger.error("❌ Failed to seed IMAP accounts:", parseError(error));
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

// Export priority for seed manager
// IMAP accounts have medium-low priority (30) - after users (100), leads (50), but before business data (10)
export const priority = 30;
