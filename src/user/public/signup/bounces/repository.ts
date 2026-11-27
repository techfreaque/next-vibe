import "server-only";

import {
  and,
  desc,
  eq,
  exists,
  gte,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { coreEnv } from "next-vibe/core/env";
import {
  type CountryLanguage,
  LanguagesArr,
} from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { Environment } from "next-vibe/env/env-util";
import type { EndpointLogger } from "next-vibe/logger/types";

import { configScopedTranslation } from "@/env/i18n";
import { messengerAccounts } from "@/messenger/accounts/db";
import {
  CampaignType,
  MessageChannel,
  MessengerAccountStatus,
  MessengerProvider,
} from "@/messenger/accounts/enum";
import { messengerEnv } from "@/messenger/env";
import { emails } from "@/messenger/messages/db";
import { imapClientEnv } from "@/messenger/providers/email/imap-client/env";
import type { SystemMailboxConfig } from "@/messenger/system-mailbox/config";
import { systemMailboxEnv } from "@/messenger/system-mailbox/env";
import {
  describeImapFailure,
  visitDeliveryReports,
} from "@/messenger/system-mailbox/imap-ops";

import { accountEmailChallenges } from "../../verify-email/db";
import { scopedTranslation as verifyTranslation } from "../../verify-email/i18n";
import { SignupBounceReason } from "../bounce-reason";
import { pendingSignups, signupEvents } from "../db";
import { SignupEventType } from "../event-type";
import { bounceDedupeKey, recordExpiredSignups } from "../events";
import { scopedTranslation, type SignupT } from "../i18n";
import type { SignupBounceSyncResponse } from "./definition";
import { type DeliveryReport, parseDeliveryReport } from "./delivery-report";
import { signupMailboxConfigs } from "./mailbox";

const MINUTE = 60_000;
const LOOKBACK = 7 * 24 * 60 * MINUTE;

export const isSignupBounceProductionInstance =
  coreEnv.NODE_ENV === Environment.PRODUCTION && !coreEnv.IS_PREVIEW_MODE;

// Once per process: the task runs every minute.
const warnedHostSources = new Set<string>();

async function loadMailbox(logger: EndpointLogger): Promise<{
  address: string;
  configs: SystemMailboxConfig["imap"][];
} | null> {
  // Signup uses the SMTP sender selected for CampaignType.SYSTEM. The
  // ops mailbox row (isSystem) is a separate sender with separate credentials.
  const [account] = await db
    .select()
    .from(messengerAccounts)
    .where(
      and(
        eq(messengerAccounts.channel, MessageChannel.EMAIL),
        eq(messengerAccounts.provider, MessengerProvider.SMTP),
        eq(messengerAccounts.status, MessengerAccountStatus.ACTIVE),
        eq(messengerAccounts.isSystem, false),
        sql`${messengerAccounts.campaignTypes} @> ${JSON.stringify([CampaignType.SYSTEM])}`,
        isNotNull(messengerAccounts.smtpFromEmail),
      ),
    )
    .orderBy(desc(messengerAccounts.priority))
    .limit(1);

  const address =
    account?.smtpFromEmail ??
    messengerEnv.EMAIL_FROM_EMAIL ??
    systemMailboxEnv.THEA_MAIL_ADDRESS;
  if (!address) {
    return null;
  }
  const envMatches =
    !messengerEnv.EMAIL_FROM_EMAIL ||
    address.toLowerCase() === messengerEnv.EMAIL_FROM_EMAIL.toLowerCase();
  const opsMatches =
    address.toLowerCase() === systemMailboxEnv.THEA_MAIL_ADDRESS?.toLowerCase();
  const legacyMatches = imapClientEnv.IMAP_SEED_EMAIL
    ? address.toLowerCase() === imapClientEnv.IMAP_SEED_EMAIL.toLowerCase()
    : envMatches;
  const configs = signupMailboxConfigs(
    [
      {
        source: "messenger_accounts.imap_host",
        host: account?.imapHost,
        username: account?.imapUsername,
        password: account?.imapPassword,
        port: account?.imapPort,
        secure: account?.imapSecure,
      },
      {
        source: "IMAP_HOST",
        host: envMatches ? messengerEnv.IMAP_HOST : undefined,
        username: messengerEnv.IMAP_USER,
        password: messengerEnv.IMAP_PASS,
        port: messengerEnv.IMAP_PORT,
        secure: messengerEnv.IMAP_SECURE,
      },
      {
        source: "IMAP_SEED_HOST",
        host: legacyMatches ? imapClientEnv.IMAP_SEED_HOST : undefined,
        username: imapClientEnv.IMAP_SEED_USERNAME,
        password: imapClientEnv.IMAP_SEED_PASSWORD,
        port: imapClientEnv.IMAP_SEED_PORT,
        secure: imapClientEnv.IMAP_SEED_SECURE,
      },
      {
        source: "THEA_MAIL_HOST",
        host: opsMatches ? systemMailboxEnv.THEA_MAIL_HOST : undefined,
        username: systemMailboxEnv.THEA_MAIL_ADDRESS,
        password: systemMailboxEnv.THEA_MAIL_PASSWORD,
      },
      {
        source: "messenger_accounts.smtp_host",
        host: account?.smtpHost,
        username: account?.smtpUsername,
        password: account?.smtpPassword,
      },
      {
        source: "EMAIL_HOST",
        host: envMatches ? messengerEnv.EMAIL_HOST : undefined,
        username: messengerEnv.EMAIL_USER,
        password: messengerEnv.EMAIL_PASS,
      },
    ],
    (source) => {
      if (!warnedHostSources.has(source)) {
        warnedHostSources.add(source);
        logger.warn("Signup bounce sync skipped an invalid IMAP hostname", {
          source,
        });
      }
    },
  );
  return configs.length ? { address: address.toLowerCase(), configs } : null;
}

const BOUNCED_ROW = {
  id: pendingSignups.id,
  leadId: pendingSignups.leadId,
  sentAt: pendingSignups.sentAt,
};

/** One BOUNCED funnel event per dispatch (a refined reason never re-counts). */
async function recordBounces(
  rows: ReadonlyArray<{ id: string; leadId: string; sentAt: Date }>,
  receivedAt: Date,
): Promise<void> {
  if (rows.length === 0) {
    return;
  }
  await db
    .insert(signupEvents)
    .values(
      rows.map((row) => ({
        leadId: row.leadId,
        pendingId: row.id,
        type: SignupEventType.BOUNCED,
        occurredAt: receivedAt,
        dedupeKey: bounceDedupeKey(row.id, row.sentAt),
      })),
    )
    .onConflictDoNothing();
}

/**
 * Whether a returned subject is a signup challenge in this locale. The
 * current subject carries the six-digit code; the plain "confirm" subject is
 * what every challenge used before 2026-11-27 (DSNs can arrive days later).
 */
function isSignupChallengeSubject(
  subject: string,
  locale: CountryLanguage,
): boolean {
  const { t } = scopedTranslation.scopedT(locale);
  if (t("confirmation.link") === subject) {
    return true;
  }
  const marker = "\u0000";
  const [prefix, suffix] = t("confirmation.subject", {
    code: marker,
    appName: configScopedTranslation.scopedT(locale).t("appName"),
  }).split(marker);
  if (prefix === undefined || suffix === undefined) {
    return false;
  }
  return (
    subject.length === prefix.length + 6 + suffix.length &&
    subject.startsWith(prefix) &&
    subject.endsWith(suffix) &&
    /^\d{6}$/.test(subject.slice(prefix.length, prefix.length + 6))
  );
}

export async function recordSignupDeliveryReport(
  report: DeliveryReport,
  receivedAt: Date,
  mailboxAddress: string,
): Promise<number> {
  let marked = 0;
  const { messageId, sentAt, sender, subject } = report;
  const accountSubjects = LanguagesArr.map((language) =>
    verifyTranslation.scopedT(`${language}-GLOBAL`).t("title"),
  );
  for (const { recipient, reason, temporary } of report.failures) {
    const soft = temporary || reason === SignupBounceReason.MAILBOX_FULL;
    const deliveryStatus = soft ? { deliveryFailed: true } : { bounced: true };
    const accountAddress = eq(
      sql`lower(${accountEmailChallenges.email})`,
      recipient,
    );
    const recipientAndTime = and(
      eq(pendingSignups.email, recipient),
      lte(pendingSignups.sentAt, new Date(receivedAt.getTime() + 999)),
    );
    const needsReason = or(
      isNull(pendingSignups.bounceReason),
      reason === SignupBounceReason.OTHER
        ? undefined
        : eq(pendingSignups.bounceReason, SignupBounceReason.OTHER),
    );
    if (messageId) {
      const ids = [messageId, messageId.slice(1, -1)];
      // A permanent DSN can arrive after a resend has replaced the current ID.
      const previousDispatch = soft
        ? undefined
        : exists(
            db
              .select({ id: emails.id })
              .from(emails)
              .where(
                and(
                  inArray(emails.messageId, ids),
                  eq(sql`lower(${emails.recipientEmail})`, recipient),
                  inArray(emails.subject, accountSubjects),
                ),
              ),
          );
      const bounced = await db
        .update(accountEmailChallenges)
        .set(deliveryStatus)
        .where(
          and(
            accountAddress,
            eq(accountEmailChallenges.bounced, false),
            soft ? eq(accountEmailChallenges.deliveryFailed, false) : undefined,
            or(
              inArray(accountEmailChallenges.messageId, ids),
              previousDispatch,
            ),
          ),
        )
        .returning({ id: accountEmailChallenges.userId });
      marked += bounced.length;
      const matched = await db
        .update(pendingSignups)
        .set({ bounced: true, bounceReason: reason })
        .where(
          and(
            recipientAndTime,
            inArray(pendingSignups.messageId, [
              messageId,
              messageId.slice(1, -1),
            ]),
            needsReason,
          ),
        )
        .returning(BOUNCED_ROW);
      await recordBounces(matched, receivedAt);
      marked += matched.length;
      continue;
    }
    if (
      !sentAt ||
      sentAt > receivedAt ||
      sender !== mailboxAddress ||
      !subject
    ) {
      continue;
    }
    if (accountSubjects.some((translated) => translated === subject)) {
      const bounced = await db
        .update(accountEmailChallenges)
        .set(deliveryStatus)
        .where(
          and(
            accountAddress,
            eq(accountEmailChallenges.bounced, false),
            soft ? eq(accountEmailChallenges.deliveryFailed, false) : undefined,
            isNotNull(accountEmailChallenges.messageId),
            gte(
              accountEmailChallenges.sentAt,
              new Date(sentAt.getTime() - 45_000),
            ),
            lte(
              accountEmailChallenges.sentAt,
              new Date(sentAt.getTime() + 999),
            ),
          ),
        )
        .returning({ id: accountEmailChallenges.userId });
      marked += bounced.length;
    }
    // A returned original Date can identify a dispatch when the DSN omitted
    // its ID. Keep the window shorter than the per-address resend cooldown.
    const matches = await db
      .select({
        id: pendingSignups.id,
        tokenHash: pendingSignups.tokenHash,
        locale: pendingSignups.locale,
      })
      .from(pendingSignups)
      .where(
        and(
          recipientAndTime,
          isNotNull(pendingSignups.messageId),
          gte(pendingSignups.sentAt, new Date(sentAt.getTime() - 45_000)),
          lte(pendingSignups.sentAt, new Date(sentAt.getTime() + 999)),
        ),
      )
      .limit(2);
    const [match] = matches;
    if (
      matches.length !== 1 ||
      !isSignupChallengeSubject(subject, match.locale)
    ) {
      continue;
    }
    const updated = await db
      .update(pendingSignups)
      .set({ bounced: true, bounceReason: reason })
      .where(
        and(
          eq(pendingSignups.id, match.id),
          eq(pendingSignups.tokenHash, match.tokenHash),
          needsReason,
        ),
      )
      .returning(BOUNCED_ROW);
    await recordBounces(updated, receivedAt);
    marked += updated.length;
  }
  return marked;
}

export async function syncSignupBounces(
  logger: EndpointLogger,
  t: SignupT,
): Promise<ResponseType<SignupBounceSyncResponse>> {
  if (!isSignupBounceProductionInstance) {
    return fail({
      message: t("bounceSync.productionOnly"),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
  }
  // Date confirmations that ran out (funnel drop-off), mailbox or not.
  await recordExpiredSignups(logger);
  try {
    const mailbox = await loadMailbox(logger);
    if (!mailbox) {
      logger.warn("Signup bounce sync is missing system mailbox configuration");
      return fail({
        message: t("bounceSync.mailboxUnavailable"),
        errorType: ErrorResponseTypes.EMAIL_ERROR,
      });
    }
    const now = Date.now();
    let marked = 0;
    const connectionFailures: ReturnType<typeof describeImapFailure>[] = [];
    const scanned = await visitDeliveryReports(
      mailbox.configs,
      (config, error) => {
        const failure = describeImapFailure(config, error);
        connectionFailures.push(failure);
        logger.debug("Signup bounce sync could not connect to IMAP", failure);
      },
      new Date(now - LOOKBACK),
      async ({ uid, raw, receivedAt }) => {
        const report = await parseDeliveryReport(raw).catch((error: Error) => {
          logger.warn("Could not parse a delivery report", {
            uid,
            errorType: parseError(error).name,
          });
          return null;
        });
        if (!report) {
          return { markSeen: false };
        }
        const updated = await recordSignupDeliveryReport(
          report,
          receivedAt,
          mailbox.address,
        );
        marked += updated;
        // SMTP can hand off the message before signup saves the SMTP Message-ID.
        if (!updated && now - receivedAt.getTime() < 2 * MINUTE) {
          return null;
        }
        return { markSeen: true };
      },
    );
    if (!scanned) {
      logger.error(
        "Signup bounce sync could not connect to any configured mailbox",
        {
          configuredMailboxes: mailbox.configs.length,
          connectionFailures,
        },
      );
      return fail({
        message: t("bounceSync.mailboxUnavailable"),
        errorType: ErrorResponseTypes.EMAIL_ERROR,
      });
    }
    if (marked) {
      logger.info("Recorded signup delivery failures", { marked });
    }
    return success({ marked });
  } catch (error) {
    logger.error("Signup bounce sync failed", parseError(error));
    return fail({
      message: t("bounceSync.mailboxUnavailable"),
      errorType: ErrorResponseTypes.EMAIL_ERROR,
    });
  }
}
