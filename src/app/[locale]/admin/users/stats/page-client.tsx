"use client";

import { type JSX, useMemo } from "react";

import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/react/widgets/renderers/EndpointRenderer";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { GET } from "@/app/api/[locale]/users/stats/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface UsersStatsPageProps {
  locale: CountryLanguage;
}

export function UsersStatsClientPage({ locale }: UsersStatsPageProps): JSX.Element {
  const logger = useMemo(() => createEndpointLogger(false, Date.now(), locale), [locale]);
  return <EndpointRenderer endpoint={GET} locale={locale} logger={logger} />;
}
