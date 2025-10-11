/**
 * User Create Form Component
 * Form for creating new users with proper validation and error handling
 */

"use client";

import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import React from "react";

import { userCreateSchema } from "@/app/api/[locale]/v1/core/users/create/definition";
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
  const endpoint = useUsersCreateEndpoint();

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
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("common.actions.back")}</span>
        </Button>
      </div>

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{t("users.form.buttons.create")}</span>
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
                name="email"
                config={{
                  type: "email",
                  label: "users.form.labels.email",
                  placeholder: "users.form.placeholders.email",
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="password"
                config={{
                  type: "password",
                  label: "users.form.labels.password",
                  placeholder: "users.form.placeholders.password",
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="firstName"
                config={{
                  type: "text",
                  label: "users.form.labels.firstName",
                  placeholder: "users.form.placeholders.firstName",
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="lastName"
                config={{
                  type: "text",
                  label: "users.form.labels.lastName",
                  placeholder: "users.form.placeholders.lastName",
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="company"
                config={{
                  type: "text",
                  label: "users.form.labels.company",
                  placeholder: "users.form.placeholders.company",
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="phone"
                config={{
                  type: "tel",
                  label: "users.form.labels.phone",
                  placeholder: "users.form.placeholders.phone",
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="jobTitle"
                config={{
                  type: "text",
                  label: "users.form.labels.jobTitle",
                  placeholder: "users.form.placeholders.jobTitle",
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="website"
                config={{
                  type: "url",
                  label: "users.form.labels.website",
                  placeholder: "users.form.placeholders.website",
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="bio"
                config={{
                  type: "textarea",
                  label: "users.form.labels.bio",
                  placeholder: "users.form.placeholders.bio",
                  rows: 4,
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="isActive"
                config={{
                  type: "checkbox",
                  label: "users.form.labels.isActive",
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="emailVerified"
                config={{
                  type: "checkbox",
                  label: "users.form.labels.emailVerified",
                }}
                control={endpoint.create.form.control}
                schema={userCreateSchema}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </FormFieldGroup>

            <FormAlert alert={endpoint.alert} />

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSaving}
              >
                {t("users.form.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving
                  ? t("users.form.buttons.saving")
                  : t("users.form.buttons.create")}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
