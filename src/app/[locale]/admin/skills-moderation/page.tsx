import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { SkillsModerationPageClient } from "./page-client";

interface SkillsModerationPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SkillsModerationPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: SkillsModerationPageProps): Promise<SkillsModerationPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/skills-moderation`,
  );
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: SkillsModerationPageData): JSX.Element {
  return <SkillsModerationPageClient locale={locale} user={user} />;
}

export default async function SkillsModerationPage({
  params,
}: SkillsModerationPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
