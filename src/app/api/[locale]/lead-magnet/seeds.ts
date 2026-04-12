/**
 * Lead Magnet Seeds
 * Seeds:
 * 1. A messenger SMTP account using env EMAIL_* credentials (needed by platform-email provider)
 * 2. A lead magnet platform-email config for the admin user
 */

import { eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";
import { messengerAccounts } from "@/app/api/[locale]/messenger/accounts/db";
import {
  CampaignType,
  MessageChannel,
  MessengerAccountStatus,
  MessengerProvider,
} from "@/app/api/[locale]/messenger/accounts/enum";
import { EmailSecurityType } from "@/app/api/[locale]/messenger/providers/email/enum";
import { users } from "@/app/api/[locale]/user/db";

import { leadMagnetConfigs } from "./db";

export const priority = 35;

const SMTP_ACCOUNT_NAME = "[DEV] Platform Email (SMTP)";

export async function dev(logger: EndpointLogger): Promise<void> {
  try {
    // 1. Seed the SMTP messenger account using env credentials
    const smtpHost = process.env.EMAIL_HOST;
    const smtpUser = process.env.EMAIL_USER;
    const smtpPass = process.env.EMAIL_PASS;
    const smtpFromEmail = process.env.EMAIL_FROM_EMAIL;
    const smtpFromName = process.env.EMAIL_FROM_NAME;
    const smtpPort = process.env.EMAIL_PORT
      ? Number(process.env.EMAIL_PORT)
      : 587;

    if (!smtpHost || !smtpUser || !smtpPass || !smtpFromEmail) {
      logger.warn(
        "EMAIL_HOST/EMAIL_USER/EMAIL_PASS/EMAIL_FROM_EMAIL not set, skipping messenger SMTP account seed",
      );
    } else {
      const existingSmtp = await db
        .select({ id: messengerAccounts.id })
        .from(messengerAccounts)
        .where(eq(messengerAccounts.name, SMTP_ACCOUNT_NAME))
        .limit(1);

      if (existingSmtp.length > 0) {
        logger.debug(
          `SMTP account "${SMTP_ACCOUNT_NAME}" already exists, skipping`,
        );
      } else {
        await db.insert(messengerAccounts).values({
          name: SMTP_ACCOUNT_NAME,
          description:
            "Dev SMTP account for lead magnet platform-email notifications",
          channel: MessageChannel.EMAIL,
          provider: MessengerProvider.SMTP,
          status: MessengerAccountStatus.ACTIVE,
          isDefault: true,
          priority: 10,
          smtpHost,
          smtpPort,
          smtpSecurityType: EmailSecurityType.STARTTLS,
          smtpUsername: smtpUser,
          smtpPassword: smtpPass,
          smtpFromEmail,
          smtpFromName: smtpFromName ?? "Unbottled.ai",
          campaignTypes: [
            CampaignType.TRANSACTIONAL,
            CampaignType.NOTIFICATION,
          ],
        });
        logger.info(`Created SMTP messenger account: ${SMTP_ACCOUNT_NAME}`);
      }
    }

    // 2. Seed the lead magnet platform-email config for admin
    const adminEmail = env.VIBE_ADMIN_USER_EMAIL;
    if (!adminEmail) {
      logger.warn(
        "VIBE_ADMIN_USER_EMAIL not set, skipping lead magnet config seed",
      );
      return;
    }

    const adminResults = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (adminResults.length === 0) {
      logger.warn(
        `Admin user (${adminEmail}) not found, skipping lead magnet config seed`,
      );
      return;
    }

    const adminId = adminResults[0].id;

    const existing = await db
      .select({ id: leadMagnetConfigs.id })
      .from(leadMagnetConfigs)
      .where(eq(leadMagnetConfigs.userId, adminId))
      .limit(1);

    if (existing.length > 0) {
      logger.debug("Lead magnet config already exists for admin, skipping");
      return;
    }

    await db.insert(leadMagnetConfigs).values({
      userId: adminId,
      provider: "PLATFORM_EMAIL",
      credentials: {
        notifyEmail: adminEmail,
        notifyEmailName: "Admin",
      },
      headline: "Get exclusive AI tips free",
      buttonText: "Get access →",
      isActive: true,
    });

    logger.info(`Created lead magnet platform-email config for ${adminEmail}`);
  } catch (error) {
    logger.error(`Lead magnet seed failed: ${String(error)}`);
  }
}

export async function test(): Promise<void> {
  // no test seeds
}

export async function prod(): Promise<void> {
  // no prod seeds
}
