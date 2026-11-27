/**
 * /[locale]/setup - first-run setup for a self-hosted instance.
 *
 * Only reachable while setup is pending (admin password still a shipped
 * default, or VIBE_SETUP_STATE=in-progress). A configured instance (prod)
 * redirects home, so this page never appears there.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { canonicalPageUrl } from "next-vibe/core/i18n/core/metadata";
import { SetupStatusRepository } from "next-vibe/env/settings/setup-status";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { SETUP_STEP_COOKIE } from "next-vibe/identity/setup-state";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { cookies } from "next-vibe/ui/lib/headers";
import { redirect } from "next-vibe/ui/lib/redirect";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { SetupPageClient } from "./_components/setup-client";
import {
  type SetupBootstrap,
  type SetupSnapshot,
  SetupSnapshotRepository,
} from "./_components/setup-snapshot";
import type { SetupView } from "./_components/setup-view";
import { resolveSetupView } from "./_components/setup-view";
import { scopedTranslation } from "./i18n";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SetupPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  view: SetupView;
  bootstrap: SetupBootstrap | null;
  snapshot: SetupSnapshot | null;
  writable: boolean;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  return {
    title: t("meta.title", { appName: configT("appName") }),
    description: t("meta.description"),
    alternates: { canonical: canonicalPageUrl(locale, "setup") },
    robots: { index: false, follow: false },
  };
}

export async function tanstackLoader({
  params,
}: Props): Promise<SetupPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);
  const status = await SetupStatusRepository.getStatus();
  if (!status.pending && !status.complete) {
    redirect(`/${locale}`);
  }
  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);
  const stepCookie = (await cookies()).get(SETUP_STEP_COOKIE)?.value ?? null;

  const view = resolveSetupView({ status, isAdmin, stepCookie });
  if (view === null) {
    redirect(`/${locale}`);
  }

  return {
    locale,
    user,
    view,
    bootstrap:
      view.kind === "welcome" && status.writable
        ? SetupSnapshotRepository.getBootstrap()
        : null,
    snapshot:
      view.kind === "wizard"
        ? await SetupSnapshotRepository.getSnapshot(locale, logger)
        : null,
    writable: status.writable,
  };
}

export function TanstackPage(data: SetupPageData): JSX.Element {
  return <SetupPageClient {...data} />;
}

export default async function SetupPage(props: Props): Promise<JSX.Element> {
  return <TanstackPage {...await tanstackLoader(props)} />;
}
