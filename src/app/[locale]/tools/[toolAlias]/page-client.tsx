"use client";

import type { JSX } from "react";

import helpDefinitions from "@/app/api/[locale]/system/help/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function ToolDetailPageClient({
  locale,
  user,
  toolAlias,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  toolAlias: string;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={helpDefinitions}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          formOptions: {
            defaultValues: { toolName: toolAlias },
          },
          queryOptions: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }}
    />
  );
}
