/**
 * User Edit Form Component
 * Form for editing existing users with proper validation and error handling
 */

"use client";

import { ArrowLeft, Save } from "next-vibe-ui/ui/icons";
import { Form } from "next-vibe-ui/ui/form/form";
import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import type React from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { UserGetResponseOutput } from "@/app/api/[locale]/v1/core/users/user/[id]/definition";
import { useUserByIdEndpoint } from "@/app/api/[locale]/v1/core/users/user/[id]/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UserEditFormProps {
  user: UserGetResponseOutput;
  locale: CountryLanguage;
  userId: string;
}

export function UserEditForm({
  user,
  locale,
  userId,
}: UserEditFormProps): React.JSX.Element {
  const router = useRouter();
  const { t } = simpleT(locale);

  // Get endpoint for form handling
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useUserByIdEndpoint(
    {
      userId,
      enabled: true,
    },
    logger,
  );

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;

  const handleBack = (): void => {
    router.push(`/${locale}/admin/users/list`);
  };

  if (isLoading) {
    return <Div>{t("app.admin.common.loading")}</Div>;
  }

  return (
    <Div className="flex flex-col gap-6">
      {/* Action Buttons */}
      <Div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center flex flex-row gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <Span>{t("app.admin.common.actions.back")}</Span>
        </Button>
      </Div>

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center flex flex-row gap-2">
            <Span>{t("app.admin.users.actions.editUser")}</Span>
            <Span className="text-lg font-normal text-gray-500">
              - {user.email}
            </Span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={endpoint.create.form}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <FormFieldGroup>
              <EndpointFormField
                name="basicInfo.email"
                config={{
                  type: "email",
                  label: "app.api.v1.core.users.user.id.id.put.email.label",
                  description:
                    "app.api.v1.core.users.user.id.id.put.email.description",
                  placeholder:
                    "app.api.v1.core.users.user.id.id.put.email.placeholder",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="basicInfo.privateName"
                config={{
                  type: "text",
                  label:
                    "app.api.v1.core.users.user.id.id.put.privateName.label",
                  description:
                    "app.api.v1.core.users.user.id.id.put.privateName.description",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="basicInfo.publicName"
                config={{
                  type: "text",
                  label:
                    "app.api.v1.core.users.user.id.id.put.publicName.label",
                  description:
                    "app.api.v1.core.users.user.id.id.put.publicName.description",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="adminSettings.isActive"
                config={{
                  type: "checkbox",
                  label: "app.api.v1.core.users.user.id.id.put.isActive.label",
                  description:
                    "app.api.v1.core.users.user.id.id.put.isActive.description",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="adminSettings.emailVerified"
                config={{
                  type: "checkbox",
                  label:
                    "app.api.v1.core.users.user.id.id.put.emailVerified.label",
                  description:
                    "app.api.v1.core.users.user.id.id.put.emailVerified.description",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="adminSettings.leadId"
                config={{
                  type: "text",
                  label: "app.api.v1.core.users.user.id.id.put.leadId.label",
                  description:
                    "app.api.v1.core.users.user.id.id.put.leadId.description",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </FormFieldGroup>

            <FormAlert alert={endpoint.alert} />

            {/* Submit Button */}
            <Div className="flex justify-end flex flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSaving}
              >
                {t("app.admin.users.form.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving
                  ? t("app.admin.users.form.buttons.saving")
                  : t("app.admin.users.form.buttons.update")}
              </Button>
            </Div>
          </Form>
        </CardContent>
      </Card>
    </Div>
  );
}
