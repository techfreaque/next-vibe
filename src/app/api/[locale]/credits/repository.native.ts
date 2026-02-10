/**
 * Native Credit Repository
 * Implements CreditRepository static interface for React Native
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ModelId } from "../agent/models/models";
import type { CreditPackCheckoutSession } from "../payment/providers/types";
import creditsDefinitions, {
  type CreditsGetResponseOutput,
} from "./definition";
import type { CreditTypeIdentifierValue } from "./enum";
import type {
  CreditIdentifier,
  CreditPool,
  CreditRepositoryType,
  CreditTransactionOutput,
} from "./repository";

/**
 * Native Credit Repository - Static class pattern
 */
export class CreditRepository {
  static async getCreditBalanceForUser(
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditsGetResponseOutput>> {
    const response = await nativeEndpoint(
      creditsDefinitions.GET,
      {},
      logger,
      locale,
    );
    if (response.success) {
      return { success: true, data: response.data, message: response.message };
    }
    return {
      success: false,
      errorType: response.errorType,
      message: response.message,
      messageParams: response.messageParams,
    };
  }

  static async getBalance(
    // oxlint-disable-next-line no-unused-vars
    _identifier: CreditIdentifier,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<CreditsGetResponseOutput>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getBalance is not implemented on native");
  }

  static async deductCredits(
    // oxlint-disable-next-line no-unused-vars
    identifier: CreditIdentifier,
    // oxlint-disable-next-line no-unused-vars
    amount: number,
    // oxlint-disable-next-line no-unused-vars
    modelId: ModelId | null,
    // oxlint-disable-next-line no-unused-vars
    messageId: string,
    // oxlint-disable-next-line no-unused-vars
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("deductCredits is not implemented on native");
  }

  static async addCredits(
    // oxlint-disable-next-line no-unused-vars
    _identifier: CreditIdentifier,
    // oxlint-disable-next-line no-unused-vars
    _amount: number,
    // oxlint-disable-next-line no-unused-vars
    _type: "subscription" | "permanent" | "bonus",
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("addCredits is not implemented on native");
  }

  static async getLeadBalance(
    // oxlint-disable-next-line no-unused-vars
    _leadId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getLeadBalance is not implemented on native");
  }

  static async getOrCreateLeadByIp(
    // oxlint-disable-next-line no-unused-vars
    _ipAddress: string,
    // oxlint-disable-next-line no-unused-vars
    _locale: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<{ leadId: string; credits: number }>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getOrCreateLeadByIp is not implemented on native");
  }

  static async addUserCredits(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _amount: number,
    // oxlint-disable-next-line no-unused-vars
    _type: "subscription" | "permanent" | "free",
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _expiresAt?: Date,
    // oxlint-disable-next-line no-unused-vars
    _sessionId?: string,
  ): Promise<ResponseType<void>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("addUserCredits is not implemented on native");
  }

  static async getTransactions(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _leadId: string,
    // oxlint-disable-next-line no-unused-vars
    _limit: number,
    // oxlint-disable-next-line no-unused-vars
    _offset: number,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getTransactions is not implemented on native");
  }

  static async expireCredits(
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("expireCredits is not implemented on native");
  }

  static async handleCreditPackPurchase(
    // oxlint-disable-next-line no-unused-vars
    _session: CreditPackCheckoutSession,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<void> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("handleCreditPackPurchase is not implemented on native");
  }

  static async getCreditIdentifierBySubscription(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _leadId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      userId?: string;
      leadId?: string;
      creditType: CreditTypeIdentifierValue;
    }>
  > {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(
      "getCreditIdentifierBySubscription is not implemented on native",
    );
  }

  static async deductCreditsForFeature(
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _cost: number,
    // oxlint-disable-next-line no-unused-vars
    _feature: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<{ success: boolean; messageId?: string }> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("deductCreditsForFeature is not implemented on native");
  }

  static async mergePendingLeadWallets(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _leadIds: string[],
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("mergePendingLeadWallets is not implemented on native");
  }

  static async hasSufficientCredits(
    // oxlint-disable-next-line no-unused-vars
    _identifier: CreditIdentifier,
    // oxlint-disable-next-line no-unused-vars
    _required: number,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<boolean> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("hasSufficientCredits is not implemented on native");
  }

