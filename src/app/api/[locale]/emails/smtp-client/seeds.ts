/**
 * SMTP Client Seeds
 * Load SMTP accounts from environment variables for development
 */

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { EmailCampaignStage, EmailJourneyVariant } from "@/app/api/[locale]/leads/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Countries, Languages } from "@/i18n/core/config";

import { leadsCampaignsEnv } from "../../leads/campaigns/env";
import { emailEnv } from "../env";
import { type NewSmtpAccount, smtpAccounts } from "./db";
import { CampaignType, SmtpAccountStatus, SmtpHealthStatus, SmtpSecurityType } from "./enum";

/**
 * Get SMTP account 1 from environment variables (System/General emails)
 */
function getSmtpAccount1Config(logger: EndpointLogger): NewSmtpAccount | null {
  const host = emailEnv.EMAIL_HOST;
  const port = emailEnv.EMAIL_PORT;
  const username = emailEnv.EMAIL_USER;
  const password = emailEnv.EMAIL_PASS;
  const fromEmail = emailEnv.EMAIL_FROM_EMAIL;

  if (!host || !username || !password || !fromEmail) {
    logger.error("❌ SMTP environment variables not configured for account 1", {
      host,
      username,
      password,
      fromEmail,
    });
    return null;
  }

  return {
    name: "System SMTP Account",
    description: "System emails (notifications, password resets, etc.)",
    host,
    port: port || 587,
    securityType: emailEnv.EMAIL_SECURE ? SmtpSecurityType.STARTTLS : SmtpSecurityType.NONE,
    username,
    password,
    fromEmail,
    connectionTimeout: 30000,
    maxConnections: 5,
    rateLimitPerHour: 1000, // Minute limit will be calculated as 1000/60 ≈ 16
    status: SmtpAccountStatus.ACTIVE,
    isDefault: false,
    priority: 90,
    healthCheckStatus: SmtpHealthStatus.HEALTHY,
    consecutiveFailures: 0,
    emailsSentToday: 0,
    emailsSentThisMonth: 0,
    totalEmailsSent: 0,
    campaignTypes: [CampaignType.SYSTEM, CampaignType.TRANSACTIONAL, CampaignType.NOTIFICATION],
    emailJourneyVariants: [],
    emailCampaignStages: [],
    countries: [Countries.GLOBAL, Countries.DE, Countries.PL],
    languages: [Languages.EN, Languages.DE, Languages.PL],
    isExactMatch: false,
    weight: 90,
    isFailover: false,
    failoverPriority: 0,
    metadata: {
      environment: "development",
      account: "system",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Get SMTP account 2 from environment variables (Lead campaigns)
 */
function getSmtpAccount2Config(logger: EndpointLogger): NewSmtpAccount | null {
  const host = leadsCampaignsEnv.LEADS_EMAIL_HOST;
  const port = leadsCampaignsEnv.LEADS_EMAIL_PORT;
  const username = leadsCampaignsEnv.LEADS_EMAIL_USER;
  const password = leadsCampaignsEnv.LEADS_EMAIL_PASS;
  const fromEmail = leadsCampaignsEnv.LEADS_EMAIL_FROM_EMAIL;

  if (!host || !username || !password || !fromEmail) {
    logger.error("❌ Leads SMTP environment variables not configured for account 2", {
      host,
      username,
      password,
      fromEmail,
    });
    return null;
  }

  return {
    name: "Lead Campaigns SMTP Account",
    description: "Lead campaigns and marketing emails",
    host,
    port: port || 587,
    securityType: leadsCampaignsEnv.LEADS_EMAIL_SECURE
      ? SmtpSecurityType.STARTTLS
      : SmtpSecurityType.NONE,
    username,
    password,
    fromEmail,
    connectionTimeout: 30000,
    maxConnections: 5,
    rateLimitPerHour: 1000, // Minute limit will be calculated as 1000/60 ≈ 16
    status: SmtpAccountStatus.ACTIVE,
    isDefault: true,
    priority: 100,
    healthCheckStatus: SmtpHealthStatus.HEALTHY,
    consecutiveFailures: 0,
    emailsSentToday: 0,
    emailsSentThisMonth: 0,
    totalEmailsSent: 0,
    campaignTypes: [CampaignType.LEAD_CAMPAIGN],
    emailJourneyVariants: [
      EmailJourneyVariant.PERSONAL_APPROACH,
      EmailJourneyVariant.RESULTS_FOCUSED,
      EmailJourneyVariant.PERSONAL_RESULTS,
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
    metadata: {
      environment: "development",
      account: "leads",
    },
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
    logger.debug("⚠️  SMTP seed environment variables not configured, skipping seeding");
    logger.debug(
      "   Configure SMTP_SEED_1_* and SMTP_SEED_2_* environment variables to enable SMTP account seeding",
    );
    return;
  }

  try {
    const accounts = [account1, account2].filter(
      (account): account is NewSmtpAccount => account !== null,
    );

    for (const account of accounts) {
      // Check if account already exists by name (more specific than fromEmail)
      // This allows multiple accounts with same fromEmail but different purposes
      const existingAccount = await db
        .select()
        .from(smtpAccounts)
        .where(eq(smtpAccounts.name, account.name))
        .limit(1);

      if (existingAccount.length > 0) {
        logger.debug(`✅ SMTP account already exists: ${account.name} (${account.fromEmail})`);
        continue;
      }

      // Insert the account
      await db.insert(smtpAccounts).values([account]);
      logger.debug(`✅ Seeded SMTP account: ${account.name} (${account.fromEmail})`);
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
 * Production seed data
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Skipping production SMTP accounts seeding");
}

// Export priority for seed manager
export const priority = 75;
