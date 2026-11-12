"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import type { CreatorGetResponseOutput } from "@/user/public/creator/[userId]/definition";
import creatorEndpoints from "@/user/public/creator/[userId]/definition";

export interface CreatorPageData {
  locale: CountryLanguage;
  creatorId: string;
  viewer: JwtPayloadType;
  platform: Platform;
  initialData: CreatorGetResponseOutput | undefined;
}

export function CreatorProfilePage({
  locale,
  creatorId,
  viewer,
  platform,
  initialData,
}: CreatorPageData): JSX.Element {
  const logger = useLogger();
  return (
    <EndpointsPage
      logger={logger}
      endpoint={creatorEndpoints}
      locale={locale}
      user={viewer}
      platform={platform}
      endpointOptions={{
        read: {
          urlPathParams: { userId: creatorId },
          initialData,
        },
      }}
    />
  );
}
