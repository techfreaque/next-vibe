export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { JsonLd, type JsonLdNode } from "next-vibe/ui/components/json-ld";
import type { JSX } from "react";

import { buildPricingStructuredData } from "@/_pages/_components/structured-data";

import { generateSubscriptionMetadata } from "../metadata";
import { subscriptionLoader } from "../shared-loader";
import { OverviewPageClient } from "./page-client";

interface PageProps {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSubscriptionMetadata(locale, "overview");
}

export interface OverviewPageData {
  locale: CountryLanguage;
  user: Awaited<ReturnType<typeof subscriptionLoader>>["user"];
  initialCredits: Awaited<
    ReturnType<typeof subscriptionLoader>
  >["initialCredits"];
  platform: Awaited<ReturnType<typeof subscriptionLoader>>["platform"];
  /** Product + Offer JSON-LD for the public pricing page. */
  structuredData: JsonLdNode;
}

export async function tanstackLoader({
  params,
  searchParams,
}: PageProps): Promise<OverviewPageData> {
  const { locale } = await params;
  const query = await searchParams;
  const [data, availability] = await Promise.all([
    subscriptionLoader({ locale, searchParams: query }),
    getEnvAvailability(),
  ]);
  return {
    ...data,
    structuredData: buildPricingStructuredData({
      locale,
      modelCount: getAvailableChatModelCount(false, availability),
    }),
  };
}

export function TanstackPage({
  locale,
  user,
  initialCredits,
  platform,
  structuredData,
}: OverviewPageData): JSX.Element {
  return (
    <>
      <JsonLd id="pricing-structured-data" data={structuredData} />
      <OverviewPageClient
        locale={locale}
        user={user}
        initialCredits={initialCredits}
        platform={platform}
      />
    </>
  );
}

export default async function OverviewPage({
  params,
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params, searchParams });
  return <TanstackPage {...data} />;
}
