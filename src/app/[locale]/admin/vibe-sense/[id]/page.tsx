/**
 * Vibe Sense - Graph Detail Page
 * Shows graph config, chart visualization, and management actions
 */

import type { JSX } from "react";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { VibeSenseDetailClient } from "./page-client";

interface VibeSenseDetailPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export interface VibeSenseDetailPageData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  id: string;
}

export async function tanstackLoader({
  params,
}: VibeSenseDetailPageProps): Promise<VibeSenseDetailPageData> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/vibe-sense/${id}`,
  );
  return { locale, user, id };
}

export function TanstackPage({
  locale,
  user,
  id,
}: VibeSenseDetailPageData): JSX.Element {
  return <VibeSenseDetailClient locale={locale} user={user} graphId={id} />;
}

export default async function VibeSenseDetailPage({
  params,
}: VibeSenseDetailPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
