import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { DocumentDeliveryService } from "../../../document-delivery/service";
import type { EstimatePdfPath, EstimatePdfResponse } from "./definition";

export class EstimatePdfRepository {
  static async getPdf(
    userId: string,
    urlPathParams: EstimatePdfPath,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<EstimatePdfResponse>> {
    const generated = await DocumentDeliveryService.generateEstimatePdf(
      urlPathParams.estimateId,
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
    });
  }
}
