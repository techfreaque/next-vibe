/**
 * Admin Layout
 * Layout for admin pages with navigation
 */

import { PageLayout } from "next-vibe-ui/ui/page-layout";
import { redirect } from "next-vibe-ui/lib/redirect";
import type React from "react";
import type { ReactNode } from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import { userByIdRepository } from "@/app/api/[locale]/users/user/[id]/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminLayoutClient } from "./_components/admin-layout-client";

interface AdminLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const logger = createEndpointLogger(true, Date.now(), locale);

  const minimalUser = await requireAdminUser(locale, `/${locale}/admin`);
  const userResponse = await userByIdRepository.getUserById(
    { id: minimalUser.id },
    minimalUser,
    logger,
  );

  if (!userResponse.success) {
    redirect(`/${locale}/`);
  }

  return (
    <PageLayout scrollable={true}>
      <AdminLayoutClient locale={locale} user={userResponse.data}>
        {children}
      </AdminLayoutClient>
    </PageLayout>
  );
}
