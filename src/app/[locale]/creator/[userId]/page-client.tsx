"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import type { JSX } from "react";

import type { CreatorGetResponseOutput } from "@/app/api/[locale]/user/public/creator/[userId]/definition";
import creatorEndpoints from "@/app/api/[locale]/user/public/creator/[userId]/definition";

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
          urlPathParams: { userId: creatorId },
          initialData,
        },
      }}
    />
  );
}
