"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import remoteConnectionListDefinition from "next-vibe/remote-connection/list/definition";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import { Container } from "next-vibe/ui/ui/container";
import type { UseNavigationStackReturn } from "next-vibe/unified-ui/hooks/use-navigation-stack";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { useMemo } from "react";

interface Props {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
}

const PATH_TO_TAB: Record<string, string> = {
  "subscription/create": "buy",
  "credits/history": "history",
};

export function RemotePageClient({
  locale,
  user,
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
      <EndpointsPage
        endpoint={remoteConnectionListDefinition}
        user={user}
        locale={locale}
        platform={platform}
        navigationOverride={navigationOverride}
      />
    </Container>
  );
}
