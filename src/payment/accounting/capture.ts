import "server-only";

import { and, asc, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "next-vibe/database";

import { paymentTransactions } from "../db";
import { PaymentProvider } from "../enum";
import { paymentEnv } from "../env";
import type { WebhookEvent } from "../providers/types";
import { paymentAccountingEvidence, paymentAccountingPostings } from "./db";
import {
  merchantCredentialId,
  readVerifiedAccountingEvidence,
} from "./evidence";

export async function captureVerifiedAccountingEvidence(
  provider: typeof paymentAccountingEvidence.$inferInsert.provider,
  body: string,
  event: WebhookEvent,
): Promise<string | undefined> {
  const credential =
    provider === PaymentProvider.STRIPE
      ? paymentEnv.STRIPE_WEBHOOK_SECRET
      : paymentEnv.NOWPAYMENTS_IPN_SECRET;
  if (!credential) {
    return undefined;
  }
  const evidence = readVerifiedAccountingEvidence(
    body,
    provider,
    merchantCredentialId(credential),
    event.data.metadata?.productId,
  );
  if (!evidence || evidence.grossMinor <= 0) {
    return undefined;
  }
  return db.transaction(async (tx) => {
    if (
      evidence.sourceKind === "refund" &&
      (evidence.paymentIntentId || evidence.invoiceReference)
    ) {
      const source = paymentAccountingEvidence;
      const posting = paymentAccountingPostings;
      // Serialize a signed refund with a concurrent release of its original deferred sale.
      await tx
        .select({ id: source.id })
        .from(source)
        .innerJoin(
          posting,
          and(
            eq(source.provider, posting.provider),
            eq(source.merchantId, posting.merchantId),
            eq(source.externalId, posting.externalId),
            eq(source.sourceKind, posting.sourceKind),
          ),
        )
        .innerJoin(
          paymentTransactions,
          eq(paymentTransactions.id, posting.transactionId),
        )
        .where(
          and(
            eq(source.provider, evidence.provider),
            eq(source.merchantId, evidence.merchantId),
            eq(source.sourceKind, "sale"),
            or(
              evidence.paymentIntentId
                ? eq(
                    paymentTransactions.providerPaymentIntentId,
                    evidence.paymentIntentId,
                  )
                : undefined,
              evidence.invoiceReference
                ? eq(source.invoiceReference, evidence.invoiceReference)
                : undefined,
            ),
          ),
        )
        .orderBy(asc(source.id))
        .for("update", { of: source });
    }
    const [created] = await tx
      .insert(paymentAccountingEvidence)
      .values(evidence)
      .onConflictDoNothing()
      .returning({ id: paymentAccountingEvidence.id });
    if (created) {
      return created.id;
    }
    const [existing] = await tx
      .select()
      .from(paymentAccountingEvidence)
      .where(
        and(
          eq(paymentAccountingEvidence.provider, evidence.provider),
          eq(paymentAccountingEvidence.merchantId, evidence.merchantId),
          eq(paymentAccountingEvidence.sourceKind, evidence.sourceKind),
          eq(paymentAccountingEvidence.externalId, evidence.externalId),
        ),
      )
      .for("update");
    if (!existing) {
      return undefined;
    }
    const servicePresent = Boolean(
      evidence.servicePeriodStart && evidence.servicePeriodEnd,
    );
    const serviceRecorded = Boolean(
      existing.servicePeriodStart && existing.servicePeriodEnd,
    );
    if (existing.servicePeriodConflict) {
      return undefined;
    }
    if (
      existing.currency !== evidence.currency ||
      existing.grossMinor !== evidence.grossMinor ||
      existing.feeMinor !== (evidence.feeMinor ?? null) ||
      existing.offerId !== (evidence.offerId ?? null) ||
      existing.paymentIntentId !== (evidence.paymentIntentId ?? null) ||
      existing.checkoutId !== (evidence.checkoutId ?? null) ||
      (existing.invoiceReference !== (evidence.invoiceReference ?? null) &&
        !(
          evidence.sourceKind === "refund" &&
          (!existing.invoiceReference || !evidence.invoiceReference)
        ))
    ) {
      if (servicePresent || serviceRecorded) {
        await tx
          .update(paymentAccountingEvidence)
          .set({ servicePeriodConflict: true })
          .where(eq(paymentAccountingEvidence.id, existing.id));
      }
      return undefined;
    }
    if (evidence.sourceKind === "sale" && (servicePresent || serviceRecorded)) {
      const taxConflicts = existing.taxMinor !== (evidence.taxMinor ?? null);
      const periodConflicts =
        servicePresent &&
        serviceRecorded &&
        (existing.servicePeriodStart?.getTime() !==
          evidence.servicePeriodStart?.getTime() ||
          existing.servicePeriodEnd?.getTime() !==
            evidence.servicePeriodEnd?.getTime() ||
          existing.serviceNetMinor !== evidence.serviceNetMinor);
      if (
        taxConflicts ||
        periodConflicts ||
        existing.sourceDate.getTime() !== evidence.sourceDate.getTime()
      ) {
        await tx
          .update(paymentAccountingEvidence)
          .set({ servicePeriodConflict: true })
          .where(eq(paymentAccountingEvidence.id, existing.id));
        return undefined;
      }
      if (servicePresent && !serviceRecorded) {
        await tx
          .update(paymentAccountingEvidence)
          .set({
            servicePeriodStart: evidence.servicePeriodStart,
            servicePeriodEnd: evidence.servicePeriodEnd,
            serviceNetMinor: evidence.serviceNetMinor,
          })
          .where(eq(paymentAccountingEvidence.id, existing.id));
      }
      return existing.id;
    }
    if (existing.taxMinor === (evidence.taxMinor ?? null)) {
      return existing.id;
    }
    if (evidence.sourceKind !== "refund") {
      return undefined;
    }
    if (evidence.taxMinor === null || evidence.taxMinor === undefined) {
      return existing.id;
    }
    if (existing.taxMinor !== null || !evidence.invoiceReference) {
      return undefined;
    }

    const source = paymentAccountingEvidence;
    const posting = paymentAccountingPostings;
    const [enriched] = await tx
      .update(source)
      .set({
        taxMinor: evidence.taxMinor,
        invoiceReference: evidence.invoiceReference,
      })
      .where(
        and(
          eq(source.id, existing.id),
          isNull(source.taxMinor),
          sql`not exists (select 1 from ${posting}
        where ${posting.provider} = ${evidence.provider}
          and ${posting.merchantId} = ${evidence.merchantId}
          and ${posting.sourceKind} = 'refund'
          and ${posting.externalId} = ${evidence.externalId})`,
        ),
      )
      .returning({ id: source.id });
    return enriched?.id;
  });
}
