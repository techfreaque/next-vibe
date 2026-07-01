"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { UseNavigationStackReturn } from "next-vibe/platforms/react/hooks/use-navigation-stack";
import { EndpointsPage } from "next-vibe/ui/renderers/react/EndpointsPage";
import { useRouter } from "next-vibe/ui/web/hooks/use-navigation";
import { Container } from "next-vibe/ui/web/ui/container";
import type { JSX } from "react";
import { useMemo } from "react";

import type { CreditsGetResponseOutput } from "@/app/api/[locale]/credits/definition";
import creditsDefinition from "@/app/api/[locale]/credits/definition";

interface Props {
  locale: CountryLanguage;
  user: JwtPayloadType;
  initialCredits: CreditsGetResponseOutput | null;
}

const PATH_TO_TAB: Record<string, string> = {
  "subscription/create": "buy",
  "credits/history": "history",
  "remote-connection/list": "remote",
};

export function OverviewPageClient({
  locale,
  user,
  initialCredits,
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
        endpoint={creditsDefinition}
        user={user}
        locale={locale}
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
