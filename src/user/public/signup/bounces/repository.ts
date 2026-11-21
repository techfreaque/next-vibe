import "server-only";

import {
  and,
  desc,
  eq,
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
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { Environment } from "next-vibe/env/env-util";
import type { EndpointLogger } from "next-vibe/logger/types";

import { messengerAccounts } from "@/messenger/accounts/db";
import {
  CampaignType,
  MessageChannel,
  MessengerAccountStatus,
  MessengerProvider,
} from "@/messenger/accounts/enum";
import { messengerEnv } from "@/messenger/env";
import { imapClientEnv } from "@/messenger/providers/email/imap-client/env";
import type { SystemMailboxConfig } from "@/messenger/system-mailbox/config";
import { systemMailboxEnv } from "@/messenger/system-mailbox/env";
import {
  describeImapFailure,
  visitDeliveryReports,
} from "@/messenger/system-mailbox/imap-ops";

import { SignupBounceReason } from "../bounce-reason";
import { pendingSignups, signupEvents } from "../db";
import { SignupEventType } from "../event-type";
import { bounceDedupeKey, recordExpiredSignups } from "../events";
import { scopedTranslation, type SignupT } from "../i18n";
import type { SignupBounceSyncResponse } from "./definition";
import { type DeliveryReport, parseDeliveryReport } from "./delivery-report";

const MINUTE = 60_000;
const LOOKBACK = 7 * 24 * 60 * MINUTE;

export const isSignupBounceProductionInstance =
  coreEnv.NODE_ENV === Environment.PRODUCTION && !coreEnv.IS_PREVIEW_MODE;

// An IMAP host that is not a hostname (e.g. a mailbox address pasted into
// IMAP_SEED_HOST) fails DNS on every run. Skip it so the next configured
// source (ops mailbox host, SMTP host) is tried instead.
const HOSTNAME =
  /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/i;

// Once per process: the task runs every minute.
const warnedHostSources = new Set<string>();

function pickHost(
  logger: EndpointLogger,
  candidates: [source: string, host: string | null | undefined][],
): string | undefined {
  for (const [source, host] of candidates) {
    if (!host) {
      continue;
    }
    if (HOSTNAME.test(host)) {
      return host;
    }
    if (warnedHostSources.has(source)) {
      continue;
    }
    warnedHostSources.add(source);
    logger.warn(
      "Signup bounce sync skipped an IMAP host that is not a hostname",
      {
        source,
        containsAt: host.includes("@"),
        length: host.length,
      },
    );
  }
  return undefined;
}

async function loadMailbox(logger: EndpointLogger): Promise<{
  address: string;
  imap: SystemMailboxConfig["imap"];
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
  const host = pickHost(logger, [
    ["messenger_accounts.imap_host", account?.imapHost],
    ["IMAP_HOST", envMatches ? messengerEnv.IMAP_HOST : undefined],
    ["IMAP_SEED_HOST", envMatches ? imapClientEnv.IMAP_SEED_HOST : undefined],
    [
      "THEA_MAIL_HOST",
      opsMatches ? systemMailboxEnv.THEA_MAIL_HOST : undefined,
    ],
    ["messenger_accounts.smtp_host", account?.smtpHost],
    ["EMAIL_HOST", envMatches ? messengerEnv.EMAIL_HOST : undefined],
  ]);
  const username =
    account?.imapUsername ??
    (envMatches
      ? (messengerEnv.IMAP_USER ?? imapClientEnv.IMAP_SEED_USERNAME)
      : undefined) ??
    (opsMatches ? systemMailboxEnv.THEA_MAIL_ADDRESS : undefined) ??
    account?.smtpUsername ??
    (envMatches ? messengerEnv.EMAIL_USER : undefined);
  const password =
    account?.imapPassword ??
    (envMatches
      ? (messengerEnv.IMAP_PASS ?? imapClientEnv.IMAP_SEED_PASSWORD)
      : undefined) ??
    (opsMatches ? systemMailboxEnv.THEA_MAIL_PASSWORD : undefined) ??
    account?.smtpPassword ??
    (envMatches ? messengerEnv.EMAIL_PASS : undefined);
  const port = account?.imapPort ?? messengerEnv.IMAP_PORT;
  if (
    !host ||
    !username ||
    !password ||
    (port !== 993 && !(account?.imapSecure ?? messengerEnv.IMAP_SECURE))
  ) {
    return null;
  }
  return {
    address: address.toLowerCase(),
    imap: { host, username, password, port, secure: true },
  };
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

export async function recordSignupDeliveryReport(
  report: DeliveryReport,
  receivedAt: Date,
  mailboxAddress: string,
): Promise<number> {
  let marked = 0;
  const { messageId, sentAt, sender, subject } = report;
  for (const { recipient, reason } of report.failures) {
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
      scopedTranslation.scopedT(match.locale).t("confirmation.link") !== subject
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
  let imap: SystemMailboxConfig["imap"] | undefined;
  try {
    const mailbox = await loadMailbox(logger);
    if (!mailbox) {
      logger.warn("Signup bounce sync is missing system mailbox configuration");
      return fail({
        message: t("bounceSync.mailboxUnavailable"),
        errorType: ErrorResponseTypes.EMAIL_ERROR,
      });
    }
    imap = mailbox.imap;
    const now = Date.now();
    let marked = 0;
    await visitDeliveryReports(
      imap,
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
    if (marked) {
      logger.info("Recorded signup delivery failures", { marked });
    }
    return success({ marked });
  } catch (error) {
    const cause = parseError(error);
    logger.error(
      "Signup bounce sync failed",
      imap ? describeImapFailure(imap, cause) : cause,
    );
    return fail({
      message: t("bounceSync.mailboxUnavailable"),
      errorType: ErrorResponseTypes.EMAIL_ERROR,
    });
  }
}
