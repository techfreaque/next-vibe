/**
 * Verify-Email Reminder Repository
 * Free account credits need a verified email. Accounts that did not click the
 * signup link get ONE reminder 24 h later. Stateless and idempotent per run:
 * the hourly run picks the accounts created in the one-hour window that is
 * REMINDER_DELAY_HOURS old (windows are aligned to the hour), and skips any
 * address that already got a mail in the last few hours (guards double runs).
 */

import "server-only";

import { and, eq, gte, inArray, lt, notExists } from "drizzle-orm";
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
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import type { EndpointLogger } from "next-vibe/logger/types";

import { emails } from "@/messenger/messages/db";

import { requestAccountChallenge } from "../public/verify-email/account-challenge";
import { accountEmailChallenges } from "../public/verify-email/db";
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
            notExists(
              db
                .select({ id: accountEmailChallenges.userId })
                .from(accountEmailChallenges)
                .where(
                  and(
                    eq(accountEmailChallenges.userId, users.id),
                    eq(accountEmailChallenges.email, users.email),
                  ),
                ),
            ),
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
        if (data.dryRun) {
          sent++;
          continue;
        }
        const account = await UserRepository.getUserById(
          user.id,
          UserDetailLevel.STANDARD,
          locale,
          logger,
        );
        if (!account.success || account.data.emailVerified) {
          skipped++;
          continue;
        }
        const result = await requestAccountChallenge(
          account.data,
          "notice",
          locale,
          logger,
        );
        if (result.success && result.data === "existing") {
          skipped++;
        } else if (result.success) {
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
