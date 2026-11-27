"use client";

import { platform } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "next-vibe/ui/components/alert";
import { Container } from "next-vibe/ui/components/container";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1 } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useRouter, useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import type { JSX } from "react";
import { useEffect } from "react";

import {
  pricingGuestVariant,
  useGrowthExposure,
} from "@/_pages/_components/use-growth-experiment";
import { CreditsTabHeaderContent } from "@/credits/credits-tab-header";
import type { CreditsGetResponseOutput } from "@/credits/definition";
import { CreditsOverview } from "@/credits/widget";
import { FREE_CREDIT_SIGNED_IN_TOTAL } from "@/products/constants";
import { scopedTranslation as subscriptionScopedTranslation } from "@/subscription/i18n";

import { scopedTranslation } from "../i18n";

interface Props {
  locale: CountryLanguage;
  user: JwtPayloadType;
  initialCredits: CreditsGetResponseOutput | null;
}

function PaymentResultBanner({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element | null {
  const searchParams = useSearchParams();
  const { t } = scopedTranslation.scopedT(locale);
  const { t: subscriptionT } = subscriptionScopedTranslation.scopedT(locale);

  // Whop appends its own `payment` (pay_ id) and `status` to the return
  // URL; a failed or canceled Whop checkout must not show "success".
  const whopStatus = searchParams.get("status");
  const paymentStatus =
    whopStatus === "failed" || whopStatus === "canceled"
      ? "canceled"
      : searchParams.get("payment");
  const paymentType =
    searchParams.get("type") === "credits" ? "credits" : "subscription";
  const logger = useLogger();

  // A canceled checkout is a user-visible dead end in the purchase funnel -
  // report it so abandoned/failed checkouts show up in the error log.
  useEffect(() => {
    if (paymentStatus === "canceled") {
      logger.warn("Checkout returned canceled", {
        component: "PaymentResultBanner",
        operation: "checkoutReturn",
        paymentStatus,
        paymentType,
      });
    }
  }, [logger, paymentStatus, paymentType]);

  if (paymentStatus !== "success" && paymentStatus !== "canceled") {
    return null;
  }

  const isSuccess = paymentStatus === "success";
  return (
    <Alert
      variant={isSuccess ? "success" : "warning"}
      icon={isSuccess ? CheckCircle : XCircle}
      className="mx-4 mb-2"
    >
      <AlertTitle>
        {t(`subscription.payment.${paymentStatus}.title`)}
      </AlertTitle>
      <AlertDescription>
        {t(`subscription.payment.${paymentStatus}.${paymentType}`)}
        {!isSuccess && (
          <Span className="mt-2 block">
            {subscriptionT("checkoutTip.body")}{" "}
            {subscriptionT("checkoutTip.other")}
          </Span>
        )}
        {!isSuccess && (
          <Link
            href={`/${locale}/subscription/buy`}
            className="mt-2 block w-fit font-medium underline"
          >
            {t(
              paymentType === "credits"
                ? "subscription.tabs.buy"
                : "subscription.tabs.plans",
            )}
          </Link>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function OverviewPageClient({
  locale,
  user,
  initialCredits,
}: Props): JSX.Element {
  const logger = useLogger();
  const router = useRouter();
  const { t } = scopedTranslation.scopedT(locale);
  const variant = platform.isReactNative ? null : pricingGuestVariant(user);
  useGrowthExposure({
    experiment: "pricing-guest-signup-v1",
    locale,
    variant,
    user: user.isPublic ? user : undefined,
  });

  return (
    <Container className="max-w-6xl px-0 py-4 sm:px-2 sm:py-8 lg:px-2">
      <H1 className="mx-4 mb-4 text-2xl font-semibold">{t("meta.category")}</H1>
      <PaymentResultBanner locale={locale} />
      <CreditsOverview
        user={user}
        locale={locale}
        header={
          <CreditsTabHeaderContent
            activeTab="overview"
            initialBalance={initialCredits ?? undefined}
            user={user}
            locale={locale}
            logger={logger}
            guestSignupCopy={
              variant === "treatment"
                ? {
                    description: t(
                      "subscription.overview.guestOffer.description",
                      {
                        count: FREE_CREDIT_SIGNED_IN_TOTAL,
                      },
                    ),
                    action: t("subscription.overview.guestOffer.action"),
                  }
                : undefined
            }
            onTabChange={(tab) => router.push(`/${locale}/subscription/${tab}`)}
          />
        }
      />
    </Container>
  );
}
