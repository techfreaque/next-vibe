import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  PreauthorizedExecutionCreateResponseOutput,
  PreauthorizedExecutionCreateUrlParamsOutput,
} from "./definition";

interface CorvinaExecutionOrder {
  id: number | null;
  transactionId: number | null;
  preauthorizedCreditTransactionId: number | null;
  executionTime: string | null;
  ordinal: number | null;
  executionResult: string | null;
  errorCode: number | null;
  failureReason: string | null;
  issuer: string | null;
}

function mapExecutionOrder(
  raw: CorvinaExecutionOrder,
): PreauthorizedExecutionCreateResponseOutput {
  return {
    transactionId: raw.transactionId,
    preauthorizedCreditTransactionId: raw.preauthorizedCreditTransactionId,
    executionTime:
      raw.executionTime !== null ? new Date(raw.executionTime) : null,
    ordinal: raw.ordinal,
    executionResult: raw.executionResult,
    errorCode: raw.errorCode,
    failureReason: raw.failureReason,
    issuer: raw.issuer,
  };
}

export class PreauthorizedExecutionRepository {
  static async create(
    urlPathParams: PreauthorizedExecutionCreateUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PreauthorizedExecutionCreateResponseOutput>> {
    const path = `/api/v1/preauthorized/transaction/${encodeURIComponent(urlPathParams.transactionId ?? 0)}/execution/${encodeURIComponent(urlPathParams.ordinal ?? 0)}`;

    const result = await CorvinaClient.request<CorvinaExecutionOrder>(
      {
        method: "POST",
        path,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Preauthorized execution order created", {
      transactionId: urlPathParams.transactionId,
      ordinal: urlPathParams.ordinal,
    });
    return success(mapExecutionOrder(result.data));
  }
}
