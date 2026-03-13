"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import emailsListDefinition from "@/app/api/[locale]/messenger/messages/list/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function MessengerInboxPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <Div className="flex-1 min-w-0 overflow-auto">
      <EndpointsPage
        endpoint={emailsListDefinition}
        locale={locale}
        user={user}
      />
    </Div>
  );
}
