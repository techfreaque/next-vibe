import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { notFound } from "next-vibe/ui/web/lib/not-found";
import { redirect } from "next-vibe/ui/web/lib/redirect";

import type { CreditsGetResponseOutput } from "@/app/api/[locale]/credits/definition";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { env } from "@/config/env";

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

  if (env.NEXT_PUBLIC_LOCAL_MODE && !isAuthenticated) {
    redirect(`/${locale}/user/login`);
  }

  // Handle NOWPayments success redirect
  const npId =
    typeof searchParams.NP_id === "string" ? searchParams.NP_id : undefined;
  const paymentType =
    typeof searchParams.type === "string" ? searchParams.type : undefined;
  const callbackToken =
    typeof searchParams.token === "string" ? searchParams.token : undefined;

  if (npId && isAuthenticated && searchParams.payment === "success") {
    if (paymentType === "credits" || callbackToken) {
      await CreditRepository.handleNowPaymentsCreditSuccessRedirect(
        npId,
        callbackToken,
        user.id,
        locale,
        logger,
      );
    } else {
      const { SubscriptionRepository } =
        await import("@/app/api/[locale]/subscription/repository");
      await SubscriptionRepository.handleNowPaymentsSuccessRedirect(
        npId,
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
