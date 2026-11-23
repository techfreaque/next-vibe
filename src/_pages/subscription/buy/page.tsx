export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import type { CreditsGetResponseOutput } from "@/credits/definition";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";

import { generateSubscriptionMetadata } from "../metadata";
import { subscriptionLoader } from "../shared-loader";
import { BuyPageClient } from "./page-client";

interface PageProps {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSubscriptionMetadata(locale, "buyCredits");
}

export interface BuyPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  initialCredits: CreditsGetResponseOutput | null;
  platform: Platform;
}

export async function tanstackLoader({
  params,
  searchParams,
}: PageProps): Promise<BuyPageData> {
  const { locale } = await params;
  const query = await searchParams;
  const data = await subscriptionLoader({
    locale,
    searchParams: query,
  });
  const { t } = creditsScopedTranslation.scopedT(locale);
  const balance = await CreditRepository.getCreditBalanceForUser(
    data.user,
    locale,
    createEndpointLogger(false, locale),
    t,
  );
  return { ...data, initialCredits: balance.success ? balance.data : null };
}

export function TanstackPage({
  locale,
  user,
  initialCredits,
  platform,
}: BuyPageData): JSX.Element {
  return (
    <BuyPageClient
      locale={locale}
      user={user}
      initialCredits={initialCredits}
      platform={platform}
    />
  );
}

export default async function BuyPage({
  params,
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
