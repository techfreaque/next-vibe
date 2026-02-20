"use client";

import type { JSX } from "react";

import pulseHistoryDefinition from "@/app/api/[locale]/system/unified-interface/tasks/pulse/history/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function PulseHistoryPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={pulseHistoryDefinition}
      locale={locale}
      user={user}
    />
  );
}
