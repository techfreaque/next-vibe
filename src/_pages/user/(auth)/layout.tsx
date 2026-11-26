import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { PageLayout } from "next-vibe/ui/components/page-layout";
import type { JSX, ReactNode } from "react";

import { AuthShell } from "../_components/auth-shell";

export interface AuthLayoutData {
  locale: CountryLanguage;
  children?: ReactNode;
}

interface LocaleParams {
  params: Promise<{ locale: CountryLanguage }>;
}

export async function tanstackLoader({
  params,
}: LocaleParams): Promise<Omit<AuthLayoutData, "children">> {
  const { locale } = await params;
  return { locale };
}

export function TanstackPage({
  children,
  locale,
}: AuthLayoutData): JSX.Element {
  return (
    <PageLayout scrollable={true}>
      <AuthShell locale={locale}>{children}</AuthShell>
    </PageLayout>
  );
}

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
} & LocaleParams): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
