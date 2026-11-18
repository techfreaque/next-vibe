"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";

import contactDefinitions from "@/contact/definition";
import { ContactFormWidget } from "@/contact/widget";

interface ContactFormSectionProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
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
      widget={<ContactFormWidget field={contactDefinitions.POST.fields} />}
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
