"use client";

import type { JSX } from "react";

import linuxUsersListDefinition from "@/app/api/[locale]/ssh/linux/users/list/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function SshUsersPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={linuxUsersListDefinition}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          queryOptions: { enabled: true, staleTime: 30 * 1000 },
        },
      }}
    />
  );
}
