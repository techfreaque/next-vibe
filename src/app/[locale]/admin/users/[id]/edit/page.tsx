/**
 * User Edit Page
 * Server component for authentication
 */

import type React from "react";

import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserEditPageClient } from "./page-client";

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

  // Require admin user authentication
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/users/${id}/edit`,
  );

  return <UserEditPageClient locale={locale} user={user} userId={id} />;
}
