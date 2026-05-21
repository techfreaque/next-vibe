import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  PreauthorizedTransactionsBulkCreateRequestOutput,
  PreauthorizedTransactionsBulkCreateResponseOutput,
  PreauthorizedTransactionsBulkDeleteRequestOutput,
  PreauthorizedTransactionsBulkDeleteResponseOutput,
  PreauthorizedTransactionsListRequestOutput,
  PreauthorizedTransactionsListResponseOutput,
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

interface CorvinaTransactionListResponse {
  items: CorvinaPreauthorizedTransaction[];
  total: number;
  currentPage: number;
  totalPages: number;
}

function mapTransaction(
  raw: CorvinaPreauthorizedTransaction,
): PreauthorizedTransactionsListResponseOutput["items"][number] {
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

export class PreauthorizedTransactionsRepository {
  static async list(
    data: PreauthorizedTransactionsListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PreauthorizedTransactionsListResponseOutput>> {
    const query: Record<string, string | number> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.targetWalletId !== undefined && data.targetWalletId !== "") {
      query.targetWalletId = data.targetWalletId;
    }
    if (data.orderId !== undefined && data.orderId !== "") {
      query.orderId = data.orderId;
    }
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result = await CorvinaClient.request<CorvinaTransactionListResponse>(
      {
        method: "GET",
        path: "/api/v1/preauthorized/transactions",
        query,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Preauthorized transactions listed");
    return success({
      items: result.data.items.map(mapTransaction),
      total: result.data.total,
      currentPage: result.data.currentPage,
      totalPages: result.data.totalPages,
    });
  }

  static async bulkCreate(
    data: PreauthorizedTransactionsBulkCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PreauthorizedTransactionsBulkCreateResponseOutput>> {
    const item: Record<string, string | number | boolean | null> = {
      orderId: data.orderId,
      targetWalletId: data.targetWalletId,
      amount: data.amount,
    };
    if (data.ordinal !== undefined) {
      item.ordinal = data.ordinal;
    }
    if (data.sourceWalletId !== undefined) {
      item.sourceWalletId = data.sourceWalletId;
    }
    if (data.txDescription !== undefined) {
      item.description = data.txDescription;
    }
    if (data.transactionSubjectType !== undefined) {
      item.transactionSubjectType = data.transactionSubjectType;
    }
    if (data.transactionSubjectRef !== undefined) {
      item.transactionSubjectRef = data.transactionSubjectRef;
    }
    if (data.transactionSubjectQuantity !== undefined) {
      item.transactionSubjectQuantity = data.transactionSubjectQuantity;
    }
    if (data.executionMinTime !== undefined) {
      item.executionMinTime =
        data.executionMinTime instanceof Date
          ? data.executionMinTime.toISOString()
          : String(data.executionMinTime);
    }
    if (data.executionMaxTime !== undefined) {
      item.executionMaxTime =
        data.executionMaxTime instanceof Date
          ? data.executionMaxTime.toISOString()
          : String(data.executionMaxTime);
    }

    const result = await CorvinaClient.request<
      CorvinaPreauthorizedTransaction[]
    >(
      {
        method: "POST",
        path: "/api/v1/preauthorized/transactions",
        body: { items: [item] },
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Preauthorized transactions bulk created");
    return success({ items: result.data.map(mapTransaction) });
  }

  static async bulkRevoke(
    data: PreauthorizedTransactionsBulkDeleteRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PreauthorizedTransactionsBulkDeleteResponseOutput>> {
    const result = await CorvinaClient.request<
      CorvinaPreauthorizedTransaction[]
    >(
      {
        method: "DELETE",
        path: "/api/v1/preauthorized/transactions",
        body: { ids: [data.transactionId] },
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Preauthorized transactions bulk revoked");
    return success({ items: result.data.map(mapTransaction) });
  }
}
