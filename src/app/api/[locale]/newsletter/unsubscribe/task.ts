/**
 * Newsletter Unsubscribe Lead Status Sync Task (Unified Format)
 * Synchronizes lead statuses for newsletter unsubscribes that weren't properly updated
 * Finds leads with emails matching unsubscribed newsletter subscriptions and updates their status
 *
 * This file follows the unified task format as specified in spec.md
 */
import "server-only";

import { and, eq, ne } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { z } from "zod";

import { leads } from "@/app/api/[locale]/leads/db";
import { LeadStatus } from "@/app/api/[locale]/leads/enum";
import { db } from "@/app/api/[locale]/system/db";
import {
  CRON_SCHEDULES,
  TASK_TIMEOUTS,
} from "@/app/api/[locale]/system/unified-interface/tasks/constants";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type {
  Task,
  TaskExecutionContext,
} from "@/app/api/[locale]/system/unified-interface/tasks/types/repository";

import { newsletterSubscriptions } from "../db";
import { NewsletterSubscriptionStatus } from "../enum";

/**
 * Task Configuration Schema
 */
export const taskConfigSchema = z.object({
  batchSize: z.coerce.number().min(1).max(1000).default(500),
  dryRun: z.boolean().default(false),
});

export type TaskConfigType = z.output<typeof taskConfigSchema>;

/**
 * Task Result Schema
 */
export const taskResultSchema = z.object({
  leadsProcessed: z.coerce.number(),
  leadsUpdated: z.coerce.number(),
  errors: z.array(z.string()),
  executionTimeMs: z.coerce.number(),
});

export type TaskResultType = z.output<typeof taskResultSchema>;

/**
 * Newsletter Unsubscribe Sync Task Implementation
 */
