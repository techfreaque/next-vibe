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
  WalletCreditRequestOutput,
  WalletCreditResponseOutput,
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

export class WalletCreditRepository {
  static async credit(
    data: WalletCreditRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<WalletCreditResponseOutput>> {
    const body: CorvinaBodyObject = {
      orderId: data.orderId,
      amount: data.amount,
      targetWalletId: data.walletId,
    };
    if (data.ordinal !== undefined) {
      body.ordinal = data.ordinal;
    }
    if (data.authorizedBy !== undefined) {
      body.authorizedBy = data.authorizedBy;
    }
    if (data.sourceOrgResourceId !== undefined) {
      body.sourceOrgResourceId = data.sourceOrgResourceId;
    }
    if (data.sourceWalletId !== undefined) {
      body.sourceWalletId = data.sourceWalletId;
    }
    if (data.transferDescription !== undefined) {
      body.description = data.transferDescription;
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
    if (data.nextRenewalDate !== undefined) {
      body.nextRenewalDate =
        data.nextRenewalDate instanceof Date
          ? data.nextRenewalDate.toISOString()
          : String(data.nextRenewalDate);
    }

    const result =
      await CorvinaClient.request<CorvinaCreditTransactionApiResponse>(
        {
          method: "POST",
          path: `/api/v1/wallet/${encodeURIComponent(data.walletId)}`,
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
    return success({
      id: raw.id,
      errorCode: raw.errorCode ?? undefined,
      executionResult: raw.executionResult,
      failureReason: raw.failureReason,
      createdAt: raw.createdAt !== null ? new Date(raw.createdAt) : null,
      issuedBy: raw.issuedBy,
      targetWalletId: raw.targetWalletId,
      txDescription: raw.description,
      orderId: raw.orderId ?? data.orderId,
      ordinal: raw.ordinal ?? data.ordinal ?? undefined,
      authorizedBy: raw.authorizedBy ?? data.authorizedBy ?? undefined,
      amount: raw.amount,
      sourceOrgResourceId:
        raw.sourceOrgResourceId ?? data.sourceOrgResourceId ?? undefined,
      sourceWalletId: raw.sourceWalletId ?? data.sourceWalletId ?? undefined,
    });
  }
}
