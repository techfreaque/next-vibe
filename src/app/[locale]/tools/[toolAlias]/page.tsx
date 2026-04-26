/**
 * Tool Detail Page
 * Shows a single tool via the help endpoint widget.
 * URL: /[locale]/tools/[toolAlias]
 */

export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { ToolDetailPageClient } from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage; toolAlias: string }>;
}

export interface ToolDetailPageData {
  locale: CountryLanguage;
  toolAlias: string;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ToolDetailPageData> {
  const { locale, toolAlias } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  return { locale, toolAlias, user };
}

export function TanstackPage(data: ToolDetailPageData): JSX.Element {
  return <ToolDetailPageClient {...data} />;
}

export default async function ToolDetailPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
