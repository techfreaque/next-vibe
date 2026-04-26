"use client";

import type { JSX } from "react";
import { useMemo } from "react";

import sessionsDefinition from "@/app/api/[locale]/agent/support/sessions/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function AdminSupportPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  const endpointOptions = useMemo(
    () => ({
      read: {
        formOptions: {
          autoSubmit: true,
        },
      },
    }),
    [],
  );

  return (
    <EndpointsPage
      endpoint={sessionsDefinition}
      locale={locale}
      user={user}
      endpointOptions={endpointOptions}
    />
  );
}
