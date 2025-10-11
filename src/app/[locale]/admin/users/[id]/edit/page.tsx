/**
 * User Edit Page
 * Server-side initial data loading with client-side form management
 */

import { redirect } from "next/navigation";
import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import { usersRepository } from "@/app/api/[locale]/v1/core/users/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UserEditForm } from "./_components/user-edit-form";

interface UserEditPageProps {
  params: Promise<{
    locale: CountryLanguage;
    id: string;
  }>;
}

export default async function UserEditPage({
  params,
}: UserEditPageProps): Promise<React.JSX.Element> {
  const { locale, id } = await params;
  const { t } = simpleT(locale);

  // Require admin user authentication
  await requireAdminUser(locale, `/${locale}/admin/users/${id}/edit`);

  // Fetch user data
  const userResponse = await usersRepository.getUserById(id);

  // Handle user not found
  if (!userResponse.success) {
    redirect(`/${locale}/admin/users/list`);
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("users.admin.actions.editUser")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("users.admin.description")}
        </p>
      </div>

      {/* Edit Form */}
      <UserEditForm locale={locale} userId={id} user={userResponse.data} />
    </div>
  );
}
