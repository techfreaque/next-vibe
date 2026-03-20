/**
 * Bounce Processor Repository
 * Scans IMAP-synced emails for DSN bounce notifications and
 * updates lead status + halts campaigns for hard bounces.
 */

import "server-only";

import { and, eq, isNull, like, or, sql } from "drizzle-orm";
import Imap from "imap";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { messengerAccounts as imapAccounts } from "@/app/api/[locale]/messenger/accounts/db";
import { emails } from "@/app/api/[locale]/messenger/messages/db";
import { imapFolders } from "@/app/api/[locale]/messenger/providers/email/imap-client/db";
import { ImapSpecialUseType } from "@/app/api/[locale]/messenger/providers/email/imap-client/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { leads } from "../../db";
import { LeadStatus } from "../../enum";
import { campaignSchedulerService } from "../emails/services/scheduler";
import type {
  BounceProcessorPostRequestOutput,
  BounceProcessorPostResponseOutput,
} from "./definition";
import type { BounceProcessorT } from "./i18n";

export class BounceProcessorRepository {
  /**
   * Sender patterns that indicate a bounce/DSN notification
   */
  private static readonly BOUNCE_SENDER_PATTERNS = [
    "mailer-daemon@%",
    "postmaster@%",
    "MAILER-DAEMON@%",
    "Mail Delivery Subsystem<%",
    "%mailer-daemon@%",
    "%MAILER-DAEMON@%",
    "%Mail Delivery System%",
    "%Mail Delivery Subsystem%",
  ] as const;

  /**
   * Subject keywords that indicate a bounce notification
   */
  private static readonly BOUNCE_SUBJECT_KEYWORDS = [
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
  private static extractEmailsFromText(text: string): string[] {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);
    return matches ? [...new Set(matches.map((e) => e.toLowerCase()))] : [];
  }

  /**
   * Move an IMAP message to the trash folder, then delete from DB.
   * Falls back to direct DB delete if IMAP move fails.
   */
  private static async moveToImapTrash(
    emailId: string,
    imapUid: number | null | undefined,
    imapFolderId: string | null | undefined,
    imapAccountId: string | null | undefined,
    logger: EndpointLogger,
  ): Promise<void> {
    // Always clean up DB record at the end
    const deleteFromDb = async (): Promise<void> => {
      await db.delete(emails).where(eq(emails.id, emailId));
    };

    if (!imapUid || !imapFolderId || !imapAccountId) {
      await deleteFromDb();
      return;
    }

    try {
      // Look up account credentials and source folder path
      const [account] = await db
        .select()
        .from(imapAccounts)
        .where(eq(imapAccounts.id, imapAccountId))
        .limit(1);

      const [sourceFolder] = await db
        .select({ path: imapFolders.path })
        .from(imapFolders)
        .where(eq(imapFolders.id, imapFolderId))
        .limit(1);

      const [trashFolder] = await db
        .select({ path: imapFolders.path })
        .from(imapFolders)
        .where(
          and(
            eq(imapFolders.accountId, imapAccountId),
            eq(imapFolders.specialUseType, ImapSpecialUseType.TRASH),
          ),
        )
        .limit(1);

      if (!account || !sourceFolder || !trashFolder) {
        logger.warn("bounce.processor.imap.trash.missing_data", {
          emailId,
          hasAccount: Boolean(account),
          hasSourceFolder: Boolean(sourceFolder),
          hasTrashFolder: Boolean(trashFolder),
        });
        await deleteFromDb();
        return;
      }

      await new Promise<void>((resolve) => {
        const imap = new Imap({
          user: account.imapUsername ?? "",
          password: account.imapPassword ?? "",
          host: account.imapHost ?? "",
          port: account.imapPort ?? 993,
          tls: account.imapSecure ?? false,
          tlsOptions: { rejectUnauthorized: false },
          connTimeout: 10000,
          authTimeout: 5000,
        });

        imap.once("ready", () => {
          imap.openBox(sourceFolder.path, false, (openErr) => {
            if (openErr) {
              logger.warn("bounce.processor.imap.trash.open_failed", {
                emailId,
                folder: sourceFolder.path,
                error: openErr.message,
              });
              imap.end();
              resolve();
              return;
            }

            imap.move([imapUid], trashFolder.path, (moveErr) => {
              if (moveErr) {
                logger.warn("bounce.processor.imap.trash.move_failed", {
                  emailId,
                  imapUid,
                  trashFolder: trashFolder.path,
                  error: moveErr.message,
                });
              } else {
                logger.debug("bounce.processor.imap.trash.moved", {
                  emailId,
                  imapUid,
                  trashFolder: trashFolder.path,
                });
              }
              imap.end();
              resolve();
            });
          });
        });

        imap.once("error", (err: Error) => {
          logger.warn("bounce.processor.imap.trash.connect_failed", {
            emailId,
            error: err.message,
          });
          resolve();
        });

        imap.connect();
      });
    } catch (err) {
      logger.warn("bounce.processor.imap.trash.error", {
        emailId,
        ...parseError(err),
      });
    }

    await deleteFromDb();
  }

