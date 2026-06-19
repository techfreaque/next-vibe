export const dynamic = "force-dynamic";

import type { JSX } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { subscriptionLoader } from "../shared-loader";
import { HistoryPageClient } from "./page-client";

interface PageProps {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface HistoryPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
  searchParams,
}: PageProps): Promise<HistoryPageData> {
  const { locale } = await params;
  const query = await searchParams;
  const { locale: l, user } = await subscriptionLoader({
    locale,
    requireAuth: true,
    searchParams: query,
  });
  return { locale: l, user };
}

export function TanstackPage({ locale, user }: HistoryPageData): JSX.Element {
  return <HistoryPageClient locale={locale} user={user} />;
}

export default async function HistoryPage({
  params,
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
