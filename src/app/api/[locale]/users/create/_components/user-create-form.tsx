/**
 * User Create Form Component
 * Form for creating new users with proper validation and error handling
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks/use-navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import { ArrowLeft, Save } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import userCreateDefinitions from "@/app/api/[locale]/users/create/definition";
import { useUsersCreateEndpoint } from "@/app/api/[locale]/users/create/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UserCreateFormProps {
  locale: CountryLanguage;
}

export function UserCreateForm({ locale }: UserCreateFormProps): React.JSX.Element {
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
    <Div className="flex flex-col gap-6">
      {/* Action Buttons */}
      <Div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack} className="flex items-center flex-row gap-2">
          <ArrowLeft className="h-4 w-4" />
          <Span>{t("app.admin.users.form.buttons.back")}</Span>
        </Button>
      </Div>

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center flex-row gap-2">
            <Span>{t("app.admin.users.form.buttons.create")}</Span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form form={endpoint.create.form} onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FormFieldGroup>
              <EndpointFormField
                name="basicInfo.email"
                control={endpoint.create.form.control}
                endpoint={userCreateDefinitions.POST}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                name="basicInfo.password"
                control={endpoint.create.form.control}
                endpoint={userCreateDefinitions.POST}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                name="basicInfo.privateName"
                control={endpoint.create.form.control}
                endpoint={userCreateDefinitions.POST}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                name="basicInfo.publicName"
                control={endpoint.create.form.control}
                endpoint={userCreateDefinitions.POST}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                name="adminSettings.roles"
                control={endpoint.create.form.control}
                endpoint={userCreateDefinitions.POST}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                name="adminSettings.isActive"
                control={endpoint.create.form.control}
                endpoint={userCreateDefinitions.POST}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                name="adminSettings.emailVerified"
                control={endpoint.create.form.control}
                endpoint={userCreateDefinitions.POST}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />

              <EndpointFormField
                name="adminSettings.leadId"
                control={endpoint.create.form.control}
                endpoint={userCreateDefinitions.POST}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
                locale={locale}
              />
            </FormFieldGroup>

            <FormAlert alert={endpoint.alert} />

            {/* Submit Button */}
            <Div className="flex justify-end flex-row gap-4">
              <Button type="button" variant="outline" onClick={handleBack} disabled={isSaving}>
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
