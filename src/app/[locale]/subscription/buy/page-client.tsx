"use client";

import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { Container } from "next-vibe-ui/ui/container";
import type { JSX } from "react";
import { useMemo } from "react";

import subscriptionCreateDefinition from "@/app/api/[locale]/subscription/create/definition";
import type { UseNavigationStackReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

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
