/**
 * Outreach Contact - Repository
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

import { outreachContacts, outreachTouches } from "../db";
import type { OutreachContactStatusValue } from "../enum";
import { OutreachContactStatus, OutreachDirection } from "../enum";
import type { OutreachT } from "../i18n";
import { normalizeAngle } from "../pipeline";
import { OutreachContactStore } from "../repository";
import type {
  OutreachContactUpsertRequestOutput,
  OutreachContactUpsertResponseOutput,
} from "./definition";

export class OutreachContactRepository {
  static async upsert(
    data: OutreachContactUpsertRequestOutput,
    logger: EndpointLogger,
    t: OutreachT,
  ): Promise<ResponseType<OutreachContactUpsertResponseOutput>> {
    try {
      const email = data.email.trim().toLowerCase();
      const angle = normalizeAngle(data.angle);
      const logsTouch = Boolean(data.subject || data.touchNote);
      const touchStatus: typeof OutreachContactStatusValue =
        data.direction === OutreachDirection.IN
          ? OutreachContactStatus.REPLIED
          : OutreachContactStatus.SENT;

      const ensured = await OutreachContactStore.ensure({
        email,
        name: data.name || email,
        kind: data.kind ?? null,
        angle,
        status: data.status ?? touchStatus,
      });
      if (!ensured) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const { contact, created } = ensured;
      const previousStatus = created ? null : contact.status;

      if (!created) {
        const linkId =
          data.campaignLinkId === undefined
            ? undefined
            : await OutreachContactStore.resolveLinkId(data.campaignLinkId);
        await db
          .update(outreachContacts)
          .set({
            name: data.name || undefined,
            kind: data.kind,
            url: data.url || undefined,
            // A touch keeps the first pitch angle; a plain update overwrites it
            angle: angle && (!logsTouch || !contact.angle) ? angle : undefined,
            notes: data.notes || undefined,
            refCode: data.refCode || undefined,
            channel: OutreachContactStore.channelKey(data.channel) ?? undefined,
            campaignLinkId: linkId,
            updatedAt: new Date(),
          })
          .where(eq(outreachContacts.id, contact.id));
      } else if (
        data.url ||
        data.notes ||
        data.refCode ||
        data.channel ||
        data.campaignLinkId
      ) {
        await db
          .update(outreachContacts)
          .set({
            url: data.url || null,
            notes: data.notes || null,
            refCode: data.refCode || null,
            channel: OutreachContactStore.channelKey(data.channel),
            campaignLinkId: await OutreachContactStore.resolveLinkId(
              data.campaignLinkId,
            ),
          })
          .where(eq(outreachContacts.id, contact.id));
      }

      if (logsTouch) {
        await db.insert(outreachTouches).values({
          contactId: contact.id,
          at: data.at ?? new Date(),
          direction: data.direction,
          subject: data.subject ?? "",
          angle,
          note: data.touchNote || null,
        });
        await OutreachContactStore.refreshCounters(contact.id);
      }

      const incoming = data.status ?? (logsTouch ? touchStatus : null);
      const currentStatus =
        incoming && !created
          ? await OutreachContactStore.applyStatus(
              contact,
              incoming,
              data.forceStatus,
            )
          : contact.status;

      const [counters] = await db
        .select({ contactCount: outreachContacts.contactCount })
        .from(outreachContacts)
        .where(eq(outreachContacts.id, contact.id))
        .limit(1);

      let warning: string | null = null;
      if (logsTouch && data.direction === OutreachDirection.OUT) {
        if (previousStatus === OutreachContactStatus.OPT_OUT) {
          warning = t("contact.post.widget.warnOptOut");
        } else if (previousStatus === OutreachContactStatus.BOUNCED) {
          warning = t("contact.post.widget.warnBounced");
        }
      }

      logger.debug("Outreach contact saved", {
        id: contact.id,
        created,
        status: currentStatus,
        touchLogged: logsTouch,
      });
      return success({
        id: contact.id,
        created,
        currentStatus,
        previousStatus,
        touchLogged: logsTouch,
        contactCount: counters?.contactCount ?? 0,
        warning,
      });
    } catch (error) {
      logger.error("Failed to save outreach contact", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
