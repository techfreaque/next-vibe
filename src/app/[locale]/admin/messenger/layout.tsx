/**
 * Emails Admin Layout
 * Server layout for all email admin pages - unified Gmail-style sidebar
 */

import type { JSX, ReactNode } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { EmailsAdminLayoutClient } from "./_components/emails-admin-layout-client";

export interface EmailsAdminLayoutData {
  locale: CountryLanguage;
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<EmailsAdminLayoutData, "children">> {
  const { locale } = await params;
  return { locale };
}

export function TanstackPage({
  locale,
  children,
}: EmailsAdminLayoutData): JSX.Element {
  return (
    <EmailsAdminLayoutClient locale={locale}>
      {children}
    </EmailsAdminLayoutClient>
  );
}

export default async function EmailsAdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
