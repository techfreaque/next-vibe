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

import type {
  endpoints,
  IndividualCronTaskType,
} from "@/app/api/[locale]/v1/core/system/tasks/cron/task/[id]/definition";
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
  endpoint: EndpointReturn<typeof endpoints>;
  locale: CountryLanguage;
}

export function CronTaskEditForm({
  task,
  endpoint,
  locale,
}: CronTaskEditFormProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const userTimezone = getDefaultTimezone(locale);

  const handleSubmit = endpoint.update?.onSubmit;
  const isLoading = endpoint.read?.isLoading;
  const isSaving = endpoint.update?.isSubmitting;

  return (
    <div className="space-y-6">
      {/* Task Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>{t("app.admin.cron.taskDetails.info")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("app.admin.cron.taskDetails.id")}
            </label>
            <p className="text-sm font-mono">{task.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("app.admin.cron.taskDetails.version")}
            </label>
            <p className="text-sm">{task.version}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("app.admin.cron.taskDetails.createdAt")}
            </label>
            <p className="text-sm">
              {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("app.admin.cron.taskDetails.updatedAt")}
            </label>
            <p className="text-sm">
              {new Date(task.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("app.admin.cron.taskDetails.scheduling")}
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
          <CardTitle>{t("app.admin.cron.taskDetails.edit")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={endpoint.update?.form}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <FormFieldGroup
              title={"app.admin.cron.taskDetails.basicInfo"}
              description={"app.admin.cron.taskDetails.basicInfoDescription"}
            >
              <div className="grid grid-cols-1 gap-4">
                <EndpointFormField
                  name="name"
                  config={{
                    type: "text",
                    label: "app.admin.cron.taskDetails.name",
                    placeholder: "app.admin.cron.taskDetails.namePlaceholder",
                  }}
                  control={endpoint.update?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="description"
                  config={{
                    type: "textarea",
                    label: "app.admin.cron.taskDetails.description",
                    placeholder:
                      "app.admin.cron.taskDetails.descriptionPlaceholder",
                    rows: 3,
                  }}
                  control={endpoint.update?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
            </FormFieldGroup>

            <FormFieldGroup
              title={"app.admin.cron.taskDetails.scheduling"}
              description={"app.admin.cron.taskDetails.schedulingDescription"}
            >
              <ScheduleAutocomplete
                value={endpoint.update?.form.watch("schedule")}
                onChange={(value) =>
                  endpoint.update?.form.setValue("schedule", value)
                }
                onBlur={() => endpoint.update?.form.trigger("schedule")}
                placeholder={t(
                  "app.admin.cron.taskDetails.schedulePlaceholder",
                )}
                searchPlaceholder={t(
                  "app.admin.cron.taskDetails.searchSchedule",
                )}
                allowCustom={true}
                locale={locale}
              />
            </FormFieldGroup>

            <FormFieldGroup
              title={"app.admin.cron.taskDetails.configuration"}
              description={
                "app.admin.cron.taskDetails.configurationDescription"
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EndpointFormField
                  name="enabled"
                  config={{
                    type: "switch",
                    label: "app.admin.cron.taskDetails.enabled",
                    description:
                      "app.admin.cron.taskDetails.enabledDescription",
                  }}
                  control={endpoint.update?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="priority"
                  config={{
                    type: "select",
                    label: "app.admin.cron.taskDetails.priority",
                    placeholder:
                      "app.admin.cron.taskDetails.priorityPlaceholder",
                    options: CronTaskPriorityOptions,
                  }}
                  control={endpoint.update?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="timeout"
                  config={{
                    type: "text",
                    label: "app.admin.cron.taskDetails.timeout",
                    placeholder:
                      "app.admin.cron.taskDetails.timeoutPlaceholder",
                  }}
                  control={endpoint.update?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />

                <EndpointFormField
                  name="retries"
                  config={{
                    type: "text",
                    label: "app.admin.cron.taskDetails.retries",
                    placeholder:
                      "app.admin.cron.taskDetails.retriesPlaceholder",
                  }}
                  control={endpoint.update?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </div>
            </FormFieldGroup>

            {/* Form Alert for errors and success */}
            <FormAlert alert={endpoint.update?.alert} />

            {/* Submit Button */}
            <Button type="submit" disabled={isSaving} className="w-full">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t("app.admin.cron.taskDetails.saving")}
                </>
              ) : (
                t("app.admin.cron.taskDetails.save")
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
