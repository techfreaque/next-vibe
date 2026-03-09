/**
 * Admin Email Campaigns Layout
 * Shared layout for all email campaigns admin pages
 */

import { Div } from "next-vibe-ui/ui/div";
import type { JSX, ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { EmailCampaignsNav } from "./_components/email-campaigns-nav";

interface EmailCampaignsLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function EmailCampaignsLayout({
  children,
  params,
}: EmailCampaignsLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/email-campaigns`);

  return (
    <Div className="flex flex-col gap-6 p-6">
      <Div className="flex flex-col gap-4">
        <EmailCampaignsNav locale={locale} />
      </Div>
      {children}
    </Div>
  );
}
