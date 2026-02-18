"use client";

import type { JSX } from "react";

import imapAccountsListDefinition from "@/app/api/[locale]/emails/imap-client/accounts/list/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function ImapAccountsPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={imapAccountsListDefinition}
      locale={locale}
      user={user}
    />
  );
}
