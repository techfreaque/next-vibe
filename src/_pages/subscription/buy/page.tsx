export const dynamic = "force-dynamic";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { JSX } from "react";

import { subscriptionLoader } from "../shared-loader";
import { BuyPageClient } from "./page-client";

interface PageProps {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface BuyPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
  searchParams,
}: PageProps): Promise<BuyPageData> {
  const { locale } = await params;
  const query = await searchParams;
  const { locale: l, user } = await subscriptionLoader({
    locale,
    requireAuth: true,
    searchParams: query,
  });
  return { locale: l, user };
}

export function TanstackPage({ locale, user }: BuyPageData): JSX.Element {
  return <BuyPageClient locale={locale} user={user} />;
}

export default async function BuyPage({
  params,
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
