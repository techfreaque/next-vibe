"use client";

import type { JSX } from "react";

import cronTaskDefinition from "@/app/api/[locale]/system/unified-interface/tasks/cron/task/[id]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function CronTaskEditPageClient({
  locale,
  user,
  id,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  id: string;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={cronTaskDefinition}
      locale={locale}
      user={user}
      forceMethod="PUT"
      endpointOptions={{
        create: {
          urlPathParams: { id },
        },
        read: {
          urlPathParams: { id },
          queryOptions: {
            enabled: true,
            staleTime: 30 * 1000,
          },
        },
      }}
    />
  );
}
