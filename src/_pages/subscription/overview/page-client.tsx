"use client";

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
import { H1 } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useRouter, useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import type { JSX } from "react";
import { useEffect } from "react";

import { CreditsTabHeaderContent } from "@/credits/credits-tab-header";
import type { CreditsGetResponseOutput } from "@/credits/definition";
import { CreditsOverview } from "@/credits/widget";

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

  const paymentStatus = searchParams.get("payment");
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
            onTabChange={(tab) => router.push(`/${locale}/subscription/${tab}`)}
          />
        }
      />
    </Container>
  );
}
