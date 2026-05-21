import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  PreauthorizedTransactionDeleteResponseOutput,
  PreauthorizedTransactionDeleteUrlParamsOutput,
  PreauthorizedTransactionGetResponseOutput,
  PreauthorizedTransactionGetUrlParamsOutput,
} from "./definition";

interface CorvinaPreauthorizedTransaction {
  id: number | null;
  orderId: string;
  ordinal: number | null;
  authorizedBy: string | null;
  targetWalletId: string;
  amount: number;
  sourceOrgResourceId: string | null;
  sourceWalletId: string | null;
  description: string | null;
  transactionSubjectType: string | null;
  transactionSubjectRef: string | null;
  transactionSubjectQuantity: number | null;
  executionMinTime: string | null;
  executionMaxTime: string | null;
  updatedAt: string | null;
  revokedBy: string | null;
  executionMaxOrdinal: number | null;
  state: string | null;
  orgResourceId: string | null;
  expectedPaymentsToDate: number | null;
  actualPaymentsReceived: number | null;
  nextPaymentDate: string | null;
}

function mapTransaction(
  raw: CorvinaPreauthorizedTransaction,
  transactionId: number,
): PreauthorizedTransactionGetResponseOutput {
  return {
    transactionId,
    id: raw.id,
    orderId: raw.orderId,
    ordinal: raw.ordinal,
    authorizedBy: raw.authorizedBy,
    targetWalletId: raw.targetWalletId,
    amount: raw.amount,
    sourceOrgResourceId: raw.sourceOrgResourceId,
    sourceWalletId: raw.sourceWalletId,
    description: raw.description,
    transactionSubjectType: raw.transactionSubjectType,
    transactionSubjectRef: raw.transactionSubjectRef,
    transactionSubjectQuantity: raw.transactionSubjectQuantity,
    executionMinTime:
      raw.executionMinTime !== null ? new Date(raw.executionMinTime) : null,
    executionMaxTime:
      raw.executionMaxTime !== null ? new Date(raw.executionMaxTime) : null,
    updatedAt: raw.updatedAt !== null ? new Date(raw.updatedAt) : null,
    revokedBy: raw.revokedBy,
    executionMaxOrdinal: raw.executionMaxOrdinal,
    state: raw.state,
    orgResourceId: raw.orgResourceId,
    expectedPaymentsToDate: raw.expectedPaymentsToDate,
    actualPaymentsReceived: raw.actualPaymentsReceived,
    nextPaymentDate:
      raw.nextPaymentDate !== null ? new Date(raw.nextPaymentDate) : null,
  };
}

function buildPath(transactionId: number): string {
  return `/api/v1/preauthorized/transaction/${encodeURIComponent(transactionId)}`;
}

export class PreauthorizedTransactionByIdRepository {
  static async get(
    data: PreauthorizedTransactionGetUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PreauthorizedTransactionGetResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaPreauthorizedTransaction>(
      {
        method: "GET",
        path: buildPath(data.transactionId),
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Preauthorized transaction fetched", {
      transactionId: data.transactionId,
    });
    return success(mapTransaction(result.data, data.transactionId));
  }

  static async revoke(
    data: PreauthorizedTransactionDeleteUrlParamsOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PreauthorizedTransactionDeleteResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaPreauthorizedTransaction>(
      {
        method: "DELETE",
        path: buildPath(data.transactionId),
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Preauthorized transaction revoked", {
      transactionId: data.transactionId,
    });
    return success(mapTransaction(result.data, data.transactionId));
  }
}
