import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import {
  type LedgerTransaction,
  lockLedgerCompany,
} from "@/chart-of-accounts/shared/ledger-write";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { scopedTranslation as systemMailboxTranslation } from "@/messenger/system-mailbox/i18n";
import { SystemMailboxRepository } from "@/messenger/system-mailbox/repository";
import { paymentInvoices } from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";

import { buildInvoiceViewUrl } from "../../token";
import type definitions from "./definition";
import {
  type InvoiceMailClaim,
  invoiceMailClaimSchema,
  type InvoiceMailOutcome,
  type InvoiceMailPayload,
} from "./delivery-state";
import { scopedTranslation } from "./i18n";

export class InvoiceDeliveryRepository {
  private static isIssued(
    invoice: typeof paymentInvoices.$inferSelect,
  ): boolean {
    return (
      invoice.status === InvoiceStatus.OPEN ||
      invoice.status === InvoiceStatus.PAID
    );
  }

  private static readClaim(
    metadata: (typeof paymentInvoices.$inferSelect)["metadata"],
  ): InvoiceMailClaim | "uncertain" | undefined {
    const bundle = z
      .object({ invoiceEmailDelivery: invoiceMailClaimSchema.optional() })
      .safeParse(metadata ?? {});
    return bundle.success ? bundle.data.invoiceEmailDelivery : "uncertain";
  }

  private static invoiceNumber(
    invoice: typeof paymentInvoices.$inferSelect,
  ): string {
    return (
      invoice.invoiceNumber?.trim() ||
      (invoice.invoiceSequenceNumber
        ? `INV-${invoice.invoiceSequenceNumber}`
        : invoice.id)
    );
  }

  private static async recipient(
    invoice: typeof paymentInvoices.$inferSelect,
    conn: Pick<LedgerTransaction, "select"> = db,
  ): Promise<string | null> {
    if (!invoice.companyId) {
      return null;
    }
    const contact = z
      .object({
        customerEmail: z.email().optional(),
        customerId: z.uuid().optional(),
      })
      .safeParse(invoice.metadata ?? {});
    if (!contact.success) {
      return null;
    }
    if (contact.data.customerEmail) {
      return contact.data.customerEmail;
    }
    if (!contact.data.customerId) {
      return null;
    }
    const [assigned] = await conn
      .select({ email: users.email })
      .from(users)
      .where(
        and(
          eq(users.id, contact.data.customerId),
          eq(users.emailVerified, true),
        ),
      );
    const email = z.email().safeParse(assigned?.email);
    return email.success ? email.data : null;
  }

