/**
 * Admin Email Campaigns Layout
 * Shared layout for all email campaigns admin pages
 */

import { Div } from "next-vibe-ui/ui/div";
import type { JSX, ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { EmailCampaignsNav } from "./_components/email-campaigns-nav";

export interface EmailCampaignsLayoutData {
  locale: CountryLanguage;
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<EmailCampaignsLayoutData, "children">> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/messenger/campaigns`);
  return { locale };
}

export function TanstackPage({
  locale,
  children,
}: EmailCampaignsLayoutData): JSX.Element {
  return (
    <Div className="flex flex-col gap-6 p-6">
      <Div className="flex flex-col gap-4">
        <EmailCampaignsNav locale={locale} />
      </Div>
      {children}
    </Div>
  );
}

export default async function EmailCampaignsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
