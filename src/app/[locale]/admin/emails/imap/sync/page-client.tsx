"use client";

import type { JSX } from "react";

import imapSyncDefinition from "@/app/api/[locale]/emails/imap-client/sync/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function ImapSyncPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage endpoint={imapSyncDefinition} locale={locale} user={user} />
  );
}
