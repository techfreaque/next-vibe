"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { UseNavigationStackReturn } from "next-vibe/platforms/react/hooks/use-navigation-stack";
import { useRouter } from "next-vibe/ui/web/hooks/use-navigation";
import { Container } from "next-vibe/ui/web/ui/container";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import type { JSX } from "react";
import { useMemo } from "react";

import remoteConnectionListDefinition from "@/app/api/[locale]/remote-connection/list/definition";

interface Props {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

const PATH_TO_TAB: Record<string, string> = {
  "subscription/create": "buy",
  "credits/history": "history",
};

export function RemotePageClient({ locale, user }: Props): JSX.Element {
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
        endpoint={remoteConnectionListDefinition}
        user={user}
        locale={locale}
        navigationOverride={navigationOverride}
      />
    </Container>
  );
}
