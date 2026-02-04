/**
 * User Create Page
 * Server-side page with client-side form management
 */

import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import { UserCreateForm } from "@/app/api/[locale]/users/create/_components/user-create-form";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
  const { t } = simpleT(locale);

  // Require admin user authentication
  const user = await requireAdminUser(locale, `/${locale}/admin/users/create`);

  return (
    <Div className="container mx-auto py-6 flex flex-col gap-6">
      {/* Header */}
      <Div>
        <H1 className="text-3xl font-bold tracking-tight">
          {t("app.admin.users.actions.addUser")}
        </H1>
        <P className="text-muted-foreground mt-2">
          {t("app.admin.users.create.description")}
        </P>
      </Div>

      {/* Create Form */}
      <UserCreateForm locale={locale} user={user} />
    </Div>
  );
}
