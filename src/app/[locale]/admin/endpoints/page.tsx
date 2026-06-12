export const dynamic = "force-dynamic";

import type { JSX } from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { parseError } from "@/app/api/[locale]/shared/utils";
import type { HelpGetResponseOutput } from "@/app/api/[locale]/system/help/definition";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { requireUser } from "@/app/api/[locale]/user/auth/utils";
import { EndpointsAdminPageClient } from "./page-client";

interface EndpointsAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface EndpointsAdminPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
  initialHelpData: HelpGetResponseOutput | null;
}

export async function tanstackLoader({
  params,
}: EndpointsAdminPageProps): Promise<EndpointsAdminPageData> {
  const { locale } = await params;
  const user = await requireUser(locale, `/${locale}/admin/endpoints`);
  const logger = createEndpointLogger(false, Date.now(), locale);

  let initialHelpData: HelpGetResponseOutput | null = null;
  try {
    const { HelpRepository } =
      await import("@/app/api/[locale]/system/help/repository");
    const result = await HelpRepository.getTools(
      { statsFilter: "webPinned", page: undefined, pageSize: undefined },
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

  return { locale, user, initialHelpData };
}

export function TanstackPage({
  locale,
  user,
  initialHelpData,
}: EndpointsAdminPageData): JSX.Element {
  return (
    <EndpointsAdminPageClient
      locale={locale}
      user={user}
      initialHelpData={initialHelpData}
    />
  );
}

export default async function EndpointsAdminPage({
  params,
}: EndpointsAdminPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
