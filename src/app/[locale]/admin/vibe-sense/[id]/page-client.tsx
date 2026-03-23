/**
 * Vibe Sense - Graph Detail Client Component
 * Uses EndpointsPage with GET for graph viewing
 */

"use client";

import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { GraphResolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/enum";
import graphDataDefinitions from "@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/[id]/data/definition";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface VibeSenseDetailClientProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  graphId: string;
}

export function VibeSenseDetailClient({
  locale,
  user,
  graphId,
}: VibeSenseDetailClientProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={graphDataDefinitions}
      locale={locale}
      user={user}
      forceMethod="GET"
      endpointOptions={{
        read: {
          urlPathParams: { id: graphId },
          initialState: {
            resolution: GraphResolution.ONE_DAY,
            cursor: undefined,
          },
          queryOptions: {
            enabled: true,
            staleTime: 30 * 1000,
          },
        },
      }}
    />
  );
}
