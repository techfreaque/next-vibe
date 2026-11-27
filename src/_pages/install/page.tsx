/**
 * /[locale]/install - local visual installer progress and optional GitHub setup.
 *
 * Only reachable on a local / first-run instance (dev mode or writable pending
 * setup). Production instances redirect home immediately.
 * Hands over cleanly to the existing /[locale]/setup first-run wizard.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { InstallerGetResponseOutput } from "next-vibe/env/installer/definition";
import { scopedTranslation } from "next-vibe/env/installer/i18n";
import { InstallerRepository } from "next-vibe/env/installer/repository";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { redirect } from "next-vibe/ui/lib/redirect";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { InstallPageClient } from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface InstallPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  initialData: InstallerGetResponseOutput | undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  return {
    title: t("meta.title", { appName: configT("appName") }),
    description: t("meta.description"),
    robots: { index: false, follow: false },
  };
}

export async function tanstackLoader({
  params,
}: Props): Promise<InstallPageData> {
  const { locale } = await params;
  const allowed = await InstallerRepository.isLocalInstallerAllowed();
  if (!allowed) {
    redirect(`/${locale}`);
  }

  const logger = createEndpointLogger(false, locale);
  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  const { t } = scopedTranslation.scopedT(locale);
  const response = await InstallerRepository.getStatus(logger, t);

  return {
    locale,
    user,
    platform: Platform.NEXT_PAGE,
    initialData: response.success ? response.data : undefined,
  };
}

export function TanstackPage(data: InstallPageData): JSX.Element {
  return <InstallPageClient {...data} />;
}

export default async function InstallPage(props: Props): Promise<JSX.Element> {
  return <TanstackPage {...await tanstackLoader(props)} />;
}
