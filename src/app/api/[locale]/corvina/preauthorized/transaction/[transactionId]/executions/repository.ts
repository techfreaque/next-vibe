import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  PreauthorizedExecutionsListRequestOutput,
  PreauthorizedExecutionsListResponseOutput,
  PreauthorizedExecutionsListUrlParamsOutput,
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

export class PreauthorizedExecutionsListRepository {
  static async list(
    urlPathParams: PreauthorizedExecutionsListUrlParamsOutput,
    data: PreauthorizedExecutionsListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PreauthorizedExecutionsListResponseOutput>> {
    const query: Record<string, string | number> = {};
    if (data.ordinal !== undefined) {
      query.ordinal = data.ordinal;
    }
    if (data.issuer !== undefined && data.issuer !== "") {
      query.issuer = data.issuer;
    }

    const path = `/api/v1/preauthorized/transaction/${encodeURIComponent(urlPathParams.transactionId)}/executions`;

    const result = await CorvinaClient.request<CorvinaExecutionOrder[]>(
      {
        method: "GET",
        path,
        query,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Preauthorized execution orders fetched", {
      transactionId: urlPathParams.transactionId,
    });
    return success({
      transactionId: urlPathParams.transactionId,
      items: result.data.map((item) => ({
        transactionId: item.transactionId,
        preauthorizedCreditTransactionId: item.preauthorizedCreditTransactionId,
        executionTime:
          item.executionTime !== null ? new Date(item.executionTime) : null,
        ordinal: item.ordinal,
        executionResult: item.executionResult,
        errorCode: item.errorCode,
        failureReason: item.failureReason,
        issuer: item.issuer,
      })),
    });
  }
}
