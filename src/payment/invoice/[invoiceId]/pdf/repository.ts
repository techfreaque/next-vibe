import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { DocumentDeliveryService } from "../../../document-delivery/service";
import type { InvoicePdfPath, InvoicePdfResponse } from "./definition";

export class InvoicePdfRepository {
  static async getPdf(
    userId: string,
    urlPathParams: InvoicePdfPath,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<InvoicePdfResponse>> {
    const generated = await DocumentDeliveryService.generateInvoicePdf(
      urlPathParams.invoiceId,
      userId,
      locale,
      logger,
    );
    if (!generated.success) {
      return generated;
    }
    const doc = generated.data;
    return success({
      documentNumber: doc.documentNumber,
      filename: doc.filename,
      contentType: doc.contentType,
      pdfBase64: doc.pdfBase64,
      hasZugferd: doc.hasZugferd,
      qrKind: doc.qrKind,
      qrSvg: doc.qrSvg,
      paymentUrl: doc.paymentUrl,
    });
  }
}
