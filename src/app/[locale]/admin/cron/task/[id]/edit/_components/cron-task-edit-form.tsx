"use client";

/**
 * Cron Task Edit Form Component
 * Form for editing cron task details
 */

import { Form } from "next-vibe-ui/ui/form/form";
import { FormAlert } from "next-vibe-ui/ui/form/form-alert";
import { Div } from "next-vibe-ui/ui/div";
import { Label } from "next-vibe-ui/ui/label";
import { P } from "next-vibe-ui/ui/typography";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { FormFieldGroup } from "next-vibe-ui/ui/form/form-section";
import type React from "react";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type {
  endpoints,
  IndividualCronTaskType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron/task/[id]/definition";
import { formatCronSchedule } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/cron-formatter";
import { CronTaskPriorityOptions } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/enum";
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
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Use PUT endpoint (mapped to endpoint.create) for form mutations
  const isLoading = endpoint.create?.isSubmitting ?? false;

  return (
    <Div className="space-y-6">
      {/* Task Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t(
              "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.get.container.title",
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Div>
            <Label className="text-sm font-medium text-muted-foreground">
              {t(
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.get.fields.id.label",
              )}
            </Label>
            <P className="text-sm font-mono">{task.id}</P>
          </Div>
          <Div>
            <Label className="text-sm font-medium text-muted-foreground">
              {t(
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.name.label",
              )}
            </Label>
            <P className="text-sm">{task.version}</P>
          </Div>
          <Div>
            <Label className="text-sm font-medium text-muted-foreground">
              {t(
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.tasks.list.columns.createdAt",
              )}
            </Label>
            <P className="text-sm">
              {new Date(task.createdAt).toLocaleString()}
            </P>
          </Div>
          <Div>
            <Label className="text-sm font-medium text-muted-foreground">
              {t(
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.tasks.list.columns.updatedAt",
              )}
            </Label>
            <P className="text-sm">
              {new Date(task.updatedAt).toLocaleString()}
            </P>
          </Div>
          <Div className="md:col-span-2">
            <Label className="text-sm font-medium text-muted-foreground">
              {t(
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.schedule.label",
              )}
            </Label>
            <P className="text-sm">
              {formatCronSchedule(task.schedule, userTimezone, locale, logger)}
            </P>
            <P className="text-xs text-muted-foreground font-mono">
              {task.schedule}
            </P>
          </Div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t(
              "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.container.title",
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            form={endpoint.create?.form}
            onSubmit={endpoint.create?.onSubmit}
            className="space-y-6"
          >
            <FormFieldGroup
              title={
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.container.title"
              }
              description={
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.container.description"
              }
            >
              <Div className="grid grid-cols-1 gap-4">
                <EndpointFormField
                  name="name"
                  config={{
                    type: "text",
                    label:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.name.label",
                    placeholder:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.name.placeholder",
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
                    label:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.description.label",
                    placeholder:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.description.placeholder",
                    rows: 3,
                  }}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </Div>
            </FormFieldGroup>

            <FormFieldGroup
              title={
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.schedule.label"
              }
              description={
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.schedule.description"
              }
            >
              <ScheduleAutocomplete
                value={endpoint.create?.form.watch("schedule") ?? ""}
                onChange={(value): void =>
                  endpoint.create?.form.setValue("schedule", value)
                }
                onBlur={(): void => {
                  void endpoint.create?.form.trigger("schedule");
                }}
                placeholder={t(
                  "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.schedule.placeholder",
                )}
                searchPlaceholder={t(
                  "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.schedule.placeholder",
                )}
                allowCustom={true}
                locale={locale}
              />
            </FormFieldGroup>

            <FormFieldGroup
              title={
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.container.title"
              }
              description={
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.container.description"
              }
            >
              <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EndpointFormField
                  name="enabled"
                  config={{
                    type: "switch",
                    label:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.enabled.label",
                    description:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.enabled.description",
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
                    label:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.priority.label",
                    placeholder:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.priority.placeholder",
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
                    label:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.timeout.label",
                    placeholder:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.timeout.placeholder",
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
                    label:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.retries.label",
                    placeholder:
                      "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.fields.retries.placeholder",
                  }}
                  control={endpoint.create?.form.control}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </Div>
            </FormFieldGroup>

            {/* Form Alert for errors and success */}
            <FormAlert alert={endpoint.alert} />

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t(
                    "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.success.updated.title",
                  )}
                </>
              ) : (
                t(
                  "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.task.put.title",
                )
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </Div>
  );
}
