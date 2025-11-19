/**
 * Native Credit Repository
 * Implements CreditRepositoryInterface for React Native
 *
 * POLYFILL PATTERN: This file makes the same repository interface work on native
 * by calling HTTP endpoints instead of direct database access using typesafe endpoint definitions.
 *
 * IMPLEMENTATION STRATEGY:
 * - getCreditBalanceForUser(): Fully implemented with nativeEndpoint()
 * - Other methods: Return "not implemented" errors (can be added when needed)
 *
 * Server code can call creditRepository.getCreditBalanceForUser() and it will:
 * - On Web/Server: Query the database directly
 * - On React Native: Make HTTP call via nativeEndpoint() with full type safety
 *
 * This allows the SAME code to work on both platforms!
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { nativeEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";

import { GET as getCreditsEndpoint } from "./definition";
import type {
  CreditRepositoryInterface,
  CreditTransactionOutput,
  CreditBalance,
  CreditIdentifier,
} from "./repository";
import type { CreditTypeIdentifierValue } from "./enum";
import type { CreditPackCheckoutSession } from "../payment/providers/types";

/**
 * Native Credit Repository Implementation
 * Uses HTTP client to call API endpoints, providing the same interface as server
 */
class CreditRepositoryNativeImpl implements CreditRepositoryInterface {
  private createNotImplementedError<T>(method: string): ResponseType<T> {
    return fail({
      message: "app.api.v1.core.credits.errors.not_implemented_on_native",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { method },
    });
  }

  async getCreditBalanceForUser(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    // Use typesafe nativeEndpoint() with endpoint definition
    // This provides full type inference from the endpoint's schema
    const response = await nativeEndpoint(
      getCreditsEndpoint,
      {},
      logger,
      "en-GLOBAL", // Locale not strictly needed for credit data
    );

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    }

    // Error response - preserve all error information
    return {
      success: false,
      errorType: response.errorType,
      message: response.message,
      messageParams: response.messageParams,
    };
  }

  async getBalance(
    identifier: CreditIdentifier,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>> {
    logger.error("getBalance not implemented on native");
    void identifier;
    return await Promise.resolve(
      this.createNotImplementedError<CreditBalance>("getBalance"),
    );
  }

  async deductCredits(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    messageId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    logger.error("deductCredits not implemented on native");
    void identifier;
    void amount;
    void modelId;
    void messageId;
    return await Promise.resolve(
      this.createNotImplementedError<void>("deductCredits"),
    );
  }

  async addCredits(
    identifier: CreditIdentifier,
    amount: number,
    type: "subscription" | "permanent" | "bonus",
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    logger.error("addCredits not implemented on native");
    void identifier;
    void amount;
    void type;
    return await Promise.resolve(
      this.createNotImplementedError<void>("addCredits"),
    );
  }

  async getLeadBalance(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    logger.error("getLeadBalance not implemented on native");
    void leadId;
    return await Promise.resolve(
      this.createNotImplementedError<number>("getLeadBalance"),
    );
  }

  async getOrCreateLeadByIp(
    ipAddress: string,
    locale: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ leadId: string; credits: number }>> {
    logger.error("getOrCreateLeadByIp not implemented on native");
    void ipAddress;
    void locale;
    return await Promise.resolve(
      this.createNotImplementedError<{ leadId: string; credits: number }>(
        "getOrCreateLeadByIp",
      ),
    );
  }

  async addUserCredits(
    userId: string,
    amount: number,
    type: "subscription" | "permanent" | "free",
    logger: EndpointLogger,
    expiresAt?: Date,
    sessionId?: string,
  ): Promise<ResponseType<void>> {
    logger.error("addUserCredits not implemented on native");
    void userId;
    void amount;
    void type;
    void expiresAt;
    void sessionId;
    return await Promise.resolve(
      this.createNotImplementedError<void>("addUserCredits"),
    );
  }

  async getTransactions(
    userId: string,
    limit: number,
    offset: number,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      transactions: CreditTransactionOutput[];
      totalCount: number;
    }>
  > {
    logger?.error("getTransactions not implemented on native");
    void userId;
    void limit;
    void offset;
    return await Promise.resolve(
      this.createNotImplementedError<{
        transactions: CreditTransactionOutput[];
        totalCount: number;
      }>("getTransactions"),
    );
  }

  async expireCredits(): Promise<ResponseType<number>> {
    return await Promise.resolve(
      this.createNotImplementedError<number>("expireCredits"),
    );
  }

  async handleCreditPackPurchase(
    session: CreditPackCheckoutSession,
    logger: EndpointLogger,
  ): Promise<void> {
    logger.error("handleCreditPackPurchase not implemented on native");
    void session;
  }

  async getCreditIdentifierBySubscription(
    userId: string,
    leadId: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      userId?: string;
      leadId?: string;
      creditType: CreditTypeIdentifierValue;
    }>
  > {
    logger.error("getCreditIdentifierBySubscription not implemented on native");
    void userId;
    void leadId;
    return await Promise.resolve(
      this.createNotImplementedError<{
        userId?: string;
        leadId?: string;
        creditType: CreditTypeIdentifierValue;
      }>("getCreditIdentifierBySubscription"),
    );
  }

  async deductCreditsForFeature(
    user: { id?: string; leadId?: string; isPublic: boolean },
    cost: number,
    feature: string,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; messageId?: string }> {
    logger.error("deductCreditsForFeature not implemented on native");
    void user;
    void cost;
    void feature;
    return { success: false };
  }

  async mergePendingLeadWallets(
    userId: string,
    leadIds: string[],
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    logger.error("mergePendingLeadWallets not implemented on native");
    void userId;
    void leadIds;
    return await Promise.resolve(
      this.createNotImplementedError<void>("mergePendingLeadWallets"),
    );
  }

  async cleanupOrphanedLeadWallets(
    logger: EndpointLogger,
  ): Promise<ResponseType<number>> {
    logger.error("cleanupOrphanedLeadWallets not implemented on native");
    return await Promise.resolve(
      this.createNotImplementedError<number>("cleanupOrphanedLeadWallets"),
    );
  }

  async hasSufficientCredits(
    identifier: CreditIdentifier,
    required: number,
    logger: EndpointLogger,
  ): Promise<boolean> {
    logger.error("hasSufficientCredits not implemented on native");
    void identifier;
    void required;
    return false;
  }

  async deductCreditsWithValidation(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    logger.error("deductCreditsWithValidation not implemented on native");
    void identifier;
    void amount;
    void modelId;
    return { success: false, error: "Not implemented on native" };
  }

  generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}

/**
 * Singleton instance
 * Export with same name as server implementation for drop-in replacement
 */
export const creditRepository = new CreditRepositoryNativeImpl();
