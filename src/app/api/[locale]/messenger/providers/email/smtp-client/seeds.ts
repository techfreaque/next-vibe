/**
 * SMTP Client Seeds
 * Load SMTP accounts from environment variables for development
 * Seeds into the unified messenger_accounts table
 */

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import {
  EmailCampaignStage,
  EmailJourneyVariant,
} from "@/app/api/[locale]/leads/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Countries, Languages } from "@/i18n/core/config";

import { leadsCampaignsEnv } from "../../../../leads/campaigns/env";
import { messengerAccounts } from "../../../accounts/db";
import {
  MessengerAccountStatus,
  MessengerProvider,
} from "../../../accounts/enum";
import { EmailSecurityType } from "../enum";
import { messengerEnv } from "../../../env";
import { CampaignType } from "../../../accounts/enum";
import { MessageChannel } from "../../../accounts/enum";

type NewMessengerAccount = typeof messengerAccounts.$inferInsert;

/**
 * Get SMTP account 1 from environment variables (System/General emails)
 */
function getSmtpAccount1Config(
  logger: EndpointLogger,
): NewMessengerAccount | null {
  const host = messengerEnv.EMAIL_HOST;
  const port = messengerEnv.EMAIL_PORT;
  const username = messengerEnv.EMAIL_USER;
  const password = messengerEnv.EMAIL_PASS;
  const fromEmail = messengerEnv.EMAIL_FROM_EMAIL;

  if (!host || !username || !password || !fromEmail) {
    logger.debug(
      "SMTP not configured for account 1 (set EMAIL_* vars to enable)",
      {
        host,
        username,
        hasPassword: !!password,
        fromEmail,
      },
    );
    return null;
  }

  return {
    name: "System SMTP Account",
    description: "System emails (notifications, password resets, etc.)",
    channel: MessageChannel.EMAIL,
    provider: MessengerProvider.SMTP,
    smtpHost: host,
    smtpPort: port || 587,
    smtpSecurityType: messengerEnv.EMAIL_SECURE
      ? EmailSecurityType.STARTTLS
      : EmailSecurityType.NONE,
    smtpUsername: username,
    smtpPassword: password,
    smtpFromEmail: fromEmail,
    smtpConnectionTimeout: 30000,
    smtpMaxConnections: 5,
    smtpRateLimitPerHour: 1000,
    status: MessengerAccountStatus.ACTIVE,
    isDefault: false,
    priority: 90,
    consecutiveFailures: 0,
    messagesSentToday: 0,
    messagesSentTotal: 0,
    campaignTypes: [
      CampaignType.SYSTEM,
      CampaignType.TRANSACTIONAL,
      CampaignType.NOTIFICATION,
    ],
    emailJourneyVariants: [],
    emailCampaignStages: [],
    countries: [Countries.GLOBAL, Countries.DE, Countries.PL],
    languages: [Languages.EN, Languages.DE, Languages.PL],
    isExactMatch: false,
    weight: 90,
    isFailover: false,
    failoverPriority: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Get SMTP account 2 from environment variables (Lead campaigns)
 */
function getSmtpAccount2Config(
  logger: EndpointLogger,
): NewMessengerAccount | null {
  const host = leadsCampaignsEnv.LEADS_EMAIL_HOST;
  const port = leadsCampaignsEnv.LEADS_EMAIL_PORT;
  const username = leadsCampaignsEnv.LEADS_EMAIL_USER;
  const password = leadsCampaignsEnv.LEADS_EMAIL_PASS;
  const fromEmail = leadsCampaignsEnv.LEADS_EMAIL_FROM_EMAIL;

  if (!host || !username || !password || !fromEmail) {
    logger.debug(
      "Leads SMTP not configured for account 2 (set LEADS_EMAIL_* vars to enable)",
      {
        host,
        username,
        hasPassword: !!password,
        fromEmail,
      },
    );
    return null;
  }

  return {
    name: "Lead Campaigns SMTP Account",
    description: "Lead campaigns and marketing emails",
    channel: MessageChannel.EMAIL,
    provider: MessengerProvider.SMTP,
    smtpHost: host,
    smtpPort: port || 587,
    smtpSecurityType: leadsCampaignsEnv.LEADS_EMAIL_SECURE
      ? EmailSecurityType.STARTTLS
      : EmailSecurityType.NONE,
    smtpUsername: username,
    smtpPassword: password,
    smtpFromEmail: fromEmail,
    smtpConnectionTimeout: 30000,
    smtpMaxConnections: 5,
    smtpRateLimitPerHour: 1000,
    status: MessengerAccountStatus.ACTIVE,
    isDefault: true,
    priority: 100,
    consecutiveFailures: 0,
    messagesSentToday: 0,
    messagesSentTotal: 0,
    campaignTypes: [CampaignType.LEAD_CAMPAIGN],
    emailJourneyVariants: [
      EmailJourneyVariant.UNCENSORED_CONVERT,
      EmailJourneyVariant.SIDE_HUSTLE,
      EmailJourneyVariant.QUIET_RECOMMENDATION,
    ],
    emailCampaignStages: [
      EmailCampaignStage.INITIAL,
      EmailCampaignStage.FOLLOWUP_1,
      EmailCampaignStage.FOLLOWUP_2,
      EmailCampaignStage.FOLLOWUP_3,
      EmailCampaignStage.NURTURE,
      EmailCampaignStage.REACTIVATION,
    ],
    countries: [Countries.GLOBAL, Countries.DE, Countries.PL],
    languages: [Languages.EN, Languages.DE, Languages.PL],
    isExactMatch: false,
    weight: 100,
    isFailover: false,
    failoverPriority: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Development seed data
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding development SMTP accounts...");

  const account1 = getSmtpAccount1Config(logger);
  const account2 = getSmtpAccount2Config(logger);

  if (!account1 && !account2) {
    logger.debug(
      "⚠️  SMTP seed environment variables not configured, skipping seeding",
    );
    return;
  }

  try {
    const accounts = [account1, account2].filter(
      (account): account is NewMessengerAccount => account !== null,
    );

    for (const account of accounts) {
      const existingAccount = await db
        .select()
        .from(messengerAccounts)
        .where(eq(messengerAccounts.name, account.name!))
        .limit(1);

      if (existingAccount.length > 0) {
        await db
          .update(messengerAccounts)
          .set({
            campaignTypes: account.campaignTypes,
            emailJourneyVariants: account.emailJourneyVariants,
            emailCampaignStages: account.emailCampaignStages,
            countries: account.countries,
            languages: account.languages,
            updatedAt: new Date(),
          })
          .where(eq(messengerAccounts.name, account.name!));
        logger.debug(
          `✅ Updated SMTP account: ${account.name} (${account.smtpFromEmail})`,
        );
        continue;
      }

      await db.insert(messengerAccounts).values([account]);
      logger.debug(
        `✅ Seeded SMTP account: ${account.name} (${account.smtpFromEmail})`,
      );
    }
  } catch (error) {
    logger.error("❌ Failed to seed SMTP accounts:", parseError(error));
  }
}

/**
 * Test seed data
 */
export function test(logger: EndpointLogger): void {
  logger.debug("🌱 Skipping test SMTP accounts seeding");
}

/**
 * Production seed data — same as dev, upserts SMTP accounts from env vars
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding production SMTP accounts...");
  await dev(logger);
}

// Export priority for seed manager
export const priority = 75;
