"use client";

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import type { JSX } from "react";
import { useEffect, useState } from "react";

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