  static async deductCreditsWithValidation(
    // oxlint-disable-next-line no-unused-vars
    _identifier: CreditIdentifier,
    // oxlint-disable-next-line no-unused-vars
    _amount: number,
    // oxlint-disable-next-line no-unused-vars
    _modelId: ModelId | null,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("deductCreditsWithValidation is not implemented on native");
  }

  static generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 15)}`;
  }

  static async getUserPool(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<CreditPool>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getUserPool is not implemented on native");
  }

  static async getLeadPoolOnly(
    // oxlint-disable-next-line no-unused-vars
    _leadId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<CreditPool>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getLeadPoolOnly is not implemented on native");
  }

  static async getLeadPool(
    // oxlint-disable-next-line no-unused-vars
    _leadId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<CreditPool>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getLeadPool is not implemented on native");
  }

  static async getTransactionsByLeadId(
    // oxlint-disable-next-line no-unused-vars
    _leadId: string,
    // oxlint-disable-next-line no-unused-vars
    _limit: number,
    // oxlint-disable-next-line no-unused-vars
    _offset: number,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getTransactionsByLeadId is not implemented on native");
  }

  static async getTransactionHistory(
    // oxlint-disable-next-line no-unused-vars
    _data: { paginationInfo: { page: number; limit: number } },
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      paginationInfo: {
        page: number;
        limit: number;
        totalCount: number;
        pageCount: number;
      };
    }>
  > {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getTransactionHistory is not implemented on native");
  }

  static async getTransactionsByUserId(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _limit: number,
    // oxlint-disable-next-line no-unused-vars
    _offset: number,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getTransactionsByUserId is not implemented on native");
  }

  static async addEarnedCredits(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _amountCents: number,
    // oxlint-disable-next-line no-unused-vars
    _sourceUserId: string,
    // oxlint-disable-next-line no-unused-vars
    _transactionId: string,
    // oxlint-disable-next-line no-unused-vars
    _commissionPercent: number,
    // oxlint-disable-next-line no-unused-vars
    _originalAmountCents: number,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _sourceUserEmail?: string,
  ): Promise<ResponseType<{ packId: string; transactionId: string }>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("addEarnedCredits is not implemented on native");
  }

  static async getEarnedCreditsBalance(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<
    ResponseType<{ total: number; available: number; locked: number }>
  > {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getEarnedCreditsBalance is not implemented on native");
  }

  static async deductEarnedCredits(
    // oxlint-disable-next-line no-unused-vars
    userId: string,
    // oxlint-disable-next-line no-unused-vars
    amountCents: number,
    // oxlint-disable-next-line no-unused-vars
    payoutRequestId: string,
    // oxlint-disable-next-line no-unused-vars
    currency: "BTC" | "USDC" | "CREDITS",
    // oxlint-disable-next-line no-unused-vars
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("deductEarnedCredits is not implemented on native");
  }

  static async getReferralTransactions(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _limit: number,
    // oxlint-disable-next-line no-unused-vars
    _offset: number,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("getReferralTransactions is not implemented on native");
  }

  static async deductCreditsForTTS(
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _cost: number,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<{
    success: boolean;
    messageId?: string;
    partialDeduction?: boolean;
  }> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("deductCreditsForTTS is not implemented on native");
  }

  static async deductCreditsForSTT(
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _cost: number,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<{
    success: boolean;
    messageId?: string;
    partialDeduction?: boolean;
  }> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("deductCreditsForSTT is not implemented on native");
  }

  static async deductCreditsForModelUsage(
    // oxlint-disable-next-line no-unused-vars
    _user: JwtPayloadType,
    // oxlint-disable-next-line no-unused-vars
    _cost: number,
    // oxlint-disable-next-line no-unused-vars
    _model: ModelId,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<{
    success: boolean;
    messageId?: string;
    partialDeduction?: boolean;
  }> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("deductCreditsForModelUsage is not implemented on native");
  }
}

// Compile-time type check
const _typeCheck: CreditRepositoryType = CreditRepository;
void _typeCheck;
