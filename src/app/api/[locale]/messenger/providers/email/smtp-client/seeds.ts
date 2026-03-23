/**
 * SMTP Client Seeds
 * Load SMTP accounts from environment variables for development and production.
 * Seeds into the unified messenger_accounts table.
 *
 * Each account can optionally include IMAP inbound config - same account, not a separate row.
 * - System account: EMAIL_* for SMTP, IMAP_* for inbound (falls back to IMAP_SEED_* legacy vars)
 * - Leads account:  LEADS_EMAIL_* for SMTP, LEADS_IMAP_* for inbound
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
  CampaignType,
  MessageChannel,
  MessengerAccountStatus,
  MessengerProvider,
} from "../../../accounts/enum";
import { messengerEnv } from "../../../env";
import { EmailImapAuthMethod, EmailSecurityType } from "../enum";
import { ImapSpecialUseType } from "../imap-client/enum";
import { imapClientEnv } from "../imap-client/env";

type NewMessengerAccount = typeof messengerAccounts.$inferInsert;

const DEFAULT_SYNC_FOLDERS = [
  ImapSpecialUseType.INBOX,
  ImapSpecialUseType.SENT,
  ImapSpecialUseType.DRAFTS,
];

/**
 * System SMTP + IMAP account (EMAIL_* / IMAP_* env vars)
 * Covers system, transactional, and notification campaign types.
 */
