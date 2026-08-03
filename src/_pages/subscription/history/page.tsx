export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { subscriptionLoader } from "../shared-loader";
import { HistoryPageClient } from "./page-client";

interface PageProps {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface HistoryPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
}

export async function tanstackLoader({
  params,
  searchParams,
}: PageProps): Promise<HistoryPageData> {
  const { locale } = await params;
  const query = await searchParams;
  const {
    locale: l,
    user,
    platform,
  } = await subscriptionLoader({
    locale,
    requireAuth: true,
    searchParams: query,
  });
  return { locale: l, user, platform };
}

export function TanstackPage({
  locale,
  user,
  platform,
}: HistoryPageData): JSX.Element {
  return <HistoryPageClient locale={locale} user={user} platform={platform} />;
}

export default async function HistoryPage({
  params,
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
