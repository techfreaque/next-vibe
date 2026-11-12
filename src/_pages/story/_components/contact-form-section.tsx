"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import contactDefinitions from "@/contact/definition";

interface ContactFormSectionProps {
  locale: CountryLanguage;
  user: JWTPublicPayloadType;
  platform: Platform;
  userEmail?: string;
}

export function ContactFormSection({
  locale,
  user,
  platform,
  userEmail,
}: ContactFormSectionProps): JSX.Element {
  const logger = useLogger();
  return (
    <EndpointsPage
      logger={logger}
      endpoint={contactDefinitions}
      locale={locale}
      user={user}
      platform={platform}
      endpointOptions={
        userEmail
          ? { create: { autoPrefillData: { email: userEmail } } }
          : undefined
      }
    />
  );
}
