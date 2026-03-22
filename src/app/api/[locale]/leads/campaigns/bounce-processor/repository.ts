/**
 * Bounce Processor Repository
 * Scans IMAP-synced emails for DSN bounce notifications and
 * updates lead status + halts campaigns for hard bounces.
 * Also manages bounce processor cron task configuration.
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
import {
  emails,
  messengerFolders as imapFolders,
} from "@/app/api/[locale]/messenger/messages/db";
import { SpecialFolderType as ImapSpecialUseType } from "@/app/api/[locale]/messenger/messages/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  cronTasks,
  type NewCronTask,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";

import type { JwtPayloadType } from "../../../user/auth/types";
import { leads } from "../../db";
import { LeadStatus } from "../../enum";
import { campaignSchedulerService } from "../emails/services/scheduler";
import { BOUNCE_PROCESSOR_ALIAS } from "./constants";
import type {
  BounceProcessorConfigGetResponseOutput,
  BounceProcessorPostRequestOutput,
  BounceProcessorPostResponseOutput,
} from "./definition";
import type { BounceProcessorT } from "./i18n";

function getDefaultConfig(): BounceProcessorConfigGetResponseOutput {
  return {
    enabled: false,
    dryRun: false,
    batchSize: 100,
    schedule: "*/15 * * * *",
    priority: CronTaskPriority.MEDIUM,
    timeout: 300000,
    retries: 3,
    retryDelay: 30000,
  };
}

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

  static async getConfig(
    user: JwtPayloadType,
    t: BounceProcessorT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BounceProcessorConfigGetResponseOutput>> {
    try {
      logger.info("Fetching bounce processor config", { userId: user.id });

      const [existing] = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.id, BOUNCE_PROCESSOR_ALIAS))
        .limit(1);

      if (!existing) {
        return success(getDefaultConfig());
      }

      const defaults = getDefaultConfig();
      const taskInput = existing.taskInput;

      return success({
        enabled: existing.enabled,
        dryRun:
          typeof taskInput?.dryRun === "boolean"
            ? taskInput.dryRun
            : defaults.dryRun,
        batchSize:
          typeof taskInput?.batchSize === "number"
            ? taskInput.batchSize
            : defaults.batchSize,
        schedule: existing.schedule,
        priority: existing.priority ?? defaults.priority,
        timeout: existing.timeout ?? defaults.timeout,
        retries: existing.retries ?? defaults.retries,
        retryDelay: existing.retryDelay ?? defaults.retryDelay,
      });
    } catch (error) {
      logger.error("Error fetching bounce processor config", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateConfig(
    data: BounceProcessorPostRequestOutput,
    user: JwtPayloadType,
    t: BounceProcessorT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BounceProcessorPostRequestOutput>> {
    try {
      logger.info("Updating bounce processor config", {
        userId: user.id,
        enabled: data.enabled,
        dryRun: data.dryRun,
      });

      if (!data.enabled) {
        await db
          .delete(cronTasks)
          .where(eq(cronTasks.id, BOUNCE_PROCESSOR_ALIAS));
        logger.debug("Removed bounce-processor cron task (disabled)");
        return success();
      }

      const cronData: NewCronTask<BounceProcessorPostRequestOutput> = {
        id: BOUNCE_PROCESSOR_ALIAS,
        shortId: BOUNCE_PROCESSOR_ALIAS,
        routeId: BOUNCE_PROCESSOR_ALIAS,
        displayName: "Bounce Processor",
        description:
          "Scan IMAP for bounce notifications and update lead status",
        version: "1.0.0",
        category: TaskCategory.LEAD_MANAGEMENT,
        schedule: data.schedule,
        enabled: true,
        priority: data.priority,
        timeout: data.timeout,
        retries: data.retries,
        retryDelay: data.retryDelay,
        taskInput: {
          enabled: data.enabled,
          dryRun: data.dryRun,
          batchSize: data.batchSize,
          schedule: data.schedule,
          priority: data.priority,
          timeout: data.timeout,
          retries: data.retries,
          retryDelay: data.retryDelay,
        },
        updatedAt: new Date(),
      };

      const [existing] = await db
        .select({ id: cronTasks.id })
        .from(cronTasks)
        .where(eq(cronTasks.id, BOUNCE_PROCESSOR_ALIAS))
        .limit(1);

      if (existing) {
        await db
          .update(cronTasks)
          .set(cronData)
          .where(eq(cronTasks.id, BOUNCE_PROCESSOR_ALIAS));
      } else {
        await db.insert(cronTasks).values(cronData);
      }

      logger.debug("Saved bounce-processor cron task");
      return success();
    } catch (error) {
      logger.error("Error updating bounce processor config", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

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
    const deleteFromDb = async (): Promise<void> => {
      await db.delete(emails).where(eq(emails.id, emailId));
    };

    if (!imapUid || !imapFolderId || !imapAccountId) {
      await deleteFromDb();
      return;
    }

    try {
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
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: BounceProcessorT,
  ): Promise<ResponseType<BounceProcessorPostResponseOutput>> {
    try {
      const saveResult = await BounceProcessorRepository.updateConfig(
        data,
        user,
        t,
        logger,
      );
      if (!saveResult.success) {
        return saveResult;
      }

      const { dryRun, batchSize } = data;

      logger.debug("Bounce processor starting", { dryRun, batchSize });

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
            isNull(emails.bouncedAt),
            sql`${emails.accountId} IS NOT NULL`,
            or(
              ...BounceProcessorRepository.BOUNCE_SENDER_PATTERNS.map(
                (pattern) => like(emails.senderEmail, pattern),
              ),
            ),
          ),
        )
        .limit(batchSize);

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

        await BounceProcessorRepository.moveToImapTrash(
          msg.id,
          msg.uid,
          msg.folderId,
          msg.accountId,
          logger,
        );

        for (const bouncedEmail of candidateEmails) {
          const [lead] = await db
            .select({ id: leads.id, status: leads.status, email: leads.email })
            .from(leads)
            .where(eq(leads.email, bouncedEmail))
            .limit(1);

          if (!lead) {
            continue;
          }

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

          await db
            .update(leads)
            .set({
              status: LeadStatus.BOUNCED,
              bouncedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(leads.id, lead.id));

          leadsUpdated++;

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
