"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { useRouter, useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import { Alert, AlertDescription, AlertTitle } from "next-vibe/ui/ui/alert";
import { Container } from "next-vibe/ui/ui/container";
import { CheckCircle } from "next-vibe/ui/ui/icons/CheckCircle";
import { XCircle } from "next-vibe/ui/ui/icons/XCircle";
import type { UseNavigationStackReturn } from "next-vibe/unified-ui/hooks/use-navigation-stack";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { useMemo } from "react";

import type { CreditsGetResponseOutput } from "@/credits/definition";
import creditsDefinition from "@/credits/definition";

import { scopedTranslation } from "../i18n";

interface Props {
  locale: CountryLanguage;
  user: JwtPayloadType;
  initialCredits: CreditsGetResponseOutput | null;
  platform: Platform;
}

const PATH_TO_TAB: Record<string, string> = {
  "subscription/create": "buy",
  "credits/history": "history",
  "remote-connection/list": "remote",
};

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
      </AlertDescription>
    </Alert>
  );
}

export function OverviewPageClient({
  locale,
  user,
  initialCredits,
  platform,
}: Props): JSX.Element {
  const router = useRouter();

  const navigationOverride = useMemo(
    () => ({
      push: <TEndpoint extends CreateApiEndpointAny>(
        endpoint: TEndpoint,
        options?: Parameters<UseNavigationStackReturn["push"]>[1],
        nativePush?: UseNavigationStackReturn["push"],
      ): void => {
        const tab = PATH_TO_TAB[endpoint.path.slice(0, 2).join("/")];
        if (tab) {
          router.push(`/${locale}/subscription/${tab}`);
        } else if (nativePush) {
          nativePush(endpoint, options);
        }
      },
      canGoBack: false,
    }),
    [locale, router],
  );

  return (
    <Container className="py-8">
      <PaymentResultBanner locale={locale} />
      <EndpointsPage
        endpoint={creditsDefinition}
        user={user}
        locale={locale}
        platform={platform}
        endpointOptions={{
          read: {
            initialData: initialCredits ?? undefined,
            queryOptions: { staleTime: 0, refetchOnWindowFocus: true },
          },
        }}
        navigationOverride={navigationOverride}
      />
    </Container>
  );
}
