import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  PreauthorizedTransactionsExecutionsCreateRequestOutput,
  PreauthorizedTransactionsExecutionsCreateResponseOutput,
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

export class PreauthorizedTransactionsExecutionsRepository {
  static async create(
    data: PreauthorizedTransactionsExecutionsCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<PreauthorizedTransactionsExecutionsCreateResponseOutput>
  > {
    const result = await CorvinaClient.request<CorvinaExecutionOrder[]>(
      {
        method: "POST",
        path: "/api/v1/preauthorized/transactions/executions",
        body: {
          items: [
            {
              preauthorizedCreditTransactionId:
                data.preauthorizedCreditTransactionId,
              ordinal: data.ordinal,
            },
          ],
        },
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Preauthorized transactions bulk executions created");
    return success({
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
