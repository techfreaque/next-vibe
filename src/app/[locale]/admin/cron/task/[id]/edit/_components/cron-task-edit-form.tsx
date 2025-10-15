"use client";

/**
 * Cron Task Edit Form Component
 * Form for editing cron task details
 */

import { Form, FormAlert } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import type React from "react";

import type definitions from "@/app/api/[locale]/v1/core/system/tasks/cron/task/[id]/definition";
import type { IndividualCronTaskType } from "@/app/api/[locale]/v1/core/system/tasks/cron/task/[id]/definition";
import { formatCronSchedule } from "@/app/api/[locale]/v1/core/system/tasks/cron-formatter";
import {
  CronTaskPriority,
  CronTaskPriorityOptions,
} from "@/app/api/[locale]/v1/core/system/tasks/enum";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { getDefaultTimezone } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import { ScheduleAutocomplete } from "./schedule-autocomplete";

interface CronTaskEditFormProps {
  task: IndividualCronTaskType;
  endpoint: EndpointReturn<typeof definitions>;
  locale: CountryLanguage;
}

export function CronTaskEditForm({
  task,
  endpoint,
  locale,
}: CronTaskEditFormProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const userTimezone = getDefaultTimezone(locale);

  const handleSubmit = endpoint.create?.onSubmit;
  const isLoading = endpoint.read?.isLoading;
  const isSaving = endpoint.create?.isSubmitting;

  return (
    <div className="space-y-6">
      {/* Task Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.dashboard.cron.taskDetails.info")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("admin.dashboard.cron.taskDetails.id")}
            </label>
            <p className="text-sm font-mono">{task.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("admin.dashboard.cron.taskDetails.version")}
            </label>
            <p className="text-sm">{task.version}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("admin.dashboard.cron.taskDetails.createdAt")}
            </label>
            <p className="text-sm">
              {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("admin.dashboard.cron.taskDetails.updatedAt")}
            </label>
            <p className="text-sm">
              {new Date(task.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("admin.dashboard.cron.taskDetails.scheduling")}
            </label>
            <p className="text-sm">
              {formatCronSchedule(task.schedule, userTimezone, locale)}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {task.schedule}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.dashboard.cron.taskDetails.edit")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={endpoint.create?.form}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <FormFieldGroup
              title={"admin.dashboard.cron.taskDetails.basicInfo"}
              description={
                "admin.dashboard.cron.taskDetails.basicInfoDescription"
              }
            >
              <div className="grid grid-cols-1 gap-4">
                <EndpointFormField
                  name="name"
                  config={{
                    type: "text",
                    label: "admin.dashboard.cron.taskDetails.name",
                    placeholder:
                      "admin.dashboard.cron.taskDetails.namePlaceholder",
                  }}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="description"
                  config={{
                    type: "textarea",
                    label: "admin.dashboard.cron.taskDetails.description",
                    placeholder:
                      "admin.dashboard.cron.taskDetails.descriptionPlaceholder",
                    rows: 3,
                  }}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
            </FormFieldGroup>

            <FormFieldGroup
              title={"admin.dashboard.cron.taskDetails.scheduling"}
              description={
                "admin.dashboard.cron.taskDetails.schedulingDescription"
              }
            >
              <ScheduleAutocomplete
                value={endpoint.create?.form.watch("schedule")}
                onChange={(value) =>
                  endpoint.create?.form.setValue("schedule", value)
                }
                onBlur={() => endpoint.create?.form.trigger("schedule")}
                placeholder={t(
                  "admin.dashboard.cron.taskDetails.schedulePlaceholder",
                )}
                searchPlaceholder={t(
                  "admin.dashboard.cron.taskDetails.searchSchedule",
                )}
                allowCustom={true}
                locale={locale}
              />
            </FormFieldGroup>

            <FormFieldGroup
              title={"admin.dashboard.cron.taskDetails.configuration"}
              description={
                "admin.dashboard.cron.taskDetails.configurationDescription"
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EndpointFormField
                  name="enabled"
                  config={{
                    type: "switch",
                    label: "admin.dashboard.cron.taskDetails.enabled",
                    description:
                      "admin.dashboard.cron.taskDetails.enabledDescription",
                  }}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="priority"
                  config={{
                    type: "select",
                    label: "admin.dashboard.cron.taskDetails.priority",
                    placeholder:
                      "admin.dashboard.cron.taskDetails.priorityPlaceholder",
                    options: CronTaskPriorityOptions,
                  }}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="timeout"
                  config={{
                    type: "text",
                    label: "admin.dashboard.cron.taskDetails.timeout",
                    placeholder:
                      "admin.dashboard.cron.taskDetails.timeoutPlaceholder",
                  }}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="retries"
                  config={{
                    type: "text",
                    label: "admin.dashboard.cron.taskDetails.retries",
                    placeholder:
                      "admin.dashboard.cron.taskDetails.retriesPlaceholder",
                  }}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
            </FormFieldGroup>

            {/* Form Alert for errors and success */}
            <FormAlert alert={endpoint.alert} />

            {/* Submit Button */}
            <Button type="submit" disabled={isSaving} className="w-full">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t("admin.dashboard.cron.taskDetails.saving")}
                </>
              ) : (
                t("admin.dashboard.cron.taskDetails.save")
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
