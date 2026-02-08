"use client";

import type { JSX } from "react";

import contactDefinitions from "@/app/api/[locale]/contact/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

interface ContactFormProps {
  locale: CountryLanguage;
  jwtUser: JwtPayloadType;
}

/**
 * Contact form component
 * Uses EndpointsPage for unified rendering
 */
export default function ContactForm({
  locale,
  jwtUser,
}: ContactFormProps): JSX.Element {
  return (
    <EndpointsPage
      endpoint={contactDefinitions}
      locale={locale}
      user={jwtUser}
    />
  );
}