function getSystemAccountConfig(
  logger: EndpointLogger,
): NewMessengerAccount | null {
  const smtpHost = messengerEnv.EMAIL_HOST;
  const smtpPort = messengerEnv.EMAIL_PORT;
  const smtpUsername = messengerEnv.EMAIL_USER;
  const smtpPassword = messengerEnv.EMAIL_PASS;
  const fromEmail = messengerEnv.EMAIL_FROM_EMAIL;
  const fromName = messengerEnv.EMAIL_FROM_NAME ?? "Unbottled";

  if (!smtpHost || !smtpUsername || !smtpPassword || !fromEmail) {
    logger.debug(
      "System SMTP not configured (set EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_FROM_EMAIL)",
      { smtpHost, smtpUsername, hasPassword: !!smtpPassword, fromEmail },
    );
    return null;
  }

  // IMAP: prefer IMAP_* vars, fall back to legacy IMAP_SEED_* vars
  const imapHost =
    messengerEnv.IMAP_HOST ?? imapClientEnv.IMAP_SEED_HOST ?? smtpHost;
  const imapUsername =
    messengerEnv.IMAP_USER ?? imapClientEnv.IMAP_SEED_USERNAME ?? smtpUsername;
  const imapPassword =
    messengerEnv.IMAP_PASS ?? imapClientEnv.IMAP_SEED_PASSWORD ?? smtpPassword;
  const imapPort = messengerEnv.IMAP_PORT ?? imapClientEnv.IMAP_SEED_PORT;
  const imapSecure =
    messengerEnv.IMAP_SECURE ?? imapClientEnv.IMAP_SEED_SECURE ?? true;

  return {
    name: "System Email",
    description: "System emails: notifications, password resets, transactional",
    channel: MessageChannel.EMAIL,
    provider: MessengerProvider.SMTP,
    smtpHost,
    smtpPort: smtpPort ?? 587,
    smtpSecurityType: messengerEnv.EMAIL_SECURE
      ? EmailSecurityType.STARTTLS
      : EmailSecurityType.NONE,
    smtpUsername,
    smtpPassword,
    smtpFromEmail: fromEmail,
    smtpFromName: fromName,
    smtpConnectionTimeout: 30000,
    smtpMaxConnections: 5,
    smtpRateLimitPerHour: 1000,
    // IMAP inbound (same account)
    imapHost,
    imapPort,
    imapSecure,
    imapUsername,
    imapPassword,
    imapAuthMethod: EmailImapAuthMethod.PLAIN,
    imapConnectionTimeout: 30000,
    imapKeepAlive: true,
    imapSyncEnabled: true,
    imapSyncInterval: 180,
    imapMaxMessages: 1000,
    imapSyncFolders: DEFAULT_SYNC_FOLDERS,
    imapIsConnected: false,
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
    countries: [Countries.GLOBAL, Countries.DE, Countries.PL, Countries.US],
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
 * Lead campaigns SMTP + IMAP account (LEADS_EMAIL_* / LEADS_IMAP_* env vars)
 * Covers lead campaigns, newsletter, signup nurture, retention, winback.
 */
function getLeadsAccountConfig(
  logger: EndpointLogger,
): NewMessengerAccount | null {
  const smtpHost = leadsCampaignsEnv.LEADS_EMAIL_HOST;
  const smtpPort = leadsCampaignsEnv.LEADS_EMAIL_PORT;
  const smtpUsername = leadsCampaignsEnv.LEADS_EMAIL_USER;
  const smtpPassword = leadsCampaignsEnv.LEADS_EMAIL_PASS;
  const fromEmail = leadsCampaignsEnv.LEADS_EMAIL_FROM_EMAIL;
  const fromName = leadsCampaignsEnv.LEADS_EMAIL_FROM_NAME ?? "Unbottled Team";

  if (!smtpHost || !smtpUsername || !smtpPassword || !fromEmail) {
    logger.debug(
      "Leads SMTP not configured (set LEADS_EMAIL_HOST, LEADS_EMAIL_USER, LEADS_EMAIL_PASS, LEADS_EMAIL_FROM_EMAIL)",
      { smtpHost, smtpUsername, hasPassword: !!smtpPassword, fromEmail },
    );
    return null;
  }

  // IMAP: prefer LEADS_IMAP_* vars, fall back to SMTP host/credentials
  const imapHost = leadsCampaignsEnv.LEADS_IMAP_HOST ?? smtpHost;
  const imapUsername = leadsCampaignsEnv.LEADS_IMAP_USER ?? smtpUsername;
  const imapPassword = leadsCampaignsEnv.LEADS_IMAP_PASS ?? smtpPassword;
  const imapPort = leadsCampaignsEnv.LEADS_IMAP_PORT ?? 993;
  const imapSecure = leadsCampaignsEnv.LEADS_IMAP_SECURE ?? true;

  return {
    name: "Lead Campaigns Email",
    description:
      "Lead campaigns, newsletters, signup nurture, retention, winback",
    channel: MessageChannel.EMAIL,
    provider: MessengerProvider.SMTP,
    smtpHost,
    smtpPort: smtpPort ?? 587,
    smtpSecurityType: leadsCampaignsEnv.LEADS_EMAIL_SECURE
      ? EmailSecurityType.STARTTLS
      : EmailSecurityType.NONE,
    smtpUsername,
    smtpPassword,
    smtpFromEmail: fromEmail,
    smtpFromName: fromName,
    smtpConnectionTimeout: 30000,
    smtpMaxConnections: 5,
    smtpRateLimitPerHour: 1000,
    // IMAP inbound (same account)
    imapHost,
    imapPort,
    imapSecure,
    imapUsername,
    imapPassword,
    imapAuthMethod: EmailImapAuthMethod.PLAIN,
    imapConnectionTimeout: 30000,
    imapKeepAlive: true,
    imapSyncEnabled: true,
    imapSyncInterval: 180,
    imapMaxMessages: 1000,
    imapSyncFolders: DEFAULT_SYNC_FOLDERS,
    imapIsConnected: false,
    status: MessengerAccountStatus.ACTIVE,
    isDefault: true,
    priority: 100,
    consecutiveFailures: 0,
    messagesSentToday: 0,
    messagesSentTotal: 0,
    campaignTypes: [
      CampaignType.LEAD_CAMPAIGN,
      CampaignType.NEWSLETTER,
      CampaignType.SIGNUP_NURTURE,
      CampaignType.RETENTION,
      CampaignType.WINBACK,
    ],
    emailJourneyVariants: [
      EmailJourneyVariant.UNCENSORED_CONVERT,
      EmailJourneyVariant.SIDE_HUSTLE,
      EmailJourneyVariant.QUIET_RECOMMENDATION,
      EmailJourneyVariant.SIGNUP_NURTURE,
      EmailJourneyVariant.RETENTION,
      EmailJourneyVariant.WINBACK,
    ],
    emailCampaignStages: [
      EmailCampaignStage.NOT_STARTED,
      EmailCampaignStage.INITIAL,
      EmailCampaignStage.FOLLOWUP_1,
      EmailCampaignStage.FOLLOWUP_2,
      EmailCampaignStage.FOLLOWUP_3,
      EmailCampaignStage.NURTURE,
      EmailCampaignStage.REACTIVATION,
    ],
    countries: [Countries.GLOBAL, Countries.DE, Countries.PL, Countries.US],
    languages: [Languages.EN, Languages.DE, Languages.PL],
    isExactMatch: false,
    weight: 100,
    isFailover: false,
    failoverPriority: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function upsertAccounts(
  logger: EndpointLogger,
  label: string,
): Promise<void> {
  logger.debug(`🌱 Seeding ${label} messenger accounts...`);

  const systemAccount = getSystemAccountConfig(logger);
  const leadsAccount = getLeadsAccountConfig(logger);

  if (!systemAccount && !leadsAccount) {
    logger.debug(
      "⚠️  No messenger account env vars configured, skipping seeding",
    );
    return;
  }

  const accounts = [systemAccount, leadsAccount].filter(
    (a): a is NewMessengerAccount => a !== null,
  );

  try {
    for (const account of accounts) {
      // Match by name (stable seed identifier) - fromEmail may be shared across accounts in dev
      const existing = await db
        .select()
        .from(messengerAccounts)
        .where(eq(messengerAccounts.name, account.name))
        .limit(1);

      const updateSet = {
        name: account.name,
        description: account.description,
        smtpHost: account.smtpHost,
        smtpPort: account.smtpPort,
        smtpSecurityType: account.smtpSecurityType,
        smtpUsername: account.smtpUsername,
        smtpPassword: account.smtpPassword,
        smtpFromEmail: account.smtpFromEmail,
        smtpFromName: account.smtpFromName,
        smtpConnectionTimeout: account.smtpConnectionTimeout,
        smtpMaxConnections: account.smtpMaxConnections,
        smtpRateLimitPerHour: account.smtpRateLimitPerHour,
        imapHost: account.imapHost,
        imapPort: account.imapPort,
        imapSecure: account.imapSecure,
        imapUsername: account.imapUsername,
        imapPassword: account.imapPassword,
        imapAuthMethod: account.imapAuthMethod,
        imapConnectionTimeout: account.imapConnectionTimeout,
        imapKeepAlive: account.imapKeepAlive,
        imapSyncEnabled: account.imapSyncEnabled,
        imapSyncInterval: account.imapSyncInterval,
        imapMaxMessages: account.imapMaxMessages,
        imapSyncFolders: account.imapSyncFolders,
        campaignTypes: account.campaignTypes,
        emailJourneyVariants: account.emailJourneyVariants,
        emailCampaignStages: account.emailCampaignStages,
        countries: account.countries,
        languages: account.languages,
        isDefault: account.isDefault,
        priority: account.priority,
        weight: account.weight,
        isExactMatch: account.isExactMatch,
        isFailover: account.isFailover,
        failoverPriority: account.failoverPriority,
        updatedAt: new Date(),
      };

      if (existing.length > 0) {
        await db
          .update(messengerAccounts)
          .set(updateSet)
          .where(eq(messengerAccounts.name, account.name));
        logger.debug(`✅ Updated: ${account.name} (${account.smtpFromEmail})`);
      } else {
        await db.insert(messengerAccounts).values([account]);
        logger.debug(`✅ Seeded: ${account.name} (${account.smtpFromEmail})`);
      }
    }
  } catch (error) {
    logger.error("❌ Failed to seed messenger accounts:", parseError(error));
  }
}

export async function dev(logger: EndpointLogger): Promise<void> {
  await upsertAccounts(logger, "development");
}

export function test(logger: EndpointLogger): void {
  logger.debug("🌱 Skipping test messenger account seeding");
}

export async function prod(logger: EndpointLogger): Promise<void> {
  await upsertAccounts(logger, "production");
}

// Export priority for seed manager
export const priority = 75;
