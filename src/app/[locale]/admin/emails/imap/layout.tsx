/**
 * IMAP Admin Layout
 * Server layout for IMAP administration pages
 */

import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { ImapAdminLayoutClient } from "@/app/api/[locale]/v1/core/emails/imap-client/_components/imap-admin-layout-client";

interface ImapAdminLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function ImapAdminLayout({
  children,
  params,
}: ImapAdminLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;

  return (
    <ImapAdminLayoutClient locale={locale}>{children}</ImapAdminLayoutClient>
  );
}
