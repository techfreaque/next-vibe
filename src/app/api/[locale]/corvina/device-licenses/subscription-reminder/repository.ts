import "server-only";

import React from "react";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import { CampaignType } from "@/app/api/[locale]/messenger/accounts/enum";
import { EmailSendingRepository } from "@/app/api/[locale]/messenger/providers/email/smtp-client/email-sending/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { corvinaDeviceSubscriptions } from "../db";
import { computeEffectiveDates } from "../subscription/repository";
import type { SubscriptionReminderPostResponseOutput } from "./definition";
import { SubscriptionReminderEmailContent } from "./email";
import type { SubscriptionReminderT } from "./i18n";

const EXPIRING_SOON_DAYS = 30;
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? "";

export class SubscriptionReminderRepository {
  static async run(
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: SubscriptionReminderT,
  ): Promise<ResponseType<SubscriptionReminderPostResponseOutput>> {
    try {
      const now = new Date();

      const rows = await db.select().from(corvinaDeviceSubscriptions);

      let checked = 0;
      let reminded = 0;
      const errors: string[] = [];

      for (const row of rows) {
        checked++;

        const { effectiveEndDate } = computeEffectiveDates(
          row.trialStartDate,
          row.subscriptionEndDate,
        );

        if (!effectiveEndDate) {
          continue;
        }

        const msUntilExpiry = effectiveEndDate.getTime() - now.getTime();
        const daysUntilExpiry = Math.ceil(
          msUntilExpiry / (1000 * 60 * 60 * 24),
        );

        if (daysUntilExpiry < 0 || daysUntilExpiry > EXPIRING_SOON_DAYS) {
          continue;
        }

        const cycleKey = effectiveEndDate.toISOString();
        if (row.reminderCycleKey === cycleKey) {
          continue;
        }

        const emailProps = {
          logicalId: row.logicalId,
          orgResourceId: row.orgResourceId,
          expiryDate: effectiveEndDate,
          daysUntilExpiry,
        };

        if (row.clientEmail) {
          const clientJsx = React.createElement(
            SubscriptionReminderEmailContent,
            {
              ...emailProps,
              isAdmin: false,
            },
          );
          const clientSubject = `Your device subscription expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"}`;
          const clientResult = await EmailSendingRepository.sendEmail(
            {
              jsx: clientJsx,
              subject: clientSubject,
              toEmail: row.clientEmail,
              toName: row.clientEmail,
              locale,
              campaignType: CampaignType.TRANSACTIONAL,
              skipRateLimitCheck: true,
            },
            logger,
            locale,
          );
          if (!clientResult.success) {
            errors.push(
              `client email failed for ${row.logicalId}: ${clientResult.message}`,
            );
          }
        }

        if (ADMIN_EMAIL) {
          const adminJsx = React.createElement(
            SubscriptionReminderEmailContent,
            {
              ...emailProps,
              isAdmin: true,
              clientEmail: row.clientEmail ?? undefined,
            },
          );
          const adminSubject = `[Admin] Subscription expiring: ${row.logicalId}`;
          const adminResult = await EmailSendingRepository.sendEmail(
            {
              jsx: adminJsx,
              subject: adminSubject,
              toEmail: ADMIN_EMAIL,
              toName: "Admin",
              locale,
              campaignType: CampaignType.TRANSACTIONAL,
              skipRateLimitCheck: true,
            },
            logger,
            locale,
          );
          if (!adminResult.success) {
            errors.push(
              `admin email failed for ${row.logicalId}: ${adminResult.message}`,
            );
          }
        }

        await db
          .update(corvinaDeviceSubscriptions)
          .set({
            reminderSentAt: now,
            reminderCycleKey: cycleKey,
            updatedAt: now,
          })
          .where(eq(corvinaDeviceSubscriptions.id, row.id));

        reminded++;
        logger.info("Subscription reminder sent", {
          logicalId: row.logicalId,
          daysUntilExpiry,
        });
      }

      logger.info("Subscription reminder run complete", { checked, reminded });
      return success({ checked, reminded, errors });
    } catch (error) {
      logger.error(
        "SubscriptionReminderRepository.run failed",
        parseError(error),
      );
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
