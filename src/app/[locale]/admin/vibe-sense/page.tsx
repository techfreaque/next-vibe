/**
 * Vibe Sense - Admin Dashboard Page
 * Lists all pipeline graphs visible to the current admin
 */

export const dynamic = "force-dynamic";

import type { JSX } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { VibeSenseClient } from "./page-client";

interface VibeSensePageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export interface VibeSensePageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

export async function tanstackLoader({
  params,
}: VibeSensePageProps): Promise<VibeSensePageData> {
  const { locale } = await params;
  const user = await requireAdminUser(locale, `/${locale}/admin/vibe-sense`);
  return { locale, user };
}

export function TanstackPage({ locale, user }: VibeSensePageData): JSX.Element {
  return <VibeSenseClient locale={locale} user={user} />;
}

export default async function VibeSensePage({
  params,
}: VibeSensePageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
