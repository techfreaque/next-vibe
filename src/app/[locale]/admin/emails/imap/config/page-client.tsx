"use client";

import type { JSX } from "react";

import imapConfigDefinition from "@/app/api/[locale]/emails/imap-client/config/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function ImapConfigPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={imapConfigDefinition}
      locale={locale}
      user={user}
    />
  );
}
