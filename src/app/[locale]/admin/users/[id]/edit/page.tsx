/**
 * User Edit Page
 * Server-side initial data loading with client-side form management
 */

import { redirect } from "next-vibe-ui/lib/redirect";
import { Div } from "next-vibe-ui/ui/div";
import { H1, P } from "next-vibe-ui/ui/typography";
import type React from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { requireAdminUser } from "@/app/api/[locale]/user/auth/utils";
import { userByIdRepository } from "@/app/api/[locale]/users/user/[id]/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { UserEditForm } from "@/app/api/[locale]/users/user/_components/user-edit-form";

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


  // Fetch user data
  const logger = createEndpointLogger(false, Date.now(), locale);
  const userResponse = await userByIdRepository.getUserById(
    { id },
    user,
    logger,
  );

  // Handle user not found
  if (!userResponse.success) {
    redirect(`/${locale}/admin/users/list`);
  }

  return (
    <Div className="container mx-auto py-6 flex flex-col gap-6">
      {/* Header */}
      <Div>
        <H1 className="text-3xl font-bold tracking-tight">
          {t("app.admin.users.actions.editUser")}
        </H1>
        <P className="text-muted-foreground mt-2">
          {t("app.admin.users.overview.description")}
        </P>
      </Div>

      {/* Edit Form */}
      <UserEditForm locale={locale} userId={id} user={userResponse.data} />
    </Div>
  );
}
