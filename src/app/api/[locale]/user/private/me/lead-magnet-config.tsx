"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface Props {
  user: JwtPayloadType | null | undefined;
  locale: CountryLanguage;
}

export function LeadMagnetConfigPage({
  user,
  locale,
}: Props): JSX.Element | null {
  const [configDef, setConfigDef] = useState<{
    GET: CreateApiEndpointAny;
    DELETE: CreateApiEndpointAny;
  } | null>(null);

  useEffect(() => {
    void import("@/app/api/[locale]/lead-magnet/config/definition").then(
      (m) => {
        setConfigDef(m.default);
        return m;
      },
    );
  }, []);

  if (!user || !configDef) {
    return null;
  }
  return <EndpointsPage endpoint={configDef} user={user} locale={locale} />;
}
