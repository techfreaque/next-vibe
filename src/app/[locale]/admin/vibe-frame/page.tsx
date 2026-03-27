/**
 * Vibe Frame Admin Test Page
 */

export const dynamic = "force-dynamic";

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { VibeFrameTestPageClient } from "./page-client";

interface VibeFrameTestPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface VibeFrameTestPageData {
  locale: CountryLanguage;
  user: JwtPrivatePayloadType;
}

export async function tanstackLoader({
  params,
}: VibeFrameTestPageProps): Promise<VibeFrameTestPageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/vibe-frame`);
  return { locale, user };
}

export function TanstackPage({
  locale,
  user,
}: VibeFrameTestPageData): JSX.Element {
  return <VibeFrameTestPageClient locale={locale} user={user} />;
}

export default async function VibeFrameTestPage({
  params,
}: VibeFrameTestPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
