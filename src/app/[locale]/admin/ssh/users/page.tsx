export const dynamic = "force-dynamic";

import type { JSX } from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SshUsersPageClient } from "./page-client";

interface SshUsersPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SshUsersPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: SshUsersPageProps): Promise<SshUsersPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/ssh/users`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: SshUsersPageData): JSX.Element {
  return <SshUsersPageClient locale={locale} user={user} />;
}

export default async function SshUsersPage({
  params,
}: SshUsersPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
