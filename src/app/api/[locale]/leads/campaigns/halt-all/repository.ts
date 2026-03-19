/**
 * Halt All Campaigns Repository
 * Immediately halts all active email campaigns and cancels pending sends.
 */

import "server-only";

import { count, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { MessageStatus } from "@/app/api/[locale]/messenger/messages/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { emailCampaigns, leads } from "../../db";
import { LeadStatus } from "../../enum";
import type {
  HaltAllCampaignsPostRequestOutput,
  HaltAllCampaignsPostResponseOutput,
} from "./definition";
import type { CampaignsHaltAllT } from "./i18n";

export class HaltAllCampaignsRepository {
  static async haltAll(
    data: HaltAllCampaignsPostRequestOutput,
    logger: EndpointLogger,
    t: CampaignsHaltAllT,
  ): Promise<ResponseType<HaltAllCampaignsPostResponseOutput>> {
    if (data.confirm !== true) {
      return fail({
        message: t("post.errors.validation.description"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    try {
      // Count and cancel all pending email campaigns
      const [pendingEmailsRow] = await db
        .select({ count: count() })
        .from(emailCampaigns)
        .where(eq(emailCampaigns.status, MessageStatus.PENDING));

      const emailsCancelled = pendingEmailsRow?.count ?? 0;

      if (emailsCancelled > 0) {
        await db
          .update(emailCampaigns)
          .set({ status: MessageStatus.FAILED })
          .where(eq(emailCampaigns.status, MessageStatus.PENDING));
      }

      // Count and halt all leads with active campaigns
      const [activeLeadsRow] = await db
        .select({ count: count() })
        .from(leads)
        .where(eq(leads.status, LeadStatus.CAMPAIGN_RUNNING));

      const halted = activeLeadsRow?.count ?? 0;

      if (halted > 0) {
        await db
          .update(leads)
          .set({ status: LeadStatus.PENDING })
          .where(eq(leads.status, LeadStatus.CAMPAIGN_RUNNING));
      }

      logger.info("campaigns.haltAll.completed", {
        halted,
        emailsCancelled,
        reason: data.reason,
      });

      return success({ halted, emailsCancelled });
    } catch (error) {
      logger.error("campaigns.haltAll.error", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
