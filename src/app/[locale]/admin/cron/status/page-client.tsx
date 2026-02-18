"use client";

import type { JSX } from "react";

import cronStatusDefinition from "@/app/api/[locale]/system/unified-interface/tasks/cron/status/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function CronStatusPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={cronStatusDefinition}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          initialState: { detailed: true },
        },
      }}
    />
  );
}
