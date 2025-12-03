/**
 * SMTP Admin Layout
 * Server layout for SMTP administration pages
 */

import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { SmtpAdminLayoutClient } from "@/app/api/[locale]/emails/smtp-client/_components/smtp-admin-layout-client";

interface SmtpAdminLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function SmtpAdminLayout({
  children,
  params,
}: SmtpAdminLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;

  return (
    <SmtpAdminLayoutClient locale={locale}>{children}</SmtpAdminLayoutClient>
  );
}
