import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { DocumentDeliveryService } from "../../../document-delivery/service";
import type {
  InvoiceDeliverEmailRequest,
  InvoiceDeliverEmailResponse,
  InvoiceDeliverPath,
  InvoiceDeliveryLogResponse,
} from "./definition";

export class InvoiceDeliverRepository {
  static async listLog(
    userId: string,
    urlPathParams: InvoiceDeliverPath,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InvoiceDeliveryLogResponse>> {
    return DocumentDeliveryService.listDeliveries(
      "invoice",
      urlPathParams.invoiceId,
      userId,
      locale,
      logger,
    );
  }

  static async sendEmail(
    userId: string,
    urlPathParams: InvoiceDeliverPath,
    data: InvoiceDeliverEmailRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InvoiceDeliverEmailResponse>> {
    const res = await DocumentDeliveryService.sendDocumentEmail({
      documentType: data.documentType ?? "invoice",
      documentId: urlPathParams.invoiceId,
      recipientEmail: data.recipientEmail,
      recipientName: data.recipientName,
      customMessage: data.customMessage,
      isResend: data.isResend,
      userId,
      locale,
      logger,
    });
    if (!res.success) {
      return res;
    }
    return success({ delivery: res.data });
  }
}
