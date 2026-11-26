export const dynamic = "force-dynamic";

import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { HelpGetResponseOutput } from "next-vibe/help-tool/definition";
import type { HelpGetRequestInput } from "next-vibe/help-tool/definition";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { cookies } from "next-vibe/ui/lib/headers";
import type { JSX } from "react";

import {
  readWorkspaceCompanyCookie,
  WORKSPACE_COMPANY_COOKIE,
  type WorkspaceCompany,
  workspaceCompanyCookieName,
} from "@/companies/_shared/workspace-company";
import { DEMO_COMPANY_NAME } from "@/companies/demo-company";

import { parseToolsInitialState } from "./initial-state";
import { ToolsLoadError } from "./load-error";
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
  /** The session could not be resolved: render a recovery page, never raw JSON. */
  loadFailed?: boolean;
}

export async function tanstackLoader({
  params,
  searchParams,
}: ToolsPageProps): Promise<ToolsPageData> {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const initialState = parseToolsInitialState({
    get: (name) => {
      const value = query?.[name];
      return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
    },
  });
  const logger = createEndpointLogger(false, locale);

  const { AuthRepository } = await import("next-vibe/identity/auth/repository");
  const auth = await AuthRepository.getAuthMinimalUser(
    [
      UserRole.PUBLIC,
      UserRole.CUSTOMER,
      UserRole.PARTNER_ADMIN,
      UserRole.PARTNER_EMPLOYEE,
      UserRole.ADMIN,
    ],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  ).then(
    (resolved) => ({ user: resolved, failed: false }),
    (error: Error) => {
      logger.error("Unable to resolve the tools page session", {
        error: parseError(error).message,
      });
      return { user: AuthRepository.anonymousPublicUser(), failed: true };
    },
  );
  if (auth.failed) {
    return {
      locale,
      user: auth.user,
      workspaceCompanies: null,
      platform: Platform.NEXT_PAGE,
      initialHelpData: null,
      initialState,
      loadFailed: true,
    };
  }
  const user = auth.user;

  const [catalog, workspace] = await Promise.allSettled([
    import("next-vibe/help-tool/repository").then(({ HelpRepository }) =>
      HelpRepository.getTools(
        {
          ...initialState,
          page: initialState.page,
          pageSize: initialState.pageSize,
        },
        user,
        locale,
        Platform.NEXT_PAGE,
        logger,
      ),
    ),
    !user.isPublic
      ? Promise.all([
          import("@/companies/_shared/workspace-company.repository").then(
            ({ listWorkspaceCompanies }) => listWorkspaceCompanies(user.id),
          ),
          cookies().then(
            (store) =>
              store.get(workspaceCompanyCookieName(user.id))?.value ??
              readWorkspaceCompanyCookie(
                store.get(WORKSPACE_COMPANY_COOKIE)?.value,
                user.id,
              ),
          ),
        ])
      : null,
  ]);
  if (catalog.status === "rejected") {
    logger.error(
      "Unable to load the tools catalog",
      parseError(catalog.reason),
    );
  }
  if (workspace.status === "rejected") {
    logger.warn("Unable to load workspace companies", {
      error: parseError(workspace.reason).message,
    });
  }
  const initialHelpData =
    catalog.status === "fulfilled" && catalog.value.success
      ? catalog.value.data
      : null;
  const [workspaceCompanies, savedCompanyId] =
    workspace.status === "fulfilled" && workspace.value
      ? workspace.value
      : [null, undefined];

  const workspaceCompanyId =
    savedCompanyId ??
    (coreEnv.NODE_ENV === "development"
      ? workspaceCompanies?.find(({ name }) => name === DEMO_COMPANY_NAME)?.id
      : undefined);
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
  loadFailed,
}: ToolsPageData): JSX.Element {
  if (loadFailed) {
    return <ToolsLoadError locale={locale} />;
  }
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
