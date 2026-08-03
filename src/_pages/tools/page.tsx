export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { HelpGetResponseOutput } from "next-vibe/help-tool/definition";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { ToolsPageClient } from "./page-client";

interface ToolsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface ToolsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
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
    const { HelpRepository } = await import("next-vibe/help-tool/repository");
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

  return { locale, user, platform: Platform.NEXT_PAGE, initialHelpData };
}

export function TanstackPage({
  locale,
  user,
  platform,
  initialHelpData,
}: ToolsPageData): JSX.Element {
  return (
    <ToolsPageClient
      locale={locale}
      user={user}
      platform={platform}
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
