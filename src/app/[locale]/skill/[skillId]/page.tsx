/**
 * Public Skill Landing Page
 * Shows a skill with CTA buttons and referral pitch.
 * URL: /[locale]/skill/[skillId]
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { JSX } from "react";

import type { SkillGetResponseOutput } from "@/app/api/[locale]/agent/chat/skills/[id]/definition";
import { SkillsRepository } from "@/app/api/[locale]/agent/chat/skills/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { configScopedTranslation } from "@/config/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { scopedTranslation } from "./i18n";
import { SkillLandingPage } from "./page-client";

interface Props {
  params: Promise<{ locale: CountryLanguage; skillId: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale, skillId } = await params;
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");

  return metadataGenerator(locale, {
    path: `skill/${skillId}`,
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description", { appName }),
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070",
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords", { appName })],
  });
};

export interface SkillLandingPageData {
  locale: CountryLanguage;
  skill: SkillGetResponseOutput | null;
  user: JwtPayloadType | null;
}

export async function tanstackLoader({
  params,
}: Props): Promise<SkillLandingPageData> {
  const { locale, skillId } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const userResponse = await UserRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.MINIMAL,
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
    },
    locale,
    logger,
  );
  const user = userResponse.success ? userResponse.data : null;

  if (!user) {
    return { locale, skill: null, user: null };
  }

  const skillResult = await SkillsRepository.getSkillById(
    { id: skillId },
    user,
    logger,
    locale,
  );

  return {
    locale,
    skill: skillResult.success ? skillResult.data : null,
    user,
  };
}

export function TanstackPage({
  locale,
  skill,
  user,
}: SkillLandingPageData): JSX.Element {
  return <SkillLandingPage locale={locale} skill={skill} user={user} />;
}

export default async function SkillPage({
  params,
}: Props): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
