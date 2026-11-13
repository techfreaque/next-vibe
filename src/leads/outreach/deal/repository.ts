/**
 * Outreach Deal - Repository
 * Server-only.
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { outreachContacts, outreachDeals } from "../db";
import type { OutreachDealStatusValue } from "../enum";
import { OutreachContactStatus, OutreachDealStatus } from "../enum";
import type { OutreachT } from "../i18n";
import { OutreachContactStore } from "../repository";
import type {
  OutreachDealUpsertRequestOutput,
  OutreachDealUpsertResponseOutput,
} from "./definition";

export class OutreachDealRepository {
  static async upsert(
    data: OutreachDealUpsertRequestOutput,
    logger: EndpointLogger,
    t: OutreachT,
  ): Promise<ResponseType<OutreachDealUpsertResponseOutput>> {
    try {
      const now = new Date();
      const linkId =
        data.campaignLinkId === undefined
          ? undefined
          : await OutreachContactStore.resolveLinkId(data.campaignLinkId);
      const linkFound =
        data.campaignLinkId === undefined ? null : linkId !== null;
      if (linkFound === false) {
        logger.info("Outreach deal campaign link not on this instance", {
          campaignLinkId: data.campaignLinkId ?? null,
        });
      }

      const stamps = (
        status: typeof OutreachDealStatusValue | undefined,
        current: { committedAt: Date | null; paidAt: Date | null } | null,
      ): { committedAt?: Date; paidAt?: Date } => {
        const result: { committedAt?: Date; paidAt?: Date } = {};
        if (data.paidAt) {
          result.paidAt = data.paidAt;
        }
        if (
          (status === OutreachDealStatus.COMMITTED ||
            status === OutreachDealStatus.PAID) &&
          !current?.committedAt
        ) {
          result.committedAt = data.paidAt ?? now;
        }
        if (
          status === OutreachDealStatus.PAID &&
          !current?.paidAt &&
          !result.paidAt
        ) {
          result.paidAt = now;
        }
        return result;
      };

      let dealId: string;
      let contactId: string;
      let dealStatus: typeof OutreachDealStatusValue;
      let created: boolean;

      if (data.id) {
        const [existing] = await db
          .select()
          .from(outreachDeals)
          .where(eq(outreachDeals.id, data.id))
          .limit(1);
        if (!existing) {
          return fail({
            message: t("errors.dealNotFound", { id: data.id }),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        await db
          .update(outreachDeals)
          .set({
            deliverable: data.deliverable,
            amountCents:
              data.amount === undefined
                ? undefined
                : Math.round(data.amount * 100),
            currency: data.currency,
            status: data.status,
            channel: OutreachContactStore.channelKey(data.channel) ?? undefined,
            campaignLinkId: linkId,
            utmCampaign: data.utmCampaign || undefined,
            refCode: data.refCode || undefined,
            notes: data.notes || undefined,
            liveAt: data.liveAt,
            ...stamps(data.status, existing),
            updatedAt: now,
          })
          .where(eq(outreachDeals.id, existing.id));
        dealId = existing.id;
        contactId = existing.contactId;
        dealStatus = data.status ?? existing.status;
        created = false;
      } else {
        if (!data.contactEmail) {
          return fail({
            message: t("errors.dealNeedsContact"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        if (!data.deliverable || data.amount === undefined) {
          return fail({
            message: t("errors.dealNeedsFields"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const ensured = await OutreachContactStore.ensure({
          email: data.contactEmail,
          name: data.contactName || data.contactEmail,
          kind: null,
          angle: null,
          status: OutreachContactStatus.INTERESTED,
        });
        if (!ensured) {
          return fail({
            message: t("errors.server.description"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        dealStatus = data.status ?? OutreachDealStatus.PROPOSED;
        const [inserted] = await db
          .insert(outreachDeals)
          .values({
            contactId: ensured.contact.id,
            deliverable: data.deliverable,
            amountCents: Math.round(data.amount * 100),
            currency: data.currency ?? "USD",
            status: dealStatus,
            channel: OutreachContactStore.channelKey(data.channel),
            campaignLinkId: linkId ?? null,
            utmCampaign: data.utmCampaign || null,
            refCode: data.refCode || null,
            notes: data.notes || null,
            liveAt: data.liveAt ?? null,
            ...stamps(dealStatus, null),
          })
          .returning({ id: outreachDeals.id });
        if (!inserted) {
          return fail({
            message: t("errors.server.description"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
        dealId = inserted.id;
        contactId = ensured.contact.id;
        created = true;
      }

      // A committed or paid deal makes the contact a Deal; an open proposal
      // means they are at least interested.
      const [contact] = await db
        .select()
        .from(outreachContacts)
        .where(eq(outreachContacts.id, contactId))
        .limit(1);
      if (contact && dealStatus !== OutreachDealStatus.CANCELED) {
        await OutreachContactStore.applyStatus(
          contact,
          dealStatus === OutreachDealStatus.PROPOSED
            ? OutreachContactStatus.INTERESTED
            : OutreachContactStatus.DEAL,
        );
      }

      logger.debug("Outreach deal saved", { dealId, created, dealStatus });
      return success({ dealId, created, dealStatus, linkFound });
    } catch (error) {
      logger.error("Failed to save outreach deal", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
