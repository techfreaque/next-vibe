"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import { Container } from "next-vibe/ui/ui/container";
import type { UseNavigationStackReturn } from "next-vibe/unified-ui/hooks/use-navigation-stack";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { useMemo } from "react";

import subscriptionCreateDefinition from "@/subscription/create/definition";

interface Props {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

const PATH_TO_TAB: Record<string, string> = {
  "credits/history": "history",
  "remote-connection/list": "remote",
};

export function BuyPageClient({ locale, user }: Props): JSX.Element {
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
      pop: (): void => {
        router.push(`/${locale}/subscription/overview`);
      },
      canGoBack: false,
    }),
    [locale, router],
  );

  return (
    <Container className="py-8">
      <EndpointsPage
        endpoint={subscriptionCreateDefinition}
        user={user}
        locale={locale}
        navigationOverride={navigationOverride}
      />
    </Container>
  );
}
