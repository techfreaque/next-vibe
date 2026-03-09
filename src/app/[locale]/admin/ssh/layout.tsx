/**
 * SSH Admin Layout
 * Shared layout for all SSH admin pages with tab navigation
 */

import { Div } from "next-vibe-ui/ui/div";
import type { JSX, ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { SshTabsNav } from "./_components/ssh-tabs-nav";

interface SshAdminLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function SshAdminLayout({
  children,
  params,
}: SshAdminLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/ssh`);

  return (
    <Div className="p-6 flex flex-col gap-6">
      <SshTabsNav locale={locale} />
      {children}
    </Div>
  );
}
