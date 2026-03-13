"use client";

import type { JSX } from "react";

import cronQueueDefinition from "@/app/api/[locale]/system/unified-interface/tasks/cron/queue/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function CronQueuePageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={{ GET: cronQueueDefinition.GET }}
      locale={locale}
      user={user}
    />
  );
}
