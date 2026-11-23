/**
 * Signup Reminder Repository
 *
 * Confirmation-first signup creates the account only when the email is
 * confirmed. About one in five email signups on prod stopped there (2026-11-19
 * to 11-23: 24 pending signups expired, none of them ever typed the code).
 * Each pending signup still open REMINDER_DELAY_HOURS after its last email gets
 * ONE reminder: a fresh code and a link valid for a day. The reminder is
 * recorded as a REMINDER_SENT signup event (unique dedupe key), so a pending
 * signup is never reminded twice, even across overlapping runs.
 */

import "server-only";

import { and, eq, gte, lt, notExists, sql } from "drizzle-orm";
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

import { sendSignupReminder } from "../public/signup/confirmation-mail";
import { pendingSignups, signupEvents } from "../public/signup/db";
import { normalizedEmailSql } from "../public/signup/email-guard";
import { SignupEventType } from "../public/signup/event-type";
import { scopedTranslation as signupScopedTranslation } from "../public/signup/i18n";
import {
  issueSignupChallenge,
  REMINDER_CONFIRMATION_TTL,
} from "../public/signup/pending";
import type {
  SignupReminderPostRequestOutput,
  SignupReminderPostResponseOutput,
} from "./definition";
import type { UserSignupReminderT } from "./i18n";
import { reminderDedupeKey, reminderDueRange } from "./window";

export class SignupReminderRepository {
  static async sendDueReminders(
    data: SignupReminderPostRequestOutput,
    logger: EndpointLogger,
    t: UserSignupReminderT,
  ): Promise<ResponseType<SignupReminderPostResponseOutput>> {
    try {
      const { sentAfter, sentBefore } = reminderDueRange(new Date());
      const due = await db
        .select()
        .from(pendingSignups)
        .where(
          and(
            eq(pendingSignups.bounced, false),
            gte(pendingSignups.sentAt, sentAfter),
            lt(pendingSignups.sentAt, sentBefore),
            notExists(
              db
                .select({ id: signupEvents.id })
                .from(signupEvents)
                .where(
                  and(
                    eq(signupEvents.pendingId, pendingSignups.id),
                    eq(signupEvents.type, SignupEventType.REMINDER_SENT),
                  ),
                ),
            ),
            // Signed up some other way in the meantime (new attempt, login).
            notExists(
              db
                .select({ id: users.id })
                .from(users)
                .where(
                  sql`${normalizedEmailSql()} = ${normalizedEmailSql(pendingSignups.email)}`,
                ),
            ),
          ),
        )
        .limit(data.batchSize);

      if (data.dryRun || due.length === 0) {
        return success({
          candidates: due.length,
          sent: data.dryRun ? due.length : 0,
          skipped: 0,
          failed: 0,
        });
      }

      let sent = 0;
      let skipped = 0;
      let failed = 0;
      for (const row of due) {
        // Persist the claim before touching the mail provider. A delivery
        // attempt with an unknown outcome must remain claimed after a restart.
        const [claim] = await db
          .insert(signupEvents)
          .values({
            leadId: row.leadId,
            pendingId: row.id,
            type: SignupEventType.REMINDER_SENT,
            dedupeKey: reminderDedupeKey(row.id),
          })
          .onConflictDoNothing({ target: signupEvents.dedupeKey })
          .returning({ id: signupEvents.id });
        if (!claim) {
          skipped++;
          continue;
        }

        const { t: signupT } = signupScopedTranslation.scopedT(row.locale);
        const issued = await issueSignupChallenge(
          row,
          row,
          row.signupIp,
          logger,
          signupT,
          sendSignupReminder,
          REMINDER_CONFIRMATION_TTL,
        );
        if (!issued.success) {
          // These failures occur before delivery, so the claim can be released.
          await db.delete(signupEvents).where(eq(signupEvents.id, claim.id));
          logger.warn("Signup reminder skipped", {
            pendingId: row.id,
            reason: issued.message,
          });
          skipped++;
          continue;
        }
        if (issued.data.deliveryFailed) {
          logger.error("Signup reminder send failed", { pendingId: row.id });
          failed++;
        } else {
          sent++;
        }
      }

      logger.info("Signup reminders processed", {
        candidates: due.length,
        sent,
        skipped,
        failed,
      });
      return success({ candidates: due.length, sent, skipped, failed });
    } catch (error) {
      logger.error("Signup reminder run failed", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
