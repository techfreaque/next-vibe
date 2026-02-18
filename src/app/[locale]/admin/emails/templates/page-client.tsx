"use client";

import type { JSX } from "react";

import previewSendTestDefinition from "@/app/api/[locale]/emails/preview/send-test/definition";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

export function EmailTemplatesPageClient({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): JSX.Element {
  return (
    <EndpointsPage
      endpoint={previewSendTestDefinition}
      locale={locale}
      user={user}
    />
  );
}
