"use client";

import { type JSX, useMemo } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointRenderer";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import definitions from "@/app/api/[locale]/users/stats/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface UsersStatsPageProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function UsersStatsClientPage({
  locale,
  user,
}: UsersStatsPageProps): JSX.Element {
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );
  return (
    <EndpointRenderer
      endpoint={definitions.GET}
      locale={locale}
      logger={logger}
      user={user}
    />
  );
}
