"use client";

import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import remoteConnectionsListDefinition from "@/app/api/[locale]/user/remote-connection/list/definition";
import type { CountryLanguage } from "@/i18n/core/config";

export function RemoteConnectionsPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={remoteConnectionsListDefinition}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          queryOptions: { enabled: true, staleTime: 15 * 1000 },
        },
      }}
    />
  );
}
