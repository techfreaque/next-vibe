import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  PreauthorizedTransactionCreateRequestOutput,
  PreauthorizedTransactionCreateResponseOutput,
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
): PreauthorizedTransactionCreateResponseOutput {
  return {
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

export class PreauthorizedTransactionRepository {
  static async create(
    data: PreauthorizedTransactionCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PreauthorizedTransactionCreateResponseOutput>> {
    const body: Record<string, string | number | boolean | null> = {
      orderId: data.orderId,
      targetWalletId: data.targetWalletId,
      amount: data.amount,
    };

    if (data.ordinal !== undefined) {
      body.ordinal = data.ordinal;
    }
    if (data.sourceWalletId !== undefined) {
      body.sourceWalletId = data.sourceWalletId;
    }
    if (data.txDescription !== undefined) {
      body.description = data.txDescription;
    }
    if (data.transactionSubjectType !== undefined) {
      body.transactionSubjectType = data.transactionSubjectType;
    }
    if (data.transactionSubjectRef !== undefined) {
      body.transactionSubjectRef = data.transactionSubjectRef;
    }
    if (data.transactionSubjectQuantity !== undefined) {
      body.transactionSubjectQuantity = data.transactionSubjectQuantity;
    }
    if (data.executionMinTime !== undefined) {
      body.executionMinTime =
        data.executionMinTime instanceof Date
          ? data.executionMinTime.toISOString()
          : String(data.executionMinTime);
    }
    if (data.executionMaxTime !== undefined) {
      body.executionMaxTime =
        data.executionMaxTime instanceof Date
          ? data.executionMaxTime.toISOString()
          : String(data.executionMaxTime);
    }

    const result = await CorvinaClient.request<CorvinaPreauthorizedTransaction>(
      {
        method: "POST",
        path: "/api/v1/preauthorized/transaction",
        body,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Preauthorized transaction created", {
      orderId: data.orderId,
    });
    return success(mapTransaction(result.data));
  }
}
