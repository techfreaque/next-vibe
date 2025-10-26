/**
 * User Edit Page
 * Server-side initial data loading with client-side form management
 */

import { redirect } from "next/navigation";
import type React from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { requireAdminUser } from "@/app/api/[locale]/v1/core/user/auth/utils";
import { userByIdRepository } from "@/app/api/[locale]/v1/core/users/user/[id]/repository";
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
  const user = await requireAdminUser(
    locale,
    `/${locale}/admin/users/${id}/edit`,
  );

  // Validate user has leadId (required for JWT payload)
  if (!user.leadId) {
    redirect(`/${locale}/admin/users/list`);
  }

  // Extract JWT payload from complete user
  const jwtPayload = {
    id: user.id,
    leadId: user.leadId,
    isPublic: false as const,
  };

  // Fetch user data
  const logger = createEndpointLogger(false, Date.now(), locale);
  const userResponse = await userByIdRepository.getUserById(
    { id },
    jwtPayload,
    locale,
    logger,
  );

  // Handle user not found
  if (!userResponse.success) {
    redirect(`/${locale}/admin/users/list`);
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("app.admin.users.actions.editUser")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("app.admin.users.overview.description")}
        </p>
      </div>

      {/* Edit Form */}
      <UserEditForm locale={locale} userId={id} user={userResponse.data} />
    </div>
  );
}
