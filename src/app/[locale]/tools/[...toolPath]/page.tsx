/**
 * Tool Detail Page
 * Shows a single tool via the help endpoint widget.
 * URL: /[locale]/tools/[...toolPath]
 */

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

import { ToolDetailPageClient } from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage; toolPath: string[] }>;
}

export interface ToolDetailPageData {
  locale: CountryLanguage;
  toolAlias: string;
  user: JwtPayloadType;
  initialHelpData: HelpGetResponseOutput | null;
}

export async function tanstackLoader({
  params,
}: Props): Promise<ToolDetailPageData> {
  const { locale, toolPath } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);
  const toolAlias = toolPath.join("/");

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
      { toolName: toolAlias, page: undefined, pageSize: undefined },
      user,
      locale,
      Platform.NEXT_PAGE,
    );
    if (result.success) {
      initialHelpData = result.data;
    }
  } catch (e) {
    logger.error("[SSR help] catch:", parseError(e));
  }

  return { locale, toolAlias, user, initialHelpData };
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
