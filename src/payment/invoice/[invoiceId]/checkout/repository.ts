import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { getDocumentAccess } from "@/finance/document-company-scope";
import { paymentInvoices } from "@/payment/db";

import { scopedTranslation } from "../../recurring/i18n";
import { prepareInvoiceStripeCheckout } from "../../stripe-checkout";
import type {
  InvoiceCheckoutPath,
  InvoiceCheckoutResponse,
} from "./definition";

export class InvoiceCheckoutRepository {
  static async createCheckout(
    userId: string,
    urlPathParams: InvoiceCheckoutPath,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InvoiceCheckoutResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    const [invoice] = await db
      .select({
        id: paymentInvoices.id,
        companyId: paymentInvoices.companyId,
        userId: paymentInvoices.userId,
      })
      .from(paymentInvoices)
      .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
      .limit(1);
    if (!invoice) {
      return fail({
        message: t("errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    if (!(await getDocumentAccess(userId, invoice))?.canManage) {
      return fail({
        message: t("errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    const prepared = await prepareInvoiceStripeCheckout(
      urlPathParams.invoiceId,
      logger,
      locale,
    );
    if (!prepared.success) {
      return prepared;
    }
    return success({
      sessionId: prepared.data.sessionId,
      paymentUrl: prepared.data.paymentUrl,
      amountCents: prepared.data.amountCents,
      currency: prepared.data.currency,
      reused: prepared.data.reused,
    });
  }
}