  /**
   * Determine if an email message is a bounce notification
   */
  private static isBounceMessage(
    senderEmail: string,
    subject: string,
  ): boolean {
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
    return BounceProcessorRepository.BOUNCE_SUBJECT_KEYWORDS.some((kw) =>
      subjectLower.includes(kw.toLowerCase()),
    );
  }

  static async run(
    data: BounceProcessorPostRequestOutput,
    logger: EndpointLogger,
    t: BounceProcessorT,
  ): Promise<ResponseType<BounceProcessorPostResponseOutput>> {
    try {
      const { dryRun, batchSize } = data;

      logger.debug("Bounce processor starting", { dryRun, batchSize });

      // Find unprocessed bounce emails synced from IMAP
      // We use a metadata flag to track which bounces have been processed
      const bounceMessages = await db
        .select({
          id: emails.id,
          senderEmail: emails.senderEmail,
          subject: emails.subject,
          bodyText: emails.bodyText,
          recipientEmail: emails.recipientEmail,
          uid: emails.uid,
          folderId: emails.folderId,
          accountId: emails.accountId,
        })
        .from(emails)
        .where(
          and(
            // Not yet processed as bounce
            isNull(emails.bouncedAt),
            // Only IMAP-synced inbound messages (have accountId)
            sql`${emails.accountId} IS NOT NULL`,
            or(
              ...BounceProcessorRepository.BOUNCE_SENDER_PATTERNS.map(
                (pattern) => like(emails.senderEmail, pattern),
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
          uid: emails.uid,
          folderId: emails.folderId,
          accountId: emails.accountId,
        })
        .from(emails)
        .where(
          and(
            isNull(emails.bouncedAt),
            sql`${emails.accountId} IS NOT NULL`,
            or(
              ...BounceProcessorRepository.BOUNCE_SUBJECT_KEYWORDS.map(
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
        if (
          !BounceProcessorRepository.isBounceMessage(
            msg.senderEmail,
            msg.subject,
          )
        ) {
          continue;
        }

        // Extract all email addresses from the bounce body
        const bodyEmails = BounceProcessorRepository.extractEmailsFromText(
          msg.bodyText ?? "",
        );
        const subjectEmails = BounceProcessorRepository.extractEmailsFromText(
          msg.subject,
        );
        const candidateEmails = [...new Set([...bodyEmails, ...subjectEmails])];

        bouncesFound++;

        if (dryRun) {
          logger.debug("bounce.processor.dry_run.bounce", {
            messageId: msg.id,
            senderEmail: msg.senderEmail,
            subject: msg.subject,
            candidateEmails,
          });
          continue;
        }

        // Move bounce email to IMAP trash, then delete from DB
        await BounceProcessorRepository.moveToImapTrash(
          msg.id,
          msg.uid,
          msg.folderId,
          msg.accountId,
          logger,
        );

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

      logger.debug("Bounce processor completed", {
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
