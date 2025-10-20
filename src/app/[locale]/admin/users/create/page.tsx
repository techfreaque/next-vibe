/**
 * User Create Page
 * Server-side page with client-side form management
 */

import type { Metadata } from "next";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UserCreateForm } from "./_components/user-create-form";

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
    title: t("app.admin.users.users.admin.actions.addUser"),
    description: t("app.admin.users.users.create.description"),
  };
}

export default async function UserCreatePage({
  params,
}: UserCreatePageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  // Require admin user authentication
  await requireAdminUser(locale, `/${locale}/admin/users/create`);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("app.admin.users.users.admin.actions.addUser")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("app.admin.users.users.create.description")}
        </p>
      </div>

      {/* Create Form */}
      <UserCreateForm locale={locale} />
    </div>
  );
}
