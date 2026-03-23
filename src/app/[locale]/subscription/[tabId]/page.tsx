/**
 * Subscription Page - Dynamic Tab Route
 * Handles /subscription/overview, /subscription/buy, /subscription/history
 */

import { redirect } from "next-vibe-ui/lib/redirect";
import { notFound } from "next/navigation";
import type { JSX } from "react";

import type { CreditsGetResponseOutput } from "@/app/api/[locale]/credits/definition";
import type { CreditsHistoryGetResponseOutput } from "@/app/api/[locale]/credits/history/definition";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import { SubscriptionRepository } from "@/app/api/[locale]/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import {
  UserPermissionRole,
  UserRole,
} from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { SubscriptionPageClient } from "./page-client";

interface SubscriptionPageProps {
  params: Promise<{
    locale: CountryLanguage;
    tabId: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface SubscriptionTabPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  isAuthenticated: boolean;
  activeTab: string;
  initialSubscription: SubscriptionGetResponseOutput | null;
  initialCredits: CreditsGetResponseOutput | null;
  initialHistory: CreditsHistoryGetResponseOutput | null;
  hasPaymentProvider: boolean;
  isAdmin: boolean;
}

const BASE_TABS = ["overview", "buy", "history"];

export async function tanstackLoader({
  params,
  searchParams,
}: SubscriptionPageProps): Promise<SubscriptionTabPageData> {
  const { locale, tabId } = await params;
  const query = await searchParams;

  const logger = createEndpointLogger(false, Date.now(), locale);
  const { t: creditsT } = creditsScopedTranslation.scopedT(locale);

  // Get user
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

  const isAdmin =
    !!isAuthenticated && user.roles.includes(UserPermissionRole.ADMIN);
  // "remote" tab available to all authenticated users
  const validTabs = isAuthenticated ? [...BASE_TABS, "remote"] : BASE_TABS;
  if (!validTabs.includes(tabId)) {
    notFound();
  }

  if (env.NEXT_PUBLIC_LOCAL_MODE && !isAuthenticated) {
    redirect(`/${locale}/user/login`);
  }

  // Handle NOWPayments success redirect - NP_id is the payment_id appended by NOWPayments
  const npId = typeof query.NP_id === "string" ? query.NP_id : undefined;
  const paymentType = typeof query.type === "string" ? query.type : undefined;
  const callbackToken =
    typeof query.token === "string" ? query.token : undefined;

  if (npId && isAuthenticated && query.payment === "success") {
    if (paymentType === "credits" || callbackToken) {
      // Credit pack purchase via NOWPayments
      await CreditRepository.handleNowPaymentsCreditSuccessRedirect(
        npId,
        callbackToken,
        user.id,
        locale,
        logger,
      );
    } else {
      // Subscription purchase via NOWPayments
      await SubscriptionRepository.handleNowPaymentsSuccessRedirect(
        npId,
        user.id,
        locale,
        logger,
      );
    }
  }

  // Fetch subscription data
  let initialSubscription: SubscriptionGetResponseOutput | null = null;
  if (isAuthenticated) {
    const subscriptionResponse = await SubscriptionRepository.getSubscription(
      user.id,
      logger,
      locale,
    );
    initialSubscription = subscriptionResponse.success
      ? subscriptionResponse.data
      : null;
  }

  // Fetch credits data
  let initialCredits: CreditsGetResponseOutput | null = null;
  if (isAuthenticated) {
    const creditsResponse = await CreditRepository.getBalance(
      { userId: user.id },
      logger,
      creditsT,
      locale,
    );
    initialCredits = creditsResponse.success ? creditsResponse.data : null;
  }

  // Fetch history data if on history tab
  let initialHistory: CreditsHistoryGetResponseOutput | null = null;
  if (isAuthenticated && tabId === "history") {
    const historyResponse = await CreditRepository.getTransactionHistory(
      { paginationInfo: { page: 1, limit: 50 } },
      user,
      logger,
      creditsT,
      locale,
    );
    initialHistory = historyResponse.success ? historyResponse.data : null;
  }

  const hasPaymentProvider = !!(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.NOWPAYMENTS_API_KEY
  );

  return {
    locale,
    user,
    isAuthenticated: !!isAuthenticated,
    activeTab: tabId,
    initialSubscription,
    initialCredits,
    initialHistory,
    hasPaymentProvider,
    isAdmin,
  };
}

export function TanstackPage({
  locale,
  user,
  isAuthenticated,
  activeTab,
  initialSubscription,
  initialCredits,
  initialHistory,
  hasPaymentProvider,
  isAdmin,
}: SubscriptionTabPageData): JSX.Element {
  return (
    <SubscriptionPageClient
      locale={locale}
      user={user}
      isAuthenticated={isAuthenticated}
      activeTab={activeTab}
      initialSubscription={initialSubscription}
      initialCredits={initialCredits}
      initialHistory={initialHistory}
      hasPaymentProvider={hasPaymentProvider}
      isAdmin={isAdmin}
    />
  );
}

export default async function SubscriptionPage({
  params,
  searchParams,
}: SubscriptionPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
