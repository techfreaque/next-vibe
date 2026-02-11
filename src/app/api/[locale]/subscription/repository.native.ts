/**
 * Native Subscription Repository
 * Implements SubscriptionRepository static interface for React Native
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { WebhookData } from "@/app/api/[locale]/payment/providers/types";
import { nativeEndpoint } from "@/app/api/[locale]/system/unified-interface/react-native/native-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { type CountryLanguage } from "@/i18n/core/config";

import type { SubscriptionCancelDeleteRequestOutput } from "./cancel/definition";
import type {
  SubscriptionCreatePostRequestOutput,
  SubscriptionCreatePostResponseOutput,
} from "./create/definition";
import type { SubscriptionGetResponseOutput } from "./definition";
import subscriptionEndpoints from "./definition";
import type { SubscriptionRepositoryType } from "./repository";
import type {
  SubscriptionUpdatePutRequestOutput,
  SubscriptionUpdatePutResponseOutput,
} from "./update/definition";

/**
 * Native Subscription Repository - Static class pattern
 */
export class SubscriptionRepository {
  static async getSubscription(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionGetResponseOutput>> {
    const response = await nativeEndpoint(
      subscriptionEndpoints.GET,
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

    return {
      success: false,
      errorType: response.errorType,
      message: response.message,
      messageParams: response.messageParams,
    };
  }

  static async createSubscription(
    // oxlint-disable-next-line no-unused-vars
    _data: SubscriptionCreatePostRequestOutput,
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionCreatePostResponseOutput>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("createSubscription is not implemented on native");
  }

  static async updateSubscription(
    // oxlint-disable-next-line no-unused-vars
    _data: SubscriptionUpdatePutRequestOutput,
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<SubscriptionUpdatePutResponseOutput>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("updateSubscription is not implemented on native");
  }

  static async cancelSubscription(
    // oxlint-disable-next-line no-unused-vars
    _data: SubscriptionCancelDeleteRequestOutput,
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
    // oxlint-disable-next-line no-unused-vars
    _locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean; message: string }>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("cancelSubscription is not implemented on native");
  }

  static async handleSubscriptionCheckout(): Promise<void> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("handleSubscriptionCheckout is not implemented on native");
  }

  static async handleInvoicePaymentSucceeded(): Promise<void> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(
      "handleInvoicePaymentSucceeded is not implemented on native",
    );
  }

  static async handleSubscriptionCanceled(): Promise<void> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("handleSubscriptionCanceled is not implemented on native");
  }

  static async handleSubscriptionUpdated(): Promise<void> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("handleSubscriptionUpdated is not implemented on native");
  }

  static async syncSubscriptionWithStripe(
    // oxlint-disable-next-line no-unused-vars
    _userId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<{ message: string; changes: string[] }>> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("syncSubscriptionWithStripe is not implemented on native");
  }

  static async handleInvoicePaymentFailed(
    // oxlint-disable-next-line no-unused-vars
    _invoice: WebhookData,
    // oxlint-disable-next-line no-unused-vars
    _subscriptionId: string,
    // oxlint-disable-next-line no-unused-vars
    _logger: EndpointLogger,
  ): Promise<void> {
    // oxlint-disable-next-line restricted-syntax
    throw new Error("handleInvoicePaymentFailed is not implemented on native");
  }
}

// Compile-time type check
const _typeCheck: SubscriptionRepositoryType = SubscriptionRepository;
void _typeCheck;
