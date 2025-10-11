"use client";

/**
 * Admin Consultation Form Component
 * Main form for creating consultations from admin panel with expanded fields
 */

import { useRouter } from "next/navigation";
import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import type React from "react";
import { useCallback } from "react";

import { consultationCreateRequestSchema } from "@/app/api/[locale]/v1/core/consultation/admin/consultation/new/definition";
import {
  ConsultationPriority,
  SelectionType,
  type SelectionTypeValue,
} from "@/app/api/[locale]/v1/core/consultation/admin/consultation/new/enum";
import { useAdminConsultationCreateEndpoint } from "@/app/api/[locale]/v1/core/consultation/admin/consultation/new/hooks";
import { ConsultationStatus } from "@/app/api/[locale]/v1/core/consultation/enum";
import { Countries, type CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { ConsultationEmailPreview } from "./consultation-email-preview";
import { ConsultationMessageInput } from "./consultation-message-input";
import { UserLeadSelector } from "./user-lead-selector";

interface AdminConsultationFormProps {
  locale: CountryLanguage;
}

export function AdminConsultationForm({
  locale,
}: AdminConsultationFormProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();

  // Get endpoint for form handling
  const endpoint = useAdminConsultationCreateEndpoint({
    enabled: true,
    defaultValues: {
      selectionType: SelectionType.CREATE_NEW_LEAD,
      status: ConsultationStatus.PENDING,
      priority: ConsultationPriority.NORMAL,
    },
    onSuccess: () => {
      router.push(`/${locale}/admin/consultations/list`);
    },
  });

  const handleBack = (): void => {
    router.push(`/${locale}/admin/consultations/list`);
  };

  // Watch selection type to show/hide fields
  const selectionType: SelectionTypeValue =
    endpoint.create.form.watch("selectionType") ||
    SelectionType.CREATE_NEW_LEAD;
  const showContactFields = selectionType === SelectionType.CREATE_NEW_LEAD;

  // Memoized onChange callback to prevent infinite rerenders
  const handleUserLeadSelectorChange = useCallback(
    (value: {
      selectionType: SelectionTypeValue;
      userId?: string;
      leadId?: string;
    }) => {
      endpoint.create.form.setValue(
        "selectionType",
        value.selectionType || SelectionType.CREATE_NEW_LEAD,
      );
      endpoint.create.form.setValue("userId", value.userId);
      endpoint.create.form.setValue("leadId", value.leadId);
    },
    [endpoint.create.form],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {t("consultations.admin.create.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("consultations.admin.create.description")}
          </p>
        </div>
        <Button onClick={handleBack} variant="outline">
          {t("consultations.admin.actions.back")}
        </Button>
      </div>

      {/* Form */}
      <Form
        form={endpoint.create.form}
        onSubmit={endpoint.create.onSubmit}
        className="space-y-6"
      >
        {/* Selection Type */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("consultations.admin.form.selection.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserLeadSelector
              locale={locale}
              value={{
                selectionType:
                  endpoint.create.form.watch("selectionType") ||
                  SelectionType.CREATE_NEW_LEAD,
                userId: endpoint.create.form.watch("userId") || undefined,
                leadId: endpoint.create.form.watch("leadId") || undefined,
              }}
              onChange={handleUserLeadSelectorChange}
            />
          </CardContent>
        </Card>

        {/* Contact Information - Only show for new consultations */}
        {showContactFields && (
          <Card>
            <CardHeader>
              <CardTitle>
                {t("consultations.admin.form.contact.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormFieldGroup
                title={"consultations.admin.form.contact.basic"}
                description={
                  "consultations.admin.form.contact.basicDescription"
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EndpointFormField
                    name="name"
                    config={{
                      type: "text",
                      label: "consultations.admin.form.name.label",
                      placeholder: "consultations.admin.form.name.placeholder",
                    }}
                    schema={consultationCreateRequestSchema}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />

                  <EndpointFormField
                    name="email"
                    config={{
                      type: "email",
                      label: "consultations.admin.form.email.label",
                      placeholder: "consultations.admin.form.email.placeholder",
                    }}
                    schema={consultationCreateRequestSchema}
                    control={endpoint.create.form.control}
                    theme={{
                      style: "none",
                      showAllRequired: false,
                    }}
                  />
                </div>

                <EndpointFormField
                  name="phone"
                  config={{
                    type: "tel",
                    label: "consultations.admin.form.phone.label",
                    placeholder: "consultations.admin.form.phone.placeholder",
                  }}
                  schema={consultationCreateRequestSchema}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </FormFieldGroup>
            </CardContent>
          </Card>
        )}

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("consultations.admin.form.business.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormFieldGroup
              title={"consultations.admin.form.business.details"}
              description={
                "consultations.admin.form.business.detailsDescription"
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EndpointFormField
                  name="businessType"
                  config={{
                    type: "text",
                    label: "consultations.admin.form.businessType.label",
                    placeholder:
                      "consultations.admin.form.businessType.placeholder",
                  }}
                  schema={consultationCreateRequestSchema}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="businessName"
                  config={{
                    type: "text",
                    label: "consultations.admin.form.businessName.label",
                    placeholder:
                      "consultations.admin.form.businessName.placeholder",
                  }}
                  schema={consultationCreateRequestSchema}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>

              <EndpointFormField
                name="website"
                config={{
                  type: "url",
                  label: "consultations.admin.form.website.label",
                  placeholder: "consultations.admin.form.website.placeholder",
                }}
                schema={consultationCreateRequestSchema}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EndpointFormField
                  name="country"
                  config={{
                    type: "select",
                    label: "consultations.admin.form.country.label",
                    placeholder: "consultations.admin.form.country.placeholder",
                    options: Object.values(Countries).map((country) => ({
                      value: country as const,
                      label:
                        `consultations.admin.form.country.options.${country}` as const,
                    })),
                  }}
                  schema={consultationCreateRequestSchema}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="language"
                  config={{
                    type: "select",
                    label: "consultations.admin.form.name.label",
                    placeholder: "consultations.admin.form.name.placeholder",
                    options: [
                      {
                        value: "en",
                        label: "consultations.admin.form.country.options.US",
                      },
                      {
                        value: "de",
                        label: "consultations.admin.form.country.options.DE",
                      },
                      {
                        value: "pl",
                        label: "consultations.admin.form.country.options.PL",
                      },
                    ],
                  }}
                  schema={consultationCreateRequestSchema}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="city"
                  config={{
                    type: "text",
                    label: "consultations.admin.form.city.label",
                    placeholder: "consultations.admin.form.city.placeholder",
                  }}
                  schema={consultationCreateRequestSchema}
                  control={endpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
            </FormFieldGroup>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card>
          <CardHeader>
            <CardTitle>{t("consultations.admin.form.name.label")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ConsultationMessageInput
              message={endpoint.create.form.watch("message") || ""}
              onMessageChange={(message) => {
                endpoint.create.form.setValue("message", message);
              }}
              disabled={endpoint.create.isSubmitting}
              locale={locale}
            />
          </CardContent>
        </Card>

        {/* Email Preview */}
        <ConsultationEmailPreview
          locale={locale}
          consultationData={{
            name: endpoint.create.form.watch("name"),
            email: endpoint.create.form.watch("email"),
            businessName: endpoint.create.form.watch("businessName"),
            businessType: endpoint.create.form.watch("businessType"),
            message: endpoint.create.form.watch("message"),
          }}
        />

        <FormAlert alert={endpoint.alert} />

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={endpoint.create.isSubmitting}
          >
            {t("consultations.admin.actions.cancel")}
          </Button>
          <Button type="submit" disabled={endpoint.create.isSubmitting}>
            {endpoint.create.isSubmitting
              ? t("consultations.admin.actions.creating")
              : t("consultations.admin.actions.create")}
          </Button>
        </div>
      </Form>
    </div>
  );
}
