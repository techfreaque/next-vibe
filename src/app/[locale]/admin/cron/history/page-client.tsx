"use client";

import type { JSX } from "react";
import { useMemo } from "react";

import cronHistoryDefinition from "@/app/api/[locale]/system/unified-interface/tasks/cron/history/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function CronHistoryPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  const endpointOptions = useMemo(() => {
    return {
      read: {
        formOptions: {
          autoSubmit: true,
          debounceMs: 300,
          persistForm: true,
        },
      },
    };
  }, []);
  return (
    <EndpointsPage
      endpoint={cronHistoryDefinition}
      locale={locale}
      user={user}
      endpointOptions={endpointOptions}
    />
  );
}
