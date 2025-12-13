/**
 * Native Subscription Repository
 * Implements SubscriptionRepository interface for React Native
 *
 * POLYFILL PATTERN: This file makes the same repository interface work on native
 * by calling HTTP endpoints instead of direct database access using typesafe endpoint definitions.
 *
 * IMPLEMENTATION STRATEGY:
 * - getSubscription(): Fully implemented with nativeEndpoint()
 * - Other methods: Return "not implemented" errors (can be added when needed)
 *
 * Server code can call subscriptionRepository.getSubscription() and it will:
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

import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { type CountryLanguage } from "@/i18n/core/config";

import { GET as getSubscriptionEndpoint } from "./definition";
import type { SubscriptionRepository } from "./repository";
import type {
  SubscriptionDeleteRequestOutput,
  SubscriptionGetResponseOutput,
  SubscriptionPostRequestOutput,
  SubscriptionPostResponseOutput,
  SubscriptionPutRequestOutput,
  SubscriptionPutResponseOutput,
} from "./definition";

/**
 * Native Subscription Repository Implementation
 * Uses HTTP client to call API endpoints, providing the same interface as server
 */
class SubscriptionRepositoryNativeImpl implements SubscriptionRepository {
  private createNotImplementedError<T>(method: string): ResponseType<T> {
    return fail({
      message: "app.api.subscription.errors.not_implemented_on_native",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { method },
    });
  }

  async getSubscription(
    userId: string, // Parameter exists for interface consistency with server implementation
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionGetResponseOutput>> {
    logger.debug("getSubscription called on native", { userId });
    // Use typesafe nativeEndpoint() with endpoint definition
    // This provides full type inference from the endpoint's schema
    // Note: userId is implicit from authentication context in nativeEndpoint
    const response = await nativeEndpoint(
      getSubscriptionEndpoint,
      {},
      logger,
      locale,
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

  async createSubscription(
    data: SubscriptionPostRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPostResponseOutput>> {
    // Parameters exist for interface consistency with server implementation
    logger.error(
      "createSubscription not implemented on native - use checkout flow",
      { userId, locale, dataKeys: Object.keys(data || {}) },
    );
    return await Promise.resolve(
      this.createNotImplementedError<SubscriptionPostResponseOutput>(
        "createSubscription",
      ),
    );
  }

  async updateSubscription(
    data: SubscriptionPutRequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionPutResponseOutput>> {
    // Parameters exist for interface consistency with server implementation
    logger.error("updateSubscription not implemented on native", {
      userId,
      locale,
      dataKeys: Object.keys(data || {}),
    });
    return await Promise.resolve(
      this.createNotImplementedError<SubscriptionPutResponseOutput>(
        "updateSubscription",
      ),
    );
  }

  async cancelSubscription(
    data: SubscriptionDeleteRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean; message: string }>> {
    // Parameters exist for interface consistency with server implementation
    logger.error("cancelSubscription not implemented on native", {
      userId,
      locale,
      dataKeys: Object.keys(data || {}),
    });
    return await Promise.resolve(
      this.createNotImplementedError<{ success: boolean; message: string }>(
        "cancelSubscription",
      ),
    );
  }
}

/**
 * Singleton instance
 * Export with same name as server implementation for drop-in replacement
 */
export const subscriptionRepository = new SubscriptionRepositoryNativeImpl();
