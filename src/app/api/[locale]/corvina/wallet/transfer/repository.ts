import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CorvinaClient,
  type CorvinaBodyObject,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  WalletTransferRequestOutput,
  WalletTransferResponseOutput,
} from "./definition";

interface CorvinaCreditTransactionApiResponse {
  id: number;
  errorCode: number | null;
  executionResult: string;
  failureReason: string | null;
  sourceWalletId: string | null;
  targetWalletId: string | null;
  amount: number;
  createdAt: string | null;
  authorizedBy: string | null;
  issuedBy: string | null;
  description: string | null;
  sourceOrgResourceId: string | null;
  orderId: string | null;
  ordinal: number | null;
}

export class WalletTransferRepository {
  static async transfer(
    data: WalletTransferRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<WalletTransferResponseOutput>> {
    const body: CorvinaBodyObject = {
      targetWalletId: data.targetWalletId,
      amount: data.amount,
    };
    if (data.orderId !== undefined) {
      body.orderId = data.orderId;
    }
    if (data.ordinal !== undefined) {
      body.ordinal = data.ordinal;
    }
    if (data.authorizedBy !== undefined) {
      body.authorizedBy = data.authorizedBy;
    }
    if (data.sourceOrgResourceId !== undefined) {
      body.sourceOrgResourceId = data.sourceOrgResourceId;
    }
    if (data.transferDescription !== undefined) {
      body.description = data.transferDescription;
    }

    const result =
      await CorvinaClient.request<CorvinaCreditTransactionApiResponse>(
        {
          method: "POST",
          path: `/api/v1/wallet/${encodeURIComponent(data.sourceWalletId)}/transferTo/${encodeURIComponent(data.targetWalletId)}`,
          body,
          service: "license",
        },
        logger,
        locale,
      );

    if (!result.success) {
      return result;
    }

    const raw = result.data;
    logger.info("[CORVINA] Wallet transfer complete", {
      id: raw.id,
      executionResult: raw.executionResult,
    });

    return success({
      id: raw.id,
      sourceWalletId: raw.sourceWalletId ?? data.sourceWalletId,
      targetWalletId: raw.targetWalletId ?? data.targetWalletId,
      amount: raw.amount,
      executionResult: raw.executionResult,
      failureReason: raw.failureReason,
      createdAt: raw.createdAt !== null ? new Date(raw.createdAt) : null,
      issuedBy: raw.issuedBy,
      errorCode: raw.errorCode ?? undefined,
      orderId: raw.orderId ?? data.orderId,
      ordinal: raw.ordinal ?? data.ordinal,
      authorizedBy: raw.authorizedBy ?? data.authorizedBy,
      sourceOrgResourceId: raw.sourceOrgResourceId ?? data.sourceOrgResourceId,
    });
  }
}
