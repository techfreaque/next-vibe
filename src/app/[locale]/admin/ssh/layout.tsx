/**
 * SSH Admin Layout
 * Shared layout for all SSH admin pages with tab navigation
 */

import { Div } from "next-vibe-ui/ui/div";
import type { JSX, ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SshTabsNav } from "./_components/ssh-tabs-nav";

export interface SshAdminLayoutData {
  locale: CountryLanguage;
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<SshAdminLayoutData, "children">> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/ssh`);
  return { locale };
}

export function TanstackPage({
  locale,
  children,
}: SshAdminLayoutData): JSX.Element {
  return (
    <Div className="p-6 flex flex-col gap-6">
      <SshTabsNav locale={locale} />
      {children}
    </Div>
  );
}

export default async function SshAdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
