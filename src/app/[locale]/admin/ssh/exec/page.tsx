export const dynamic = "force-dynamic";

import type { JSX } from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SshExecPageClient } from "./page-client";

interface SshExecPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SshExecPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: SshExecPageProps): Promise<SshExecPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/ssh/exec`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: SshExecPageData): JSX.Element {
  return <SshExecPageClient locale={locale} user={user} />;
}

export default async function SshExecPage({
  params,
}: SshExecPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
