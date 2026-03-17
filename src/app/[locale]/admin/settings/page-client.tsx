"use client";

import type { JSX } from "react";

import settingsDefinition from "@/app/api/[locale]/system/settings/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function SettingsPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={{ GET: settingsDefinition.GET }}
      locale={locale}
      user={user}
    />
  );
}
