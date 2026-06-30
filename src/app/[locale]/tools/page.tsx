export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { parseError } from "@/app/api/[locale]/shared/utils";
import type { HelpGetResponseOutput } from "@/app/api/[locale]/system/help/definition";
import { createEndpointLogger } from "@/app/api/[locale]/system/logger/server";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { ToolsPageClient } from "./page-client";

interface ToolsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface ToolsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  initialHelpData: HelpGetResponseOutput | null;
}

export async function tanstackLoader({
  params,
}: ToolsPageProps): Promise<ToolsPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  let initialHelpData: HelpGetResponseOutput | null = null;
  try {
    const { HelpRepository } =
      await import("@/app/api/[locale]/system/help/repository");
    const result = await HelpRepository.getTools(
      { statsFilter: "webPinned", page: undefined, pageSize: undefined },
      user,
      locale,
      Platform.NEXT_PAGE,
      logger,
    );
    if (result.success) {
      initialHelpData = result.data;
    }
  } catch (e) {
    logger.error("[SSR help] catch:", parseError(e));
  }

  return { locale, user, initialHelpData };
}

export function TanstackPage({
  locale,
  user,
  initialHelpData,
}: ToolsPageData): JSX.Element {
  return (
    <ToolsPageClient
      locale={locale}
      user={user}
      initialHelpData={initialHelpData}
    />
  );
}

export default async function ToolsPage({
  params,
}: ToolsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
