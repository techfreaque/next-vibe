"use client";

/**
 * Consultation Edit Form Component
 * Form for editing consultation details
 */

import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import type React from "react";

import type { ConsultationGetResponseTypeOutput } from "@/app/api/[locale]/v1/core/consultation/admin/consultation/[id]/definition";
import type { ConsultationUpdateEndpointReturn } from "@/app/api/[locale]/v1/core/consultation/admin/hooks";
import { ConsultationStatus } from "@/app/api/[locale]/v1/core/consultation/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ConsultationEditFormProps {
  consultation: ConsultationGetResponseTypeOutput;
  updateEndpoint: ConsultationUpdateEndpointReturn;
  locale: CountryLanguage;
}

export function ConsultationEditForm({
  consultation,
  updateEndpoint,
  locale,
}: ConsultationEditFormProps): React.JSX.Element {
  const { t } = simpleT(locale);

  // Status options for the dropdown
  const statusOptions = [
    {
      value: ConsultationStatus.PENDING,
      label: "consultations.admin.stats.pending" as const,
    },
    {
      value: ConsultationStatus.SCHEDULED,
      label: "consultations.admin.stats.scheduled" as const,
    },
    {
      value: ConsultationStatus.CONFIRMED,
      label: "consultations.admin.stats.confirmed" as const,
    },
    {
      value: ConsultationStatus.COMPLETED,
      label: "consultations.admin.stats.completed" as const,
    },
    {
      value: ConsultationStatus.CANCELLED,
      label: "consultations.admin.stats.cancelled" as const,
    },
    {
      value: ConsultationStatus.NO_SHOW,
      label: "consultations.admin.stats.noShow" as const,
    },
  ];

  const handleSubmit = updateEndpoint.create.onSubmit;
  const isLoading = updateEndpoint.create.isSubmitting;

  return (
    <div className="space-y-6">
      {/* User Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>{t("consultations.admin.list.table.user")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("consultations.admin.list.filters.userEmail")}
            </label>
            <p className="text-sm">{consultation.userEmail}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("consultations.admin.list.table.user")}
            </label>
            <p className="text-sm">
              {consultation.userName ||
                t("consultations.admin.list.table.noResults")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("consultations.admin.list.table.businessType")}
            </label>
            <p className="text-sm">{consultation.userBusinessType || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("consultations.admin.calendar.event.user")}
            </label>
            <p className="text-sm">{consultation.userContactPhone || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("consultations.admin.list.table.message")}
            </label>
            <p className="text-sm">{consultation.message || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("consultations.admin.list.table.preferredDate")}
            </label>
            <p className="text-sm">
              {consultation.preferredDate
                ? new Date(
                    String(consultation.preferredDate),
                  ).toLocaleDateString(locale)
                : "-"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("consultations.admin.calendar.event.time")}
            </label>
            <p className="text-sm">{consultation.preferredTime || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t("consultations.admin.list.table.edit")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={updateEndpoint.create.form}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <FormFieldGroup
              title={"consultations.admin.list.table.edit"}
              description={"consultations.admin.list.title"}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EndpointFormField
                  name="status"
                  config={{
                    type: "select",
                    label: "consultations.admin.list.table.status",
                    placeholder: "consultations.admin.list.filters.status",
                    options: statusOptions,
                  }}
                  control={updateEndpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="scheduledDate"
                  config={{
                    type: "date",
                    label: "consultations.admin.list.table.scheduledDate",
                    placeholder: "consultations.admin.list.filters.dateFrom",
                  }}
                  control={updateEndpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="scheduledTime"
                  config={{
                    type: "text",
                    label: "consultations.admin.calendar.event.time",
                    placeholder: "consultation.scheduler.time.placeholder",
                  }}
                  control={updateEndpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="meetingLink"
                  config={{
                    type: "text",
                    label: "consultation.email.scheduled.meetingLink",
                    placeholder: "consultation.email.scheduled.joinMeeting",
                  }}
                  control={updateEndpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="calendarEventId"
                  config={{
                    type: "text",
                    label: "consultations.admin.calendar.event.status",
                    placeholder: "consultations.admin.list.filters.status",
                  }}
                  control={updateEndpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="isNotified"
                  config={{
                    type: "switch",
                    label: "consultations.admin.list.table.actions",
                    description: "consultations.admin.list.table.loading",
                  }}
                  control={updateEndpoint.create.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>

              <EndpointFormField
                name="message"
                config={{
                  type: "textarea",
                  label: "consultations.admin.list.table.message",
                  placeholder: "consultation.scheduler.challenges.placeholder",
                  rows: 4,
                }}
                control={updateEndpoint.create.form.control}
                theme={{
                  style: "none",
                  showAllRequired: false,
                }}
              />
            </FormFieldGroup>

            {/* Form Alert for errors and success */}
            <FormAlert alert={updateEndpoint.alert} />

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t("consultations.admin.list.table.loading")}
                </>
              ) : (
                t("consultations.admin.list.table.edit")
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