async function executeNewsletterUnsubscribeSync(
  context: TaskExecutionContext<TaskConfigType>,
): Promise<ResponseType<TaskResultType>> {
  const config = context.config;
  const { logger } = context;
  const startTime = Date.now();

  logger.info("tasks.newsletter_unsubscribe_sync.start", { config });

  let leadsProcessed = 0;
  let leadsUpdated = 0;
  const errors: string[] = [];

  try {
    // Step 1: Find leads that have unsubscribed newsletter subscriptions but are not marked as unsubscribed
    const unsubscribedLeads = await db
      .select({
        leadId: leads.id,
        leadEmail: leads.email,
        leadStatus: leads.status,
        subscriptionId: newsletterSubscriptions.id,
        subscriptionStatus: newsletterSubscriptions.status,
      })
      .from(leads)
      .innerJoin(newsletterSubscriptions, eq(leads.email, newsletterSubscriptions.email))
      .where(
        and(
          eq(newsletterSubscriptions.status, NewsletterSubscriptionStatus.UNSUBSCRIBED),
          ne(leads.status, LeadStatus.UNSUBSCRIBED),
        ),
      )
      .limit(config.batchSize);

    logger.info("tasks.newsletter_unsubscribe_sync.found_leads", {
      count: unsubscribedLeads.length,
    });

    // Step 2: Process each lead
    for (const lead of unsubscribedLeads) {
      try {
        leadsProcessed++;
        logger.debug("tasks.newsletter_unsubscribe_sync.processing_lead", {
          leadId: lead.leadId,
          email: lead.leadEmail,
          currentStatus: lead.leadStatus,
        });

        if (!config.dryRun) {
          // Update lead status to unsubscribed
          await db
            .update(leads)
            .set({
              status: LeadStatus.UNSUBSCRIBED,
              updatedAt: new Date(),
            })
            .where(eq(leads.id, lead.leadId));

          leadsUpdated++;
        }

        logger.debug("tasks.newsletter_unsubscribe_sync.lead_updated", {
          leadId: lead.leadId,
          email: lead.leadEmail,
          oldStatus: lead.leadStatus,
          newStatus: LeadStatus.UNSUBSCRIBED,
        });
      } catch (error) {
        const errorMessage: string =
          error instanceof Error
            ? error.message
            : "tasks.newsletter_unsubscribe_sync.unknown_error";
        errors.push(`${lead.leadId}: ${errorMessage}`);

        logger.error("tasks.newsletter_unsubscribe_sync.lead_error", {
          leadId: lead.leadId,
          email: lead.leadEmail,
          error: errorMessage,
        });
      }
    }

    // Step 3: Additional cleanup - find leads that are marked as unsubscribed but have active subscriptions
    const inconsistentLeads = await db
      .select({
        leadId: leads.id,
        leadEmail: leads.email,
        leadStatus: leads.status,
        subscriptionId: newsletterSubscriptions.id,
        subscriptionStatus: newsletterSubscriptions.status,
      })
      .from(leads)
      .innerJoin(newsletterSubscriptions, eq(leads.email, newsletterSubscriptions.email))
      .where(
        and(
          eq(leads.status, LeadStatus.UNSUBSCRIBED),
          eq(newsletterSubscriptions.status, NewsletterSubscriptionStatus.SUBSCRIBED),
        ),
      )
      .limit(config.batchSize);

    logger.info("tasks.newsletter_unsubscribe_sync.found_inconsistent", {
      count: inconsistentLeads.length,
    });

    // Process inconsistent leads (resubscribed)
    for (const lead of inconsistentLeads) {
      try {
        leadsProcessed++;
        logger.debug("tasks.newsletter_unsubscribe_sync.processing_resubscribed", {
          leadId: lead.leadId,
          email: lead.leadEmail,
          currentStatus: lead.leadStatus,
        });

        if (!config.dryRun) {
          // Update lead status back to newsletter subscriber
          await db
            .update(leads)
            .set({
              status: LeadStatus.NEWSLETTER_SUBSCRIBER,
              updatedAt: new Date(),
            })
            .where(eq(leads.id, lead.leadId));

          leadsUpdated++;
        }

        logger.debug("tasks.newsletter_unsubscribe_sync.lead_resubscribed", {
          leadId: lead.leadId,
          email: lead.leadEmail,
          oldStatus: lead.leadStatus,
          newStatus: LeadStatus.NEWSLETTER_SUBSCRIBER,
        });
      } catch (error) {
        const errorMessage: string =
          error instanceof Error
            ? error.message
            : "tasks.newsletter_unsubscribe_sync.unknown_error";
        errors.push(`${lead.leadId}: ${errorMessage}`);

        logger.error("tasks.newsletter_unsubscribe_sync.resubscribe_error", {
          leadId: lead.leadId,
          email: lead.leadEmail,
          error: errorMessage,
        });
      }
    }

    const executionTimeMs = Date.now() - startTime;

    const result: TaskResultType = {
      leadsProcessed,
      leadsUpdated,
      errors,
      executionTimeMs,
    };

    logger.info("tasks.newsletter_unsubscribe_sync.completed", result);
    return success(result);
  } catch (error) {
    const executionTimeMs = Date.now() - startTime;
    logger.error("tasks.newsletter_unsubscribe_sync.failed", {
      error:
        error instanceof Error ? error.message : "tasks.newsletter_unsubscribe_sync.unknown_error",
      executionTimeMs,
    });

    return fail({
      message: "app.api.newsletter.error.default",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

/**
 * Newsletter Unsubscribe Sync Task (Unified Format)
 */
const newsletterUnsubscribeSyncTask: Task = {
  type: "cron",
  name: "newsletter-unsubscribe-sync",
  description: "tasks.newsletter_unsubscribe_sync.description",
  schedule: CRON_SCHEDULES.EVERY_6_HOURS, // Every 6 hours
  category: TaskCategory.MAINTENANCE,
  enabled: false,
  priority: CronTaskPriority.LOW,
  timeout: TASK_TIMEOUTS.MEDIUM, // 5 minutes

  run: async ({ logger, locale, cronUser }) => {
    const context: TaskExecutionContext<TaskConfigType> = {
      config: {
        batchSize: 500,
        dryRun: false,
      },
      logger,
      taskName: "newsletter-unsubscribe-sync",
      signal: new AbortController().signal,
      startTime: Date.now(),
      locale,
      cronUser,
    };

    const result = await executeNewsletterUnsubscribeSync(context);

    if (!result.success) {
      return fail({
        message: "app.api.newsletter.unsubscribe.sync.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  },

  onError: ({ error, logger }) => {
    logger.error("Newsletter unsubscribe sync task error", parseError(error));
  },
};

/**
 * Export all tasks for newsletter unsubscribe subdomain
 */
export const tasks: Task[] = [newsletterUnsubscribeSyncTask];

export default tasks;
