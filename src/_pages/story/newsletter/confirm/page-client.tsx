"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import confirmDefinitions from "@/newsletter/confirm/definition";

export function NewsletterConfirmPageClient({
  locale,
  user,
  token,
  platform,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
  token: string;
  platform: Platform;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={confirmDefinitions}
      locale={locale}
      user={user}
      platform={platform}
      endpointOptions={{ create: { autoPrefillData: { token } } }}
    />
  );
}
