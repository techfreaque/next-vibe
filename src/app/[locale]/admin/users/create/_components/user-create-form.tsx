/**
 * User Create Form Component
 * Form for creating new users with proper validation and error handling
 */

"use client";

import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Span } from "next-vibe-ui/ui/span";
import { Div } from "next-vibe-ui/ui/div";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import React from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { UserRoleOptions } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { useUsersCreateEndpoint } from "@/app/api/[locale]/v1/core/users/create/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UserCreateFormProps {
  locale: CountryLanguage;
}

export function UserCreateForm({
  locale,
}: UserCreateFormProps): React.JSX.Element {
  const router = useRouter();
  const { t } = simpleT(locale);

  // Get endpoint for form handling
  const logger = createEndpointLogger(false, Date.now(), locale);
  const endpoint = useUsersCreateEndpoint(logger);

  const handleSubmit = endpoint.create.onSubmit;
  const isSaving = endpoint.create.isSubmitting;

  // Handle successful creation
  React.useEffect(() => {
    if (endpoint.create.response?.success) {
      router.push(`/${locale}/admin/users/list`);
    }
  }, [endpoint.create.response?.success, router, locale]);

  const handleBack = (): void => {
    router.push(`/${locale}/admin/users/list`);
  };

  return (
    <Div className="space-y-6">
      {/* Action Buttons */}
      <Div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <Span>{t("app.admin.users.form.buttons.back")}</Span>
        </Button>
      </Div>

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Span>{t("app.admin.users.form.buttons.create")}</Span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={endpoint.create.form}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <FormFieldGroup>
              <EndpointFormField
                name="basicInfo.email"
                config={{
                  type: "email",
                  label: "app.api.v1.core.users.create.post.email.label",
                  description:
                    "app.api.v1.core.users.create.post.email.description",
                  placeholder: "app.api.v1.core.users.create.post.email.label",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="basicInfo.password"
                config={{
                  type: "password",
                  label: "app.api.v1.core.users.create.post.password.label",
                  description:
                    "app.api.v1.core.users.create.post.password.description",
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
                  label: "app.api.v1.core.users.create.post.privateName.label",
                  description:
                    "app.api.v1.core.users.create.post.privateName.description",
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
                  label: "app.api.v1.core.users.create.post.publicName.label",
                  description:
                    "app.api.v1.core.users.create.post.publicName.description",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="adminSettings.roles"
                config={{
                  type: "multiselect",
                  label: "app.api.v1.core.users.create.post.roles.label",
                  description:
                    "app.api.v1.core.users.create.post.roles.description",
                  options: UserRoleOptions,
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
                  label: "app.api.v1.core.users.create.post.isActive.label",
                  description:
                    "app.api.v1.core.users.create.post.isActive.description",
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
                    "app.api.v1.core.users.create.post.emailVerified.label",
                  description:
                    "app.api.v1.core.users.create.post.emailVerified.description",
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
                  label: "app.api.v1.core.users.create.post.leadId.label",
                  description:
                    "app.api.v1.core.users.create.post.leadId.description",
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
            <Div className="flex justify-end space-x-4">
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
                  : t("app.admin.users.form.buttons.create")}
              </Button>
            </Div>
          </Form>
        </CardContent>
      </Card>
    </Div>
  );
}
