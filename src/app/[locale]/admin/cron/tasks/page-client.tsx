"use client";

import type { JSX } from "react";

import cronTasksDefinition from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function CronTasksPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={{ GET: cronTasksDefinition.GET }}
      locale={locale}
      user={user}
    />
  );
}
