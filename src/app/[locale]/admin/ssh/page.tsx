export const dynamic = "force-dynamic";

import { redirect } from "next-vibe-ui/lib/redirect";
import type { JSX } from "react";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

interface SshAdminPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface SshAdminPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: SshAdminPageProps): Promise<SshAdminPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/ssh`);
  redirect(`/${locale}/admin/ssh/terminal`);
  return { locale, user };
}

export function TanstackPage(): JSX.Element {
  return null as never;
}

export default async function SshAdminPage({
  params,
}: SshAdminPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/ssh`);
  redirect(`/${locale}/admin/ssh/terminal`);
}
