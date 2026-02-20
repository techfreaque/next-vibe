"use client";

import type { JSX } from "react";

import terminalDefinition from "@/app/api/[locale]/ssh/terminal/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function SshTerminalPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={terminalDefinition}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          queryOptions: { enabled: true, staleTime: 0 },
        },
      }}
    />
  );
}
