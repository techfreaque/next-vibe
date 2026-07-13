"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import type { JSX } from "react";

import contactDefinitions from "@/app/api/[locale]/contact/definition";

interface ContactFormSectionProps {
  locale: CountryLanguage;
  user: JWTPublicPayloadType;
  userEmail?: string;
}

export function ContactFormSection({
  locale,
  user,
  userEmail,
}: ContactFormSectionProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={contactDefinitions}
      locale={locale}
      user={user}
      endpointOptions={
        userEmail
          ? { create: { autoPrefillData: { email: userEmail } } }
          : undefined
      }
    />
  );
}