  static async share(
    invoiceId: string,
    actorId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<typeof definitions.GET.types.ResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, invoiceId));
      if (!invoice || !(await getDocumentAccess(actorId, invoice))?.canManage) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      if (!InvoiceDeliveryRepository.isIssued(invoice)) {
        return fail({
          message: t("delivery.notIssued"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      const claim = InvoiceDeliveryRepository.readClaim(invoice.metadata);
      const recipient =
        claim && claim !== "uncertain" && claim.status !== "retryable"
          ? claim.recipient
          : await InvoiceDeliveryRepository.recipient(invoice);
      return success({
        id: invoice.id,
        number: InvoiceDeliveryRepository.invoiceNumber(invoice),
        viewUrl: buildInvoiceViewUrl(invoice.id),
        recipient,
        deliveryStatus:
          claim === "uncertain" ? claim : (claim?.status ?? "ready"),
      });
    } catch {
      logger.error("Invoice share lookup failed");
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async send(
    invoiceId: string,
    expectedRecipient: string,
    actorId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    transmit: (payload: InvoiceMailPayload) => Promise<InvoiceMailOutcome> = (
      payload,
    ) => InvoiceDeliveryRepository.sendViaMailbox(payload, locale, logger),
  ): Promise<ResponseType<typeof definitions.PATCH.types.ResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const forbidden = fail({
      message: t("post.errors.forbidden.title"),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });
    try {
      const [scope] = await db
        .select({
          companyId: paymentInvoices.companyId,
          userId: paymentInvoices.userId,
        })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, invoiceId));
      if (
        !scope?.companyId ||
        !(await getDocumentAccess(actorId, scope))?.canManage
      ) {
        return forbidden;
      }
      const companyId = scope.companyId;
      const claim = await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, companyId);
        const [invoice] = await tx
          .select()
          .from(paymentInvoices)
          .where(
            and(
              eq(paymentInvoices.id, invoiceId),
              eq(paymentInvoices.companyId, companyId),
            ),
          )
          .for("update");
        const access = invoice
          ? await getDocumentAccess(actorId, invoice, tx)
          : null;
        if (!company || !invoice || !access?.canManage) {
          return forbidden;
        }
        if (!InvoiceDeliveryRepository.isIssued(invoice)) {
          return fail({
            message: t("delivery.notIssued"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        const prior = InvoiceDeliveryRepository.readClaim(invoice.metadata);
        if (prior === "uncertain") {
          return success({ deliveryStatus: prior });
        }
        if (prior && prior.status !== "retryable") {
          return success({ deliveryStatus: prior.status });
        }
        const recipient = await InvoiceDeliveryRepository.recipient(
          invoice,
          tx,
        );
        if (!recipient || recipient !== expectedRecipient) {
          return fail({
            message: t("delivery.recipientChanged"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        const number = InvoiceDeliveryRepository.invoiceNumber(invoice);
        const companyName = access.companyName ?? "";
        const payload = {
          to: recipient,
          subject: t("delivery.emailSubject", { number }),
          text: t("delivery.emailText", {
            number,
            company: companyName,
            url: buildInvoiceViewUrl(invoice.id),
          }),
          actorId,
        };
        const next = {
          status: "pending",
          attemptId: randomUUID(),
          actorId,
          recipient,
          updatedAt: new Date().toISOString(),
        } satisfies InvoiceMailClaim;
        await tx
          .update(paymentInvoices)
          .set({
            metadata: InvoiceDeliveryRepository.writeClaim(next),
          })
          .where(eq(paymentInvoices.id, invoiceId));
        return success({ claim: next, payload });
      });
      if (!claim.success) {
        return claim;
      }
      if ("deliveryStatus" in claim.data) {
        return success({ deliveryStatus: claim.data.deliveryStatus });
      }
      const { claim: attempt, payload } = claim.data;
      const outcome = await transmit(payload).catch(
        (): InvoiceMailOutcome => "uncertain",
      );
      const [recorded] = await db
        .update(paymentInvoices)
        .set({
          metadata: InvoiceDeliveryRepository.writeClaim({
            ...attempt,
            status: outcome,
            updatedAt: new Date().toISOString(),
          }),
        })
        .where(
          and(
            eq(paymentInvoices.id, invoiceId),
            eq(paymentInvoices.companyId, companyId),
            sql`${paymentInvoices.metadata}->'invoiceEmailDelivery'->>'attemptId' = ${attempt.attemptId}`,
            sql`${paymentInvoices.metadata}->'invoiceEmailDelivery'->>'status' = 'pending'`,
          ),
        )
        .returning({ id: paymentInvoices.id });
      return success({ deliveryStatus: recorded ? outcome : "uncertain" });
    } catch {
      // If an attempt was claimed, leave it pending across an interrupted response or write.
      // A later request cannot distinguish that from a message that reached the relay.
      logger.error("Invoice delivery could not complete");
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static writeClaim(claim: InvoiceMailClaim): ReturnType<typeof sql> {
    return sql`coalesce(${paymentInvoices.metadata}, '{}'::jsonb) || jsonb_build_object('invoiceEmailDelivery', ${JSON.stringify(claim)}::jsonb)`;
  }

  private static async sendViaMailbox(
    payload: InvoiceMailPayload,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<InvoiceMailOutcome> {
    const safeLogger: EndpointLogger = {
      isDebugEnabled: false,
      debug: () => undefined,
      info: () => undefined,
      vibe: () => undefined,
      warn: () => logger.warn("Invoice mailbox reported a warning"),
      error: () => logger.error("Invoice mailbox reported an error"),
    };
    const sent = await SystemMailboxRepository.send(
      { to: payload.to, subject: payload.subject, text: payload.text },
      payload.actorId,
      safeLogger,
      systemMailboxTranslation.scopedT(locale).t,
    );
    if (sent.success) {
      return "accepted";
    }
    // The mailbox returns these statuses only before handing a message to SMTP.
    if (
      sent.errorType === ErrorResponseTypes.NOT_FOUND ||
      sent.errorType === ErrorResponseTypes.FORBIDDEN ||
      sent.errorType === ErrorResponseTypes.VALIDATION_ERROR
    ) {
      return "retryable";
    }
    return "uncertain";
  }
}
