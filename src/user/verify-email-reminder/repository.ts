/**
 * Verify-Email Reminder Repository
 * Free account credits need a verified email. Accounts that did not click the
 * signup link get ONE reminder 24 h later. Stateless and idempotent per run:
 * the hourly run picks the accounts created in the one-hour window that is
 * REMINDER_DELAY_HOURS old (windows are aligned to the hour), and skips any
 * address that already got a mail in the last few hours (guards double runs).
 */

import "server-only";

import { and, eq, gte, inArray, lt } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { emails } from "@/messenger/messages/db";
import { EmailSendingRepository } from "@/messenger/providers/email/smtp-client/email-sending/repository";

import { renderVerificationReminder } from "../public/verify-email/email";
import type {
  VerifyEmailReminderPostRequestOutput,
  VerifyEmailReminderPostResponseOutput,
} from "./definition";
import type { UserVerifyEmailReminderT } from "./i18n";
import { HOUR_MS, RECENT_MAIL_GUARD_HOURS, reminderWindow } from "./window";

export class VerifyEmailReminderRepository {
  static async sendDueReminders(
    data: VerifyEmailReminderPostRequestOutput,
    logger: EndpointLogger,
    t: UserVerifyEmailReminderT,
  ): Promise<ResponseType<VerifyEmailReminderPostResponseOutput>> {
    try {
      const { from, to } = reminderWindow(new Date());
      const due = await db
        .select({
          id: users.id,
          email: users.email,
          locale: users.locale,
        })
        .from(users)
        .where(
          and(
            eq(users.emailVerified, false),
            eq(users.isActive, true),
            eq(users.isBanned, false),
            gte(users.createdAt, from),
            lt(users.createdAt, to),
          ),
        )
        .limit(data.batchSize);

      if (due.length === 0) {
        return success({ candidates: 0, sent: 0, skipped: 0, failed: 0 });
      }

      const recentlyMailed = new Set(
        (
          await db
            .select({ email: emails.recipientEmail })
            .from(emails)
            .where(
              and(
                inArray(
                  emails.recipientEmail,
                  due.map((u) => u.email),
                ),
                gte(
                  emails.createdAt,
                  new Date(Date.now() - RECENT_MAIL_GUARD_HOURS * HOUR_MS),
                ),
              ),
            )
        ).map((row) => row.email.toLowerCase()),
      );

      let sent = 0;
      let skipped = 0;
      let failed = 0;

      for (const user of due) {
        if (recentlyMailed.has(user.email.toLowerCase())) {
          skipped++;
          continue;
        }
        const locale: CountryLanguage = user.locale;
        const rendered = await renderVerificationReminder(
          user.id,
          locale,
          logger,
        );
        if (!rendered.success) {
          logger.error("Verify reminder render failed", {
            userId: user.id,
            error: rendered.message,
          });
          failed++;
          continue;
        }
        if ("skip" in rendered.data) {
          skipped++;
          continue;
        }
        if (data.dryRun) {
          sent++;
          continue;
        }
        const { jsx, subject, toEmail, toName, leadId } = rendered.data;
        const result = await EmailSendingRepository.sendEmail(
          {
            jsx,
            subject,
            toEmail,
            toName,
            locale,
            emailJourneyVariant: null,
            emailCampaignStage: null,
            leadId,
          },
          logger,
          locale,
        );
        if (result.success) {
          sent++;
        } else {
          logger.error("Verify reminder send failed", {
            userId: user.id,
            error: result.message,
          });
          failed++;
        }
      }

      logger.info("Verify reminders processed", {
        candidates: due.length,
        sent,
        skipped,
        failed,
        dryRun: data.dryRun,
      });
      return success({ candidates: due.length, sent, skipped, failed });
    } catch (error) {
      logger.error("Verify reminder run failed", parseError(error));
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
