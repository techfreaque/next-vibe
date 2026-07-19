import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { notFound } from "next-vibe/ui/lib/not-found";
import { redirect } from "next-vibe/ui/lib/redirect";

import type { CreditsGetResponseOutput } from "@/credits/definition";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";

export interface SubscriptionPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  initialCredits: CreditsGetResponseOutput | null;
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
  const { t: creditsT } = creditsScopedTranslation.scopedT(locale);

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

  if (coreEnv.NEXT_PUBLIC_LOCAL_MODE && !isAuthenticated) {
    redirect(`/${locale}/user/login`);
  }

  // Handle NOWPayments success redirect.
  const getParam = (key: string): string | undefined =>
    typeof searchParams[key] === "string"
      ? (searchParams[key] as string)
      : undefined;

  const paymentType = getParam("type");
  const paymentStatus = getParam("payment");
  const callbackToken = getParam("cbtoken");

  if (isAuthenticated && paymentStatus === "success" && callbackToken) {
    if (paymentType === "credits") {
      await CreditRepository.handleNowPaymentsCreditSuccessRedirect(
        callbackToken,
        user.id,
        locale,
        logger,
      );
    } else {
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

  let initialCredits: CreditsGetResponseOutput | null = null;
  if (isAuthenticated) {
    const creditsResponse = await CreditRepository.getBalance(
      user,
      logger,
      creditsT,
      locale,
    );
    initialCredits = creditsResponse.success ? creditsResponse.data : null;
  }

  return { locale, user, initialCredits };
}
