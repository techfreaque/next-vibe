/**
 * Bounce Processor Repository
 * Scans IMAP-synced emails for DSN bounce notifications and
 * updates lead status + halts campaigns for hard bounces.
 */

import "server-only";

import { and, eq, isNull, like, or, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { emails } from "@/app/api/[locale]/emails/messages/db";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { leads } from "../../db";
import { LeadStatus } from "../../enum";
import { campaignSchedulerService } from "../emails/services/scheduler";
import type {
  BounceProcessorPostRequestOutput,
  BounceProcessorPostResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Sender patterns that indicate a bounce/DSN notification
 */
const BOUNCE_SENDER_PATTERNS = [
  "mailer-daemon@%",
  "postmaster@%",
  "MAILER-DAEMON@%",
  "Mail Delivery Subsystem<%",
] as const;

/**
 * Subject keywords that indicate a bounce notification
 */
const BOUNCE_SUBJECT_KEYWORDS = [
  "Delivery Status Notification",
  "Mail Delivery Failed",
  "Undelivered Mail",
  "Delivery Failure",
  "Failed Delivery",
  "Returned mail",
  "Mail delivery failed",
  "Undeliverable",
];

/**
 * Extract email addresses from text using RFC 5321 compliant regex
 */
function extractEmailsFromText(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches ? [...new Set(matches.map((e) => e.toLowerCase()))] : [];
}

/**
 * Determine if an email message is a bounce notification
 */
function isBounceMessage(senderEmail: string, subject: string): boolean {
  const senderLower = senderEmail.toLowerCase();
  if (
    senderLower.startsWith("mailer-daemon@") ||
    senderLower.startsWith("postmaster@") ||
    senderLower === "mailer-daemon" ||
    senderLower.includes("mail delivery subsystem")
  ) {
    return true;
  }

  const subjectLower = subject.toLowerCase();
  return BOUNCE_SUBJECT_KEYWORDS.some((kw) =>
    subjectLower.includes(kw.toLowerCase()),
  );
}

export class BounceProcessorRepository {
  static async run(
    data: BounceProcessorPostRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<BounceProcessorPostResponseOutput>> {
    try {
      const { dryRun, batchSize } = data;

      logger.info("bounce.processor.start", { dryRun, batchSize });

      // Find unprocessed bounce emails synced from IMAP
      // We use a metadata flag to track which bounces have been processed
      const bounceMessages = await db
        .select({
          id: emails.id,
          senderEmail: emails.senderEmail,
          subject: emails.subject,
          bodyText: emails.bodyText,
          recipientEmail: emails.recipientEmail,
        })
        .from(emails)
        .where(
          and(
            // Not yet processed as bounce
            isNull(emails.bouncedAt),
            // Only IMAP-synced inbound messages (have imapAccountId)
            sql`${emails.imapAccountId} IS NOT NULL`,
            or(
              ...BOUNCE_SENDER_PATTERNS.map((pattern) =>
                like(emails.senderEmail, pattern),
              ),
            ),
          ),
        )
        .limit(batchSize);

      // Also check by subject keywords for bounces that don't match sender pattern
      const subjectBounces = await db
        .select({
          id: emails.id,
          senderEmail: emails.senderEmail,
          subject: emails.subject,
          bodyText: emails.bodyText,
          recipientEmail: emails.recipientEmail,
        })
        .from(emails)
        .where(
          and(
            isNull(emails.bouncedAt),
            sql`${emails.imapAccountId} IS NOT NULL`,
            or(
              ...BOUNCE_SUBJECT_KEYWORDS.map(
                (kw) =>
                  sql`lower(${emails.subject}) LIKE ${`%${kw.toLowerCase()}%`}`,
              ),
            ),
          ),
        )
        .limit(batchSize);

      // Deduplicate by id
      const allMessages = [
        ...bounceMessages,
        ...subjectBounces.filter(
          (s) => !bounceMessages.some((b) => b.id === s.id),
        ),
      ].slice(0, batchSize);

      logger.debug(`bounce.processor.candidates`, {
        count: allMessages.length,
      });

      let bouncesFound = 0;
      let leadsUpdated = 0;
      let campaignsCancelled = 0;

      for (const msg of allMessages) {
        if (!isBounceMessage(msg.senderEmail, msg.subject)) {
          continue;
        }

        // Extract all email addresses from the bounce body
        const bodyEmails = extractEmailsFromText(msg.bodyText ?? "");
        const subjectEmails = extractEmailsFromText(msg.subject);
        const candidateEmails = [...new Set([...bodyEmails, ...subjectEmails])];

        bouncesFound++;

        if (dryRun) {
          logger.debug("bounce.processor.dry_run.bounce", {
            messageId: msg.id,
            senderEmail: msg.senderEmail,
            subject: msg.subject,
            candidateEmails,
          });
          // Mark as processed even in dry run to avoid re-scanning
          await db
            .update(emails)
            .set({ bouncedAt: new Date() })
            .where(eq(emails.id, msg.id));
          continue;
        }

        // Mark the bounce email as processed
        await db
          .update(emails)
          .set({ bouncedAt: new Date() })
          .where(eq(emails.id, msg.id));

        // Find leads matching any of the extracted emails
        for (const bouncedEmail of candidateEmails) {
          const [lead] = await db
            .select({ id: leads.id, status: leads.status, email: leads.email })
            .from(leads)
            .where(eq(leads.email, bouncedEmail))
            .limit(1);

          if (!lead) {
            continue;
          }

          // Skip leads already in a terminal suppressed state
          if (
            lead.status === LeadStatus.BOUNCED ||
            lead.status === LeadStatus.INVALID ||
            lead.status === LeadStatus.UNSUBSCRIBED
          ) {
            continue;
          }

          logger.info("bounce.processor.lead.bounced", {
            leadId: lead.id,
            email: lead.email,
            messageId: msg.id,
          });

          // Update lead status to BOUNCED
          await db
            .update(leads)
            .set({
              status: LeadStatus.BOUNCED,
              bouncedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(leads.id, lead.id));

          leadsUpdated++;

          // Halt all pending campaigns for this lead
          const cancelled = await campaignSchedulerService.haltCampaign(
            lead.id,
            logger,
            { reason: "hard_bounce" },
          );

          campaignsCancelled += cancelled;
        }
      }

      logger.info("bounce.processor.done", {
        bouncesFound,
        leadsUpdated,
        campaignsCancelled,
      });

      return success({ bouncesFound, leadsUpdated, campaignsCancelled });
    } catch (error) {
      logger.error("bounce.processor.error", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
