/**
 * IMAP Seeds
 * Sample data for testing the IMAP system — inserts into messenger_accounts (unified table)
 */

import { eq, and } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { messengerAccounts } from "../../../accounts/db";
import {
  MessengerAccountStatus,
  MessengerProvider,
} from "../../../accounts/enum";
import { EmailImapAuthMethod } from "../enum";
import { ImapSpecialUseType } from "./enum";
import { imapClientEnv } from "./env";
import { MessageChannel } from "../../../accounts/enum";

/**
 * Development seed data — creates a messenger_accounts row with IMAP config
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding development IMAP accounts (messenger_accounts)...");

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

  const name =
    imapClientEnv.IMAP_SEED_ACCOUNT_NAME || "Development IMAP Account";
  const host = imapClientEnv.IMAP_SEED_HOST || "imap.gmail.com";
  const username = imapClientEnv.IMAP_SEED_USERNAME || "";
  const password = imapClientEnv.IMAP_SEED_PASSWORD || "";
  const port = imapClientEnv.IMAP_SEED_PORT || 993;
  const secure = imapClientEnv.IMAP_SEED_SECURE ?? true;

  try {
    // Check if account already exists by name
    const existingAccount = await db
      .select()
      .from(messengerAccounts)
      .where(
        and(
          eq(messengerAccounts.name, name),
          eq(messengerAccounts.channel, MessageChannel.EMAIL),
        ),
      )
      .limit(1);

    if (existingAccount.length > 0) {
      logger.debug(`✅ IMAP messenger account already exists: ${name}`);
      return;
    }

    const syncFolders = [
      ImapSpecialUseType.INBOX,
      ImapSpecialUseType.SENT,
      ImapSpecialUseType.DRAFTS,
    ];

    await db.insert(messengerAccounts).values([
      {
        name,
        channel: MessageChannel.EMAIL,
        provider: MessengerProvider.SMTP,
        status: MessengerAccountStatus.ACTIVE,
        smtpHost: host,
        smtpFromEmail: email.toLowerCase().trim(),
        smtpUsername: username.trim(),
        smtpPassword: password,
        smtpPort: 587,
        imapHost: host,
        imapPort: port,
        imapSecure: secure,
        imapUsername: username.trim(),
        imapPassword: password,
        imapAuthMethod: EmailImapAuthMethod.PLAIN,
        imapConnectionTimeout: 30000,
        imapKeepAlive: true,
        imapSyncEnabled: true,
        imapSyncInterval: 180,
        imapMaxMessages: 1000,
        imapSyncFolders: syncFolders,
        imapIsConnected: false,
      },
    ]);

    logger.debug(`✅ Seeded IMAP messenger account: ${name} (${email})`);
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
