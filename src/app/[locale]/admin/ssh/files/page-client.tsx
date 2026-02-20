"use client";

import type { JSX } from "react";

import filesListDefinition from "@/app/api/[locale]/ssh/files/list/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function SshFilesPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={filesListDefinition}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          queryOptions: { enabled: true, staleTime: 5 * 1000 },
        },
      }}
    />
  );
}
