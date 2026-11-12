"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Container } from "next-vibe/ui/components/container";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import type { UseNavigationStackReturn } from "next-vibe/unified-ui/hooks/use-navigation-stack";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { useMemo } from "react";

import subscriptionCreateDefinition from "@/subscription/create/definition";

interface Props {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
}

const PATH_TO_TAB: Record<string, string> = {
  "credits/history": "history",
  "remote-connection/list": "remote",
};

export function BuyPageClient({ locale, user, platform }: Props): JSX.Element {
  const logger = useLogger();
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
    <Container className="max-w-6xl px-0 py-4 sm:px-2 sm:py-8 lg:px-2">
      <EndpointsPage
        logger={logger}
        endpoint={subscriptionCreateDefinition}
        user={user}
        locale={locale}
        platform={platform}
        navigationOverride={navigationOverride}
      />
    </Container>
  );
}
