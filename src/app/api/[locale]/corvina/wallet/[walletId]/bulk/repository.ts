import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  WalletBulkRequestOutput,
  WalletBulkResponseOutput,
} from "./definition";

interface CorvinaCreditTransaction {
  id: number | null;
  executionResult: string | null;
  failureReason: string | null;
  sourceWalletId: string | null;
  targetWalletId: string | null;
  amount: number | null;
  createdAt: string | null;
  orderId: string | null;
  ordinal: number | null;
  orgResourceId: string | null;
}

export class WalletBulkRepository {
  static async bulkTransfer(
    data: WalletBulkRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<WalletBulkResponseOutput>> {
    const item: Record<string, string | number | boolean> = {
      orderId: data.orderId,
      targetWalletId: data.targetWalletId,
      amount: data.amount,
    };
    if (data.ordinal !== undefined) {
      item.ordinal = data.ordinal;
    }
    if (data.sourceWalletId !== undefined && data.sourceWalletId !== "") {
      item.sourceWalletId = data.sourceWalletId;
    }
    if (
      data.transferDescription !== undefined &&
      data.transferDescription !== ""
    ) {
      item.description = data.transferDescription;
    }
    if (
      data.transactionSubjectType !== undefined &&
      data.transactionSubjectType !== ""
    ) {
      item.transactionSubjectType = data.transactionSubjectType;
    }
    if (
      data.transactionSubjectRef !== undefined &&
      data.transactionSubjectRef !== ""
    ) {
      item.transactionSubjectRef = data.transactionSubjectRef;
    }
    if (data.transactionSubjectQuantity !== undefined) {
      item.transactionSubjectQuantity = data.transactionSubjectQuantity;
    }

    const result = await CorvinaClient.request<CorvinaCreditTransaction[]>(
      {
        method: "POST",
        path: `/api/v1/wallet/${encodeURIComponent(data.targetWalletId)}/bulk`,
        body: [item],
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Bulk credit transfer completed", {
      targetWalletId: data.targetWalletId,
      orderId: data.orderId,
      count: result.data.length,
    });
    return success({
      targetWalletId: data.targetWalletId,
      orderId: data.orderId,
      items: result.data.map((tx) => ({
        id: tx.id,
        executionResult: tx.executionResult,
        failureReason: tx.failureReason,
        sourceWalletId: tx.sourceWalletId,
        targetWalletId: tx.targetWalletId,
        amount: tx.amount,
        createdAt: tx.createdAt,
        orderId: tx.orderId,
        ordinal: tx.ordinal,
        orgResourceId: tx.orgResourceId,
      })),
    });
  }
}
