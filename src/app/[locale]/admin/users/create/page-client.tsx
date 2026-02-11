/**
 * User Create Page Client Component
 * Uses EndpointsPage to render user create endpoint
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import definitions from "@/app/api/[locale]/users/create/definition";
import type { CountryLanguage } from "@/i18n/core/config";

interface UserCreatePageProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export function UserCreatePageClient({
  locale,
  user,
}: UserCreatePageProps): JSX.Element {
  return (
    <Div className="w-full min-h-screen">
      <EndpointsPage endpoint={definitions} locale={locale} user={user} />
    </Div>
  );
}
