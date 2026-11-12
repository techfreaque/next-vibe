/**
 * AI Skills Page
 * Standalone page for browsing AI skills.
 * Same content as the popover, but as a full page with back navigation.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { SkillListResponseOutput } from "next-vibe/agent/skills/definition";
import { SkillSourceFilter } from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { configScopedTranslation } from "@/env/i18n";

import { scopedTranslation } from "./i18n";
import { SkillsPageClient } from "./page-client";

interface SkillsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function generateMetadata({
  params,
}: SkillsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "skills",
    title: t("meta.title", { appName }),
    description: t("meta.description"),
    category: t("meta.category"),
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
}

export interface SkillsPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  /** Built-in skills resolved server-side so the list paints on first load. */
  initialData: SkillListResponseOutput | undefined;
}

export async function tanstackLoader({
  params,
}: SkillsPageProps): Promise<SkillsPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);

  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC, UserRole.CUSTOMER],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );

  // Dynamic import: the skills repository's import tree cycles when pulled
  // in at page module top-level (same reason skills-content is lazy).
  const { SkillsRepository } =
    await import("next-vibe/agent/skills/repository");
  const skills = await SkillsRepository.getSkills(
    { sourceFilter: SkillSourceFilter.BUILT_IN },
    user,
    logger,
    locale,
    Platform.NEXT_PAGE,
  );

  return {
    locale,
    user,
    platform: Platform.NEXT_PAGE,
    initialData: skills.success ? skills.data : undefined,
  };
}

export function TanstackPage({
  locale,
  user,
  platform,
  initialData,
}: SkillsPageData): JSX.Element {
  return (
    <SkillsPageClient
      locale={locale}
      user={user}
      platform={platform}
      initialData={initialData}
    />
  );
}

export default async function SkillsPage({
  params,
}: SkillsPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
