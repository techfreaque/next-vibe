"use client";

import type { JSX } from "react";

import imapFoldersListDefinition from "@/app/api/[locale]/emails/imap-client/folders/list/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function ImapFoldersPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={imapFoldersListDefinition}
      locale={locale}
      user={user}
    />
  );
}
