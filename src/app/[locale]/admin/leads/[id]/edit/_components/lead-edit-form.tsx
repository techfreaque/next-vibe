/**
 * Lead Edit Form Component
 * Handles lead editing with proper form validation and field handling
 */

"use client";

import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import type React from "react";
import type { JSX } from "react";

import type { LeadDetailResponse } from "@/app/api/[locale]/v1/core/leads/definition";
import {
  EmailCampaignStage,
  LeadStatus,
} from "@/app/api/[locale]/v1/core/leads/enum";
import { useLeadByIdEndpoint } from "@/app/api/[locale]/v1/core/leads/lead/[id]/hooks";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";
import { Countries } from "@/i18n/core/config";

interface LeadEditFormProps {
  lead: LeadDetailResponse;
  locale: CountryLanguage;
  leadId: string;
}

export function LeadEditForm({
  lead,
  locale,
  leadId,
}: LeadEditFormProps): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Get endpoint for form handling following cron pattern
  const endpoint = useLeadByIdEndpoint(logger, {
    leadId,
    enabled: true,
  });

  const handleSubmit = endpoint.create.onSubmit;
  const isLoading = endpoint.read.isLoading;
  const isSaving = endpoint.create.isSubmitting;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("app.admin.leads.leads.edit.form.actions.back")}
          </Button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{leadId}</div>
      </div>

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Edit Lead</span>
            <span className="text-lg font-normal text-gray-500">
              - {lead.lead.basicInfo.businessName}
            </span>
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
                name="updates.basicInfo.email"
                config={{
                  type: "email",
                  label: "app.admin.leads.leads.edit.form.fields.email.label",
                  placeholder:
                    "app.admin.leads.leads.edit.form.fields.email.placeholder",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="updates.basicInfo.businessName"
                config={{
                  type: "text",
                  label:
                    "app.admin.leads.leads.edit.form.fields.businessName.label",
                  placeholder:
                    "app.admin.leads.leads.edit.form.fields.businessName.placeholder",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="updates.basicInfo.contactName"
                config={{
                  type: "text",
                  label:
                    "app.admin.leads.leads.edit.form.fields.contactName.label",
                  placeholder:
                    "app.admin.leads.leads.edit.form.fields.contactName.placeholder",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="updates.contactDetails.phone"
                config={{
                  type: "tel",
                  label: "app.admin.leads.leads.edit.form.fields.phone.label",
                  placeholder:
                    "app.admin.leads.leads.edit.form.fields.phone.placeholder",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="updates.contactDetails.website"
                config={{
                  type: "url",
                  label: "app.admin.leads.leads.edit.form.fields.website.label",
                  placeholder:
                    "app.admin.leads.leads.edit.form.fields.website.placeholder",
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="updates.contactDetails.country"
                config={{
                  type: "select",
                  label: "app.admin.leads.leads.edit.form.fields.country.label",
                  placeholder:
                    "app.admin.leads.leads.edit.form.fields.country.placeholder",
                  options: [
                    {
                      value: Countries.GLOBAL,
                      label: "app.common.countries.global",
                    },
                    { value: Countries.DE, label: "app.common.countries.de" },
                    { value: Countries.PL, label: "app.common.countries.pl" },
                  ],
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="updates.contactDetails.language"
                config={{
                  type: "select",
                  label:
                    "app.admin.leads.leads.edit.form.fields.language.label",
                  placeholder:
                    "app.admin.leads.leads.edit.form.fields.language.placeholder",
                  options: [
                    { value: "en", label: "app.common.languages.en" },
                    { value: "de", label: "app.common.languages.de" },
                    { value: "pl", label: "app.common.languages.pl" },
                  ],
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="updates.basicInfo.status"
                config={{
                  type: "select",
                  label: "app.admin.leads.leads.edit.form.fields.status.label",
                  placeholder:
                    "app.admin.leads.leads.edit.form.fields.status.placeholder",
                  options: [
                    {
                      value: LeadStatus.NEW,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.new",
                    },
                    {
                      value: LeadStatus.PENDING,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.pending",
                    },
                    {
                      value: LeadStatus.CAMPAIGN_RUNNING,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.campaign_running",
                    },
                    {
                      value: LeadStatus.WEBSITE_USER,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.website_user",
                    },
                    {
                      value: LeadStatus.NEWSLETTER_SUBSCRIBER,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.newsletter_subscriber",
                    },
                    {
                      value: LeadStatus.IN_CONTACT,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.in_contact",
                    },
                    {
                      value: LeadStatus.SIGNED_UP,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.signed_up",
                    },
                    {
                      value: LeadStatus.CONSULTATION_BOOKED,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.consultation_booked",
                    },
                    {
                      value: LeadStatus.SUBSCRIPTION_CONFIRMED,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.subscription_confirmed",
                    },
                    {
                      value: LeadStatus.UNSUBSCRIBED,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.unsubscribed",
                    },
                    {
                      value: LeadStatus.BOUNCED,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.bounced",
                    },
                    {
                      value: LeadStatus.INVALID,
                      label:
                        "app.admin.leads.leads.edit.form.fields.status.options.invalid",
                    },
                  ],
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              <EndpointFormField
                name="updates.campaignManagement.currentCampaignStage"
                config={{
                  type: "select",
                  label: "app.admin.leads.leads.edit.form.fields.status.label",
                  placeholder:
                    "app.admin.leads.leads.edit.form.fields.status.placeholder",
                  options: [
                    {
                      value: EmailCampaignStage.NOT_STARTED,
                      label: "app.admin.leads.leads.admin.stage.not_started",
                    },
                    {
                      value: EmailCampaignStage.INITIAL,
                      label: "app.admin.leads.leads.admin.stage.initial",
                    },
                    {
                      value: EmailCampaignStage.FOLLOWUP_1,
                      label: "app.admin.leads.leads.admin.stage.followup_1",
                    },
                    {
                      value: EmailCampaignStage.FOLLOWUP_2,
                      label: "app.admin.leads.leads.admin.stage.followup_2",
                    },
                    {
                      value: EmailCampaignStage.FOLLOWUP_3,
                      label: "app.admin.leads.leads.admin.stage.followup_3",
                    },
                    {
                      value: EmailCampaignStage.NURTURE,
                      label: "app.admin.leads.leads.admin.stage.nurture",
                    },
                    {
                      value: EmailCampaignStage.REACTIVATION,
                      label: "app.admin.leads.leads.admin.stage.reactivation",
                    },
                  ],
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />

              {/* User Selector for Converted User */}
              {/* TODO: Implement UserSelector component
              <div className="space-y-2">
                <UserSelector
                  locale={locale}
                  value={
                    endpoint.create.form?.watch("convertedUserId") || undefined
                  }
                  onChange={(userId: string | undefined) =>
                    endpoint.create.form?.setValue(
                      "convertedUserId",
                      userId || null,
                    )
                  }
                />
              </div>
              */}

              <EndpointFormField
                name="updates.additionalDetails.notes"
                config={{
                  type: "textarea",
                  label: "app.admin.leads.leads.edit.form.fields.notes.label",
                  placeholder:
                    "app.admin.leads.leads.edit.form.fields.notes.placeholder",
                  rows: 4,
                }}
                control={endpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </FormFieldGroup>
            <FormAlert alert={endpoint.alert} />

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t("app.admin.leads.leads.edit.form.actions.cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving
                  ? t("app.admin.leads.leads.edit.form.actions.saving")
                  : t("app.admin.leads.leads.edit.form.actions.save")}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
