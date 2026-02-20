"use client";

import type { JSX } from "react";

import composeDefinition from "@/app/api/[locale]/emails/imap-client/messages/compose/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function ImapComposePageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage endpoint={composeDefinition} locale={locale} user={user} />
  );
}
