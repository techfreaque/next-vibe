import type { JSX } from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SshTerminalPageClient } from "./page-client";

interface SshTerminalPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SshTerminalPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: SshTerminalPageProps): Promise<SshTerminalPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/ssh/terminal`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: SshTerminalPageData): JSX.Element {
  return <SshTerminalPageClient locale={locale} user={user} />;
}

export default async function SshTerminalPage({
  params,
}: SshTerminalPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
