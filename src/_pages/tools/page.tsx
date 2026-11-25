export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { HelpGetResponseOutput } from "next-vibe/help-tool/definition";
import type { HelpGetRequestInput } from "next-vibe/help-tool/definition";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole, UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { cookies } from "next-vibe/ui/lib/headers";
import type { JSX } from "react";

import {
  readWorkspaceCompanyCookie,
  WORKSPACE_COMPANY_COOKIE,
  type WorkspaceCompany,
} from "@/companies/_shared/workspace-company";

import { parseToolsInitialState } from "./initial-state";
import { ToolsPageClient } from "./page-client";

export interface ToolsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export interface ToolsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  initialHelpData: HelpGetResponseOutput | null;
  workspaceCompanies: WorkspaceCompany[] | null;
  workspaceCompanyId?: string;
  initialState: Partial<HelpGetRequestInput>;
}

export async function tanstackLoader({
  params,
  searchParams,
}: ToolsPageProps): Promise<ToolsPageData> {
  const { locale } = await params;
  const query = await searchParams;
  const initialState = parseToolsInitialState({
    get: (name) => {
      const value = query?.[name];
      return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
    },
  });
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
      {
        ...initialState,
        page: initialState.page,
        pageSize: initialState.pageSize,
      },
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

  let workspaceCompanies: WorkspaceCompany[] | null = null;
  let workspaceCompanyId: string | undefined;
  if (!user.isPublic && user.roles.includes(UserPermissionRole.ADMIN)) {
    try {
      const { listWorkspaceCompanies } =
        await import("@/companies/_shared/workspace-company.repository");
      const cookie = (await cookies()).get(WORKSPACE_COMPANY_COOKIE);
      workspaceCompanyId = readWorkspaceCompanyCookie(cookie?.value, user.id);
      workspaceCompanies = await listWorkspaceCompanies(user.id);
    } catch (error) {
      logger.warn("Unable to load workspace companies", {
        error: parseError(error).message,
      });
    }
  }

  return {
    locale,
    user,
    workspaceCompanies,
    workspaceCompanyId,
    platform: Platform.NEXT_PAGE,
    initialHelpData,
    initialState,
  };
}

export function TanstackPage({
  locale,
  user,
  platform,
  initialHelpData,
  workspaceCompanies,
  workspaceCompanyId,
  initialState,
}: ToolsPageData): JSX.Element {
  return (
    <ToolsPageClient
      locale={locale}
      user={user}
      platform={platform}
      initialHelpData={initialHelpData}
      workspaceCompanies={workspaceCompanies}
      workspaceCompanyId={workspaceCompanyId}
      serverState={initialState}
    />
  );
}

export default async function ToolsPage(
  props: ToolsPageProps,
): Promise<JSX.Element> {
  const data = await tanstackLoader(props);
  return <TanstackPage {...data} />;
}
