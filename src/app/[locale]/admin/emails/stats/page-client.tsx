"use client";

import type { JSX } from "react";

import emailStatsDefinition from "@/app/api/[locale]/emails/messages/stats/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function EmailsStatsPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={emailStatsDefinition}
      locale={locale}
      user={user}
    />
  );
}
