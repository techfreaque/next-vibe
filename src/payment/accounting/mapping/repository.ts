import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { scopedTranslation } from "../i18n";
import { SalesAccountingRepository } from "../repository";
import type definition from "./definition";

export async function configureProcessorOffer(
  data: Parameters<typeof SalesAccountingRepository.saveOffer>[1],
  userId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
  t: ReturnType<typeof scopedTranslation.scopedT>["t"],
): Promise<ResponseType<(typeof definition.POST)["types"]["ResponseOutput"]>> {
  const mapping = await SalesAccountingRepository.saveOffer(
    userId,
    data,
    logger,
    locale,
  );
  return mapping.status === "saved"
    ? success({ id: mapping.id })
    : fail({
        message: t(mapping.status),
        errorType:
          mapping.status === "forbidden"
            ? ErrorResponseTypes.FORBIDDEN
            : ErrorResponseTypes.VALIDATION_ERROR,
      });
}
