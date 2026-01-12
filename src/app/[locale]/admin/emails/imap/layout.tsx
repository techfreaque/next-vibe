/**
 * IMAP Admin Layout
 * Server layout for IMAP administration pages
 */

import type { JSX, ReactNode } from "react";

import { ImapAdminLayoutClient } from "@/app/api/[locale]/emails/imap-client/_components/imap-admin-layout-client";
import type { CountryLanguage } from "@/i18n/core/config";

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
