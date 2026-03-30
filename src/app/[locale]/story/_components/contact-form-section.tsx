"use client";

import type { JSX } from "react";

import contactDefinitions from "@/app/api/[locale]/contact/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JWTPublicPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface ContactFormSectionProps {
  locale: CountryLanguage;
  user: JWTPublicPayloadType;
}

export function ContactFormSection({
  locale,
  user,
}: ContactFormSectionProps): JSX.Element {
  return (
    <EndpointsPage endpoint={contactDefinitions} locale={locale} user={user} />
  );
}
