"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import unsubscribeDefinitions from "@/newsletter/unsubscribe/definition";

export function UnsubscribePageClient({
  locale,
  user,
  prefilledEmail,
  platform,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  prefilledEmail?: string;
  platform: Platform;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={unsubscribeDefinitions}
      locale={locale}
      user={user}
      platform={platform}
      endpointOptions={
        prefilledEmail
          ? { create: { autoPrefillData: { email: prefilledEmail } } }
          : undefined
      }
    />
  );
}
