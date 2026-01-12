/**
 * Emails Admin Layout
 * Server layout for all email admin pages
 */

import type { JSX, ReactNode } from "react";

import { EmailsAdminLayoutClient } from "@/app/api/[locale]/emails/_components/emails-admin-layout-client";
import type { CountryLanguage } from "@/i18n/core/config";

interface EmailsAdminLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function EmailsAdminLayout({
  children,
  params,
}: EmailsAdminLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;

  return (
    <EmailsAdminLayoutClient locale={locale}>
      {children}
    </EmailsAdminLayoutClient>
  );
}
