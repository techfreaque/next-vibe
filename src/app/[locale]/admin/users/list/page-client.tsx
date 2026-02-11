/**
 * Users List Page Client Component
 * Uses EndpointsPage to render users list endpoint
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import definitions from "@/app/api/[locale]/users/list/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface UsersListPageProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function UsersListPageClient({
  locale,
  user,
}: UsersListPageProps): JSX.Element {
  return (
    <Div className="w-full min-h-screen">
      <EndpointsPage endpoint={definitions} locale={locale} user={user} />
    </Div>
  );
}
