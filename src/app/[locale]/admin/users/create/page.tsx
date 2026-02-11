/**
 * User Create Page
 * Server component for authentication
 */

import type { Metadata } from "next";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UserCreatePageClient } from "./page-client";

interface UserCreatePageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export async function generateMetadata({
  params,
}: UserCreatePageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  return {
    title: t("app.admin.users.actions.addUser"),
    description: t("app.admin.users.create.description"),
  };
}

export default async function UserCreatePage({
  params,
}: UserCreatePageProps): Promise<React.JSX.Element> {
  const { locale } = await params;

  // Require admin user authentication
  const user = await requireAdminUser(locale, `/${locale}/admin/users/create`);

  return <UserCreatePageClient locale={locale} user={user} />;
}
