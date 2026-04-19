"use client";

import type { JSX } from "react";

import creatorEndpoints from "@/app/api/[locale]/user/public/creator/[userId]/definition";
import type { CreatorGetResponseOutput } from "@/app/api/[locale]/user/public/creator/[userId]/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export interface CreatorPageData {
  locale: CountryLanguage;
  creatorId: string;
  viewer: JwtPayloadType;
  initialData: CreatorGetResponseOutput | undefined;
}

export function CreatorProfilePage({
  locale,
  creatorId,
  viewer,
  initialData,
}: CreatorPageData): JSX.Element {
  return (
    <EndpointsPage
      endpoint={creatorEndpoints}
      locale={locale}
      user={viewer}
      endpointOptions={{
        read: {
          urlPathParams: { creatorId },
          initialData,
        },
      }}
    />
  );
}
