/**
 * Vibe Sense — Graph Detail Page
 * Shows graph config, chart visualization, and management actions
 */

import type { JSX } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { VibeSenseDetailClient } from "./page-client";

interface VibeSenseDetailPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export default async function VibeSenseDetailPage({
  params,
}: VibeSenseDetailPageProps): Promise<JSX.Element> {
  const { locale, id } = await params;
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/vibe-sense/${id}`,
  );

  return <VibeSenseDetailClient locale={locale} user={user} graphId={id} />;
}
