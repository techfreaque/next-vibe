import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { notFound } from "next-vibe/ui/lib/not-found";

import { CreditRepository } from "@/credits/repository";

export interface SubscriptionPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
}

interface LoaderInput {
  locale: CountryLanguage;
  requireAuth?: boolean;
  searchParams: Record<string, string | string[] | undefined>;
}

export async function subscriptionLoader({
  locale,
  requireAuth,
  searchParams,
}: LoaderInput): Promise<SubscriptionPageData> {
  const logger = createEndpointLogger(false, locale);

  const userResponse = await UserRepository.getUserByAuth(
    {
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,
    },
    locale,
    logger,
  );
  if (!userResponse.success) {
    notFound();
  }
  const user = userResponse.data;
  const isAuthenticated = user && !user.isPublic && user.id;

  if (requireAuth && !isAuthenticated) {
    notFound();
  }

  // Handle NOWPayments success redirect.
  const getParam = (key: string): string | undefined =>
    typeof searchParams[key] === "string"
      ? (searchParams[key] as string)
      : undefined;

  const paymentType = getParam("type");
  const paymentStatus = getParam("payment");
  const callbackToken = getParam("cbtoken");
  // Stripe fills its Checkout Session placeholder. NOWPayments removes it
  // from its success URL. Stripe subscriptions are reconciled by webhooks.
  const isStripeSubscriptionRedirect =
    paymentType === "subscription" &&
    /^cs_(?:live|test)_[a-zA-Z0-9]+$/.test(getParam("session_id") ?? "");

  if (isAuthenticated && paymentStatus === "success" && callbackToken) {
    if (paymentType === "credits") {
      await CreditRepository.handleNowPaymentsCreditSuccessRedirect(
        callbackToken,
        user.id,
        locale,
        logger,
      );
    } else if (!isStripeSubscriptionRedirect) {
      const { SubscriptionRepository } =
        await import("@/subscription/repository");
      await SubscriptionRepository.handleNowPaymentsSuccessRedirect(
        callbackToken,
        user.id,
        locale,
        logger,
      );
    }
  }

  return { locale, user, platform: Platform.NEXT_PAGE };
}
