/**
 * Newsletter Unsubscribe Sync Route Handler
 * Called by cron to sync lead statuses for newsletter unsubscribes
 */

import "server-only";

import { and, eq, ne } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { campaignSchedulerService } from "@/app/api/[locale]/leads/campaigns/emails/services/scheduler";
import { leads } from "@/app/api/[locale]/leads/db";
import { LeadStatus } from "@/app/api/[locale]/leads/enum";
import { db } from "@/app/api/[locale]/system/db";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { newsletterSubscriptions } from "../../db";
import { NewsletterSubscriptionStatus } from "../../enum";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      const { batchSize, dryRun } = data;
      const startTime = Date.now();

      let leadsProcessed = 0;
      let leadsUpdated = 0;

      try {
        // Find leads with unsubscribed newsletter subscriptions not yet marked unsubscribed
        const unsubscribedLeads = await db
          .select({
            leadId: leads.id,
            leadEmail: leads.email,
            leadStatus: leads.status,
          })
          .from(leads)
          .innerJoin(
            newsletterSubscriptions,
            eq(leads.email, newsletterSubscriptions.email),
          )
          .where(
            and(
              eq(
                newsletterSubscriptions.status,
                NewsletterSubscriptionStatus.UNSUBSCRIBED,
              ),
              ne(leads.status, LeadStatus.UNSUBSCRIBED),
            ),
          )
          .limit(batchSize);

        for (const lead of unsubscribedLeads) {
          try {
            leadsProcessed++;

            if (!dryRun) {
              await db
                .update(leads)
                .set({
                  status: LeadStatus.UNSUBSCRIBED,
                  updatedAt: new Date(),
                })
                .where(eq(leads.id, lead.leadId));

              await campaignSchedulerService.haltCampaignsForStatusChange(
                lead.leadId,
                LeadStatus.UNSUBSCRIBED,
                logger,
              );

              leadsUpdated++;
            }
          } catch (error) {
            logger.error("newsletter_unsubscribe_sync.lead_error", {
              leadId: lead.leadId,
              error: parseError(error).message,
            });
          }
        }

        // Find leads marked unsubscribed but re-subscribed to newsletter
        const resubscribedLeads = await db
          .select({
            leadId: leads.id,
            leadEmail: leads.email,
          })
          .from(leads)
          .innerJoin(
            newsletterSubscriptions,
            eq(leads.email, newsletterSubscriptions.email),
          )
          .where(
            and(
              eq(leads.status, LeadStatus.UNSUBSCRIBED),
              eq(
                newsletterSubscriptions.status,
                NewsletterSubscriptionStatus.SUBSCRIBED,
              ),
            ),
          )
          .limit(batchSize);

        for (const lead of resubscribedLeads) {
          try {
            leadsProcessed++;

            if (!dryRun) {
              await db
                .update(leads)
                .set({
                  status: LeadStatus.NEWSLETTER_SUBSCRIBER,
                  updatedAt: new Date(),
                })
                .where(eq(leads.id, lead.leadId));

              leadsUpdated++;
            }
          } catch (error) {
            logger.error("newsletter_unsubscribe_sync.resubscribe_error", {
              leadId: lead.leadId,
              error: parseError(error).message,
            });
          }
        }

        return success({
          leadsProcessed,
          leadsUpdated,
          executionTimeMs: Date.now() - startTime,
        });
      } catch (error) {
        logger.error("newsletter_unsubscribe_sync.failed", {
          error: parseError(error).message,
        });
        return fail({
          message: "app.api.newsletter.error.default",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    },
  },
});
