"use client";

import type { JSX } from "react";

import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointRenderer";
import { GET } from "@/app/api/[locale]/users/stats/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface UsersStatsPageProps {
  locale: CountryLanguage;
}

export function UsersStatsClientPage({
  locale,
}: UsersStatsPageProps): JSX.Element {
  return <EndpointRenderer endpoint={GET} locale={locale} />;
}
