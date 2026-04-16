/**
 * Admin Layout
 * Layout for admin pages with navigation
 */

export const dynamic = "force-dynamic";

import { redirect } from "next-vibe-ui/lib/redirect";
import { PageLayout } from "next-vibe-ui/ui/page-layout";
import type React from "react";
import type { ReactNode } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { UserGetResponseOutput } from "@/app/api/[locale]/users/user/[id]/definition";
import { UserByIdRepository } from "@/app/api/[locale]/users/user/[id]/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import { AdminLayoutClient } from "./_components/admin-layout-client";

export interface AdminLayoutData {
  locale: CountryLanguage;
  user: JwtPayloadType;
  userData: UserGetResponseOutput;
  children?: ReactNode;
}

export async function tanstackLoader({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Omit<AdminLayoutData, "children">> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const minimalUser = await requireAdminUser(locale, `/${locale}/admin`);
  const userResponse = await UserByIdRepository.getUserById(
    { id: minimalUser.id },
    minimalUser,
    logger,
    locale,
  );

  if (!userResponse.success) {
    logger.error("Failed to get user data", {
      userId: minimalUser.id,
      error: userResponse.message,
    });
    redirect(`/${locale}/threads`);
  }

  return { locale, user: minimalUser, userData: userResponse.data };
}

export function TanstackPage({
  locale,
  user,
  userData,
  children,
}: AdminLayoutData): React.JSX.Element {
  return (
    <PageLayout scrollable={true}>
      <AdminLayoutClient locale={locale} user={user} userData={userData}>
        {children}
      </AdminLayoutClient>
    </PageLayout>
  );
}

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<React.JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data}>{children}</TanstackPage>;
}
