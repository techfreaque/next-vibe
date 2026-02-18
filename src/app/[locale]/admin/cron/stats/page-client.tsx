"use client";

import type { JSX } from "react";

import cronStatsDefinition from "@/app/api/[locale]/system/unified-interface/tasks/cron/stats/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function CronStatsPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage endpoint={cronStatsDefinition} locale={locale} user={user} />
  );
}
