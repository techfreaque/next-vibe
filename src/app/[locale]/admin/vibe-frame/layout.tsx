/**
 * Vibe Frame Admin Layout
 */

import type { JSX, ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

export interface VibeFrameAdminLayoutData {
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<VibeFrameAdminLayoutData, "children">> {
  const { locale } = await params;
  await requireAdminUser(locale, `/${locale}/admin/vibe-frame`);
  return {};
}

export function TanstackPage({
  children,
}: VibeFrameAdminLayoutData): JSX.Element {
  return <>{children}</>;
}

export default async function VibeFrameAdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
