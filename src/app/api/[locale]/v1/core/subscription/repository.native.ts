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
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { nativeEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import { GET as getSubscriptionEndpoint } from "./definition";
// Import the interface for type compatibility
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
    return createErrorResponse(
      "app.api.v1.core.subscription.errors.not_implemented_on_native",
      ErrorResponseTypes.INTERNAL_ERROR,
      { method },
    );
  }

  async getSubscription(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionGetResponseOutput>> {
    // Use typesafe nativeEndpoint() with endpoint definition
    // This provides full type inference from the endpoint's schema
    const response = await nativeEndpoint(
      getSubscriptionEndpoint,
      {},
      logger,
      "en-GLOBAL", // Locale not strictly needed for subscription data
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
    logger.error(
      "createSubscription not implemented on native - use checkout flow",
    );
    void data;
    void userId;
    void locale;
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
    logger.error("updateSubscription not implemented on native");
    void data;
    void userId;
    void locale;
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
    logger.error("cancelSubscription not implemented on native");
    void data;
    void userId;
    void locale;
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
