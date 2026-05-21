import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  WalletHistoryRequestOutput,
  WalletHistoryResponseOutput,
} from "./definition";

interface CorvinaCreditTransaction {
  id: number;
  executionResult: string;
  failureReason: string | null;
  sourceWalletId: string | null;
  targetWalletId: string | null;
  amount: number;
  createdAt: string | null;
  authorizedBy: string | null;
  description: string | null;
  orderId: string | null;
  orgResourceId: string | null;
}

interface CorvinaWalletHistoryPageResponse {
  content: CorvinaCreditTransaction[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export class WalletHistoryRepository {
  static async getHistory(
    data: WalletHistoryRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<WalletHistoryResponseOutput>> {
    const query: Record<string, string | number | undefined> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.orderBy !== undefined && data.orderBy !== "") {
      query.orderBy = data.orderBy;
    }
    if (data.orderDir !== undefined && data.orderDir !== "") {
      query.orderDir = data.orderDir;
    }

    const result =
      await CorvinaClient.request<CorvinaWalletHistoryPageResponse>(
        {
          method: "GET",
          path: `/api/v1/wallet/${encodeURIComponent(data.walletId)}/history`,
          query,
          service: "license",
        },
        logger,
        locale,
      );
    if (!result.success) {
      return result;
    }
    return success({
      total: result.data.totalElements,
      totalPages: result.data.totalPages,
      currentPage: result.data.number,
      transactions: result.data.content.map((item) => ({
        id: item.id,
        executionResult: item.executionResult,
        failureReason: item.failureReason,
        sourceWalletId: item.sourceWalletId,
        targetWalletId: item.targetWalletId,
        amount: item.amount,
        createdAt: item.createdAt !== null ? new Date(item.createdAt) : null,
        authorizedBy: item.authorizedBy,
        description: item.description,
        orderId: item.orderId,
        orgResourceId: item.orgResourceId,
      })),
    });
  }
}
