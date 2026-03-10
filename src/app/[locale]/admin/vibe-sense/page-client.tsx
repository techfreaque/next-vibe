/**
 * Vibe Sense — Client Component
 * Renders the graph list using EndpointsPage
 */

"use client";

import type React from "react";

import graphsDefinitions from "@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface VibeSenseClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function VibeSenseClient({
  locale,
  user,
}: VibeSenseClientProps): React.JSX.Element {
  return (
    <EndpointsPage
      endpoint={graphsDefinitions}
      locale={locale}
      user={user}
      endpointOptions={{
        read: {
          queryOptions: {
            enabled: true,
            refetchOnWindowFocus: false,
            staleTime: 1 * 60 * 1000,
          },
        },
      }}
    />
  );
}
