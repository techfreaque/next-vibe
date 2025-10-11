/**
 * Admin Streaming Layout
 * Shared layout for all admin streaming pages with navigation
 */

import type React from "react";
import type { ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminStreamingLayoutClient } from "./_components/admin-streaming-layout-client";

interface AdminStreamingLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function AdminStreamingLayout({
  children,
  params,
}: AdminStreamingLayoutProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  // Require admin authentication
  await requireAdminUser(locale, `/${locale}/admin/streaming`);

  return (
    <AdminStreamingLayoutClient locale={locale}>
      {children}
    </AdminStreamingLayoutClient>
  );
}
